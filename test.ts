let message: string = 'Hello, World!';

let arr:(string|number)[] = [];
arr.push('a')
arr.push(1)
console.log(message);



const add = (one:number|boolean,two:number|boolean) => {
    return (one as number)+ (two as number)
}
