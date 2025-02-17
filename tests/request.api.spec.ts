import { test, expect } from '@playwright/test';
import AuthController from '../api-controllers/AuthController';
import CarsController from '../api-controllers/CarsController';
import HomePage from '../page-objects/pages/HomePage';
import { credentials } from '../test-data/usersData'

let authController: AuthController;
let carsController: CarsController;

test.describe('Add car form', () => {
    let carsController: CarsController;
        let authController: AuthController;
        let sid: string;
  test.beforeEach(async ({ request, page }) => {
    authController = new AuthController(request);
    carsController = new CarsController(request); 
       
    sid = await authController.signInAndGetCookie(credentials.userOne.email, credentials.userOne.password)

    
  });

  test('Change user name and verify in UI', async ({ request, page }) => {
    const requestBody = {
      photo: 'default-user.png',
      name: 'Polar',
      lastName: 'Bear',
      dateBirth: '2021-03-17T15:21:05.000Z',
      country: 'Ukraine',
    };

    const response = await request.put('api/users/profile', {
      headers: { cookie: `sid=${sid}` },
      data: requestBody,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data.name).toBe('Polar');
    expect(responseBody.data.lastName).toBe('Bear');

    // Перехоплення API-запиту профілю
    await page.route('**/api/users/profile', async (route) => {
      await route.fulfill({
        status: 200,
        body: {
          status: 'ok',
          data: {
            userId: 171558,
            photoFilename: 'default-user.png',
            name: 'Polar',
            lastName: 'Bear',
          },
        },
      });
    });

    await page.goto('/panel/profile', {
      headers: { cookie: `sid=${sid}` },
    });

    await expect(page.locator('p.profile_name.display-4')).toHaveText('Polar Bear');
  });

  test.afterAll(async ({ request }) => {
    const resetRequestBody = {
      photo: 'default-user.png',
      name: 'Michael',
      lastName: 'Kvak',
      dateBirth: '2021-03-17T15:21:05.000Z',
      country: 'Ukraine',
    };

    const resetResponse = await request.put('api/users/profile', {
      headers: { cookie: `sid=${globalSid}` },
      data: resetRequestBody,
    });
    expect(resetResponse.status()).toBe(200);
  });
});
