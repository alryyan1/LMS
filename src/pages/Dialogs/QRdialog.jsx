import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import QRCode from 'react-qr-code'

function QRdialog({data,isOpen,setOpen}) {
  return (
  <Dialog open={isOpen}>
          <DialogTitle  >QR</DialogTitle>
           <DialogContent >
            <QRCode value={`https://preeminent-sprite-257d36.netlify.app/find/${data}`}></QRCode>
           </DialogContent>
          <DialogActions>
          <Button color="error"  onClick={()=>{
            setOpen(false);
          }}>
              close
          </Button>
          </DialogActions>
        </Dialog>
  )
}

export default QRdialog