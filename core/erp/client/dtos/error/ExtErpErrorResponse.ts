export interface ExtErpErrorResponse {
    message?: string;
}

export function from(message: string | undefined): ExtErpErrorResponse {
    return { message };
}
