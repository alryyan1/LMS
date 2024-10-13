let getUknownTuple = (...args : (number|string)[]):[number,string] =>{
    let total = 0;
    let str = ''
    
    args.forEach((args)=>{
        if (typeof args == 'number') {
            total+=args
        }else{
            str.concat(args)
        }
    })

    return [total, str]
}


console.log(getUknownTuple(1,2,3,'abc','cdf'))