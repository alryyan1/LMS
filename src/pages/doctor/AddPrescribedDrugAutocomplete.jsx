import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axiosClient from "../../../axios-client";
function AddPrescribedDrugAutocomplete({
  patient,
  setActiveDoctorVisit,
  items,
}) {
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  const addDrugsHandler = () => {
    setLoading(true);
    selectedDrugs.forEach((drug) => {
      if (drug.strips == 0) {
        alert("يجب ان يحتوي الدواء علي شريط واحد علي الاقل");
      }
      return;
    });
    axiosClient
      .post(`addPrescribedDrug/${patient.id}`, {
        doctor_id: patient.patient.doctor_id,
        selectedDrugs: selectedDrugs
          .filter((d) => d.strips != 0)
          .map((d) => d.id),
      })
      .then(({ data }) => {
        console.log(data, "data");

        setActiveDoctorVisit(data.patient);
        setSelectedDrugs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          gap: "5px",
          width: "inhert",
          zIndex: "3",
        }}
      >
        <Autocomplete
          fullWidth
          autoFocus={true}
          value={selectedDrugs}
          inputValue={field}
          onInputChange={(e, v) => {
            console.log(v, "");
            setField(v);
          }}
          multiple
          sx={{ flexGrow: 1 }}
          onChange={(event, newValue) => {
            console.log(newValue);
            setSelectedDrugs(newValue);
          }}
          getOptionKey={(op) => op.id}
          getOptionLabel={(option) => option.market_name}
          options={items}
          renderInput={(params) => {
            // console.log(params)

            return (
              <TextField
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("enter pressed");
                    if (selectedDrugs.length > 0) {
                      addDrugsHandler();
                      return;
                    }

                    //get test from tests using find
                    const barcode = e.target.value.trim();
                    console.log(items, "items", barcode, "barcode");
                    const itemFounded = items.find((item) => {
                      return item.barcode?.trim() === barcode;
                    });
                    console.log(itemFounded, "founed");
                    if (itemFounded) {
                      if (itemFounded.strips == 0) {
                        alert("يجب ان يحتوي الدواء علي شريط واحد علي الاقل");
                        return;
                      }
                      console.log(itemFounded.expire, "expire");
                      console.log(
                        dayjs(itemFounded.expire).isAfter(dayjs()),
                        "expire"
                      );
                      if (!dayjs(itemFounded.expire).isAfter(dayjs())) {
                      }

                      setLoading(true);

                      axiosClient
                        .post(`addPrescribedDrug/${patient.id}`, {
                          doctor_id: patient.doctor_id,
                          product_id: itemFounded.id,
                        })
                        .then(({ data }) => {
                          console.log(data, "add by barcode");
                          setField("");
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                      // setSelectedDrugs((prev)=>{
                      //   console.log(prev)
                      //   return [...prev, itemFounded]
                      // })
                    } else {
                      // alert('no item')
                    }
                  }
                }}
                {...params}
                label="Item"
              />
            );
          }}
        ></Autocomplete>
        <LoadingButton
          loading={loading}
          onClick={addDrugsHandler}
          variant="contained"
        >
          +
        </LoadingButton>
      </div>
    </div>
  );
}

export default AddPrescribedDrugAutocomplete;
