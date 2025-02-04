import { test, expect } from "@playwright/test";
import HomePage from "../page-objects/pages/HomePage";
import SignInForm from "../page-objects/forms/SignInForm";
import GaragePage from "../page-objects/pages/GaragePage";
import { credentials } from "../test-data/usersData";

test.describe("Garage Page", () => {
  let homePage: HomePage;
  let signInForm: SignInForm;
  let garagePage: GaragePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    garagePage = new GaragePage(page);

    await homePage.openPage();
    await homePage.openSignInForm();
    await signInForm.loginWithCredentials(
      credentials.userOne.email,
      credentials.userOne.password
    );
  });
  test("Add BMW 3 series", async () => {
    await garagePage.addCarByBrandAndModel("BMW", "3", "500");
    await garagePage.verifyLastAddedCar("BMW 3");
  });

  test("Update mileage", async () => {
    await garagePage.updateCarMileage('BMW 3','5000');
  });

  test('Update car data', async () => {
   await garagePage.editCarData('Audi', 'TT', '7000');
  });

  test.afterAll(async () => {
    await garagePage.removeLastAddedCar();
  });
});
