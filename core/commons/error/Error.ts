export interface FieldError {
    field: string;
    message: string;
    code?: string;
}

export interface Error {
    message: string;
    fields?: FieldError[];
}

export const createError = (message: string, fields?: FieldError[]): Error => ({
    message,
    fields
});

export const createFieldError = (field: string, message: string, code?: string): FieldError => ({
    field,
    message,
    code
});


