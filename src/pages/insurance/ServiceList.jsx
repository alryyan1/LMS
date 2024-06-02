import {
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MyTableCell from "../inventory/MyTableCell";
import MySelectTableCell from "../inventory/MyselectTableCell";
import { Item, webUrl } from "../constants";

function ServiceList() {
  const { companies } = useOutletContext();
  const [activeCompany, setActiveCompany] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [services, setServices] = useState([]);
  console.log(services);
  console.log(activeCompany, "active company", "page = ", page);
  useEffect(() => {
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
                </TableRow>
              </thead>
              <tbody>
                {activeCompany &&
                  services.slice(page, page + 10).map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <MyTableCell
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
                        item={activeCompany}
                        type={"number"}
                        service_id={service.id}
                        table="company/service"
                        colName={"percentage_wage"}
                      >
                        {service?.pivot?.percentage_wage}
                      </MyTableCell>
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
      </Grid>
      <Grid item xs={3}>
        <List>
          {companies.map((company) => {
            return (
              <ListItemButton
                style={{
                  border: "1px dashed ",
                  marginBottom: "2px",
                  color: "black",
                }}
                sx={
                  activeCompany?.id == company.id
                    ? { backgroundColor: (theme) => theme.palette.primary.main }
                    : null
                }
                onClick={() => {
                  const foundedCompany = companies.find(
                    (c) => company.id === c.id
                  );
                  console.log(foundedCompany, "founded");
                  setActiveCompany(foundedCompany);
                  setServices(foundedCompany.services);
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
