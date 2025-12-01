export interface ProblemDetailsFieldErrorResponse {
    field: string;
    message: string;
    code: string;
    rejectedValue: any;
}

export interface ProblemDetailResponse {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: ProblemDetailsFieldErrorResponse[];
}
