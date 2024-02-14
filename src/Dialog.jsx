import React, { useEffect, useRef } from "react";

function Dialog({ children ,isOpen}) {
    const dialogRef =  useRef()
    useEffect(()=>{
        if (dialogRef.current === null) {
            return
        }

        document.addEventListener("close",dialogRef.current.close())
        if (isOpen) {
            dialogRef.current.showModal()
        }else{
            dialogRef.current.close()
        }

        return ()=>{

        }

    },[isOpen])
  return <dialog ref={dialogRef}>{children}</dialog>;
}

export default Dialog;
