import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useOutletContext } from 'react-router-dom';
import axiosClient from '../../axios-client';
import { LoadingButton } from '@mui/lab';

const options = [{ id:1 ,name:'Cash'},{ id:2,name:'Transfer'}, {id:3,name:'Bank'}];

export default function PayOptions() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const {activeSell,setActiveSell,setShift} =useOutletContext()
  const [payment, setPayment] = React.useState(activeSell.payment_type_id);
  const [loading , setLoading] = React.useState(false)
  console.log(payment,'payment')
  console.log(activeSell,'activeSell')
  const handleClick = () => {
  };

  const handleMenuItemClick = (event, paymentId) => {
    setPayment(paymentId);
    setLoading(true)
    setOpen(false);
    axiosClient.patch(`deduct/payment/${activeSell.id}`,{payment:paymentId}).then(({data})=>{
        console.log(data,'data')
        setActiveSell(data.data)
        setShift(data.shift)
    }).finally(()=>setLoading(false))
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup  sx={{m:1}}
      
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <LoadingButton loading={loading} fullWidth onClick={handleClick}>{activeSell.payment_type.name}</LoadingButton>
        <Button
         
          size="small"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option) => (
                    <MenuItem
                    
                      key={option.id}
                    //   disabled={index === 2}
                      selected={option.id === payment}
                      onClick={(event) => handleMenuItemClick(event, option.id)}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}