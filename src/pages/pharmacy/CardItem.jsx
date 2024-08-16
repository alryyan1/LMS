import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function CardItem({myItem,handleTestAdd,active}) {

  const image1 = new Image(100,100)
  image1.src = myItem?.images;
  return (
    <Paper onClick={
     ()=>{
      handleTestAdd(myItem)
     }
    }
       
      sx={{

        cursor:'pointer',
        p: 2,
        margin: 'auto',
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          active ? theme.palette.primary.light :''
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt="complex" src={image1.src } />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {myItem.market_name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Full resolution 1920x1080 • JPEG
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {myItem.id}
              </Typography>
            </Grid>
            {/* <Grid item>
              <Typography sx={{ cursor: 'pointer' }} variant="body2">
                Remove
              </Typography>
            </Grid> */}
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              OMR {myItem.sell_price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}