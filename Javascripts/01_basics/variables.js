//explain the var , let and const 

var name = "Aditya"
// console.log(name);

if (true) {
    var name = "this is inside the block"

}
console.log(name);//leaks out 

function test() {
    var name2 = "this is inside the function block"
}
// console.log(name2);//leaks out

//explaining the let 

let age = 29;
console.log(age);

if (true) {
    let age1 = 49;
    console.log("this is inside the if block" + age1);
}
// console.log(age1);

//Data types in javascript

//string , number , boolean , undefined , symbol , BigInt , null
//object function Array


const person = { name: "John", age: 29 } // object
const skills = ["js ", "java", "nodejs"]//Array

function test() {
    console.log("this is a test function")
}

console.log(person.name, skills[0]);


//type conversion


let num = "1233"

console.log(Number(num));//gives the number 
console.log(Boolean(0));
