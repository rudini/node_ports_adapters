import { Observable } from "rx";
import { ReservationDto, validateReservation } from "../../core/application/validate-reservation";
import { HttpResult, toHttpResult } from "../../core/application/to-http-result";
import { IO, getReservedSeatsFromDb } from "../persistence/get-reserved-seats-from-db";
import { failure } from "../../core/domain/result";
import { checkCapacity } from "../../core/domain/check-capacity";
import { saveReservation } from "../persistence/save-reservation";

const connectionString: string = "";
const restaurantsCapacity: number = 10;

export function postReservation(
    candidate: ReservationDto): IO<HttpResult> {

    const httpResult$ = Observable.of(candidate)
        .map(c => validateReservation(c))
        .flatMap(result =>
            !result.isSuccess ? Observable.of(result) :
                Observable.of(result)
                    .flatMap(r => getReservedSeatsFromDb(connectionString, r.value.reservationDate)
                        .catch(error => failure(error))
                    )
                    .map((reservedSeats: number) => checkCapacity(restaurantsCapacity, reservedSeats, result.value))
                    .flatMap(x =>
                        !x.isSuccess ? Observable.of(x) :
                            Observable.of(x)
                                .do(l => saveReservation(connectionString, l.value)
                                    .catch(error => failure(error))
                                )
                    ))
                    .map(x => toHttpResult(x));

    return <Promise<HttpResult>>httpResult$.toPromise();
}
