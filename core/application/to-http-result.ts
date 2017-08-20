import { Success, Failure } from "../domain/result";
import { CAPACITY_EXCEEDED } from "../domain/check-capacity";

export type ModelError = {
    message: string;
    fieldErrors: FieldError[];
};

export type FieldError = {
    field: string;
    message: string;
};

export type HttpResult = {
    statusCode: number;
    payload?: string | ModelError | any;
};

export function OK(result?: any): HttpResult {
    return {
        statusCode: 200,
        payload: result
    };
}

export function CapacityExceeded(): HttpResult {
    return {
        statusCode: 406,
        payload: CAPACITY_EXCEEDED
    };
}

export function ValidationError(error: ModelError): HttpResult {
    return {
        statusCode: 400,
        payload: error
    };
}

export function InternalServerError(error: any): HttpResult {
    return {
        statusCode: 500,
        payload: error
    };
}

export function toHttpResult<T>(result: Success<T> | Failure<string | ModelError | Error>): HttpResult {

    if (result.isSuccess) {
        return OK(result.value);
    }

    if (result.isSuccess === false) {
        switch (result.type) {
            case "CAPACITY_EXCEEDED":
                return CapacityExceeded();
            case "VALIDATION_FAILED":
                return ValidationError(<ModelError>result.error);
            default: return InternalServerError(result.error);
        }
    }
}