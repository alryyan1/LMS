import {
  Grid,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MyTableCell from "../inventory/MyTableCell";
import MySelectTableCell from "../inventory/MySelectTableCell";
import { Item, webUrl } from "../constants";

function LabList() {
  const { companies } = useOutletContext();
  const [activeCompany, setActiveCompany] = useState(null);
  const [search, setSearch] = useState(null);
  const [page, setPage] = useState(0);
  const [tests, setTests] = useState([]);
  const {setDialog} =  useOutletContext()
  console.log(activeCompany, "active company", "page = ", page);
  useEffect(() => {
    if (activeCompany) {
      setTests(() => {
        return [
          ...activeCompany.tests.filter((test) =>
            test.main_test_name.toLowerCase().includes(search.toLowerCase())
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
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 1 }}
              type="search"
            ></TextField>
            <a href={`${webUrl}company/test/${activeCompany.id}`}>التقرير</a>
            <Table key={activeCompany.id} size="small">
              <thead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>السعر</TableCell>
                  <TableCell>التحمل نسبه</TableCell>
                  <TableCell>التحمل ثابت</TableCell>
                  <TableCell>الموافقه</TableCell>
                  <TableCell>الحاله</TableCell>
                  <TableCell>استخدام الثابت</TableCell>
                </TableRow>
              </thead>
              <tbody>
                {activeCompany &&
                  tests.slice(page, page + 10).map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.main_test_name}</TableCell>
                      <MyTableCell
                        
                        show={true}
                        item={activeCompany}
                        test_id={test.id}
                        colName={"price"}
                        table="company/test"
                      >
                        {test?.pivot?.price}
                      </MyTableCell>
                      <MyTableCell
                        show={true}
                        item={activeCompany}
                        

                        test_id={test.id}
                        table="company/test"
                        colName={"endurance_percentage"}
                      >
                        {test?.pivot?.endurance_percentage}
                      </MyTableCell>
                      <MyTableCell
                        show={true}
                        item={activeCompany}
                        test_id={test.id}
                        colName={"endurance_static"}
                        table="company/test"
                      >
                        {test?.pivot?.endurance_static}
                      </MyTableCell>
                      <MySelectTableCell
                        item={activeCompany}
                        myVal={test.pivot.approve}
                        

                        test_id={test.id}
                        table="company/test"
                        colName={"approve"}
                      ></MySelectTableCell>
                      <MySelectTableCell
                        item={activeCompany}
                        

                        myVal={test.pivot.status}
                        test_id={test.id}
                        table="company/test"
                        colName={"status"}
                      ></MySelectTableCell>
                        <MySelectTableCell
                        item={activeCompany}
                        

                        myVal={test.pivot.use_static}
                        test_id={test.id}
                        table="company/test"
                        colName={"use_static"}
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
                    ? (activeCompany.tests.length / 10).toFixed(0)
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
                  
                }}
                sx={
                  activeCompany?.id == company.id
                    ? {
                    

                        backgroundColor: (theme) => theme.palette.primary.main,
                      }
                    : null
                }
                onClick={() => {
                  const foundedCompany = companies.find(
                    (c) => company.id === c.id
                  );
                  console.log(foundedCompany, "founded");
                  setActiveCompany(foundedCompany);
                  setTests(foundedCompany.tests);
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

export default LabList;
