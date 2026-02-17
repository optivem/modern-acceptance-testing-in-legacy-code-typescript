export interface PublishCouponRequest {
    code?: string | null;
    discountRate?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
    usageLimit?: string | null;
}
