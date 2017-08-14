import { HttpResult, toHttpResult } from "../pure/to-http-result";
import { IO, getReservedSeatsFromDb } from "./get-reserved-seats-from-db";
import { ReservationDto, validateReservation, Result } from "../pure/validate-reservation";
import { Observable } from "rx";
import { Reservation, checkCapacity } from "../pure/check-capacity";
import { saveReservation } from "./save-reservation";

export function postReservation(
    candidate: ReservationDto): IO<HttpResult> {

    const httpResult$ = Observable.of(candidate)
        .map(c => validateReservation(c))
        .flatMap(result => {
            return (<Result>result).type !== undefined ? Observable.of(result) :
                Observable.of(result)
                    .flatMap((reservation: Reservation) => getReservedSeatsFromDb("", reservation.reservationDate)
                        .catch(error => <Result>{ type: "Result", value: error })
                    )
                    .map((reservedSeats: number) => checkCapacity(10, reservedSeats, <Reservation>result))
                    .flatMap(r =>
                        (<Result>result).type !== undefined ? Observable.of(r) :
                            Observable.of(r)
                                .do((reservation: Reservation) => saveReservation("", reservation)
                                    .catch(error => <Result>{ type: "Result", value: error })
                                )
                    );
        }
        )
        .map(x => toHttpResult(x));

    return <Promise<HttpResult>>httpResult$.toPromise();
}