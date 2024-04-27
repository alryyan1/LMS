import { Navigate, Outlet } from "react-router-dom";
import useApp from "./hooks/useApp";
import NavLab from "./pages/inventory/NavLab";
import { useStateContext } from "./appContext";

function LabLayout() {

    const { token } = useStateContext();

    console.log("lab layout rendered");
    if (!token) {
      console.log("redirect to login");
      return <Navigate to={'/login'}/>
    }
  const {
    selectTestHandler,
    units,
    setActiveTestObj,
    activeTestObj,
    inputRef,
    containerData,
    packageData,
    setShowAddTest,
    setUnits,
    showUnitList,
    setShowUnitList,
    testsIsLoading,
    showAddTest,
    doctors,
  } = useApp();
  return (
    <div>
      <NavLab />
      <h1>laboratory section</h1>
      {
        <Outlet
          context={{
            showAddTest,
            selectTestHandler,
            showUnitList,
            testsIsLoading,
            setShowUnitList,
            units,
            setActiveTestObj,
            activeTestObj,
            searchInput: inputRef.current,
            containerData,
            packageData,
            setShowAddTest,
            setUnits,
            doctors,
          }}
        />
      }
    </div>
  );
}

export default LabLayout;
