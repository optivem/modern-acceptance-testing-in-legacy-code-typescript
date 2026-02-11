import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Result } from '../util/index.js';
import { ProblemDetailResponse } from './ProblemDetailResponse.js';

/**
 * @deprecated Use {@link JsonHttpClient} instead. HttpGateway returns raw Axios responses;
 * JsonHttpClient returns Result<T, E> directly and will replace this API.
 */
export class HttpGateway {
    private readonly client: AxiosInstance;
    private readonly baseUrl: string;

    constructor(client: AxiosInstance, baseUrl: string) {
        this.client = client;
        this.baseUrl = baseUrl;
    }

    async get<T>(path: string): Promise<Result<AxiosResponse<T>, ProblemDetailResponse>> {
        return this.executeRequest(() => this.client.get<T>(path));
    }

    async post<T>(path: string, body: any): Promise<Result<AxiosResponse<T>, ProblemDetailResponse>> {
        return this.executeRequest(() => this.client.post<T>(path, body));
    }

    async put<T>(path: string, body: any): Promise<Result<AxiosResponse<T>, ProblemDetailResponse>> {
        return this.executeRequest(() => this.client.put<T>(path, body));
    }

    async delete<T>(path: string): Promise<Result<AxiosResponse<T>, ProblemDetailResponse>> {
        return this.executeRequest(() => this.client.delete<T>(path));
    }

    private async executeRequest<T>(request: () => Promise<AxiosResponse<T>>): Promise<Result<AxiosResponse<T>, ProblemDetailResponse>> {
        try {
            const response = await request();
            if (this.isSuccessStatusCode(response.status)) {
                return Result.success(response);
            }
            return Result.failure(this.createProblemDetailFromResponse(response));
        } catch (error) {
            const problemDetail = this.createProblemDetailFromError(error);
            return Result.failure(problemDetail);
        }
    }

    private isSuccessStatusCode(status: number): boolean {
        return status >= 200 && status < 300;
    }

    private createProblemDetailFromResponse<T>(response: AxiosResponse<T>): ProblemDetailResponse {
        const data = response.data as any;
        if (data && (data.type || data.title || data.detail || data.errors)) {
            return data as ProblemDetailResponse;
        }
        return {
            status: response.status,
            title: `HTTP ${response.status}`,
            detail: JSON.stringify(response.data),
        };
    }

    private createProblemDetailFromError(error: unknown): ProblemDetailResponse {
        if (error instanceof AxiosError) {
            return {
                status: error.response?.status ?? 0,
                title: error.code ?? 'Network Error',
                detail: error.message,
            };
        }
        return {
            status: 0,
            title: 'Unknown Error',
            detail: error instanceof Error ? error.message : String(error),
        };
    }
}
