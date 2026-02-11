/**
 * Objects that hold resources and must be closed asynchronously (e.g. Playwright browser).
 * Mirrors .NET IAsyncDisposable (ValueTask DisposeAsync()).
 * Prefer closing in reverse order of creation (e.g. page → context → browser).
 */
export interface AsyncCloseable {
    close(): Promise<void>;
}
