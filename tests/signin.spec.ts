import { test, expect, Locator } from '@playwright/test';
import HomePage from '../page-objects/pages/HomePage';
import SignInForm from '../page-objects/forms/SignInForm';
import { SIGNIN_EMPTY_EMAIL, SIGNIN_EMPTY_PASSWORD, SIGNIN_INVALID_EMAIL, SIGNIN_WRONG_DATA } from '../test-data/constants/errors.ts';

test.describe(('Sign In tests with POM'), () => {
    let homePage: HomePage;
    let signInForm: SignInForm;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        signInForm = new SignInForm(page);
        await homePage.openPage();
        await homePage.openSignInForm();
    })


    test('C1 Sign In without email', async ({ page }) => {
        await signInForm.triggerErrorOnField('email');
        await expect(page.getByText(SIGNIN_EMPTY_EMAIL)).toBeVisible();
    });

    test('Sign In without password', async ({ page }) => {
        await signInForm.triggerErrorOnField('password');
        await expect(page.getByText(SIGNIN_EMPTY_PASSWORD)).toBeVisible();
    });

    test('Sign In with wrong password/email', async ({ page }) => {
        await signInForm.loginWithCredentials('example@test777.com', 'test777')
        await expect(page.getByText(SIGNIN_WRONG_DATA)).toBeVisible();
    });

    test('Successful Sign In', async ({ page }) => {
        await signInForm.loginWithCredentials('mkvak@gmail.com', 'Barselona-1987')
        await expect(page.locator('//h1[text()="Garage"]')).toBeVisible();
    });

    test('Redirection to Restore Access form', async ({ page }) => {
        await signInForm.clickForgotPasswordLink();
        await expect(page.getByRole('heading', { name: 'Restore access' })).toBeVisible();
    });

    test('Redirection to Registration form', async ({ page }) => {
        await signInForm.clickRegistrationLink();
        await expect(page.getByRole('heading', { name: 'Registration' })).toBeVisible();
    });

    test('Sign in with invalid email', async ({ page }) => {
        await signInForm.enterEmail('notvalid');
        await signInForm.triggerErrorOnField('email');
        await expect(page.getByRole('paragraph')).toContainText(SIGNIN_INVALID_EMAIL);
    });

})
