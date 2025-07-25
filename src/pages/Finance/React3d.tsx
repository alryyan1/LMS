import React, { useState, useEffect, useRef } from "react";
import "./finance.css";
import AccountForm from "./AccountForm";
import AccountCard from "./AccountCard";
import axiosClient from "../../../axios-client";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs, // Import Tabs and Tab
  Tab,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import { formatNumber, webUrl } from "../constants.js";
import DateComponent from "./DateComponent";

// import SortableTree from "react-sortable-tree";
// import "react-sortable-tree/style.css"; // Import react-sortable-tree styles
import { v4 as uuidv4 } from "uuid"; // Import a UUID generator

//import AccountTree from "./AccountTree"; // Assuming you still have this
import Tree from "react-d3-tree"; // Import react-d3-tree
const NonRerenderingComponent = React.memo(({ someProp }) => {
  console.log("Rendered!");

  return <div>This part will NOT re-render when `someState` changes.</div>;
});
function AccountManager() {
  const [accounts, setAccounts] = useState([]);
  const selectedAccountRef = useRef(null);

  const [treeDataSortable, setTreeDataSortable] = useState([]); // react-sortable-tree data
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for react-tree-graph, 1 for react-sortable-tree

  const [firstDate, setFirstDate] = useState(dayjs(new Date()).startOf('month'));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axiosClient.get("accounts?parents=1");
        axiosClient.get("settings").then(({data})=>{
                      // setSettings(data)
                      setFirstDate(dayjs(data.financial_year_start))
                      setSecondDate(dayjs(data.financial_year_end)) })
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleNodeClick = (accountId) => {
    console.log(accountId)
    // const account = accounts.find((a) => a.id === accountId);
    // console.log(accountId);

    // setSelectedAccount(account);
  };

  const handleAccountAdded = () => {
    fetchAccounts();
  };
  const handleAccountUpdated = () => {
    fetchAccounts();
    setEditMode(false);
    setSelectedAccount(null);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setSelectedAccount(null);
    setEditMode(false);
  };

  const convertToTreeData = (accounts) => {
    if (!Array.isArray(accounts)) {
      console.warn('convertToTreeData: accounts is not an array', accounts);
      return [{ name: "Accounts", children: [] }];
    }
    
    const accountMap = new Map(
      accounts.map((account) => {
        const totalCredits = (account.credits || []).reduce(
          (acc, curr) => acc + (curr?.amount || 0),
          0
        );
        const totalDebits = (account.debits || []).reduce(
          (acc, curr) => acc + (curr?.amount || 0),
          0
        );
        const balance = totalCredits - totalDebits;
        return [
          account.id,
          {
            name: account.name,
            id: account.id,
            code: account.code,
            credits: account.credits || [],
            debits: account.debits || [],
            description: account.description,
            balance: formatNumber(Math.abs(balance)),
            totalCredits: formatNumber(totalCredits),
            totalDebits: formatNumber(totalDebits),

            children: [],
          },
        ];
      })
    );

    let treeData = [];

    accounts.forEach((account) => {
      const node = accountMap.get(account.id);
      //   console.log(node,'node in foreach')

      if (node) {
        node.attributes = {
          balance: account.balance,
          credits: account.totalCredits,
          debits: account.balance,
        };

        if (account.parents && account.parents.length > 0) {
          const parentNode = accountMap.get(account.parents[0].id);
          if (parentNode) {
            parentNode.children.push(node);
          }
        } else {
          treeData.push(node);
        }
      }
    });

    return [{ name: "Accounts", children: treeData }];
  };

  const convertToTreeDataSortable = (accounts) => {
    if (!Array.isArray(accounts)) {
      console.warn('convertToTreeDataSortable: accounts is not an array', accounts);
      return [];
    }
    
    const accountMap = new Map(
      accounts.map((account) => {
        let totalCreditSum = 0;
        let totalDebitSum = 0;
        let totalCredits = (account.credits || []).reduce(
          (accum, current) => accum + (current?.amount || 0),
          0
        );
        let totalDebits = (account.debits || []).reduce(
          (accum, current) => accum + (current?.amount || 0),
          0
        );
        totalCreditSum += totalCredits;
        totalDebitSum += totalDebits;
        // console.log(totalCredits, "total credits", totalDebits, "total dedits");
        let largerNumber = Math.max(totalCredits, totalDebits);
        let creditBalance = 0;
        let debitBalance = 0;
        if (totalCredits > totalDebits) {
          creditBalance = totalCredits - totalDebits;
        } else {
          debitBalance = totalDebits - totalCredits;
        }
        return [
          account.id,
          {
            id: account.id, // IMPORTANT: Add a unique ID!
            title: `${account.name} (${creditBalance > 0 ? `${formatNumber(creditBalance)}+` : formatNumber(debitBalance)}) `,
            name: account.name, //Keep track of Account Name
            attributes: {
              balance: account.balance,
            },
            code: account.code,
            description: account.description,
            parent:
              account.parents.length > 0
                ? { id: account.parents[0].id, name: account.parents[0].name }
                : null,
            children: [],
          },
        ];
      })
    );

    const treeData = [];

    accounts.forEach((account) => {
      const node = accountMap.get(account.id);

      if (node) {
        if (account.parents && account.parents.length > 0) {
          const parentNode = accountMap.get(account.parents[0].id);
          if (parentNode) {
            parentNode.children.push(node);
          } else {
            treeData.push(node);
          }
        } else {
          treeData.push(node);
        }
      }
    });
    return treeData; // Return the array of root nodes
  };
  console.log("page rendered");
  useEffect(() => {
    document.title = "شجره الحسابات ";
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const renderCustomNodeElement2 = ({ nodeDatum, toggleNode }) => {
    return (
      <g transform="translate(-10,-10)">
        {/* Circle for the node */}
        <circle r="10" fill="lightsteelblue" />

        {/* Node Text */}
        <text x="15" y="0px" style={{ fontSize: "12px" }}>
          {nodeDatum.name} ({formatNumber(nodeDatum.balance)})
        </text>

        {/* Button inside the node */}
        <foreignObject x="50" y="-10" width="100" height="30">
          <button
            style={{ width: "100%", height: "100%" }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering tree collapse
              alert(`Clicked on ${nodeDatum.name}`);
            }}
          >
            Click Me
          </button>
        </foreignObject>
      </g>
    );
  };
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    // console.log(nodeDatum,'nodeDatum',)
    const isCollapsed = collapsedNodes.includes(nodeDatum.id);
    
    return (
      <g
        onClick={() => {
          //   toggleNodeExpansion(nodeDatum);
          handleNodeClick(nodeDatum);
          toggleNode();
        }}
      >
        <circle r="20" />
        <text style={{ fontWeight: "normal" }} x="0" y="0px">
          {nodeDatum.name} ({formatNumber(nodeDatum.balance)})
        </text>
        <foreignObject x="50" y="-10" width="100" height="100">
          <Stack direction={"column"}>
            <Button
              target="_blank"
              href={`${webUrl}ledger/${nodeDatum?.id}?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}
            >
              PDF
            </Button>
            <label>Credit {nodeDatum.totalCredits}</label>
            <label>Debits {nodeDatum.totalDebits}</label>
         

          </Stack>
        
        </foreignObject>
      </g>
    );
  };
  const toggleNodeExpansion = (node) => {
    const nodeId = node.id;
    setCollapsedNodes((prevState) => {
      if (prevState.includes(nodeId)) {
        return prevState.filter((id) => id !== nodeId); // Remove ID to expand
      } else {
        return [...prevState, nodeId]; // Add ID to collapse
      }
    });
  };
  const onNodeClick = (node) => {
    // alert("ssssssss");
    console.log(node, "node clicked");
    if (node.parent) {
      console.log(node.data, "node account");
      // selectedAccountRef.current = node.data; // Updating without re-render

      // setSelectedAccount(node.data); // Here, we extract the account data from node.data
    }
  };
  const treeData = convertToTreeData(accounts);

  useEffect(() => {
    // When accounts are fetched, convert them to tree data
    if (accounts.length > 0) {
      // When accounts are fetched, convert them to tree data
      const convertedTree = convertToTreeData(accounts);
      convertedTree[0].collapsed = false;
      setCollapsedNodes([convertedTree[0].id]);
    }
  }, [accounts]);

  const getNodeKey = (node) => node.id; // Use node.id as the key

  const onTreeChange = (newTreeData) => {
    setTreeDataSortable(newTreeData); // Update the treeData state when the tree changes
  };

  return (
    <>
      <DateComponent
        setFirstDate={setFirstDate}
        setSecondDate={setSecondDate}
        firstDate={firstDate}
        secondDate={secondDate}
        accounts={accounts}
        setAccounts={setAccounts}
      />

      <Stack
        direction={"row"}
        gap={1}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {selectedAccount && (
          <div style={{ width: "300px" }}>
            <h1>Account Tree</h1>
            {selectedAccount && !editMode && (
              <AccountCard
                handleEditAccount={handleEditAccount}
                selectedAccount={selectedAccount}
                first={firstDate.format("YYYY/MM/DD")}
                second={secondDate.format("YYYY/MM/DD")}
              />
            )}

            {editMode && (
              <AccountForm
                account={selectedAccount}
                onAccountAdded={handleAccountAdded}
                onAccountUpdated={handleAccountUpdated}
                onCancel={handleCancelEdit}
              />
            )}

            {!selectedAccount && !editMode && (
              <AccountForm
                onAccountAdded={handleAccountAdded}
                onAccountUpdated={handleAccountUpdated}
              />
            )}
          </div>
        )}
        <div style={{ height: `${window.innerHeight - 100}px`, flex: 1 }}>
          <Tree
            //    key={selectedAccountRef}
            //   enableLegacyTransitions
            collapsible={true}
            separation={{ siblings: 2, nonSiblings: 2 }} // Adjust these values
            initialDepth={0}
            onNodeClick={onNodeClick}
            data={treeData}
            orientation="vertical" // or "horizontal"
            renderCustomNodeElement={renderCustomNodeElement} // Use custom node rendering
            // onNodeClick={handleNodeClick} //Adjust to work with react-d3-tree data
          />
        </div>
      </Stack>
    </>
  );
}

export default AccountManager;
