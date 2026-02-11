/**
 * Objects that hold resources and can be closed (e.g. browser, context, HTTP client).
 * Prefer closing in reverse order of creation (e.g. page → context → browser).
 */
export interface Closeable {
    close(): void | Promise<void>;
}
