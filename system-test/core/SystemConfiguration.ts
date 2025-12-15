export class SystemConfiguration {
    private readonly shopUiBaseUrl: string;
    private readonly shopApiBaseUrl: string;
    private readonly erpBaseUrl: string;
    private readonly taxBaseUrl: string;
    
    constructor(
        shopUiBaseUrl: string,
        shopApiBaseUrl: string,
        erpBaseUrl: string,
        taxBaseUrl: string
    ) {
        this.shopUiBaseUrl = shopUiBaseUrl;
        this.shopApiBaseUrl = shopApiBaseUrl;
        this.erpBaseUrl = erpBaseUrl;
        this.taxBaseUrl = taxBaseUrl;
    }

    getShopUiBaseUrl(): string {
        return this.shopUiBaseUrl;
    }

    getShopApiBaseUrl(): string {
        return this.shopApiBaseUrl;
    }

    getErpBaseUrl(): string {
        return this.erpBaseUrl;
    }

    getTaxBaseUrl(): string {
        return this.taxBaseUrl;
    }
}