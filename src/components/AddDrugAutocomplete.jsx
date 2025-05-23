import { LoadingButton } from "@mui/lab";
import { Autocomplete, CircularProgress, createFilterOptions, TextField } from "@mui/material";
import {  Fragment, useEffect, useState } from "react";

import { useOutletContext } from "react-router-dom";
import axiosClient from "../../axios-client";
import dayjs from "dayjs";

function AddDrugAutocomplete({setUpdater,update,searchOption}) {
  const { setDeduct ,setShiftIsLoading ,setDialog,  activeSell, setActiveSell,setShift,opendDrugDialog,setOpendDrugDialog} = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState('');
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search != '') {
        axiosClient
        .get(`items/search?word=${search}&searchOption=${searchOption}`)
        .then(({ data}) => {
          console.log(data,'searched data');
          setItems(data);
        })
        .catch(({ response: { data } }) => {
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              color: "error",
              message: data.message,
            };
          });
        });
      }
      
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [selectedDrugs, setSelectedDrugs] = useState([]);
  // console.log('AddDrugAutocomplete rendered',selectedDrugs)
  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 10,
  });
  const addDrugsHandler = ()=>{

    if (activeSell.complete) {
      alert('يجب الغاء السداد اولا')
      return;
    }
    console.log(selectedDrugs,'selected')
    // selectedDrugs.map((d)=>{
    //   if (d.last_deposit_item == null) {
    //     setDialog((prev)=>{
    //       return {...prev, open: true, message:`Item (${d.market_name}) is not available in store `,color:'error'}
    //     })
    //   }
    // })
    //  selectedDrugs.forEach((drug)=>{
    //    if (drug.strips == 0) {
    //      alert('يجب ان يحتوي الدواء علي شريط واحد علي الاقل')
    //    }
    //    return 
    //  })
     
   setShiftIsLoading(true);
     setLoading(true)
    axiosClient.post('addDrugForSell',{deduct_id:activeSell.id, 'selectedDrugs': selectedDrugs.map((d)=>d.id)}).then(({data})=>{
        // console.log(data,'data')
        
        update(data.data)
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
          size="small"
          fullWidth
          value={selectedDrugs}
          inputValue={field}
            onInputChange={(e,v)=>{
              // console.log(v,'')
              setField(v)
            }}
            multiple
           
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
                fullWidth
                autoFocus
                   {...params}
                  onChange={(e)=>{
                  setSearch(e.target.value)
                  }}
                 
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
                      let itemFounded  = null
                      axiosClient.get(`items/search?barcode=${barcode}`).then(({data})=>{
                          itemFounded = data
                          console.log(itemFounded,'founed')
                          if (itemFounded ) {
                          
                            // if (itemFounded.deposit_items_sum_quantity == null || itemFounded.deposit_items_sum_quantity == 0) {
                            //   setDialog((prev)=>{
                            //     return {...prev, open: true, message:`Item (${itemFounded.market_name}) is not available in store `,color:'error'}
                            //   })
                            //   return
                            // }
                            // alert(itemFounded.last_deposit_item.expire)
                            // console.log(itemFounded.expire,'expire')
                            // console.log(dayjs(itemFounded.expire).isAfter(dayjs()),'expire')
                            if (!dayjs(itemFounded.last_deposit_item.expire).isAfter(dayjs())) {
                              setDialog((prev)=>{
                                return {...prev, open: true, message:'Item is expire',color:'error'}
                              })
                            }
                            if ( itemFounded.last_deposit_item.totalRemaining <= 0) {
                              setDialog((prev)=>{
                                return {...prev, open: true, message:'This product is Unavailable In Store',color:'error'}
                              })
                              // return
                            }
                            setLoading(true);
                            setShiftIsLoading(true)
    
                            axiosClient.post('addDrugForSell',{deduct_id:activeSell.id,product_id:itemFounded.id}).then(({data})=>{
                              // console.log(data,'add by barcode')
                              update(data.data)
    
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
                      })
                      
                  

                    
                    }
                  }}
               
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
