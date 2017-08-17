
export type IO<T> = Promise<T>;

export function getReservedSeatsFromDb(
    connectionString: string,
    time: Date): IO<number> {
    return Promise.resolve(0);
}