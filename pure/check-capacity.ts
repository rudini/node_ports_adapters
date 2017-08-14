import  { Result } from "./validate-reservation";

export type Reservation = {
    reservationDate: Date;
    name: string;
    email: string;
    quantity: number;
};

export function checkCapacity(
    capacity: number,
    reservedSeats: number,
    reservation: Reservation): Result | Reservation {
    if (capacity < (reservation.quantity + reservedSeats)) {
        // return capacity exeeded
    } return reservation;
}