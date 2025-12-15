import { Command } from './Command';
import { Context } from './Context';
import { CommandResult } from './CommandResult';

export abstract class BaseCommand<TDriver, TResponse, TVerification> implements Command<CommandResult<TResponse, TVerification>> {
  protected readonly driver: TDriver;
  protected readonly context: Context;

  protected constructor(driver: TDriver, context: Context) {
    this.driver = driver;
    this.context = context;
  }

  abstract execute(): Promise<CommandResult<TResponse, TVerification>>;
}
