export interface GetProductsResponse {
    products: Product[];
}

export interface Product {
    id: string;
    sku: string;
    price: string;
}
