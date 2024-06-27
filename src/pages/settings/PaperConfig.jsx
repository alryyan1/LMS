import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'

function PaperConfig() {
    const [file, setFile] = useState(null);
    const [src,setSrc] = useState(null);

    const handleFileChange = (e) => {
       const url =  URL.createObjectURL(e.target.files[0])
       console.log(url,'path')
       setSrc(url)
        console.log('upload',e.target.files[0])
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
      // We will fill this out later
    };
  return (
    <Grid container>
        <Grid item xs={4}>
            <Typography>header logo</Typography>
                <input onChange={handleFileChange} type='file'></input>
                {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        <img src={src} width={100} alt="" />

        </section>
      )}
        </Grid>
    </Grid>
  )
}

export default PaperConfig