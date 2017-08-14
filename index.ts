
import { postReservation } from "./ports/user/post-reservation";

postReservation({
    reservationDate: "2017-08-14",
    name: "test",
    email: "test.test@test.com",
    quantity: 2
}).then(x => {
    console.log(JSON.stringify(x));
});

