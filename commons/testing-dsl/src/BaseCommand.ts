import { UseCase } from './Command.js';
import { UseCaseContext } from './Context.js';
import { UseCaseResult } from './CommandResult.js';

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

// Backward compatibility: BaseCommand with 3 generic params (TDriver, TResponse, TVerification)
// Maps to BaseUseCase<TDriver, UseCaseContext, TResponse, unknown, TVerification, unknown>
export abstract class BaseCommand<
  TDriver,
  TResponse,
  TVerification
> extends BaseUseCase<TDriver, UseCaseContext, TResponse, unknown, TVerification, unknown> {
  protected constructor(driver: TDriver, context: UseCaseContext) {
    super(driver, context);
  }
}
