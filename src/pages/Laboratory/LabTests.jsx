import { useOutletContext } from "react-router-dom";
import { Button } from "@mui/material";
import SearchDiv from "../../parts/SearchDiv";
import UnitList from "./UnitList";
import MainTestChildren from "../../MainTestChildren";

function LabTests() {
  const appData = useOutletContext();
  
  console.log(appData.showUnitList)
 
  console.log(appData.showUnitList ,'show unit ');
  return (
    <>
     
      <SearchDiv/>
      

      <div>

        {appData.activeTestObj && (
          <MainTestChildren
          />
        )}
      </div>
    </>
     
  );
}

export default LabTests;
