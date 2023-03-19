import { test, expect, ElementHandle, Page, Locator } from '@playwright/test';

const testIdSelector = (selector: string): string => `[data-test-id="${selector}"]`;
const selector = testIdSelector('calendar');
const getLocator = (x: Page | Locator, s: string): Locator => x.locator(testIdSelector(s));

test.describe('Wired calendar', () => {
	let calendarLocator: Locator;

	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:9000/calendar.html');
		calendarLocator = getLocator(page, "calendar");
		await calendarLocator.waitFor();
		await calendarLocator.evaluate((el: any) => {
			el.selected = 'Feb 20, 2023';
		});
	});

	test('Shows month and year in header, if selected', async () => {
		const headerLocator = getLocator(calendarLocator, "header-text");
		await expect(headerLocator.textContent()).resolves.toBe('February 2023');
	});

	test('Shows prev month on left arrow click', async () => {
		const headerLocator = getLocator(calendarLocator, "header-text");
		const arrowLeftLocator = getLocator(calendarLocator, "arrow-left");
		await arrowLeftLocator.click();
		await expect(headerLocator.textContent()).resolves.toBe('January 2023');
	});

	test('Shows next month on right arrow click', async () => {
		const headerLocator = getLocator(calendarLocator, "header-text");
		const arrowRightLocator = getLocator(calendarLocator, "arrow-right");
		await arrowRightLocator.click();
		await expect(headerLocator.textContent()).resolves.toBe('March 2023');
	});
});