/**
 * Test Constants
 * 
 * Centralized location for all test-related constants used across the test suite.
 * This improves maintainability and provides a single source of truth for test values.
 */

/**
 * Product Constants
 */
export const PRODUCTS = {
    APPLE_MONITOR: {
        NAME: 'Apple monitor 24',
        PRICE: 400,
        CATEGORY: 'Monitors'
    }
} as const;

/**
 * Selector Constants
 */
export const SELECTORS = {
    APPLE_MONITOR: `a.hrefch:has-text("${PRODUCTS.APPLE_MONITOR.NAME}")`,
    HOME_PAGE_INDICATOR: '.nav-link:has-text("Home")',
    LAPTOPS_CATEGORY: 'a.list-group-item:has-text("Laptops")',
    MONITORS_CATEGORY: 'a.list-group-item:has-text("Monitors")',
    PHONES_CATEGORY: 'a.list-group-item:has-text("Phones")'
} as const;

/**
 * URL Constants
 */
export const URLS = {
    BASE_URL: 'https://www.demoblaze.com',
    HOME_PAGE: 'https://www.demoblaze.com/index.html'
} as const;

/**
 * Category Constants
 */
export const CATEGORIES = {
    LAPTOPS: 'Laptops',
    MONITORS: 'Monitors',
    PHONES: 'Phones'
} as const;
