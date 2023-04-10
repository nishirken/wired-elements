import { test, expect, ElementHandle, Page, Locator } from '@playwright/test';

const testIdSelector = (selector: string): string => `[data-test-id="${selector}"]`;
const selector = testIdSelector('calendar');
const getLocator = (x: Page | Locator, s: string): Locator => x.locator(testIdSelector(s));
const getSelectedDayLocator = (x: Page | Locator, date: string): Locator =>
	x.locator(`${testIdSelector(`day-${date}`)}[data-selected="true"]`);
const getDayText = (l: Locator): Promise<string | undefined> => {
	return l.textContent().then(t => t?.trim());
};

test.describe('Wired calendar', () => {
	let calendarLocator: Locator;

	test.beforeEach(async ({ page }) => {
		const date = new Date('2021-01-20T00:00:00Z').valueOf();
		await page.addInitScript(`{
      // Extend Date constructor to default to fakeNow
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(${date.valueOf()});
          } else {
            super(...args);
          }
        }
      }
      // Override Date.now() to start from fakeNow
      const __DateNowOffset = ${date.valueOf()} - Date.now();
      const __DateNow = Date.now;
      Date.now = () => __DateNow() + __DateNowOffset;
    }`);
		await page.goto('http://localhost:9000/calendar.html');
		calendarLocator = getLocator(page, "calendar");
		await calendarLocator.waitFor();
	});

	test.describe("When the selected property has been passed", () => {
		test.beforeEach(async ({ page }) => {
			await calendarLocator.evaluate((el: any) => {
				el.selected = 'Feb 10, 2023';
			});
		});

		test('Shows selected with a passed value', async () => {
			const dayLocator = getSelectedDayLocator(calendarLocator, 'Feb 10, 2023');
			await expect(getDayText(dayLocator)).resolves.toBe('10');
		});

		test('Switches to a new value after click by a day', async () => {
			const prevSelectedLocator = getLocator(calendarLocator, 'day-Feb 10, 2023');
			const nextSelectedLocator = getSelectedDayLocator(calendarLocator, 'Feb 9, 2023');
			const dayLocator = getLocator(calendarLocator, 'day-Feb 9, 2023');
			await dayLocator.click();
			await expect(getDayText(nextSelectedLocator)).resolves.toBe('9');
			await expect(prevSelectedLocator.getAttribute("data-selected")).resolves.toBeNull();
		});

		test('Switches to a new value, if the value property has been changed', async ({ page }) => {
			await calendarLocator.evaluate((el: any) => {
				el.value = {
					date: new Date('2023-01-20T00:00:00Z'),
					text: 'Feb 20, 2023',
				};
			});
			await expect(getDayText(getSelectedDayLocator(calendarLocator, 'Feb 20, 2023'))).resolves.toBe('20');
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

	test('Shows selected day if selected by click', async ({ page }) => {
		const daySelector = 'day-Jan 1, 2021';
		const dayLocator = getLocator(calendarLocator, daySelector);
		await dayLocator.click();
		const dayText = await getSelectedDayLocator(calendarLocator, daySelector).textContent();
		expect(dayText?.trim()).toBe('1');
	});
});
