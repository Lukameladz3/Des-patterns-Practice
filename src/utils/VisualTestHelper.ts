import { Page } from '@playwright/test';

/**
 * Utility class for visual testing operations.
 * Provides methods to stabilize dynamic content and ensure consistent visual snapshots.
 */
export class VisualTestHelper {
    /**
     * Hides dynamic carousel elements to prevent visual test flakiness.
     * Uses CSS injection to hide carousel elements that auto-rotate.
     * 
     * @param page - Playwright Page instance
     */
    static async hideCarousel(page: Page): Promise<void> {
        await page.addStyleTag({
            content: `
                #carouselExampleIndicators,
                .carousel,
                .carousel-inner {
                    display: none !important;
                }
            `
        });
    }

    /**
     * Normalizes dynamic username display to a consistent placeholder value.
     * This ensures visual snapshots remain consistent across test runs.
     * 
     * @param page - Playwright Page instance
     * @param placeholder - Static placeholder text to use
     */
    static async normalizeDynamicContent(page: Page, placeholder: string): Promise<void> {
        await page.evaluate((placeholderText) => {
            const userDisplay = document.querySelector('#nameofuser');
            if (userDisplay) userDisplay.textContent = placeholderText;
        }, placeholder);
    }


    /**
     * Waits for viewport size change to complete and layout to stabilize.
     * Uses request animation frame to ensure CSS transitions complete.
     * 
     * @param page - Playwright Page instance
     */
    static async waitForViewportStability(page: Page): Promise<void> {
        await page.evaluate(() => {
            return new Promise<void>(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => resolve());
                });
            });
        });
    }
}
