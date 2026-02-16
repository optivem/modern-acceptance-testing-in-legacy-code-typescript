/**
 * API error body shape (e.g. RFC 7807 problem details).
 * Defined in client because it is the contract of the HTTP API the client calls.
 */
export interface ProblemDetailsResponse {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    timestamp?: string;
    errors?: Array<{
        field?: string;
        message?: string;
        code?: string;
        rejectedValue?: unknown;
    }>;
}
