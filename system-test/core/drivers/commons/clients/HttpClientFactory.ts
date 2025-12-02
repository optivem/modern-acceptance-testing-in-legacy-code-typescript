import axios, { AxiosInstance } from 'axios';

export class HttpClientFactory {
    static create(baseUrl: string): AxiosInstance {
        return axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            validateStatus: () => true,
        });
    }
}
