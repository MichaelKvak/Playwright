import { test, expect, Locator } from "@playwright/test";
import HomePage from "../page-objects/pages/HomePage.ts";
import SignUpForm from "../page-objects/forms/signUpForm.ts";
import {
  SIGNUP_NAME,
  SIGNUP_WRONGLENGTH_NAME,  
  SIGNUP_INVALID_NAME,
  SIGNUP_LAST_NAME,
  SIGNUP_INVALID_LAST_NAME,
  SIGNUP_WRONGLENGTH_LAST_NAME,
  SIGNUP_EMPTY_EMAIL,
  SIGNUP_WRONG_EMAIL,
  SIGNUP_EMPTY_PASSWORD,
  SIGNUP_WRONG_PASSWORD,
  SIGNUP_WRONG_REENTER_PASSWORD,
  SIGNUP_EMPTY_REENTER_PASSWORD,
  SIGNUP_DO_NOT_MATCH_REENTER_PASSWORD
} from "../test-data/constants/errors.ts";

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const data = require("../test-data/constants/data.json");

test.describe("Sign Up Check Test", () => {
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

  test("Should check Sign Up with empty Name field", async ({ page }) => {
    await signUpForm.triggerErrorOnNameAndLastNameField("name");
    const errorText = page.getByText(SIGNUP_NAME);
    await expect(errorText).toBeVisible();      
    await expect(errorText).toHaveCSS("color", "rgb(220, 53, 69)");   
    await signUpForm.enterLastName(data.lastName);
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with invalid Name field", async ({ page }) => {
    await signUpForm.enterName(data.invalidName);
    await signUpForm.triggerField(signUpForm.emailField);
    await expect(page.getByText(SIGNUP_INVALID_NAME)).toContainText(
      "Name is invalid"
    );
    await signUpForm.enterLastName(data.lastName);
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with wrong length Name field", async ({ page }) => {
    await signUpForm.enterName(data.wrongLengthName);
    await signUpForm.triggerField(signUpForm.emailField);
    const errorText = page.getByText(SIGNUP_WRONGLENGTH_NAME);    
    await expect(errorText).toHaveText("Name has to be from 2 to 20 characters long");
    await expect(errorText).toHaveCSS("color", "rgb(220, 53, 69)");
    await signUpForm.enterLastName(data.lastName);
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with empty Last Name field", async ({ page }) => {
    await signUpForm.enterName(data.name);
    await signUpForm.triggerErrorMessageForField(signUpForm.lastNameField);
    await expect(page.getByText(SIGNUP_LAST_NAME)).toBeVisible();    
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();   
  });

  test("Should check Sign Up with invalid Last Name field", async ({ page }) => {
    await signUpForm.enterName(data.name);   
    await signUpForm.enterLastName(data.invalidLastName);
    await signUpForm.triggerField(signUpForm.emailField);
    await expect(page.getByText(SIGNUP_INVALID_LAST_NAME)).toContainText(
      "Last name is invalid");
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();   
  });

  test("Should check Sign Up with wrong length of Last Name field", async ({ page }) => {
    await signUpForm.enterName(data.name);
    await signUpForm.enterLastName(data.wrongLengthLastName);
    await signUpForm.triggerField(signUpForm.emailField);
    const errorText = page.getByText(SIGNUP_WRONGLENGTH_LAST_NAME);
    await expect(errorText).toHaveText("Last name has to be from 2 to 20 characters long");
    await expect(errorText).toHaveCSS("color", "rgb(220, 53, 69)");
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();   
  });

  test("Should check Sign Up with empty Email field", async ({ page }) => {
    await signUpForm.enterName(data.name);
    await signUpForm.enterLastName(data.lastName);
    await signUpForm.triggerErrorMessageForField(signUpForm.emailField);
    await expect(page.getByText(SIGNUP_EMPTY_EMAIL)).toBeVisible();    
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();   
  });

  test("Should check Sign Up with invalid Email field", async ({ page }) => {
    await signUpForm.enterName(data.name);
    await signUpForm.enterLastName(data.lastName);   
    await signUpForm.enterEmail(data.wrongEmail);
    await signUpForm.triggerField(signUpForm.passwordField);
    const errorText = page.getByText(SIGNUP_WRONG_EMAIL);
    await expect(errorText).toHaveText("Email is incorrect");
    await expect(errorText).toHaveCSS("color", "rgb(220, 53, 69)");   
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);
    await expect(signUpForm.registerButton).toBeDisabled();   
  });

  test("Should check Sign Up with empty Password field", async ({ page }) => {
    await signUpForm.enterName(data.name); 
    await signUpForm.enterLastName(data.lastName);   
    await signUpForm.enterEmail(data.email);
    await signUpForm.triggerErrorMessageForField(signUpForm.passwordField);
    await expect(page.getByText(SIGNUP_EMPTY_PASSWORD)).toBeVisible();
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);    
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with invalid Password field", async ({ page }) => {
    await signUpForm.enterName(data.name); 
    await signUpForm.enterLastName(data.lastName);   
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.wrongPassword);
    await signUpForm.triggerField(signUpForm.repeatPasswordField);
    await expect(page.getByText(SIGNUP_WRONG_PASSWORD)).toContainText(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );   
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);    
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with empty Re-enter password field", async ({ page }) => {
    await signUpForm.enterName(data.name); 
    await signUpForm.enterLastName(data.lastName);   
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.triggerErrorMessageForField(signUpForm.repeatPasswordField);
    await expect(page.getByText(SIGNUP_EMPTY_REENTER_PASSWORD)).toBeVisible();
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up with invalid Re-enter password field", async ({ page }) => {
    await signUpForm.enterName(data.name); 
    await signUpForm.enterLastName(data.lastName);   
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);    
    await signUpForm.enterRepeatPassword(data.repeatPasswordWrong);
    await signUpForm.triggerField(signUpForm.passwordField);
    await expect(page.getByText(SIGNUP_WRONG_REENTER_PASSWORD)).toContainText(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );    
    await expect(signUpForm.registerButton).toBeDisabled();
  });

  test("Should check Sign Up not match Re-enter password field", async ({ page }) => {
    await signUpForm.enterName(data.name); 
    await signUpForm.enterLastName(data.lastName);   
    await signUpForm.enterEmail(data.email);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordDoNotMatch);
    await signUpForm.triggerField(signUpForm.passwordField);
    await expect(page.getByText(SIGNUP_DO_NOT_MATCH_REENTER_PASSWORD)).toContainText(
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

    await signUpForm.enterName(data.name);
    await signUpForm.enterLastName(data.lastName);
    await signUpForm.enterEmail(randomEmail);
    await signUpForm.enterPassword(data.password);
    await signUpForm.enterRepeatPassword(data.repeatPasswordSuccess);

    await expect(signUpForm.registerButton).toBeEnabled();
    await signUpForm.clickRegisterButton();

    await page.waitForURL("https://guest:welcome2qauto@qauto.forstudy.space/");
    expect(page.url()).toBe("https://guest:welcome2qauto@qauto.forstudy.space/");
  });
});
