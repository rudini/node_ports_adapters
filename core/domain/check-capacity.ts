import { failure, success, Success, Failure } from "./result";

export type Reservation = {
    reservationDate: Date;
    name: string;
    email: string;
    quantity: number;
};

export const CAPACITY_EXCEEDED: string = "CAPACITY_EXCEEDED";

export function checkCapacity(
    capacity: number,
    reservedSeats: number,
    reservation: Reservation): Success<Reservation> | Failure<string> {
    if (capacity < (reservation.quantity + reservedSeats)) {
        return failure(CAPACITY_EXCEEDED, "The capacity has excceeded.");
    } return success(reservation);
}
