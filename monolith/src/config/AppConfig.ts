export class AppConfig {
  // Server configuration
  static readonly PORT = parseInt(process.env.PORT || '8082');

  // Database configuration
  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = parseInt(process.env.DB_PORT || '5434');
  static readonly DB_USER = process.env.DB_USER || 'eshop_user';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'eshop_password';
  static readonly DB_NAME = process.env.DB_NAME || 'eshop';
  static readonly DB_DROP_SCHEMA = process.env.DB_DROP_SCHEMA === 'true';

  // External services configuration
  static readonly ERP_API_URL = process.env.ERP_API_URL || 'http://localhost:3200';
  static readonly TAX_API_URL = process.env.TAX_API_URL || 'http://localhost:3201';

  // Validate required configuration
  static validate(): void {
    const required = [
      { name: 'PORT', value: this.PORT },
      { name: 'DB_HOST', value: this.DB_HOST },
      { name: 'DB_PORT', value: this.DB_PORT },
      { name: 'DB_USER', value: this.DB_USER },
      { name: 'DB_PASSWORD', value: this.DB_PASSWORD },
      { name: 'DB_NAME', value: this.DB_NAME },
      { name: 'ERP_API_URL', value: this.ERP_API_URL },
      { name: 'TAX_API_URL', value: this.TAX_API_URL },
    ];

    const missing = required.filter(({ value }) => !value);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required configuration: ${missing.map(({ name }) => name).join(', ')}`
      );
    }
  }
}
