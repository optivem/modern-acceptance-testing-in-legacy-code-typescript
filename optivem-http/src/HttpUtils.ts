import { AxiosResponse } from 'axios';
import { Result } from '@optivem/lang';
import { ProblemDetailResponse } from './ProblemDetailResponse.js';
import { StatusCodes } from 'http-status-codes';

export class HttpUtils {
    static getOkResultOrFailure<T>(response: AxiosResponse<T>): Result<T, ProblemDetailResponse> {
        return HttpUtils.getResultOrFailure(response, StatusCodes.OK, true);
    }

    static getCreatedResultOrFailure<T>(response: AxiosResponse<T>): Result<T, ProblemDetailResponse> {
        return HttpUtils.getResultOrFailure(response, StatusCodes.CREATED, true);
    }

    static getNoContentResultOrFailure(response: AxiosResponse<void>): Result<void, ProblemDetailResponse> {
        return HttpUtils.getResultOrFailure(response, StatusCodes.NO_CONTENT, false);
    }

    private static getResultOrFailure<T>(response: AxiosResponse<T>, statusCode: StatusCodes, hasData: boolean): Result<T, ProblemDetailResponse> {
        if (response.status === statusCode) {
            if (hasData) {
                return Result.success(response.data);
            }
            return Result.success();
        }
        return this.extractError(response);
    }

    private static extractError<T>(response: AxiosResponse<any>): Result<T, ProblemDetailResponse> {
        if (this.isProblemDetails(response.data)) {
            const problemDetails = response.data as ProblemDetailResponse;
            return Result.failure(problemDetails);
        }
        
        // Create a problem detail from the raw response
        const problemDetail: ProblemDetailResponse = {
            status: response.status,
            detail: JSON.stringify(response.data),
            title: `HTTP ${response.status}`
        };
        return Result.failure(problemDetail);
    }

    private static isProblemDetails(data: any): boolean {
        return data && (data.type || data.title || data.detail || data.errors);
    }
}
