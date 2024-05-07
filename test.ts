let message: string = 'Hello, World!';

let arr:(string|number)[] = [];
arr.push('a')
arr.push(1)
console.log(message);



const add = (one:number|boolean,two:number|boolean) => {
    return (one as number)+ (two as number)
}

let greeting : (name: string) => string;
let greet : (name:string) => string[]
greet = (name:string)=>{
    return [`Hello, ${name}`]
}

let info : (name:string,age:number) => string 


greeting = (name: string) => {
    return `Hello, ${name}`;
}

const hello = ( name:string)=> name