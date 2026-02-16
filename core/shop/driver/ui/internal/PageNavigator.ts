export enum Page {
    NONE = 'NONE',
    HOME = 'HOME',
    NEW_ORDER = 'NEW_ORDER',
    ORDER_HISTORY = 'ORDER_HISTORY',
    ORDER_DETAILS = 'ORDER_DETAILS',
    COUPON_MANAGEMENT = 'COUPON_MANAGEMENT',
}

export class PageNavigator {
    private currentPage: Page = Page.NONE;

    isOnPage(page: Page): boolean {
        return this.currentPage === page;
    }

    setCurrentPage(page: Page): void {
        this.currentPage = page;
    }

    getCurrentPage(): Page {
        return this.currentPage;
    }
}
