import { Observable } from "rxjs";
import { ReservationDto, validateReservation } from "../../core/application/validate-reservation";
import { HttpResult, ModelError, toHttpResult } from "../../core/application/to-http-result";
import { IO, getReservedSeatsFromDb } from "../persistence/get-reserved-seats-from-db";
import { saveReservation } from "../persistence/save-reservation";
import { checkCapacity, Reservation } from "../../core/domain/check-capacity";
import { failure, Failure, Success } from "../../core/domain/result";

const connectionString: string = "";
const restaurantsCapacity: number = 10;

const onSuccess =
    <T, R>(f: (r: Success<R>) => IO<T>) =>
        (result: Success<R> | Failure<ModelError | string | Error>): IO<T | Failure<ModelError | string | Error>>  =>
            !result.isSuccess ? Promise.resolve(result) : f(result);

export function postReservation(
    candidate: ReservationDto): IO<HttpResult> {

    const httpResult$: Observable<HttpResult> = Observable.of(candidate)
        .map(c => uniformOutput(validateReservation, c))
        .flatMap(onSuccess(
            result => getReservedSeatsFromDb(connectionString, result.value.reservationDate)
                .then((reservedSeats: number) => checkCapacity(restaurantsCapacity, reservedSeats, result.value)))
        )
        .flatMap(onSuccess(
            result => saveReservation(connectionString, result.value)
                .then(_ => result))
        )
        .catch((error: Error) =>
            Observable.of(failure<Error>("UNEXPECTED_ERROR", error))
        )
        .map(toHttpResult);

    return <Promise<HttpResult>>httpResult$.toPromise();
}

export function postReservation_(
    candidate: ReservationDto): IO<HttpResult> {

    const result = validateReservation(candidate);
    if (!result.isSuccess) {
        return Promise.resolve(toHttpResult(result));
    } else {
        return getReservedSeatsFromDb(connectionString, result.value.reservationDate)
            .then(reservedSeats => {
                let r = checkCapacity(restaurantsCapacity, reservedSeats, result.value);
                if (!r.isSuccess) {
                    return Promise.resolve(toHttpResult(r));
                } else {
                    return saveReservation(connectionString, r.value)
                        .then(_ => toHttpResult(r))
                        .catch((error: Error) => toHttpResult(failure<Error>("SAVE_RESERVATION_FAILED", error)));
                }
            })
            .catch((error: Error) => toHttpResult(failure<Error>("ERROR_ON_READING_RESERVEDSEATS_FROM_DATABASE", error)));
    }
}

function uniformOutput<T>(f: (p: T) => any, p: T): Success<Reservation> | Failure<ModelError | string | Error> {
    return f(p);
}
