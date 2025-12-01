export class Closer {
    static async close(closeable: any): Promise<void> {
        if (closeable && typeof closeable.close === 'function') {
            try {
                await closeable.close();
            } catch (error) {
                console.error('Error closing resource:', error);
            }
        }
    }
}
