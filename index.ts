
import { postReservation } from "./ports/user/post-reservation";

postReservation({
    reservationDate: "2017-08-14",
    name: "test12345",
    email: "test.test@test.com",
    quantity: 2
}).then(x => {
    console.log(JSON.stringify(x));
});

// https://medium.com/@chetcorcos/functional-programming-for-javascript-people-1915d8775504

// functional composition
const add1 = (a: number) => a + 1;
const times2 = (a: number) => a * 2;
const compose = (fa: (c: number) => number, fb: (c: number) => number) => (c: number) => fa(fb(c));
const add1OfTimes2 = compose(add1, times2);
add1OfTimes2(5); // => 11

const pipe = (fns: [(c: number) => number]) => (x: number) => fns.reduce((v, f) => f(v), x);
const times2add1 = pipe([times2, add1]);
times2add1(5); // => 11


// function currying
const add = (a, b) => a + b;
const curry = (f: (a: number, b: number) => number) => (a: number) => (b: number) => number => f(a, b);
const curried = curry(add);
curried(1)(2);

import * as _ from "lodash";
_.curry(add)(1)(2);

const users = [{name: "chet", age:25}, {name:"joe", age:24}]
var joinedUsers = _.chain(users)
    .sortBy(u => u.age)
    .map(u => u.name)
    .join(", ")
    .value();
console.log(joinedUsers);

// monads Maybe type
type Nothing = {
    isNothing: true;
    isJust: false;
};

type Just<T> = {
    isJust: true;
    isNothing: false;
    value: T;
};

const just = <T>(value: T) =>  <Just<T>>{ value: value };
const nothing = () => <Nothing>{};

type Maybe<T> = Nothing | Just<T>;
const test: Maybe<any> = just(1);
test.isJust;
test.value;


import * as imutable from "mori";
const vector = imutable.vector(1, 2, 3, 4);
const newVector = imutable.conj(vector, 5);
const t: boolean = vector === newVector;
const a = imutable.intoArray(newVector);
console.log(t, a);


// lazy.js
import * as Lazy from "lazy.js";
const _users = [{name: "chet", age:25}, {name:"joe", age:24}]
const result = Lazy(_users)
    .sortBy(u => u.age)
    .map(u => u.name)
    .join(", ");
console.log(result);