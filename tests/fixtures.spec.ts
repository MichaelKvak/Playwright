import { test } from "../test-data/fixtures/index";
test.describe("Garage Page with Fixtures", () => {
  test("Add BMW X6", async ({
    garagePageAsLoggedMainUserWithRemovingLastCar,
  }) => {
    test.step("Add [BMW X6] Car to Garage", async () => {
      await garagePageAsLoggedMainUserWithRemovingLastCar.addCarByBrandAndModel(
        "BMW",
        "X6",
        "500"
      );
    });
    test.step("Verify [BMW X6] is in Garage", async () => {
      await garagePageAsLoggedMainUserWithRemovingLastCar.verifyLastAddedCar(
        "BMW X6"
      );
    });
  });

  test("@C2 Add Audi TT", async ({
    garagePageAsLoggedMainUserWithRemovingLastCar,
  }) => {
    await garagePageAsLoggedMainUserWithRemovingLastCar.addCarByBrandAndModel(
      "Audi",
      "TT",
      "500"
    );
    await garagePageAsLoggedMainUserWithRemovingLastCar.verifyLastAddedCar(
      "Audi TT"
    );
  });

  test("@C1Add Ford Fiesta", async ({
    garagePageAsLoggedMainUserWithRemovingLastCar,
  }) => {
    await garagePageAsLoggedMainUserWithRemovingLastCar.addCarByBrandAndModel(
      "Ford",
      "Fiesta",
      "500"
    );
    await garagePageAsLoggedMainUserWithRemovingLastCar.verifyLastAddedCar(
      "Ford Fiesta"
    );
  });
});
