import axios from 'axios';
import { AppConfig } from '../../config/AppConfig';

export interface ProductDetails {
  price: number;
}

export class ErpGateway {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AppConfig.ERP_API_URL;
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
