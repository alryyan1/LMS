import { Divider, IconButton, Stack, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { Item, webUrl } from "../pages/constants";
import { Calculate, Group, PersonAdd, Print } from "@mui/icons-material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import bloodTest from "./../assets/images/blood-test.png";
import { useOutletContext } from "react-router-dom";
import { useStateContext } from "../appContext";
import { ReceptionLayoutProps } from "../types/CutomTypes";
import { User } from "../types/Patient";
import EmptyDialog from "../pages/Dialogs/EmptyDialog";
import CashDenos from "../pages/Clinic/CashDenos";
import DoctorsCredits from "../pages/Clinic/DoctorsCredits";
import { Book, Plus } from "lucide-react";
import CostDialog from "../pages/Dialogs/CostDialog";
interface CustomSideBarProbs {
  showFormHandler: () => void;
  showDoctorsDialog: () => void;
  setOpen: (value: boolean) => void;
  showShiftMoney: () => void;
  activeShift: string;
  user: User;
  activePatient: any;
  setAllMoneyUpdatedLab: () => void;

}
function CustumSideBar({
  showFormHandler,
  showDoctorsDialog,
  setAllMoneyUpdatedLab,
  setOpen,
  showShiftMoney,
  activeShift,
  user,
  activePatient,
}:CustomSideBarProbs) {
  const { setShowPatientServices, setShowServicePanel ,setShowTestPanel,setShowLabTests} =
    useOutletContext<ReceptionLayoutProps>();
    const [showDoctorCredit,setShowDoctorCredit] = useState(false)
      const [show, setShow] = useState(false);
    
  return (
    <Stack
      sx={{ mr: 1 }}
      gap={"5px"}
      divider={<Divider orientation="vertical" flexItem />}
      direction={"column"}
    >
     {!user?.isAccountant && <Item>
        <IconButton
          title="فورمه التسجيل"
          variant="contained"
          onClick={showFormHandler}
        >
          <CreateOutlinedIcon />
        </IconButton>
      </Item>}
      {!user?.isAccountant &&  <Item>
        <IconButton
          title="قائمه الاطباء"
          variant="contained"
          onClick={showDoctorsDialog}
        >
          <Group />
        </IconButton>
      </Item>}
      {/* {!user?.isAccountant &&   <Item title="اضافه طبيب">
        <IconButton
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          <PersonAdd />
        </IconButton>
      </Item>} */}
      {/* <Item title="ملخص اليوميه المالي">
        <IconButton variant="contained" onClick={showShiftMoney}>
          <Calculate />
        </IconButton>
      </Item> */}

      <Item>
        {user && (
          <IconButton
            title="العيادات تفصيلي"
            href={`${webUrl}clinics/all?user=$`}
            variant="contained"
          >
            <Print />
          </IconButton>
        )}
      </Item>

      <Item>
        {user && (
          <IconButton
            title=" التقرير العام"
            href={`${webUrl}clinics/all?user_id=${user?.id}`}
            variant="contained"
          >
            <Book />
          </IconButton>
        )}
      </Item>

      <Item>
       
          <IconButton
            title="استحقاق الاطباء"
            onClick={() => setShowDoctorCredit(true)}
            variant="contained"
          >
            <Diversity3Icon />
          </IconButton>
      
      </Item>
      <Tooltip title='اضافه منصرف'>
          <IconButton onClick={()=>{
            setShow(true);
          }}>
              <Plus/>
            </IconButton>
          </Tooltip>
      {activeShift && (
        <Item>
          <IconButton
            color="info"
            title="التقرير الخاص"
            href={`${webUrl}clinics/doctor/report?user=${user.id}&doctorshift=${activeShift.id}`}
            variant="contained"
          >
            <DescriptionIcon />
          </IconButton>
        </Item>
      )}
               <CostDialog setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}  setShift={null} setShow={setShow} show={show} />

     <EmptyDialog setShow={setShowDoctorCredit} show={showDoctorCredit}>
        <DoctorsCredits user={user} setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}/>
     </EmptyDialog>
    </Stack>
  );
}

export default CustumSideBar;
