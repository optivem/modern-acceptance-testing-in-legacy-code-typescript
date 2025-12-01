import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class TestHttpClient {
    private readonly client: AxiosInstance;

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            validateStatus: () => true, // Don't throw on any status
        });
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
