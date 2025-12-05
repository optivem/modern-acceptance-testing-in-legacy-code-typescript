import { AxiosInstance, AxiosResponse } from 'axios';

export class HttpGateway {
    private readonly client: AxiosInstance;
    private readonly baseUrl: string;

    constructor(client: AxiosInstance, baseUrl: string) {
        this.client = client;
        this.baseUrl = baseUrl;
    }

    async get<T>(path: string): Promise<AxiosResponse<T>> {
        return await this.client.get<T>(path);
    }

    async post<T>(path: string, body: any): Promise<AxiosResponse<T>> {
        return await this.client.post<T>(path, body);
    }

    async put<T>(path: string, body: any): Promise<AxiosResponse<T>> {
        return await this.client.put<T>(path, body);
    }

    async delete<T>(path: string): Promise<AxiosResponse<T>> {
        return await this.client.delete<T>(path);
    }
}
