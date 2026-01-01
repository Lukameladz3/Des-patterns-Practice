/**
 * Visual Testing Constants
 * 
 * Centralized location for all visual regression testing related constants.
 */

export const VISUAL_SNAPSHOTS = {
    HOMEPAGE: {
        INITIAL: '01-homepage-initial.png',
        LOGGED_IN: '02-homepage-logged-in.png',
    },
    CART: {
        WITH_PRODUCT: '03-cart-with-product.png',
    },
    CATALOG: {
        ALL: 'catalog-01-all-products.png',
        LAPTOPS: 'catalog-02-laptops.png',
        MONITORS: 'catalog-03-monitors.png',
    },
    RESPONSIVE: {
        DESKTOP: 'responsive-01-desktop.png',
        TABLET: 'responsive-02-tablet.png',
        MOBILE: 'responsive-03-mobile.png',
    }
} as const;

export const VIEWPORTS = {
    DESKTOP: { width: 1920, height: 1080 },
    TABLET: { width: 768, height: 1024 },
    MOBILE: { width: 375, height: 667 },
} as const;

export const VISUAL_PLACEHOLDERS = {
    USERNAME: 'Welcome VisualUser',
} as const;

/**
 * Expected product counts per category (as of data snapshot)
 * These are OPTIONAL - use only if you want to assert specific counts.
 * Note: These may change if backend data is updated.
 */
export const EXPECTED_PRODUCT_COUNTS = {
    ALL: 9,      // All products on homepage
    PHONES: 7,   // Phones category
    LAPTOPS: 6,  // Laptops category
    MONITORS: 6, // Monitors category (Updated: was 2, actual is 6)
} as const;

