
import { IO } from "./get-reserved-seats-from-db";
import { Reservation } from "../../core/domain/check-capacity";

export function saveReservation(
    connectionString: string,
    reservation: Reservation): IO<void> {
        // todo: implement save to a database
        return Promise.reject("dasasdf");
}