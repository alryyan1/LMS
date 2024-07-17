import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
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
import { Controller, useForm } from "react-hook-form";
import axiosClient from "./../../axios-client";
import dayjs from "dayjs";
import ContractStateAutocomplete from "../components/ContractStateAutocomplete";
import { Item, webUrl } from "./constants";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import UserSelect from "../components/UserSelect";
import { useStateContext } from "../appContext";

function Contracts() {
  const [page, setPage] = useState(7);
  const [links, setLinks] = useState([]);
  // const []
  const {user} =  useStateContext()
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(0);
  const [selectedContract, setSelectedContract] = useState();
  const [layOut, setLayout] = useState({
    form: "1fr",
    showForm:true,
  });
  const showFormHandler = () => {
    setLayout((prev) => {
      return { ...prev, form: "1fr",showForm:true };
    });
  };
  const hideFormHandler = () => {
    setLayout((prev) => {
      return { ...prev, form: "0fr",showForm:false };
    });
  };
  const {
    handleSubmit,
    register,
    reset,
    formState: {isSubmitSuccessful,isLoading, errors },
  } = useForm();
  const {
    handleSubmit: handleSubmit2,
    control,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm();
  const [loading, setLoading] = useState();
  const onStateSubmit = (data) => {
    axiosClient.post(`addStateToContract/${selectedContract.id}`,{
      state_id: data.state.id,
      user_id: data.user,
    }).then(({data})=>{
      setSelectedContract(data.contract)
    })
  }
  const handleFormSubmit = (data) => {
    setLoading(true);
    axiosClient
      .post("contracts", data)
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          setUpdate((prev)=>{
            return prev+1
          })
          reset();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    axiosClient("users").then(({ data }) => {
      setUsers(data);
      console.log(data, "users");
    });
  }, []);
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
  }, [page, search,update]);

  return (
    <div
      style={{
        marginTop: "5px",
        gap: "15px",
        transition: "0.3s all ease-in-out",

        display: "grid",
        gridTemplateColumns: `0.1fr ${layOut.form}  2fr  1fr   1fr     `,
      }}
    >
      <Box>
        <Stack>
        <Item>
              <IconButton variant="contained" onClick={showFormHandler}>
                <CreateOutlinedIcon />
              </IconButton>
            </Item>
        </Stack>
      </Box>
      <Box>
        {layOut.showForm && <>
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
        </>}
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
                <TableCell>handed</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.filter((c)=>{
                if (user?.id != 1) {
                  return  c.user_handed == user?.id
                    
                  
                }else{
                  return c
                }
              }).map((contract) => (
                <TableRow sx={{backgroundColor :(theme)=> selectedContract?.id == contract.id ? theme.palette.primary.light : ''}} key={contract.id}>
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
                  <TableCell><UserSelect setUpdate={setUpdate} user={contract.user_handed} users={users}  selectedContract={contract} /></TableCell>

                  <TableCell>
                    <Button
                      onClick={() => {
                        hideFormHandler()
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
      <Box>
        {selectedContract && (
          <Box>
            <Typography textAlign={"center"} variant="h4">
              Add new state
            </Typography>
            <form onSubmit={handleSubmit2(onStateSubmit)}>
              <Stack direction={"column"} gap={2}>
                <ContractStateAutocomplete control={control} />{" "}
                <Controller
                  name="user"
                  control={control}
                  rules={{ required: {
                    value: true,
                    message: "الحقل مطلوب",
                  } }}
                  render={({ field }) => (
                    <Select
            value={field.value ?? ''}
                    
                    onChange={(e)=>{
                      field.onChange(e.target.value);
                    }} variant="filled" label="user" fullWidth>
                      {users.map((user) => {
                        return (
                          <MenuItem value={user.id} key={user.id}>
                            {user.username}
                          </MenuItem>
                        );
                      })}
                      <MenuItem selected></MenuItem>
                    </Select>
                  )}
                ></Controller>
                <Button type="submit" fullWidth variant="contained">
                  Save
                </Button>
              </Stack>
            </form>
          </Box>
        )}
      </Box>
      <Box>
         {selectedContract  &&<>
         <a href={`${webUrl}contractStates/${selectedContract.id}`}>PDF</a>
          <Typography textAlign={'center'}>Contract States</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>State</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedContract.states.map((state) => (
              <TableRow key={state.id}>
                <TableCell>{state.state.name}</TableCell>
                <TableCell>{state.user.username}</TableCell>
                <TableCell>{dayjs(Date.parse(state.created_at)).format('YYYY/MM/DD')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    
         </>}
      </Box>
    </div>
  );
}

export default Contracts;
