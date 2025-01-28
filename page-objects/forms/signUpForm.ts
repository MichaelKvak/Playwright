import { Locator, Page } from '@playwright/test';

class SignUpForm {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get nameField(): Locator {
    return this.page.locator('#signupName');
  }

  get lastNameField(): Locator {
    return this.page.locator('#signupLastName');
  }

  get emailField(): Locator {
    return this.page.locator('#signupEmail');
  }

  get passwordField(): Locator {
    return this.page.locator('#signupPassword');
  }

  get repeatPasswordField(): Locator {
    return this.page.locator('#signupRepeatPassword');
  }

  get registerButton(): Locator {
    return this.page.locator('.modal-content .btn-primary');
  }

  get errorMessage(): Locator {
    return this.page.locator('.invalid-feedback p');
  }

  private formatInput(input: string): string {
    return input.trim().replace(/\s+/g, '');
  }

  async enterName(name: string): Promise<void> {
    await this.nameField.fill(this.formatInput(name));
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameField.fill(this.formatInput(lastName));
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailField.fill(this.formatInput(email));
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordField.fill(this.formatInput(password));
  }

  async enterRepeatPassword(password: string): Promise<void> {
    await this.repeatPasswordField.fill(this.formatInput(password));
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async triggerErrorMessageForField(field: Locator): Promise<void> {
    await field.focus();
    await field.blur();
  }
}

export default SignUpForm;
