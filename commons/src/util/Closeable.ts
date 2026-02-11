/**
 * Objects that hold resources and can be closed synchronously.
 * Mirrors .NET IDisposable (void Dispose()).
 * Prefer closing in reverse order of creation (e.g. page → context → browser).
 */
export interface Closeable {
    close(): void;
}
