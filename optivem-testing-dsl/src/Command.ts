export interface UseCase<TResult> {
  execute(): Promise<TResult>;
}

// Backward compatibility alias
export { UseCase as Command };
