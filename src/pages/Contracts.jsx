import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "./../../axios-client";
import dayjs from "dayjs";

function Contracts() {
  const [page, setPage] = useState(7);
  const [links, setLinks] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContract, setSelectedContract] = useState();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState();
  const handleFormSubmit = (data) => {
    setLoading(true);
    axiosClient
      .post("contracts", data)
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          reset();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    //fetch all Items
    axiosClient
      .get(`contracts/all/pagination/${page}?word=${search}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "items");
        console.log(links);
        setContracts(data);
        console.log(links);
        setLinks(links);
      })
      .catch(({ response: { data } }) => {});
  }, [page, search]);

  return (
    <div
      style={{
        marginTop: "5px",
        gap: "15px",
        transition: "0.3s all ease-in-out",

        display: "grid",
        gridTemplateColumns: `1fr  2fr  1fr   1fr     `,
      }}
    >
      <Box>
        <Typography textAlign={"center"} variant="h4">
          Contract
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack gap={2} direction={"column"}>
            <TextField
              error={errors?.tenant_name != null}
              helperText={errors?.tenant_name && errors?.tenant_name.message}
              {...register("tenant_name", {
                required: {
                  value: true,
                  message: "الحقل مطلوب",
                },
              })}
              label="tenant name"
            ></TextField>
            <TextField
              error={errors?.room_no != null}
              helperText={errors?.room_no && errors?.room_no.message}
              {...register("room_no", {
                required: {
                  value: true,
                  message: "الحقل مطلوب",
                },
              })}
              label="room number"
            ></TextField>
            <TextField
              error={errors?.building_no != null}
              helperText={errors?.building_no && errors?.building_no.message}
              {...register("building_no", {
                required: {
                  value: true,
                  message: "الحقل مطلوب",
                },
              })}
              label="building number"
            ></TextField>
            <TextField
              error={errors?.notes != null}
              helperText={errors?.notes && errors?.notes.message}
              {...register("notes", {
                required: {
                  value: true,
                  message: "الحقل مطلوب",
                },
              })}
              label="notes"
            ></TextField>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox {...register("checklist")} />}
                label="checklist"
              />
            </FormGroup>

            <LoadingButton variant="contained" type="submit" loading={loading}>
              Save
            </LoadingButton>
          </Stack>
        </form>
      </Box>
      <Box>
        <TableContainer>
          <Stack
            sx={{ mb: 1 }}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <select
              onChange={(val) => {
                setPage(val.target.value);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <TextField
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              label="بحث"
            ></TextField>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Tenant name</TableCell>
                <TableCell>Building No</TableCell>
                <TableCell>Room No</TableCell>
                <TableCell>Checklist Recieved</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.id}</TableCell>
                  <TableCell>{contract.tenant_name}</TableCell>
                  <TableCell>{contract.building_no}</TableCell>
                  <TableCell>{contract.room_no}</TableCell>
                  <TableCell>{contract.checklist ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {dayjs(Date.parse(contract.created_at)).format(
                      "YYYY/MM/DD"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setSelectedContract(contract);
                      }}
                      variant="contained"
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box>{selectedContract && <Box>
        <Typography>Add new state</Typography>
        
        </Box>}</Box>
    </div>
  );
}

export default Contracts;
