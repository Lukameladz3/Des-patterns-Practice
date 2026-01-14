import { Page } from '@playwright/test';

/**
 * Base Page Object
 * 
 * Contains common functionality shared across all page objects.
 * Following Spec-Driven Development (SDD) rules.
 */
export abstract class BasePage {
    protected readonly page: Page;
    protected readonly baseUrl: string;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = 'https://www.demoblaze.com';
    }

    /**
     * Navigate to a specific URL
     */
    async navigate(path: string = ''): Promise<void> {
        const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
        await this.page.goto(url);
    }

    /**
     * Get the page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Reload the current page
     */
    async reload(): Promise<void> {
        await this.page.reload();
    }

    /**
     * Go back to the previous page
     */
    async goBack(): Promise<void> {
        await this.page.goBack();
    }
}
