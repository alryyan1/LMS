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
import { url } from "../constants.js";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import MyTableCell from "./MyTableCell.jsx";
import { useOutletContext } from "react-router-dom";

function Section() {
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
    fetch(`${url}sections/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        //setloading false
        setLoading(false);
        if (data.status) {
          reset();
          //set is loading to false
          setLoading(false);
          setDialog({
            open: true,
          message: "Addition was successfull",
          });
        }
        console.log(data);
      });
  };

  // const deleteSectionHandler = (id) => {
  //   fetch(`${url}sections/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.status) {
  //         //delete Section by id
  //         setSections(Sections.filter((Section) => Section.id != id));
  //         //show success dialog
  //         setDialog({
  //           open: true,
  //         message: "Delete was successfull",
  //         });
  //       }
  //     });
  // };
  useEffect(() => {
    //fetch all Sections
    fetch(`${url}sections/all`)
      .then((res) => res.json())
      .then((data) => {
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
                  <MyTableCell colName={"name"} table="sections" item={section}>
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

export default Section;
