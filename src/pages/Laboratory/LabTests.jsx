import { useOutletContext } from "react-router-dom";
import { Button } from "@mui/material";
import SearchDiv from "../../parts/SearchDiv";
import UnitList from "./UnitList";
import MainTestChildren from "../../MainTestChildren";

function LabTests() {
  const appData = useOutletContext();
  
  console.log(appData)
  console.log(appData.showUnitList)
 
  console.log(appData.showUnitList ,'show unit ');
  return (
    <div className="container">
      <div>
        <Button
          sx={{
            "&:hover": {
              backgroundColor: "secondary",
            },
          }}
          onClick={() => {
            console.log("clicked");
            appData.setActiveTestObj(undefined);
            appData.setShowAddTest(true);
          }}
          variant="contained"
        >
          +
        </Button>
      </div>
      <SearchDiv
        activeTestObj={appData.activeTestObj}
        data={appData.allTests}
        packageData={appData.packageData}
        selectTestHandler={appData.selectTestHandler}
        setActiveTestObj={appData.setActiveTestObj}
        showAddTest={appData.showAddTest}
      />
      <div>
        <button
          onClick={() => {
            console.log('unit clicked')
            appData.setActiveTestObj(undefined);
            appData.setShowUnitList(true);
          }}
        >
          units
        </button>
      </div>

      <div>
        {appData.showUnitList && <UnitList />}

        {appData.activeTestObj && (
          <MainTestChildren
            addChildTestHandler={appData.addChildTestHandler}
            test={appData.activeTestObj}
          />
        )}
      </div>
    </div>
  );
}

export default LabTests;
