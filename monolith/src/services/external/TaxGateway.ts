import axios from 'axios';
import { AppConfig } from '../../config/AppConfig';

export interface TaxDetails {
  taxRate: number;
}

export class TaxGateway {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AppConfig.TAX_API_URL;
  }

  async getTaxDetails(country: string): Promise<TaxDetails | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/countries/${country}`);
      return {
        taxRate: response.data.taxRate
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
