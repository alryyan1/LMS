import { useState, useRef, useEffect } from "react";
const useApp = () => {
  const [showUnitList, setShowUnitList] = useState(false);

  const [data, setData] = useState([]);
  const [searchedTest, setSearchedTest] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [units, setUnits] = useState([]);
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
    // console.log(obj);
    // take li test name and fill text box with it [value of txtbox  = li.textContent]
    setSearchedTest(obj.main_test_name);
    inputRef.current.value = obj.main_test_name;
    //close search dropdown
    setShowSearchBox(false);
    //show test main information
    //show test children
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
    setTestsIsLoading(true)
    fetch("http://127.0.0.1/projects/bootstraped/new/api.php?all_tests=1")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data)=>{
        console.log(data)
        setData(data)
      }).finally(()=>{
        setTestsIsLoading(false)
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
  const searchTestList = data
    .filter((element) => {
      return element.main_test_name
        .toLowerCase()
        .includes(searchedTest.toLowerCase());
    })
    .map((el) => (
      <li onClick={() => selectTestHandler(el)} key={el.id} data-id={el.id}>
        {el.main_test_name}
      </li>
    ));
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
    searchTestList,
    searchHandler,
    units,
    showSearchBox,
    setActiveTestObj,
    activeTestObj,
    data,
    setData,
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
  };
};

export default useApp;
