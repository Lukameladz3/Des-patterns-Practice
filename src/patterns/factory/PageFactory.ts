import { Page } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { SignUpPage } from '../../pages/SignUpPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { BasePage } from '../../pages/BasePage';

export type PageType = 'HOME' | 'LOGIN' | 'SIGNUP' | 'PRODUCT' | 'CART';

/**
 * Factory Method Pattern Implementation - Page Objects
 * 
 * Purpose: Centralizes the creation of Page Objects.
 * This simplifies dependency management and allows for easier extension.
 */
export class PageFactory {
    /**
     * Creates and returns a Page Object based on the provided type.
     */
    public static createPage(type: PageType, page: Page): BasePage {
        switch (type) {
            case 'HOME':
                return new HomePage(page);
            case 'LOGIN':
                return new LoginPage(page);
            case 'SIGNUP':
                return new SignUpPage(page);
            case 'PRODUCT':
                return new ProductPage(page);
            case 'CART':
                return new CartPage(page);
            default:
                throw new Error(`Unknown page type: ${type}`);
        }
    }
}
