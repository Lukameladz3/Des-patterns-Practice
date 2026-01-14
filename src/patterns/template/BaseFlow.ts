import { Page } from '@playwright/test';
import { step } from '../../utils/StepDecorator';

/**
 * Abstract base class defining the template for test flows.
 */
export abstract class BaseFlow {
    protected page: Page;
    protected flowName: string;

    constructor(page: Page, flowName: string) {
        this.page = page;
        this.flowName = flowName;
    }

    /**
     * Template Method - defines the skeleton of the flow.
     */
    @step()
    public async execute(): Promise<void> {
        try {
            await this.setup();
            await this.performActions();
            await this.verify();
            await this.cleanup();
        } catch (error) {
            await this.handleError(error);
            throw error;
        }
    }

    /**
     * Hook method: Setup phase (optional override)
     */
    protected async setup(): Promise<void> {
        // Default implementation does nothing
    }

    /**
     * Abstract method: Main actions (required override)
     */
    public abstract performActions(): Promise<void>;

    /**
     * Abstract method: Verification phase (required override)
     */
    protected abstract verify(): Promise<void>;

    /**
     * Hook method: Cleanup phase (optional override)
     */
    protected async cleanup(): Promise<void> {
        // Default implementation does nothing
    }

    /**
     * Hook method: Error handling (optional override)
     */
    protected async handleError(error: any): Promise<void> {
        // Subclasses can override for custom error handling
    }
}
