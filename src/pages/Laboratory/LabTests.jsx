import { useOutletContext } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import UnitList from "./UnitList";
import MainTestChildren from "../../MainTestChildren";
import SearchDiv from "./SearchDiv";
import AddMainTestForm from "./AddMainTestForm";

function LabTests() {
  const appData = useOutletContext();

  console.log(appData.showUnitList);

  console.log(appData.showUnitList, "show unit ");
  return (
    <>
      <Stack direction={"row"}>
        <SearchDiv />
        <Button
          onClick={() => {
            appData.setActiveTestObj(null)
            appData.setShowAddTest(true);
          }}
        >
          ADD New Test
        </Button>
      </Stack>
      {appData.showAddTest && (
        <AddMainTestForm
        />
      )}
      <div>{appData.activeTestObj && <MainTestChildren />}</div>
    </>
  );
}

export default LabTests;
