/**
 * Safe close for closeable resources. Rethrows on failure so callers can handle.
 * Accepts Closeable or any object with an optional close() (no-op if close is missing).
 */
export class Closer {
    static async close(closeable: { close?: () => void | Promise<void> } | null | undefined): Promise<void> {
        if (closeable == null || typeof closeable.close !== 'function') {
            return;
        }
        try {
            const result = closeable.close();
            if (result instanceof Promise) {
                await result;
            }
        } catch (error) {
            throw new Error('Failed to close resource', { cause: error });
        }
    }
}
