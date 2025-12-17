import { AxiosResponse } from 'axios';
import { Result } from '@optivem/lang';
import { ProblemDetailResponse } from './ProblemDetailResponse.js';
import { StatusCodes } from 'http-status-codes';

export class HttpUtils {
    static getOkResultOrFailure<T>(responseResult: Result<AxiosResponse<T>, ProblemDetailResponse>): Result<T, ProblemDetailResponse> {
        return HttpUtils.getResultOrFailure(responseResult, StatusCodes.OK, true);
    }

    static getCreatedResultOrFailure<T>(responseResult: Result<AxiosResponse<T>, ProblemDetailResponse>): Result<T, ProblemDetailResponse> {
        return HttpUtils.getResultOrFailure(responseResult, StatusCodes.CREATED, true);
    }

    static getNoContentResultOrFailure(responseResult: Result<AxiosResponse<void>, ProblemDetailResponse>): Result<void, ProblemDetailResponse> {
        return HttpUtils.getResultOrFailure(responseResult, StatusCodes.NO_CONTENT, false);
    }

    private static getResultOrFailure<T>(responseResult: Result<AxiosResponse<T>, ProblemDetailResponse>, statusCode: StatusCodes, hasData: boolean): Result<T, ProblemDetailResponse> {
        if (responseResult.isFailure()) {
            return Result.failure(responseResult.getError());
        }

        const response = responseResult.getValue();
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
