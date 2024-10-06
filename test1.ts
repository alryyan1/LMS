interface Patient {
    name:string,
    age:Date,

}


const newPatient:Patient = {
    name: 'John Doe',
    age: new Date('1990-05-15'),
}


const hi  = (patient:Patient)=>{
        console.log(patient.name)
}