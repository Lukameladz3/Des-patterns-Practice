import { Page } from '@playwright/test';

export type PageAction = (...args: any[]) => Promise<any>;

export interface ActionDecorator {
    (action: PageAction, actionName: string): PageAction;
}

export function withLogging(action: PageAction, actionName: string): PageAction {
    return async function (...args: any[]): Promise<any> {
        const startTime = Date.now();
        const timestamp = new Date().toISOString();

        console.log(`[${timestamp}] → Starting: ${actionName}`);

        try {
            const result = await action(...args);
            const duration = Date.now() - startTime;
            console.log(`[${timestamp}] ✓ Completed: ${actionName} (${duration}ms)`);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`[${timestamp}] ✗ Failed: ${actionName} (${duration}ms)`);
            throw error;
        }
    };
}

export function withScreenshot(page: Page, action: PageAction, actionName: string): PageAction {
    return async function (...args: any[]): Promise<any> {
        try {
            return await action(...args);
        } catch (error) {
            const screenshotName = `failure-${actionName.replace(/\s+/g, '-')}-${Date.now()}.png`;
            await page.screenshot({ path: `screenshots/${screenshotName}`, fullPage: true });
            console.log(`  📸 Screenshot saved: ${screenshotName}`);
            throw error;
        }
    };
}

export function withRetry(maxRetries: number = 3, delayMs: number = 1000): ActionDecorator {
    return function (action: PageAction, actionName: string): PageAction {
        return async function (...args: any[]): Promise<any> {
            let lastError: any;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    return await action(...args);
                } catch (error) {
                    lastError = error;

                    if (attempt < maxRetries) {
                        console.log(`  ⟳ Retry ${attempt}/${maxRetries - 1} for: ${actionName}`);
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                    }
                }
            }

            console.error(`  ✗ All retries failed for: ${actionName}`);
            throw lastError;
        };
    };
}

export function withTiming(action: PageAction, actionName: string): PageAction {
    return async function (...args: any[]): Promise<any> {
        const startTime = performance.now();

        try {
            const result = await action(...args);
            const duration = (performance.now() - startTime).toFixed(2);
            console.log(`  ⏱️  ${actionName}: ${duration}ms`);
            return result;
        } catch (error) {
            const duration = (performance.now() - startTime).toFixed(2);
            console.log(`  ⏱️  ${actionName}: ${duration}ms (failed)`);
            throw error;
        }
    };
}

export function composeDecorators(...decorators: ActionDecorator[]): ActionDecorator {
    return function (action: PageAction, actionName: string): PageAction {
        return decorators.reduceRight(
            (decoratedAction, decorator) => decorator(decoratedAction, actionName),
            action
        );
    };
}
