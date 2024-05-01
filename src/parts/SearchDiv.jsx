import Search from '../pages/Laboratory/SearchTest'
import TestMainInfo from '../pages/Laboratory/TestMainInfo'
import AddMainTestForm from '../pages/Laboratory/AddMainTestForm'
function SearchDiv({selectTestHandler,data,activeTestObj,setActiveTestObj,showAddTest,packageData,containerData}) {
  return (
    <div className="searchContainer">
    <Search selectTestHandler={selectTestHandler} tests={data} />
    <div className="mainTestInfo">
      {activeTestObj && (
        <h1 style={{ textAlign: "center" }}>Main Test Info</h1>
      )}

      {activeTestObj && (
        <TestMainInfo
          setActiveTestObj={setActiveTestObj}
          test={activeTestObj}
        />
      )}
      {showAddTest && (
        <AddMainTestForm
          packageData={packageData}
          containerData={containerData}
        />
      )}
    </div>
  </div>
  )
}

export default SearchDiv