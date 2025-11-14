import axios from 'axios';

export interface TaxDetails {
  taxRate: number;
}

export class TaxGateway {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.TAX_API_URL || 'http://localhost:3001';
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
