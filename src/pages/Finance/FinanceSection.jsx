import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useForm } from "react-hook-form";
  import { LoadingButton } from "@mui/lab";
  import MyTableCell from "../inventory/MyTableCell.jsx"
  import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
  
  function FinanceSection() {
    const [loading, setLoading] = useState(false);
    //create state variable to store all Items
    const {dialog, setDialog} = useOutletContext();
    //create state variable to store all Sections
    const [Sections, setSections] = useState([]);
    const {
      register,
      reset,
      formState: { errors, isSubmitting, isSubmitted },
      handleSubmit,
    } = useForm();
    useEffect(() => {
      document.title = 'الاقسام' ;
    }, []);
    console.log(isSubmitting);
    const submitHandler = async (formData) => {
      setLoading(true);
      console.log(formData);
      // console.log(isSubmitting)
      axiosClient.post(`financeSections`, formData)
        .then(({data}) => {
          //setloading false
          setLoading(false);
          if (data.status) {
            reset();
            //set is loading to false
            setLoading(false);
            setDialog({
              open: true,
            message: "تمت الاضافه بنجاح",
            });
          }
          console.log(data);
        });
    };
  
 
    useEffect(() => {
      //fetch all Sections
      axiosClient.get(`financeSections`)
        .then(({data}) => {
          //set Sections
          setSections(data);
          console.log(data);
        });
    }, [isSubmitted]);
    return (
      <Grid container spacing={2}>
          
        <Grid item xs={4}>
  
          <Paper sx={{p:1}}>
          <Typography textAlign={'center'} variant="h4">اضافه قسم جديد</Typography>
  
          <form noValidate onSubmit={handleSubmit(submitHandler)}>
            <div>
              <TextField
              fullWidth
                error={errors.name}
                {...register("name", {
                  required: { value: true, message: "يجب ادخال اسم القسم" },
                })}
                id="outlined-basic"
                label="اسم القسم"
                variant="filled"
                helperText={errors.name && errors.name.message}
              />
            </div>
  
            <div></div>
            <LoadingButton
              fullWidth
              sx={{ mt: 2 }}
              loading={loading}
              variant="contained"
              type="submit"
            >
              حفظ
            </LoadingButton>
          </form>
          </Paper>
        
        </Grid>
        <Grid item xs={8}>
          <Paper>
          <TableContainer>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                </TableRow>
              </thead>
  
              <TableBody>
                {Sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>{section.id}</TableCell>
                    <MyTableCell colName={"name"}  table="financeSections" item={section}>
                      {section.name}
                    </MyTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Paper>
        
          
        </Grid>
  
    
      </Grid>
    );
  }
  
  export default FinanceSection;
  