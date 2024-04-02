import { useState, useRef, useEffect } from "react";
const useApp = () => {
  const [showUnitList, setShowUnitList] = useState(false);

  const [searchedTest, setSearchedTest] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [units, setUnits] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [containerData, setContainersData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [testsIsLoading, setTestsIsLoading] = useState(false);
  // const [selectedTest, setSelectedTest] = useState({});
  const [activeTestObj, setActiveTestObj] = useState();
  console.log("app rendered");
  const inputRef = useRef();

  const headers = new Headers();
  headers.append("content-type", "application/json");
  const selectTestHandler = (obj) => {
    //hide unit list if its open
    setShowUnitList(false);
    //set active test id
    setActiveTestObj(obj);

  };

  useEffect(() => {
    console.log("start fetching units");
    fetch("http://127.0.0.1/projects/bootstraped/new/api.php?units")
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "unists array");
        setUnits(data.data);
      });
  }, []);
  useEffect(() => {
    console.log("start fetching doctors");
    fetch("http://127.0.0.1:8000/doctors",{
  
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json;',
  }})
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "doctors array");
        setDoctors(data);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch("http://127.0.0.1/projects/bootstraped/new/api.php?containers")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setContainersData(data.data);
        }),
      fetch("http://127.0.0.1/projects/bootstraped/new/api.php?packages")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPackageData(data.data);
        }),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);
  const searchHandler = (e) => {
    if (e.target.value != "") {
      setShowSearchBox(true);
      setShowAddTest(false);
    } else {
      setShowSearchBox(false);
    }
    setSearchedTest(e.target.value);
  };
  
  function addChildTestHandler() {
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?addChild=1&main=${activeTestObj.id}`
    )
      .then((res) => res.json())
      .then((results) => {
        // console.log(data)
        // console.log(results.data)

        setActiveTestObj((prev) => {
          return { ...prev, children: [...prev.children, results.data] };
        });
      })
      .catch(() => {})
      .finally(() => {});
  }

  return {
    selectTestHandler,
    testsIsLoading,
    addChildTestHandler,
    searchHandler,
    units,
    showSearchBox,
    setActiveTestObj,
    activeTestObj,
    inputRef,
    searchedTest,
    containerData,
    packageData,
    setShowAddTest,
    showAddTest,
    setShowSearchBox,
    setUnits,
    showUnitList,
    setShowUnitList,
    doctors
  };
};

export default useApp;
