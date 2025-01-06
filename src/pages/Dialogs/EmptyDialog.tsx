import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState, VoidFunctionComponent } from "react";
import axiosClient from "../../../axios-client";
import { formatNumber } from "../constants";
import AddCostForm from "../../components/AddCostForm";

interface EmptyDialogProbs {
  show: boolean;
  setShow: (p: boolean) => void;
  children: JSX.Element;
  title: string;
}
function EmptyDialog({ show, setShow, children, title }: EmptyDialogProbs) {
  return (
    <div>
      <Dialog
        PaperProps={{
          sx: {
            width: "auto", // Adjust width
            maxWidth: "90%", // Optional: Limit width to avoid overflow
          },
        }}
        fullWidth
        open={show}
      >
        <DialogTitle> {title} </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={() => setShow(false)}>close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EmptyDialog;
