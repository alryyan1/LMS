import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import PatientEditSelect from "./PatientEditSelect";
import { DoctorVisit } from "../../types/Patient";
import { updateHandler } from "../constants";
import React, { SetStateAction } from "react";
import CodeEditor from "./CodeMirror";
interface ReviewOfSystemsProps {
  value: number;
  index: number;
  patient: DoctorVisit;
  setComplains: () => void;
  complains: string[];
  setActiveDoctorVisit: React.Dispatch<SetStateAction<DoctorVisit | null>>;
}
function ReviewOfSystems(props: ReviewOfSystemsProps) {
  const {
    value,
    index,
    patient,
    setActiveDoctorVisit,
    complains,
    setComplains,
    ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Review of Systems
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="group">
          <Stack direction={"column"} gap={1} justifyContent={"space-around"}>
            <Box>
              <Typography variant="h5">General</Typography>
              <CodeEditor
                colName="general"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.general}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Skin</Typography>
              <CodeEditor
                colName="skin"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.skin}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Respiratory System</Typography>
              <CodeEditor
                colName="respiratory_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.respiratory_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Cardiovascular System</Typography>
              <CodeEditor
                colName="cardio_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.cardio_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">GIT System</Typography>
              <CodeEditor
                colName="git_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.git_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Peripheral Vascular System</Typography>
              <CodeEditor
                colName="peripheral_vascular_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.peripheral_vascular_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
          </Stack>
          <Stack direction={"column"} gap={1} justifyContent={"space-around"}>
            <Box>
              <Typography variant="h5">Head</Typography>
              <CodeEditor
                colName="head"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.head}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Eyes</Typography>
              <CodeEditor
                colName="eyes"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.eyes}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Genitourinary System</Typography>
              <CodeEditor
                colName="genitourinary_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.genitourinary_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Nervous System</Typography>
              <CodeEditor
                colName="nervous_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.nervous_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Musculoskeletal System</Typography>
              <CodeEditor
                colName="musculoskeletal_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.musculoskeletal_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Neuropsychiatric System</Typography>
              <CodeEditor
                colName="neuropsychiatric_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.neuropsychiatric_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
          </Stack>
          <Stack direction={"column"} gap={1} justifyContent={"space-around"}>
            <Box>
              <Typography variant="h5">Ear</Typography>
              <CodeEditor
                colName="ear"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.ear}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Nose</Typography>
              <CodeEditor
                colName="nose"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.nose}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Mouth</Typography>
              <CodeEditor
                colName="mouth"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.mouth}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Throat</Typography>
              <CodeEditor
                colName="throat"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.throat}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box>
              <Typography variant="h5">Neck</Typography>
              <CodeEditor
                colName="neck"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.neck}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
                api='editRequested'
              />
            </Box>
            <Box>
              <Typography variant="h5">Endocrine System</Typography>
              <CodeEditor
                colName="endocrine_system"
                setOptions={setComplains}
                tableName="chief_complain"
                init={patient.patient.endocrine_system}
                options={complains}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
          </Stack>
        </Box>
      )}
    </div>
  )
}

export default ReviewOfSystems
