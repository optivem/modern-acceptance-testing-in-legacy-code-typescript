import axios from 'axios';

export interface ProductDetails {
  price: number;
}

export class ErpGateway {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.ERP_API_URL || 'http://localhost:3200';
  }

  async getProductDetails(sku: string): Promise<ProductDetails | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${sku}`);
      return {
        price: response.data.price
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
