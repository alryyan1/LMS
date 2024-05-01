import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
const DiscountSelect = ({ id, disc, actviePatient, setTests }) => {
  const [discount, setDiscount] = useState(disc);
  const changeDiscountHandler = async (id, dis) => {
    setDiscount(dis);
    const response = await fetch(`${url}labRequest/${actviePatient.id}`, {
      headers: { "content-type": "application/json" },
      method: "PATCH",
      body: JSON.stringify({ test_id: id, discount: dis }),
    });
    const data = await response.json();

    setTests((prev) => {
      return prev.map((t) => {
        if (t.id == id) {
          console.log(t, "test");
          t.pivot.discount_per = dis;
        }
        return t;
      });
    });
  };

  return (
    <Select fullWidth sx={{border:'none'}}
      disabled={actviePatient.is_lab_paid == 1}
      onChange={(e) => {
        changeDiscountHandler(id, e.target.value);
      }}
      value={discount}
    >
      <MenuItem value={0}>0%</MenuItem>
      <MenuItem value={10}>10%</MenuItem>
      <MenuItem value={20}>20%</MenuItem>
      <MenuItem value={30}>30%</MenuItem>
      <MenuItem value={40}>40%</MenuItem>
      <MenuItem value={50}>50%</MenuItem>
      <MenuItem value={60}>60%</MenuItem>
      <MenuItem value={70}>70%</MenuItem>
      <MenuItem value={80}>80%</MenuItem>
      <MenuItem value={90}>90%</MenuItem>
      <MenuItem value={100}>100%</MenuItem>
    </Select>
  );
};

export default DiscountSelect;
