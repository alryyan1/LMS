import { useOutletContext } from "react-router-dom";
import { Button } from "@mui/material";
import UnitList from "./UnitList";
import MainTestChildren from "../../MainTestChildren";
import SearchDiv from "./SearchDiv";

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
