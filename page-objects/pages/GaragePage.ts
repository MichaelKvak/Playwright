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

    constructor(page: Page) {
        this.page = page;
        this.addCarButton = page.locator('//button[@class="btn btn-primary"]');
        this.brandDropdown = page.locator('//select[@id="addCarBrand"]');
        this.modelDropdown = page.locator('//select[@id="addCarModel"]');
        this.mileageField = page.locator('//input[@id="addCarMileage"]');
        this.mileageUpdateField = page.locator('.update-mileage-form .update-mileage-form_input');
        this.mileageUpdateSubmit = page.locator('.update-mileage-form_submit');
        this.addButton = page.locator('//app-add-car-modal//button[@class="btn btn-primary"]');
        this.lastAddedCar = page.locator('//div[@class="car jumbotron"]').first();
        this.carNameLocator = '//p[@class="car_name h2"]';
        this.editCarIconLocator = '//span[@class="icon icon-edit"]';
        this.removeCarButton = page.locator('//button[@class="btn btn-outline-danger"]');
        this.approveRemoveButton = page.locator('//button[@class="btn btn-danger"]');
        this.carRemoveNotification = page.locator('//div[@class="alert alert-success"]//p[text()="Car removed"]');
    }

    async open() {
        await this.page.goto('/panel/garage');
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
    async enterUpdateMileage(mileageUpdated: string) {
        // await this.mileageUpdateField.clear();
        await this.mileageUpdateField.fill(mileageUpdated);
    }
    async clickUpdateMileageButton() {
        await this.mileageUpdateSubmit.click();
        
    }

    async updateCarMileage(mileageUpdated: string) {
     await this.enterUpdateMileage(mileageUpdated);
     await this.clickUpdateMileageButton();
    }
    
    async clickAddCarButton() {
        await this.addCarButton.click();
    }

    async clickAddButton() {
        await this.addButton.click();
    }

    async addCarByBrandAndModel(brand: string, model: string, mileage: string) {
        await this.clickAddCarButton();
        await this.selectCarBrand(brand);
        await this.selectCarModel(model);
        await this.enterMileage(mileage);
        await this.clickAddButton();
    }

    async verifyLastAddedCar(carName: string) {
        await expect(this.lastAddedCar.locator(this.carNameLocator)).toHaveText(carName);
    }

    async removeLastAddedCar() {
        await this.lastAddedCar.locator(this.editCarIconLocator).click();
        await this.removeCarButton.click();
        await this.approveRemoveButton.click();
        await expect(this.carRemoveNotification).toBeVisible();
        await expect(this.carRemoveNotification).not.toBeVisible({ timeout: 10000 });
    }



}