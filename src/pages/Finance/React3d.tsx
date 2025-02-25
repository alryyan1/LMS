import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import { formatNumber } from "../constants.js";
import DateComponent from "./DateComponent";

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // Import react-sortable-tree styles
import { v4 as uuidv4 } from 'uuid'; // Import a UUID generator

//import AccountTree from "./AccountTree"; // Assuming you still have this
import Tree from 'react-d3-tree'; // Import react-d3-tree

function AccountManager() {
    const [accounts, setAccounts] = useState([]);
    const [treeDataSortable, setTreeDataSortable] = useState([]); // react-sortable-tree data
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [tabValue, setTabValue] = useState(0); // 0 for react-tree-graph, 1 for react-sortable-tree
  
    const [firstDate, setFirstDate] = useState(dayjs(new Date()));
    const [secondDate, setSecondDate] = useState(dayjs(new Date()));

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axiosClient.get("accounts?parents=1");
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleNodeClick = (accountId) => {
    const account = accounts.find((a) => a.id === accountId);
    console.log(account);
    setSelectedAccount(account);
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
    const accountMap = new Map(
      accounts.map((account) => {
          const totalCredits = account.credits.reduce((acc, curr) => acc + curr.amount, 0);
          const totalDebits = account.debits.reduce((acc, curr) => acc + curr.amount, 0);
          const balance = totalCredits - totalDebits;
        return [
          account.id,
          {
            name: account.name,
            id: account.id,
            code: account.code,
            description: account.description,
             balance: formatNumber(Math.abs(balance)),
            children: [],
          },
        ];
      })
    );

    let treeData = [];

    accounts.forEach((account) => {
      const node = accountMap.get(account.id);

      if (account.parents.length > 0) {
        const parentNode = accountMap.get(account.parents[0].id);
        if (parentNode) {
          parentNode.children.push(node);
        }
      } else {
        treeData.push(node);
      }
    });

       return [{ name: "Accounts", children: treeData }];
  };

  const convertToTreeDataSortable = (accounts) => {
    const accountMap = new Map(
      accounts.map((account) => {
        let totalCreditSum = 0;
        let totalDebitSum = 0;
        let totalCredits = account.credits.reduce(
          (accum, current) => accum + current.amount,
          0
        );
        let totalDebits = account.debits.reduce(
          (accum, current) => accum + current.amount,
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

      if (account.parents.length > 0) {
        const parentNode = accountMap.get(account.parents[0].id);
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          treeData.push(node);
        }
      } else {
          treeData.push(node);
      }
    });
     return treeData; // Return the array of root nodes
  };

  useEffect(() => {
    document.title = 'شجره الحسابات ';
  }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
 const renderCustomNodeElement = ({ nodeDatum }) => {
    console.log(nodeDatum,'nodeDatum')
   return (
        <g>
            <circle r="10" fill="lightsteelblue"></circle>
            <text style={{ fontSize: '12px' }} x="15" y="0px">
                {nodeDatum.name} ({nodeDatum.balance})
            </text>
        </g>
    );
 }
    const onNodeClick = (node) => {
          setSelectedAccount(node.node); // Here, we extract the account data from node.data
    };
    const treeData = convertToTreeData(accounts);
    console.log(treeData)


      useEffect(() => {
        // When accounts are fetched, convert them to tree data
        if (accounts.length > 0) {
          const convertedTree = convertToTreeDataSortable(accounts);
          setTreeDataSortable(convertedTree);
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
   

         
        

              <div style={{ height: `${window.innerHeight -100}px` }}>
                    <Tree
                        data={treeData}
                      orientation="vertical" // or "horizontal"
                      renderCustomNodeElement={renderCustomNodeElement} // Use custom node rendering
                      //onNodeClick={handleNodeClick} //Adjust to work with react-d3-tree data
                   />
              </div>
            

       
      
      
    </>
  );
}

export default AccountManager;