// module result types

export type Success<T> = {
    isSuccess: true;
    value: T;
};

export type Failure<T> = {
    isSuccess: false;
    type: string;
    error: T;
};

export function success<T>(value?: T): Success<T> {
    return <Success<T>>{
        isSuccess: true,
        value: value
    };
}

export function failure<T>(type: string, error?: T): Failure<T> {
    return <Failure<T>>{
        isSuccess: false,
        type: type,
        error: error
    };
}

