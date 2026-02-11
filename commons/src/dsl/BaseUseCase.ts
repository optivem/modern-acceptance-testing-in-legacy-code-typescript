import { UseCase } from './UseCase.js';
import { UseCaseContext } from './UseCaseContext.js';
import { UseCaseResult } from './UseCaseResult.js';

export abstract class BaseUseCase<
  TDriver,
  TContext = UseCaseContext,
  TSuccessResponse = unknown,
  TFailureResponse = unknown,
  TSuccessVerification = unknown,
  TFailureVerification = unknown
> implements UseCase<UseCaseResult<TSuccessResponse, TFailureResponse, TContext, TSuccessVerification, TFailureVerification>> {
  protected readonly driver: TDriver;
  protected readonly context: TContext;

  protected constructor(driver: TDriver, context: TContext) {
    this.driver = driver;
    this.context = context;
  }

  abstract execute(): Promise<UseCaseResult<TSuccessResponse, TFailureResponse, TContext, TSuccessVerification, TFailureVerification>>;
}
