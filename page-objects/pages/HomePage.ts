import { Locator, Page } from "@playwright/test";

export default class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('//*[contains(@class, "header_signin")]');
    this.signUpButton = page.locator('//*[contains(@class, "btn-primary")]');
  }

  async openSignInForm() {
    await this.signInButton.click();
  }

  async openSignUpForm() {
    await this.signUpButton.click();
  }

  async openPage() {
    await this.page.goto("https://guest:welcome2qauto@qauto.forstudy.space/");
  }
}
