export class ClientCloser {
  static async close(client: { close(): Promise<void> } | null): Promise<void> {
    if (client) {
      try {
        await client.close();
      } catch (error) {
        throw new Error(`Failed to close client: ${error}`);
      }
    }
  }
}
