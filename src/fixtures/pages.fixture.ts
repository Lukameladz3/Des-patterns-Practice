import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { PageFactory } from '../patterns/factory/PageFactory';

export type PagesFixture = {
    homePage: HomePage;
    loginPage: LoginPage;
    signUpPage: SignUpPage;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<PagesFixture>({
    homePage: async ({ page }, use) => {
        await use(PageFactory.createPage('HOME', page) as HomePage);
    },
    loginPage: async ({ page }, use) => {
        await use(PageFactory.createPage('LOGIN', page) as LoginPage);
    },
    signUpPage: async ({ page }, use) => {
        await use(PageFactory.createPage('SIGNUP', page) as SignUpPage);
    },
    productPage: async ({ page }, use) => {
        await use(PageFactory.createPage('PRODUCT', page) as ProductPage);
    },
    cartPage: async ({ page }, use) => {
        await use(PageFactory.createPage('CART', page) as CartPage);
    },
});

export { expect } from '@playwright/test';
