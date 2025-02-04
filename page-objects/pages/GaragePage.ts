import { expect, Locator, Page } from "@playwright/test";

export default class GaragePage {
  readonly page: Page;
  readonly addCarButton: Locator;
  readonly brandDropdown: Locator;
  readonly modelDropdown: Locator;
  readonly mileageField: Locator;
  readonly mileageUpdateField: Locator;
  readonly mileageUpdateSubmit: Locator;
  readonly addButton: Locator;
  readonly lastAddedCar: Locator;
  readonly carNameLocator: string;
  readonly editCarIconLocator: string;
  readonly removeCarButton: Locator;
  readonly approveRemoveButton: Locator;
  readonly carRemoveNotification: Locator;
  readonly editCarButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addCarButton = page.locator('//button[@class="btn btn-primary"]');
    this.editCarButton = page.locator(".car_edit.btn.btn-edit");
    this.brandDropdown = page.locator('//select[@id="addCarBrand"]');
    this.modelDropdown = page.locator('//select[@id="addCarModel"]');
    this.mileageField = page.locator('//input[@id="addCarMileage"]');
    this.mileageUpdateField = page.locator(
      ".update-mileage-form .update-mileage-form_input"
    );
    this.mileageUpdateSubmit = page.locator(".update-mileage-form_submit");
    this.addButton = page.locator(
      '//app-add-car-modal//button[@class="btn btn-primary"]'
    );
    this.saveButton = page.locator(
      '//div[contains(@class, "modal-footer")]//button[contains(@class, "btn btn-primary") and text()="Save"]'
    );
    this.cancelButton = page.locator(
      '//div[contains(@class, "modal-footer")]//button[contains(@class, "btn btn-secondary") and text()="Cancel"]'
    );
    this.lastAddedCar = page.locator('//div[@class="car jumbotron"]').first();
    this.carNameLocator = '//p[@class="car_name h2"]';
    this.editCarIconLocator = '//span[@class="icon icon-edit"]';
    this.removeCarButton = page.locator(
      '//button[@class="btn btn-outline-danger"]'
    );
    this.approveRemoveButton = page.locator(
      '//button[@class="btn btn-danger"]'
    );
    this.carRemoveNotification = page.locator(
      '//div[@class="alert alert-success"]//p[text()="Car removed"]'
    );
  }

  async open() {
    await this.page.goto("/panel/garage");
  }

  async selectCarBrand(brand: string) {
    await this.brandDropdown.selectOption(brand);
  }

  async selectCarModel(model: string) {
    await this.modelDropdown.selectOption(model);
  }

  async enterMileage(mileage: string) {
    await this.mileageField.fill(mileage);
  }

  async enterUpdateMileage(carName: string, mileageUpdated: string) {
    const carRow = this.page.locator(
      `//p[@class="car_name h2" and text()="${carName}"]/ancestor::div[contains(@class, "car jumbotron")]`
    );
    await carRow
      .locator(".update-mileage-form .update-mileage-form_input")
      .fill(mileageUpdated);
  }

  async clickUpdateMileageButton(carName: string) {
    const carRow = this.page.locator(
      `//p[@class="car_name h2" and text()="${carName}"]/ancestor::div[contains(@class, "car jumbotron")]`
    );
    await carRow.locator(".update-mileage-form_submit").click();
  }

  async updateCarMileage(carName: string, mileageUpdated: string) {
    await this.enterUpdateMileage(carName, mileageUpdated);
    await this.clickUpdateMileageButton(carName);
  }

  async clickAddCarButton() {
    await this.addCarButton.click();
  }

  async clickAddButton() {
    await this.addButton.click();
  }

  async clickEditCarButton() {
    await this.editCarButton.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async editCarData(brand: string, model: string, mileage: string) {
    await this.clickEditCarButton();
    await this.selectCarBrand(brand);
    await this.selectCarModel(model);
    await this.enterMileage(mileage);
    await this.saveButton.click();
  }

  async addCarByBrandAndModel(brand: string, model: string, mileage: string) {
    await this.clickAddCarButton();
    await this.selectCarBrand(brand);
    await this.selectCarModel(model);
    await this.enterMileage(mileage);
    await this.clickAddButton();
  }

  async verifyLastAddedCar(carName: string) {
    await expect(this.lastAddedCar.locator(this.carNameLocator)).toHaveText(
      carName
    );
  }

  async removeLastAddedCar() {
    await this.lastAddedCar.locator(this.editCarIconLocator).click();
    await this.removeCarButton.click();
    await this.approveRemoveButton.click();
    await expect(this.carRemoveNotification).toBeVisible();
    await expect(this.carRemoveNotification).not.toBeVisible({
      timeout: 10000,
    });
  }

  async triggerErrorMessageForField(field: Locator) {
    await field.focus();
    await field.blur();
  }
}
