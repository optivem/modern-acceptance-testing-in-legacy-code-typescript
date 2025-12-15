import { AxiosResponse } from 'axios';
import { Result } from '@optivem/lang';
import { ProblemDetailResponse } from './ProblemDetailResponse.js';
import { StatusCodes } from 'http-status-codes';

export class HttpUtils {
    static getOkResultOrFailure<T>(response: AxiosResponse<T>): Result<T> {
        return HttpUtils.getResultOrFailure(response, StatusCodes.OK, true);
    }

    static getCreatedResultOrFailure<T>(response: AxiosResponse<T>): Result<T> {
        return HttpUtils.getResultOrFailure(response, StatusCodes.CREATED, true);
    }

    static getNoContentResultOrFailure(response: AxiosResponse<void>): Result<void> {
        return HttpUtils.getResultOrFailure(response, StatusCodes.NO_CONTENT, false);
    }

    private static getResultOrFailure<T>(response: AxiosResponse<T>, statusCode: StatusCodes, hasData: boolean): Result<T> {
        if (response.status === statusCode) {
            if (hasData) {
                return Result.success(response.data);
            }
            return Result.success();
        }
        return this.extractErrorMessages(response);
    }

    private static extractErrorMessages<T>(response: AxiosResponse<any>): Result<T> {
        if (this.isProblemDetails(response.data)) {
            const problemDetails = response.data as ProblemDetailResponse;
            
            const errorMessages: string[] = [];
            
            if (problemDetails.detail) {
                errorMessages.push(problemDetails.detail);
            }
            
            if (problemDetails.title && problemDetails.title !== problemDetails.detail) {
                errorMessages.push(`Title: ${problemDetails.title}`);
            }
            
            if (problemDetails.errors && problemDetails.errors.length > 0) {
                for (const error of problemDetails.errors) {
                    errorMessages.push(error.message);
                }
            }
            
            if (errorMessages.length > 0) {
                return Result.failure(errorMessages);
            }
        }
        
        return Result.failure([`HTTP ${response.status}: ${JSON.stringify(response.data)}`]);
    }

    private static isProblemDetails(data: any): boolean {
        return data && (data.type || data.title || data.detail || data.errors);
    }

    // TODO: VJ: Get uri
}
