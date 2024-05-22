import {
    Autocomplete,
      Divider,
      Grid,
      Skeleton,
      Stack,
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableRow,
      TextField,
      Typography,
    } from "@mui/material";
    import {  useState } from "react";
    import { useForm } from "react-hook-form";
    import { LoadingButton } from "@mui/lab";
    import axiosClient from "../../../axios-client";
    import MyTableCell from "../inventory/MyTableCell";
  import { useOutletContext } from "react-router-dom";
    
    function Specialists() {
     const {specialists,setUpdateSpecialists} = useOutletContext()
      const [loading, setLoading] = useState(false);
    
    
   
      //create state variable to store all Items
      const submitHandler = (data) => {
        setLoading(true);
    
        console.log(data, "submitted data");
        axiosClient
          .post("specialists/add", data)
          .then((data) => {
            console.log(data)
            if (data.status) {
              reset();
              setUpdateSpecialists((prev)=>prev+1)
            }
          })
          .finally(() => setLoading(false));
      };
      const {
        register,
        reset,
        formState: { errors,isSubmitSuccessful },
        handleSubmit,
      } = useForm(); 
      // console.log(isSubmitting);
    
    
      return (
        <Grid container gap={3}>
          {loading  ? (
            <Skeleton height={400} style={{flexGrow:"2"} }></Skeleton>
          ) : (
            <Grid item xs={5}>
              <TableContainer sx={{ mb: 1 }}>
              
    
                <Table dir="rtl" size="small">
                  <thead>
                    <TableRow>
                      <TableCell>رقم</TableCell>
                      <TableCell>الاسم</TableCell>
                
                    </TableRow>
                  </thead>
                  <TableBody>
                    {specialists.map((specialist) => (
                      <TableRow key={specialist.id}>
                        <TableCell>{specialist.id}</TableCell>
                        <MyTableCell table="specialists" colName={"name"} item={specialist}>
                          {specialist.name}
                        </MyTableCell>
                     
                      
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
    
           
            </Grid>
          )}
          <Grid item xs={6}>
            <Stack direction={"row"} justifyContent={"center"} spacing={4}>
              <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
                اضافه  تخصص طبي
              </Typography>
            </Stack>
            <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
              <Stack direction={"column"} gap={3}>
                <TextField
                  fullWidth
                  error={errors.name != null}
                  {...register("name", {
                    required: { value: true, message: "يجب ادخال اسم التخصص" },
                  })}
                  id="outlined-basic"
                  label="اسم الطبيب"
                  variant="filled"
                  helperText={errors.name?.message}
                />
    
             
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  type="submit"
                >
                  حفظ
                </LoadingButton>
              </Stack>
            </form>
          </Grid>
        </Grid>
      );
    }
    
    export default Specialists;
    