import { useState, useRef, useEffect } from "react";
const useApp = () => {
  const [showUnitList, setShowUnitList] = useState(false);

  const [searchedTest, setSearchedTest] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [units, setUnits] = useState([]);
  const [showAddTest, setShowAddTest] = useState(false);

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
    addChildTestHandler,
    searchHandler,
    units,
    showSearchBox,
    setActiveTestObj,
    activeTestObj,
    inputRef,
    searchedTest,
    setShowAddTest,
    showAddTest,
    setShowSearchBox,
    setUnits,
    showUnitList,
    setShowUnitList,
  };
};

export default useApp;
