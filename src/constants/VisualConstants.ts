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
