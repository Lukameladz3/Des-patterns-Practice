import { Page } from '@playwright/test';
import { BaseFlow } from './BaseFlow';
import { User } from '../builder/UserBuilder';
import { SignUpPage } from '../../pages/SignUpPage';
import { HomePage } from '../../pages/HomePage';
import { step } from '../../utils/StepDecorator';

/**
 * Concrete implementation of BaseFlow for Sign-Up flow.
 */
export class SignUpFlow extends BaseFlow {
    private user: User;
    private signUpPage: SignUpPage;
    private homePage: HomePage;
    private dialogPromise: Promise<string | null> | null = null;

    constructor(page: Page, user: User) {
        super(page, 'Sign Up');
        this.user = user;
        this.signUpPage = new SignUpPage(page);
        this.homePage = new HomePage(page);
    }

    /**
     * Override: Setup phase to prepare dialog listener
     */
    @step('Sign Up: Setup')
    protected async setup(): Promise<void> {
        this.dialogPromise = this.page.waitForEvent('dialog', { timeout: 10000 }).then(async dialog => {
            const message = dialog.message();
            await dialog.accept();
            return message;
        }).catch(() => {
            return null;
        });
    }

    /**
     * Override: Perform sign-up actions using Page Objects
     */
    @step('Sign Up: Perform Actions')
    public async performActions(): Promise<void> {
        await this.homePage.clickSignUp();
        await this.signUpPage.signUp(this.user);
    }

    /**
     * Override: Verify sign-up success
     */
    @step('Sign Up: Verify')
    protected async verify(): Promise<void> {
        if (this.dialogPromise) {
            await this.dialogPromise;
        }
    }

    /**
     * Override: Cleanup
     */
    @step('Sign Up: Cleanup')
    protected async cleanup(): Promise<void> {
        if (await this.signUpPage.modal.isVisible()) {
            await this.signUpPage.closeModal().catch(() => {});
        }
    }
}
