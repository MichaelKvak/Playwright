import { Locator, Page } from "@playwright/test";

export default class SignUpForm {
  readonly form: Page;
  readonly signUpButton: Locator;
  readonly registerButton: Locator;
  readonly nameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly repeatPasswordField: Locator;

  constructor(page: Page) {
    this.form = page;
    this.nameField = page.locator("#signupName");
    this.lastNameField = page.locator("#signupLastName");
    this.signUpButton = page.locator('//*[contains(@class, "btn-primary")]');
    this.registerButton = page.locator(".modal-content .btn-primary");
    this.emailField = page.locator('//input[@id="signupEmail"]');
    this.passwordField = page.locator('//input[@id="signupPassword"]');
    this.repeatPasswordField = page.locator(
      '//input[@id="signupRepeatPassword"]'
    );
  }

  async enterName(name: string) {
    await this.nameField.fill(name);
  }

  async enterLastName(lastName: string) {
    await this.lastNameField.fill(lastName);
  }

  async enterEmail(email: string) {
    await this.emailField.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async enterRepeatPassword(password: string) {
    await this.repeatPasswordField.fill(password);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async triggerErrorOnNameAndLastNameField(fieldName: string) {
    const element = fieldName === "name" ? this.nameField : this.lastNameField;
    await element.focus();
    await element.blur();
  }

  async triggerErrorMessageForField(field: Locator) {
      await field.focus();
      await field.blur();
    }

  async triggerField(field: Locator) {
      await field.focus();
    }
}
