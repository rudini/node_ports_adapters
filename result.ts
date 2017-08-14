// module result types

export type Success<T> = {
    isSuccess: true;
    value: T;
};

export type Failure<T> = {
    isSuccess: false;
    error: T;
};

export function success<T>(value?: T) {
    return <Success<T>>{
        isSuccess: true,
        value: value
    };
}

export function failure<T>(error?: T) {
    return <Failure<T>>{
        isSuccess: false,
        error: error
    };
}
