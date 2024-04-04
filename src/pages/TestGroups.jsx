import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box ,Card} from "@mui/material";
import TestGroupChildren from "./TestGroupChildren";

function TestGroups() {
  const [packages, setPackages] = useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("start fetching", "packages and their tests");
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/packages/all`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "packagess");
        setPackages(data);
      });
  }, []);

  return (
    <Box>
      <Tabs textColor="secondary" indicatorColor="secondary" value={value} onChange={handleChange} variant="scrollable">
        {packages.map((p) => {
          return <Tab key={p.package_id} label={p.package_name} />;
        })}
      </Tabs>
      {packages.map((p,index) => {
        return (
          <TestGroupChildren key={p.package_id} index={index} value={value}>
            {p.tests.map((t) => (
              <Card sx={{p:1,minWidth:"80px"}} key={t.id}>{t.main_test_name}</Card>
            ))}
          </TestGroupChildren>
        );
      })}

      <TestGroupChildren index={1} value={value}>
        2
      </TestGroupChildren>
      <TestGroupChildren index={2} value={value}>
        3
      </TestGroupChildren>
    </Box>
  );
}

export default TestGroups;
