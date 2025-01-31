import { test, expect } from '@playwright/test';
import HomePage from '../page-objects/pages/HomePage';
import SignInForm from '../page-objects/forms/SignInForm';
import GaragePage from '../page-objects/pages/GaragePage';
import { credentials } from '../test-data/usersData';

test.describe('Garage Page', () => {
    let homePage: HomePage;
    let signInForm: SignInForm;
    let garagePage: GaragePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        signInForm = new SignInForm(page);
        garagePage = new GaragePage(page);

        await homePage.openPage();
        await homePage.openSignInForm();
        await signInForm.loginWithCredentials(credentials.userOne.email, credentials.userOne.password);
    })
    test('Add BMW X6', async () => {
        await garagePage.addCarByBrandAndModel('BMW', 'X6', '500');
        await garagePage.verifyLastAddedCar('BMW X6');
    });

    test('Add Audi TT', async () => {
        await garagePage.addCarByBrandAndModel('Audi', 'TT', '500');
        await garagePage.verifyLastAddedCar('Audi TT');
    });

    test('Add Ford Fiesta', async () => {
        await garagePage.addCarByBrandAndModel('Ford', 'Fiesta', '500');
        await garagePage.verifyLastAddedCar('Ford Fiesta');
    });

    test('Update mileage', async() => {
       await garagePage.updateCarMileage('2000')
    });

    test.afterEach(async () => {
        await garagePage.removeLastAddedCar();
    })
})