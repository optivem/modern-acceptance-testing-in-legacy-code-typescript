import { Result } from '../util/index.js';
import { HttpClientFactory } from './HttpClientFactory.js';
import { HttpGateway } from './HttpGateway.js';
import { HttpUtils } from './HttpUtils.js';
import { ProblemDetailResponse } from './ProblemDetailResponse.js';

/**
 * High-level HTTP client that returns Result<T, E> directly.
 */
export class JsonHttpClient<E> {
    private readonly gateway: HttpGateway;

    constructor(baseUrl: string) {
        const client = HttpClientFactory.create(baseUrl);
        this.gateway = new HttpGateway(client, baseUrl);
    }

    async get<T>(path: string): Promise<Result<T, E>> {
        const responseResult = await this.gateway.get<T>(path);
        return HttpUtils.getOkResultOrFailure(responseResult) as Result<T, E>;
    }

    async getVoid(path: string): Promise<Result<void, E>> {
        const responseResult = await this.gateway.get<void>(path);
        return HttpUtils.getOkResultOrFailure(responseResult).mapVoid() as Result<void, E>;
    }

    async post<T>(path: string, request: unknown): Promise<Result<T, E>> {
        const responseResult = await this.gateway.post<T>(path, request);
        return HttpUtils.getCreatedResultOrFailure(responseResult) as Result<T, E>;
    }

    async postVoid(path: string, request?: unknown): Promise<Result<void, E>> {
        const responseResult = await this.gateway.post<void>(path, request ?? {});
        return HttpUtils.getCreatedResultOrFailure(responseResult).mapVoid() as Result<void, E>;
    }

    async put<T>(path: string, request: unknown): Promise<Result<T, E>> {
        const responseResult = await this.gateway.put<T>(path, request);
        return HttpUtils.getOkResultOrFailure(responseResult) as Result<T, E>;
    }

    async putVoid(path: string, request: unknown): Promise<Result<void, E>> {
        const responseResult = await this.gateway.put<void>(path, request);
        return HttpUtils.getNoContentResultOrFailure(responseResult) as Result<void, E>;
    }

    async delete<T>(path: string): Promise<Result<T, E>> {
        const responseResult = await this.gateway.delete<T>(path);
        return HttpUtils.getOkResultOrFailure(responseResult) as Result<T, E>;
    }

    async deleteVoid(path: string): Promise<Result<void, E>> {
        const responseResult = await this.gateway.delete<void>(path);
        return HttpUtils.getNoContentResultOrFailure(responseResult) as Result<void, E>;
    }
}
