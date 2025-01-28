import { test, expect, Locator } from "@playwright/test";
import HomePage from "../page-objects/pages/HomePage.ts";
import SignUpForm from "../page-objects/forms/SignUpForm.ts";
import {
  SIGNUP_NAME,
  SIGNUP_LAST_NAME,
  SIGNUP_INVALID_NAME,
  SIGNUP_INVALID_LAST_NAME,
  SIGNUP_EMPTY_EMAIL,
} from "../test-data/constants/errors.ts";
import data from "../test-data/constants/data.json" assert { type: "json" };

test.describe("Sign Up Check Test", () => {
  let testData: any;
  const randomEmail = `test_${Date.now()}@example.com`;
  let homePage: HomePage;
  let signUpForm: SignUpForm;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signUpForm = new SignUpForm(page);
    await homePage.openPage();
    await homePage.openSignUpForm();
  });

  test("Should check Sign Up modal header", async ({ page }) => {
    const modalHeader = page.locator(".modal-header");
    await expect(modalHeader).toContainText("Registration");
    await expect(modalHeader).toBeVisible();
  });

  test("Should check Sign Up with invalid Name field", async ({ page }) => {
    await signUpForm.triggerErrorOnField("name");
    await expect(page.getByText(SIGNUP_NAME)).toBeVisible();

    await signUpForm.triggerErrorOnField("lastName");
    await expect(page.getByText(SIGNUP_LAST_NAME)).toBeVisible();

    await signUpForm.enterLastName(data.invalidLastName);
    await expect(page.getByText(SIGNUP_INVALID_LAST_NAME)).toContainText(
      "Last name is invalid"
    );

    // await signUpForm.enterName(testData.wrongLengthName);
    // await expect(signUpForm.errorMessage).toContainText(
    //   "Name has to be from 2 to 20 characters long"
    // );

    // await signUpForm.enterLastName(testData.lastName);
    // await signUpForm.enterEmail(testData.email);
    // await signUpForm.enterPassword(testData.password);
    // await signUpForm.enterRepeatPassword(testData.repeatPasswordSuccess);
    // await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with invalid Last Name field", async ({
    page,
  }) => {
    const signUpForm = new SignUpForm(page);
    await signUpForm.enterName(testData.name);
    await signUpForm.triggerErrorMessageForField(signUpForm.lastNameField);
    await expect(signUpForm.errorMessage).toContainText("Last name required");

    await signUpForm.enterLastName(testData.invalidLastName);
    await expect(signUpForm.errorMessage).toContainText("Last name is invalid");

    await signUpForm.enterLastName(testData.wrongLengthLastName);
    await expect(signUpForm.errorMessage).toContainText(
      "Last name has to be from 2 to 20 characters long"
    );

    await signUpForm.enterEmail(testData.email);
    await signUpForm.enterPassword(testData.password);
    await signUpForm.enterRepeatPassword(testData.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with invalid Email field", async ({ page }) => {
    const signUpForm = new SignUpForm(page);
    await signUpForm.enterName(testData.name);
    await signUpForm.enterLastName(testData.lastName);
    await signUpForm.triggerErrorMessageForField(signUpForm.emailField);
    await expect(signUpForm.errorMessage).toContainText("Email required");

    await signUpForm.enterEmail(testData.wrongEmail);
    await expect(signUpForm.errorMessage).toContainText("Email is incorrect");

    await signUpForm.enterPassword(testData.password);
    await signUpForm.enterRepeatPassword(testData.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with invalid Password field", async ({ page }) => {
    const signUpForm = new SignUpForm(page);
    await signUpForm.enterName(testData.name);
    await signUpForm.enterLastName(testData.lastName);
    await signUpForm.enterEmail(testData.email);
    await signUpForm.triggerErrorMessageForField(signUpForm.passwordField);
    await expect(signUpForm.errorMessage).toContainText("Password required");

    await signUpForm.enterPassword(testData.wrongPassword);
    await expect(signUpForm.errorMessage).toContainText(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );

    await signUpForm.enterRepeatPassword(testData.repeatPasswordSuccess);
    await expect(signUpForm.errorMessage).toContainText(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with mismatched Re-enter password field", async ({
    page,
  }) => {
    const signUpForm = new SignUpForm(page);
    await signUpForm.enterName(testData.name);
    await signUpForm.enterLastName(testData.lastName);
    await signUpForm.enterEmail(testData.email);
    await signUpForm.enterPassword(testData.password);

    await signUpForm.triggerErrorMessageForField(
      signUpForm.repeatPasswordField
    );
    await expect(signUpForm.errorMessage).toContainText(
      "Re-enter password required"
    );

    await signUpForm.enterRepeatPassword(testData.repeatPasswordWrong);
    await expect(signUpForm.errorMessage).toContainText(
      "Passwords do not match"
    );
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with correct data", async ({ page }) => {
    const signUpForm = new SignUpForm(page);

    await page.route("/api/auth/signup", (route) => {
      route.fulfill({
        status: 201,
        body: JSON.stringify({ status: "ok" }),
      });
    });

    await signUpForm.enterName(testData.name);
    await signUpForm.enterLastName(testData.lastName);
    await signUpForm.enterEmail(randomEmail);
    await signUpForm.enterPassword(testData.password);
    await signUpForm.enterRepeatPassword(testData.repeatPasswordSuccess);

    await expect(signUpForm.registerButton).toBeEnabled();
    await signUpForm.clickRegisterButton();

    await page.waitForURL("https://qauto.forstudy.space/panel/garage");
    await expect(page.url()).toBe("https://qauto.forstudy.space/panel/garage");
  });
});
