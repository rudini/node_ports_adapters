import * as _ from "lodash";
import { Observable } from "rx";
import { ReservationDto, validateReservation } from "../../core/application/validate-reservation";
import { HttpResult, toHttpResult } from "../../core/application/to-http-result";
import { IO, getReservedSeatsFromDb } from "../persistence/get-reserved-seats-from-db";
import { saveReservation } from "../persistence/save-reservation";
import { checkCapacity } from "../../core/domain/check-capacity";
import { failure } from "../../core/domain/result";

const connectionString: string = "";
const restaurantsCapacity: number = 10;

export function postReservation(
    candidate: ReservationDto): IO<HttpResult> {

    const httpResult$: Observable<HttpResult> = Observable.of(candidate)
        .map(validateReservation)
        .flatMap(result =>
            !result.isSuccess ? Observable.of(result) :
                Observable.of(result)
                    .flatMap(r => getReservedSeatsFromDb(connectionString, r.value.reservationDate)
                    )
                    .map((reservedSeats: number) => checkCapacity(restaurantsCapacity, reservedSeats, result.value))
                    .flatMap(x =>
                        !x.isSuccess ? Observable.of(x) :
                            Observable.of(x)
                                .do(l => saveReservation(connectionString, l.value).then()
                                )
                    ))
        .catch((error: any) =>
            Observable.of(failure<string>(error))
        )
        .map(x => toHttpResult(x));

    return <Promise<HttpResult>>httpResult$.toPromise();
}
