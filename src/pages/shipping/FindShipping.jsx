import {
  Card,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { useParams } from "react-router-dom";
import { FitnessCenter, Person } from "@mui/icons-material";

function FindShipping() {
  const [shipping, setShipping] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    axiosClient.get(`shipping/find/${id}`).then(({ data }) => {
      setShipping(data);
      console.log(data);
    });
  }, []);
  return (
    <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
      {shipping && (
        <Card sx={{ p: 1 }}>
          <List>
          <ListItem secondaryAction='Client' disablePadding>
            <ListItemButton>
        
              <ListItemText primary={shipping.name} />
            </ListItemButton>
          </ListItem>
          <ListItem secondaryAction={'Item'} disablePadding>
            <ListItemButton>
              <ListItemText primary={shipping.item.name} />
            </ListItemButton>
          </ListItem>
          <ListItem secondaryAction='State'>
            <ListItemButton>
              <ListItemIcon>

              </ListItemIcon>
              <ListItemText primary={shipping.state?.name} />
            </ListItemButton>
          </ListItem>
          <ListItem secondaryAction='CTN' disablePadding>
            <ListItemButton>
              <ListItemIcon>

              </ListItemIcon>
              <ListItemText primary={shipping.ctn} />
            </ListItemButton>
          </ListItem>
          <ListItem secondaryAction='CBM' disablePadding>
            <ListItemButton>
              <ListItemIcon>

              </ListItemIcon>
              <ListItemText primary={shipping.cbm} />
            </ListItemButton>
          </ListItem>
          <ListItem secondaryAction='Kg' disablePadding>
            <ListItemButton>
           
              <ListItemText primary={shipping.kg} />
            </ListItemButton>
          </ListItem>
        </List> 
        </Card>
      )}
    </Stack>
  );
}

export default FindShipping;
