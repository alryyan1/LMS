import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MyCheckbox from "../../components/MyCheckBox";
import { FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import MyTableCell from "../inventory/MyTableCell";
import axiosClient from "../../../axios-client";
import { toFixed } from "../constants";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function ButtonOptions({
  item,
  change,
  deleteIncomeItemHandler,
  loading,
  
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Options
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <FormControlLabel
            control={
              <MyCheckbox
                change={change}
                path={`depositItems/update/${item.id}`}
                isChecked={item.return}
                colName={"return"}
              />
            }
            label="Return"
          ></FormControlLabel>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <LoadingButton
            fullWidth
            variant="contained"
            loading={loading}
            title="Delete"
            endIcon={<Delete />}
            onClick={() => {
              deleteIncomeItemHandler(item.id);
            }}
          >
            Delete
          </LoadingButton>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <TextField
            label="Free QYN"
            defaultValue={item.free_quantity}
            onChange={(e) => {
              axiosClient.patch(`depositItems/update/${item.id}`, {
                colName: "free_quantity",
                val: e.target.value,
              });
            }}
          ></TextField>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
            <div>Vat OMR</div>
            <div>    {toFixed(
                        (item.vat_cost * item.cost) / 100,
                        3
                      )}</div>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
            <div>Cost + Vat</div>
            <div>  {toFixed(item.finalCostPrice, 3)}</div>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
            <div>Total Cost</div>
            <div>{toFixed(item.quantity * item.finalCostPrice, 3)}</div>
          </Stack>
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
