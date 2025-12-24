import { Page, expect } from '@playwright/test';

export interface Command {
    execute(): Promise<void>;
    undo?(): Promise<void>;
    getDescription(): string;
}

export class ClickCommand implements Command {
    private page: Page;
    private selector: string;
    private description: string;

    constructor(page: Page, selector: string, description?: string) {
        this.page = page;
        this.selector = selector;
        this.description = description || `Click on ${selector}`;
    }

    public async execute(): Promise<void> {
        console.log(`  → Executing: ${this.description}`);
        const element = this.page.locator(this.selector);
        await element.click();
        console.log(`  ✓ Clicked: ${this.selector}`);
    }

    public getDescription(): string {
        return this.description;
    }
}

export class TypeCommand implements Command {
    private page: Page;
    private selector: string;
    private text: string;
    private description: string;
    private previousValue?: string;

    constructor(page: Page, selector: string, text: string, description?: string) {
        this.page = page;
        this.selector = selector;
        this.text = text;
        this.description = description || `Type '${text}' into ${selector}`;
    }

    public async execute(): Promise<void> {
        console.log(`  → Executing: ${this.description}`);
        const element = this.page.locator(this.selector);
        this.previousValue = await element.inputValue().catch(() => '');
        await element.fill(this.text);
        console.log(`  ✓ Typed into: ${this.selector}`);
    }

    public async undo(): Promise<void> {
        if (this.previousValue !== undefined) {
            console.log(`  ← Undoing: ${this.description}`);
            await this.page.locator(this.selector).fill(this.previousValue);
            console.log(`  ✓ Restored previous value`);
        }
    }

    public getDescription(): string {
        return this.description;
    }
}

export class NavigateCommand implements Command {
    private page: Page;
    private url: string;
    private description: string;

    constructor(page: Page, url: string, description?: string) {
        this.page = page;
        this.url = url;
        this.description = description || `Navigate to ${url}`;
    }

    public async execute(): Promise<void> {
        console.log(`  → Executing: ${this.description}`);
        await this.page.goto(this.url);
        console.log(`  ✓ Navigated to: ${this.url}`);
    }

    public getDescription(): string {
        return this.description;
    }
}

export class WaitCommand implements Command {
    private page: Page;
    private selector: string;
    private description: string;

    constructor(page: Page, selector: string, description?: string) {
        this.page = page;
        this.selector = selector;
        this.description = description || `Wait for ${selector}`;
    }

    public async execute(): Promise<void> {
        console.log(`  → Executing: ${this.description}`);
        await expect(this.page.locator(this.selector)).toBeVisible();
        console.log(`  ✓ Element visible: ${this.selector}`);
    }

    public getDescription(): string {
        return this.description;
    }
}

export class VerifyCommand implements Command {
    private page: Page;
    private selector: string;
    private expectedText: string;
    private description: string;

    constructor(page: Page, selector: string, expectedText: string, description?: string) {
        this.page = page;
        this.selector = selector;
        this.expectedText = expectedText;
        this.description = description || `Verify ${selector} contains '${expectedText}'`;
    }

    public async execute(): Promise<void> {
        console.log(`  → Executing: ${this.description}`);
        const element = this.page.locator(this.selector);
        await expect(element).toContainText(this.expectedText);
        console.log(`  ✓ Verification passed: ${this.selector}`);
    }

    public getDescription(): string {
        return this.description;
    }
}
