
import { Reservation } from "../domain/check-capacity";
import { Success, Failure, success, failure } from "../domain/result";
import { ModelError } from "./to-http-result";

export const VALIDATION_FAILED = "VALIDATION_FAILED";

export type ReservationDto = {
    reservationDate: string;
    name: string;
    email: string;
    quantity: number;
};

export function validateReservation(
    reservation: ReservationDto): Success<Reservation> | Failure<ModelError> | Failure<string> {

    let modelErrors = <ModelError>{ fieldErrors: [] };

    if (!isInRange(reservation.name, 8, 20)) {
        modelErrors.fieldErrors = [...modelErrors.fieldErrors, { field: "name", message: "Expected value should be between 8 and 20" }];
    };

    if (!isValidEmail(reservation.email)) {
        modelErrors.fieldErrors = [...modelErrors.fieldErrors, { field: "email", message: "Not a valid email address" }]
    }

    if (modelErrors.fieldErrors.length > 0) {
        modelErrors.message = VALIDATION_FAILED;
        return failure<ModelError>(VALIDATION_FAILED, modelErrors);
    }

    return success(<Reservation>{
        name: reservation.name,
        email: reservation.email,
        quantity: reservation.quantity,
        reservationDate: new Date(reservation.reservationDate)
    });
}

export function isInRange(value: string, lower: number, upper: number): boolean {
    return (value.length >= lower && value.length <= upper);
}

export function isValidEmail(email: string): boolean {
    // todo: implement more pure validation functions
    return true;
}