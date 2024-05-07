import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { cacheRtl, theme, url } from "../constants.js";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { CacheProvider } from "@emotion/react";
import MyTableCell from "./MyTableCell.jsx";
import { useOutletContext } from "react-router-dom";

function Section() {
  const [loading, setLoading] = useState(false);
  //create state variable to store all Items
  const [openSuccessDialog, setOpenSuccessDialog] = useOutletContext()
  //create state variable to store all Sections
  const [Sections, setSections] = useState([]);
  const {
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    setLoading(true)
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
        setLoading(false)
        if (data.status) {
          reset()
          //set is loading to false
          setLoading(false);
          setOpenSuccessDialog({
            open: true,
            msg: "تمت الاضافه بنجاح",
          });
        } 
        console.log(data);
      });
  };
 
  const deleteSectionHandler = (id) => {
    fetch(`${url}sections/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          //delete Section by id
          setSections(Sections.filter((Section) => Section.id != id));
          //show success dialog
          setOpenSuccessDialog({
            open: true,
            msg: "تم الحذف بنجاح",
          });
        }
      });
  };
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
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <Grid container>
          <Grid item xs={4}>
            <Typography>اضافه قسم جديد</Typography>
            <form noValidate onSubmit={handleSubmit(submitHandler)}>
              <div>
                <TextField
                  error={errors.name}
                  {...register("name", {
                    required: { value: true, message: "يجب ادخال اسم القسم" },
                  })}
                  id="outlined-basic"
                  label="اسم القسم"
                  variant="standard"
                />
                {errors.name && errors.name.message}
              </div>

              <div></div>
              <LoadingButton loa
                sx={{ mt: 2 }}
                loading={loading}
                variant="contained"
                type="submit"
              >
                حفظ
              </LoadingButton>
            </form>
          </Grid>
          <Grid item xs={5}>
            {/* create table with all Sections */}
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
                      <MyTableCell  colName={'name'} table="sections" item={section} setOpenSuccessDialog={setOpenSuccessDialog}>{section.name}</MyTableCell>
                    
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={3}>
            1
          </Grid>
        </Grid>
    
      </CacheProvider>
    </ThemeProvider>
  );
}

export default Section;
