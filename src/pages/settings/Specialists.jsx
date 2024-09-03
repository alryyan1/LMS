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

  import { cn } from "/src/lib/utils"
import { Button } from "/src/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card"
import { Input } from "/src/components/ui/input"
import { Label } from "/src/components/ui/label"

    
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
        <Grid container gap={4} className="rtl text-right justify-center">
          {loading  ? (
            <Skeleton height={400} style={{flexGrow:"2"} }></Skeleton>
          ) : (
            <Grid item xs={8}  >
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
          <Grid item xs={2} >

            <Card className="w-[450px]  rtl text-right col-span-3 ">
              <CardHeader>
                <CardTitle>اضافه  تخصص طبي </CardTitle>
              </CardHeader>
              <CardContent>
                <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
                  <Input type="hidden" name="supplier_id" />
                  <Input type="hidden" name="user_id" />
                  <div className="grid w-full items-center gap-4">
                    {/** Name  */}
                    <div className="flex flex-col space-y-1.5 text-right">
                      <Label htmlFor="name"> اسم التخصص</Label>
                      <Input
                        
                        className="text-right"
                        error={errors.name != null}
                        {...register("name", {
                          required: { value: true, message: "يجب ادخال اسم التخصص" },
                        })}
                        id="outlined-basic"
                        label="اسم الطبيب"
                        variant="filled"
                        helperText={errors.name?.message}
                      />
                    </div>
                  
                    
                    
                  </div>
                  <LoadingButton loading={loading} variant="contained" type="submit" className="mt-3 w-full">
                    حفظ
                  </LoadingButton>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                
              </CardFooter>
            </Card>
          </Grid>

          
        </Grid>
      );
    }
    
    export default Specialists;
    