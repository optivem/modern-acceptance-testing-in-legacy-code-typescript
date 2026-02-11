import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Result } from '../util/index.js';
import { HttpStatus } from './HttpStatus.js';

/**
 * High-level HTTP client that returns Result<T, E> directly.
 */
export class JsonHttpClient<E> {
    private readonly client: AxiosInstance;

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true,
        });
    }

    /**
     * GET. For no response body use get&lt;void&gt;(path) → Result&lt;void, E&gt;.
     */
    async get<T>(path: string): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doGet(path));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * POST. For no response body use post&lt;void&gt;(path, request) → Result&lt;void, E&gt;.
     */
    async post<T>(path: string, request: object): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doPost(path, request));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * PUT. For no response body use put&lt;void&gt;(path, request) → Result&lt;void, E&gt;.
     */
    async put<T>(path: string, request: object): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doPut(path, request));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * DELETE. For no response body use delete&lt;void&gt;(path) → Result&lt;void, E&gt;.
     */
    async delete<T>(path: string): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doDelete(path));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * HELPERS
     */

    private doGet(path: string): Promise<AxiosResponse<unknown>> {
        return this.client.get(path);
    }

    private doPost(path: string, request: object): Promise<AxiosResponse<unknown>> {
        return this.client.post(path, request);
    }

    private doPut(path: string, request: object): Promise<AxiosResponse<unknown>> {
        return this.client.put(path, request);
    }

    private doDelete(path: string): Promise<AxiosResponse<unknown>> {
        return this.client.delete(path);
    }

    private async doRequest(request: () => Promise<AxiosResponse<unknown>>): Promise<Result<AxiosResponse<unknown>, E>> {
        try {
            const response = await request();
            return Result.success(response);
        } catch (error) {
            return Result.failure(this.axiosErrorToError(error) as E);
        }
    }

    private getResultOrFailure<T>(httpResponse: Result<AxiosResponse<unknown>, E>): Result<T, E> {
        if (httpResponse.isFailure()) return Result.failure(httpResponse.getError());
        const response = httpResponse.getValue();
        if (response.status >= 200 && response.status < 300) {
            return Result.success(response.data as T);
        }
        return Result.failure(this.toError(response) as E);
    }

    private toError(response: AxiosResponse<unknown>): unknown {
        const data = response.data;
        if (data != null && typeof data === 'object' && ('type' in data || 'title' in data || 'detail' in data)) {
            return data;
        }
        return {
            status: response.status,
            title: `HTTP ${response.status}`,
            detail: typeof data === 'string' ? data : JSON.stringify(data),
        };
    }

    private axiosErrorToError(error: unknown): unknown {
        if (axios.isAxiosError(error)) {
            const ax = error as AxiosError<unknown>;
            if (ax.response?.data != null && typeof ax.response.data === 'object') {
                return ax.response.data;
            }
            return {
                status: ax.response?.status ?? 0,
                title: ax.code ?? 'Network Error',
                detail: ax.message,
            };
        }
        return {
            status: 0,
            title: 'Unknown Error',
            detail: error instanceof Error ? error.message : String(error),
        };
    }
}

// TODO: VJ: Please check whole file, esp from doGet, etc...
