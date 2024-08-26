import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField } from "@mui/material";
import {  useState } from "react";

import { useOutletContext } from "react-router-dom";
import axiosClient from "../../axios-client";
import dayjs from "dayjs";

function AddDrugAutocomplete({setUpdater}) {
  const { items,setDeduct ,setShiftIsLoading ,setDialog,  activeSell, setActiveSell,setShift,opendDrugDialog,setOpendDrugDialog} = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  // console.log('AddDrugAutocomplete rendered',selectedDrugs)

  const addDrugsHandler = ()=>{

    if (activeSell.complete) {
      alert('يجب الغاء السداد اولا')
      return;
    }
    selectedDrugs.map((d)=>{
      if (d.lastDepositItem == null) {
        setDialog((prev)=>{
          return {...prev, open: true, message:`Item (${d.market_name}) is not available in store `,color:'error'}
        })
      }
    })
     selectedDrugs.forEach((drug)=>{
       if (drug.strips == 0) {
         alert('يجب ان يحتوي الدواء علي شريط واحد علي الاقل')
       }
       return 
     })
     
   setShiftIsLoading(true);
     setLoading(true)
    axiosClient.post('addDrugForSell',{deduct_id:activeSell.id, 'selectedDrugs': selectedDrugs.filter((d)=>d.lastDepositItem!=null).filter((d)=>d.strips !=0).map((d)=>d.id)}).then(({data})=>{
        // console.log(data,'data')
        
        setActiveSell(data.data)
        setShift(data.shift)
        setUpdater((prev)=>prev+1)
        setSelectedDrugs([])
    }).finally(()=>{
      setLoading(false)
      setShiftIsLoading(false)
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
          
          value={selectedDrugs}
          inputValue={field}
            onInputChange={(e,v)=>{
              // console.log(v,'')
              setField(v)
            }}
            multiple
            sx={{ flexGrow: 1 }}
           
            onChange={(event, newValue) => {
              // console.log(newValue);
              setSelectedDrugs(newValue);
              
            }}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.market_name}
            options={items}
            renderInput={(params) => {
              // console.log(params)

              return (
                <TextField
                autoFocus
                 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // console.log("enter pressed");
                        if (selectedDrugs.length > 0) {
                          addDrugsHandler()
                          return
                        }
                        if (e.target.value.length < 4) {
                           return
                        }
                        
                      //get test from tests using find
                      const barcode = e.target.value.trim();
                      // console.log(items,'items',barcode,'barcode');
                      const itemFounded =  items.find((item)=>{
                        return item.barcode?.trim() === barcode
                      })
                      // console.log(itemFounded,'founed')
                      if (itemFounded ) {
                        if (itemFounded.strips == 0) {
                          alert('يجب ان يحتوي الدواء علي شريط واحد علي الاقل')
                          return
                        }
                        if (itemFounded.lastDepositItem == null) {
                          setDialog((prev)=>{
                            return {...prev, open: true, message:`Item (${itemFounded.market_name}) is not available in store `,color:'error'}
                          })
                          return
                        }
                        alert(itemFounded.lastDepositItem.expire)
                        // console.log(itemFounded.expire,'expire')
                        // console.log(dayjs(itemFounded.expire).isAfter(dayjs()),'expire')
                        if (!dayjs(itemFounded.lastDepositItem.expire).isAfter(dayjs())) {
                          setDialog((prev)=>{
                            return {...prev, open: true, message:'Item is expire',color:'error'}
                          })
                        }
                        if ( itemFounded.lastDepositItem.totalRemaining <= 0) {
                          setDialog((prev)=>{
                            return {...prev, open: true, message:'This product is Unavailable In Store',color:'error'}
                          })
                          // return
                        }
                        setLoading(true);
                        setShiftIsLoading(true)

                        axiosClient.post('addDrugForSell',{deduct_id:activeSell.id,product_id:itemFounded.id}).then(({data})=>{
                          // console.log(data,'add by barcode')
                          setActiveSell((prev)=>{
                            return {...prev,...data.data}
                          })
                          setShift(data.shift)

                          setUpdater((prev)=>prev + 1)
                          setField('')
                        }).finally(()=>{
                          setLoading(false)
                          setShiftIsLoading(false)

                        }) 
                        // setSelectedDrugs((prev)=>{
                        //   console.log(prev)
                        //   return [...prev, itemFounded]
                        // })
                      }else{
                        setOpendDrugDialog(true)
                        setDialog((prev)=>{
                          return {...prev, open: true,message:'Item Not Defined',color:'error'}
                        })
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

export default AddDrugAutocomplete;
