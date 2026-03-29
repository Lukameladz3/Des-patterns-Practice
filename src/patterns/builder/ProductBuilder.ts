/**
 * Builder Pattern Implementation - Product Data
 * 
 * Purpose: Provides a flexible way to construct product test data objects
 * with various optional attributes.
 */

export interface Product {
    name: string;
    price?: number;
    description?: string;
    category?: string;
    imageUrl?: string;
    inStock?: boolean;
}

export class ProductBuilder {
    private product: Partial<Product> = {};

    /**
     * Sets the product name.
     */
    public withName(name: string): ProductBuilder {
        this.product.name = name;
        return this;
    }

    /**
     * Sets the product price.
     */
    public withPrice(price: number): ProductBuilder {
        this.product.price = price;
        return this;
    }

    /**
     * Sets the product description.
     */
    public withDescription(description: string): ProductBuilder {
        this.product.description = description;
        return this;
    }

    /**
     * Sets the product category.
     */
    public withCategory(category: string): ProductBuilder {
        this.product.category = category;
        return this;
    }

    /**
     * Sets the product image URL.
     */
    public withImageUrl(imageUrl: string): ProductBuilder {
        this.product.imageUrl = imageUrl;
        return this;
    }

    /**
     * Sets the product stock status.
     */
    public withStockStatus(inStock: boolean): ProductBuilder {
        this.product.inStock = inStock;
        return this;
    }

    /**
     * Builds and returns the final Product object.
     */
    public build(): Product {
        if (!this.product.name) {
            throw new Error('Product name is required');
        }
        return this.product as Product;
    }

    /**
     * Static factory method for Apple monitor (used in test scenario).
     */
    public static appleMonitor(): ProductBuilder {
        return new ProductBuilder()
            .withName('Apple monitor 24')
            .withCategory('Monitors')
            .withStockStatus(true);
    }

    /**
     * Static factory method for creating a custom product.
     */
    public static custom(name: string): ProductBuilder {
        return new ProductBuilder().withName(name);
    }
}

/**
 * Example usage:
 * 
 * // Create Apple monitor product
 * const monitor = ProductBuilder.appleMonitor()
 *   .withPrice(400)
 *   .withDescription('24-inch LED Cinema Display')
 *   .build();
 * 
 * // Create custom product
 * const laptop = ProductBuilder.custom('MacBook Pro')
 *   .withPrice(1299)
 *   .withCategory('Laptops')
 *   .withDescription('13-inch, M1 chip')
 *   .withStockStatus(true)
 *   .build();
 */
