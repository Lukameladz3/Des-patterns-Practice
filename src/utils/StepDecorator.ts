import { test } from '@playwright/test';

/**
 * Decorator that wraps a function in a Playwright test step.
 * Uses Stage 3 decorator syntax for maximum compatibility.
 */
export function step(stepName?: string) {
    return function (originalMethod: any, context: ClassMethodDecoratorContext) {
        return async function (this: any, ...args: any[]) {
            const name = stepName || String(context.name);
            return await test.step(name, async () => {
                return await originalMethod.apply(this, args);
            });
        };
    };
}
