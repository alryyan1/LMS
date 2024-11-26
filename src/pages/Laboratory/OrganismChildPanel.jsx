import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import axiosClient from "../../../axios-client";
function OrganismChildPanel(props) {
  const { children, value, index, organism, setActivePatient, ...other } =
    props;

  const [sensitive, setSensitive] = useState(organism.sensitive);
  const [resistant, setResistant] = useState(organism.resistant);
  const [name, Setname] = useState(organism.organism);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="group" sx={{ p: 3 }}>
          <Button
            onClick={() => {
              const result = confirm("Are you sure you want to delete this ?");
              if (result) {
                axiosClient
                  .delete(`deleteOrganism/${organism.id}`)
                  .then(({ data }) => {
                    setActivePatient(data.data)
                  });
              }
            }}
          >
            Delete
          </Button>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Organism name</TableCell>
                <TableCell>
                  <TextField
                    value={name}
                    onChange={(e) => {
                      Setname(e.target.value);
                      axiosClient
                        .patch(`editOrganism/${organism.id}`, {
                          val: e.target.value,
                          colName: "organism",
                        })
                        .then(({ data }) => {
                          console.log(data);
                        });
                    }}
                  />
                </TableCell>{" "}
              </TableRow>
              <TableRow>
                <TableCell>Sensitive</TableCell>
                <TableCell>
                  <TextField
                    rows={4}
                    multiline
                    value={sensitive}
                    onChange={(e) => {
                      setSensitive(e.target.value);
                      axiosClient
                        .patch(`editOrganism/${organism.id}`, {
                          val: e.target.value,
                          colName: "sensitive",
                        })
                        .then(({ data }) => {
                          console.log(data);
                        });
                    }}
                  />
                </TableCell>{" "}
              </TableRow>
              <TableRow>
                <TableCell>Resistant</TableCell>
                <TableCell>
                  <TextField
                    rows={4}
                    multiline
                    value={resistant}
                    onChange={(e) => {
                      setResistant(e.target.value);
                      axiosClient
                        .patch(`editOrganism/${organism.id}`, {
                          val: e.target.value,
                          colName: "resistant",
                        })
                        .then(({ data }) => {
                          console.log(data);
                        });
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      )}
    </div>
  );
}

export default OrganismChildPanel;
