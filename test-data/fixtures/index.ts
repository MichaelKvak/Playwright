import { mergeTests } from "@playwright/test";
import { test as pages } from "./pagesFixture";

export const test = mergeTests(pages);
