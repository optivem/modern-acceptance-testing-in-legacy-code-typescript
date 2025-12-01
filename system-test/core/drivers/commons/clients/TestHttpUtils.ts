import { AxiosResponse } from 'axios';
import { Result } from '../Result.js';
import { ProblemDetailResponse } from '../../commons/dtos/ProblemDetailResponse.js';

export class TestHttpUtils {
    static getOkResultOrFailure<T>(response: AxiosResponse<T>): Result<T> {
        if (response.status === 200) {
            return Result.success(response.data);
        }
        return this.extractErrorMessages(response);
    }

    static getCreatedResultOrFailure<T>(response: AxiosResponse<T>): Result<T> {
        if (response.status === 201) {
            return Result.success(response.data);
        }
        return this.extractErrorMessages(response);
    }

    static getNoContentResultOrFailure(response: AxiosResponse<void>): Result<void> {
        if (response.status === 204) {
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
}
