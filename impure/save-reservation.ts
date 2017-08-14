

import { Reservation } from "../pure/check-capacity";
import { IO } from "./get-reserved-seats-from-db";

export function saveReservation(
    connectionString: string,
    reservation: Reservation): IO<void> {
        // todo: implement save to a database
        return Promise.resolve();
}