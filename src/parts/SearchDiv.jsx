import Search from '../SearchTest'
import TestMainInfo from '../TestMainInfo'
import AddMainTestForm from '../AddMainTestForm'
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