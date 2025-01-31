export type Result<TValue, TError> =
    | { success: true, failed: false, data: TValue }
    | { success: false, failed: true, error: TError };

export function success<TValue, TError>(data: TValue): Result<TValue, TError> {
    return { success: true, failed: false, data };
}

export function failure<TValue, TError>(error: TError): Result<TValue, TError> {
    return { success: false, failed: true, error };
}