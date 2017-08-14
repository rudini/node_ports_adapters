
import { Reservation } from "./check-capacity";

export type ReservationDto = {
    reservationDate: string;
    name: string;
    email: string;
    quantity: number;
};


export type Result = {
    type: "Result";
    value: string;
};

export function validateReservation(
    reservation: ReservationDto): Result | Reservation {
    // todo: implement
    // what should this function return?
    return <Reservation> {
        name: reservation.name,
        email: reservation.email,
        quantity: reservation.quantity,
        reservationDate: new Date(reservation.reservationDate)
    };
}