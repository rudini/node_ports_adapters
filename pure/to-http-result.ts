import  { Result } from "./validate-reservation";

export type HttpResult = {
    statusCode: number;
};

export function OK(): HttpResult {
    return {
        statusCode: 200
    };
}

export function toHttpResult<T extends Result | any>(t: T) {
    // check if its an error
    return OK();
}