import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { useOutletContext } from "react-router-dom";
import axiosClient from "../../axios-client";

function AddDrugAutocomplete({setUpdater}) {

  const { items,setDeduct   ,  activeSell, setActiveSell,setShift} = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const addDrugsHandler = ()=>{
    setLoading(true)
    axiosClient.post('addDrugForSell',{deduct_id:activeSell.id, 'selectedDrugs': selectedDrugs.map((d)=>d.id)}).then(({data})=>{
        console.log(data,'data')
        setActiveSell(data.data)
        setShift(data.shift)
        setUpdater((prev)=>prev+1)
    }).finally(()=>{
      setLoading(false)
    })
  }

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
          inputValue={field}
            onInputChange={(e,v)=>{
              console.log(v,'')
              setField(v)
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
                    
                        
                      //get test from tests using find
                      const barcode = e.target.value.trim();
                      console.log(items,'items',barcode,'barcode');
                      const itemFounded =  items.find((item)=>{
                        return item.barcode.trim() === barcode
                      })
                      console.log(itemFounded,'founed')
                      if (itemFounded ) {
                        setLoading(true);
                        axiosClient.post('addDrugForSell',{deduct_id:activeSell.id,product_id:itemFounded.id}).then(({data})=>{
                          console.log(data,'add by barcode')
                          setActiveSell(data.data)
                          setUpdater((prev)=>prev + 1)
                          setField('')
                        }).finally(()=>{
                          setLoading(false)
                        }) 
                        // setSelectedDrugs((prev)=>{
                        //   console.log(prev)
                        //   return [...prev, itemFounded]
                        // })
                      }

                    
                    }
                  }}
                  {...params}
                  label="الدواء"
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

export default AddDrugAutocomplete;