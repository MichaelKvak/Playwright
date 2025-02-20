import { test, expect } from '@playwright/test';
import AuthController from '../api-controllers/AuthController';
import { credentials } from '../test-data/usersData';
import HomePage from "../page-objects/pages/HomePage";
import SignInForm from "../page-objects/forms/SignInForm";
import GaragePage from "../page-objects/pages/GaragePage";

test.describe('Change user name and verify in UI', () => {
  let authController: AuthController;
  let sid: string;
  let homePage: HomePage;
  let signInForm: SignInForm;
  let garagePage: GaragePage;

  test.beforeAll(async ({ request }) => {    
    authController = new AuthController(request);    
    sid = await authController.signInAndGetCookie(credentials.userOne.email, credentials.userOne.password);
  });

  test('Verify updated user name in UI', async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    garagePage = new GaragePage(page);

    await homePage.openPage();
    await homePage.openSignInForm();
    await signInForm.loginWithCredentials(
      credentials.userOne.email,
      credentials.userOne.password
    );

    await page.route('**/api/users/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          data: {
            userId: 171558,
            photoFilename: 'default-user.png',
            name: 'Polar',
            lastName: 'Bear',
          },
        }),
      });
    });

    const requestBody = {
      photo: 'default-user.png',
      name: 'Polar',
      lastName: 'Bear',
      dateBirth: '2021-03-17T15:21:05.000Z',
      country: 'Ukraine',
    };

    const response = await page.request.put('api/users/profile', {
      headers: { cookie: `sid=${sid}` },
      data: requestBody,
    });

    expect(response.status()).toBe(200);

    await page.goto('/panel/profile', { waitUntil: 'networkidle' });

    const profileName = page.locator('p.profile_name.display-4');
    await profileName.waitFor({ state: 'visible', timeout: 20000 });

    await expect(profileName).toHaveText('Polar Bear', { timeout: 10000 });
  });

  test.afterAll(async ({ request }) => {
    const resetRequestBody = {
      photo: 'default-user.png',
      name: 'Michaell',
      lastName: 'Kvak',
      dateBirth: '2021-03-17T15:21:05.000Z',
      country: 'Ukraine',
    };

    const resetResponse = await request.put('api/users/profile', {
      headers: { cookie: `sid=${sid}` },
      data: resetRequestBody,
    });

    expect(resetResponse.status()).toBe(200);
  });
});
