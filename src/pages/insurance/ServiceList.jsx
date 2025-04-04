import {
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Skeleton,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MyTableCell from "../inventory/MyTableCell";
import MySelectTableCell from "../inventory/MySelectTableCell";
import { Item, webUrl } from "../constants";
import axiosClient from "../../../axios-client";

function ServiceList() {
  const { companies } = useOutletContext();
  const [activeCompany, setActiveCompany] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
  
  console.log(services);
  console.log(activeCompany, "active company", "page = ", page);
  useEffect(() => {
     document.title = 'تعاقد الخدمات'
    if (activeCompany) {
      console.log(activeCompany);
      setServices(() => {
        return [
          ...activeCompany.services.filter((service) =>
            service.name.toLowerCase().includes(search.toLowerCase())
          ),
        ];
      });
    }
  }, [search]);
  return (
    <Grid spacing={2} container>
      <Grid item xs={9}>
       {loading ? <Skeleton height={window.innerHeight - 200}/> : <>
        {activeCompany && (
          <TableContainer>
            <TextField
              label="بحث"
              size="small"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              sx={{ mb: 1 }}
              type="search"
            ></TextField>
            <a href={`${webUrl}company/service/${activeCompany.id}`}>التقرير</a>

            <Table
              style={{ direction: "rtl" }}
              key={activeCompany.id}
              size="small"
            >
              <thead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>السعر</TableCell>
                  <TableCell>التحمل نسبه</TableCell>
                  <TableCell>التحمل ثابت</TableCell>
                  <TableCell>نصيب الطبيب (مبلغ)</TableCell>
                  <TableCell>نصيب الطبيب (نسبه)</TableCell>
                  <TableCell>استخدام التحمل الثابت</TableCell>
                  <TableCell>الموافقه</TableCell>
                </TableRow>
              </thead>
              <tbody>
                {activeCompany &&
                  services.slice(page, page + 10).map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <MyTableCell
                        sx={{width:'80px'}}
                        show={true}
                        item={activeCompany}
                        type={"number"}
                        service_id={service.id}
                        colName={"price"}
                        table="company/service"
                      >
                        {service?.pivot?.price}
                      </MyTableCell>
                      <MyTableCell
                        sx={{width:'80px'}}
                        show={true}
                        item={activeCompany}
                        type={"number"}
                        service_id={service.id}
                        table="company/service"
                        colName={"percentage_endurance"}
                      >
                        {service?.pivot?.percentage_endurance}
                      </MyTableCell>
                      <MyTableCell
                        sx={{width:'80px'}}
                        show={true}
                        item={activeCompany}
                        type={"number"}
                        service_id={service.id}
                        table="company/service"
                        colName={"static_endurance"}
                      >
                        {service?.pivot?.static_endurance}
                      </MyTableCell>

                      <MyTableCell
                        show
                        sx={{width:'80px'}}
                        type={"number"}
                        item={activeCompany}
                        service_id={service.id}
                        table="company/service"
                        colName={"static_wage"}
                      >
                        {service?.pivot?.static_wage}
                      </MyTableCell>
                      <MyTableCell
                        show
                        sx={{width:'80px'}}
                        item={activeCompany}
                        type={"number"}
                        service_id={service.id}
                        table="company/service"
                        colName={"percentage_wage"}
                      >
                        {service?.pivot?.percentage_wage}
                      </MyTableCell>
                      <MySelectTableCell
                        item={activeCompany}
                        test_id={service.id}

                        myVal={service.pivot.use_static}
                        table="company/service"
                        colName={"use_static"}
                      ></MySelectTableCell>
                        <MySelectTableCell
                        item={activeCompany}
                        test_id={service.id}

                        myVal={service.pivot.approval}
                        table="company/service"
                        colName={"approval"}
                      ></MySelectTableCell>
                    </TableRow>
                  ))}
              </tbody>
            </Table>
            {activeCompany && (
              <Pagination
                shape="rounded"
                onChange={(e, number) => setPage(number * 10 - 10)}
                count={
                  activeCompany
                    ? (activeCompany.services.length / 10).toFixed(0)
                    : 10
                }
                variant="outlined"
              />
            )}
          </TableContainer>
        )}
       </>}
      </Grid>
      <Grid item xs={3}>
        <List>
          {companies.map((company) => {
            return (
              <ListItemButton
                style={{
                  border: "1px dashed ",
                  marginBottom: "2px",
               
                }}
                sx={
                  activeCompany?.id == company.id
                    ? { backgroundColor: (theme) => theme.palette.primary.main }
                    : null
                }
                onClick={() => {
                  setLoading(true)

                  axiosClient.get(`company/${company.id}?with=services`).then(({data})=>{

                    setActiveCompany(data.data);
                    setServices(data.data.services);
                  }).finally(()=>setLoading(false))
                  console.log(company.id);
                }}
                key={company.id}
              >
                <ListItemText>{company.name}</ListItemText>
              </ListItemButton>
            );
          })}
        </List>
      </Grid>
    </Grid>
  );
}

export default ServiceList;
