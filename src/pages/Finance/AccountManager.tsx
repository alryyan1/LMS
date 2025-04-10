import React, { useState, useEffect } from "react";
import "./finance.css";
import AccountForm from "./AccountForm";
import AccountTree from "./AccountTree";
import axiosClient from "../../../axios-client";
import AccountCard from "./AccountCard";
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
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import { formatNumber } from "../constants.js";
import DateComponent from "./DateComponent";

function AccountManager() {
    const [accounts, setAccounts] = useState([]);
      const [selectedAccount, setSelectedAccount] = useState(null);
      const [editMode, setEditMode] = useState(false);
      const [treeDataSortable, setTreeDataSortable] = useState([]);

      const [firstDate, setFirstDate] = useState(dayjs().startOf('month'));
    
      const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axiosClient.get("accounts?parents=1");
      setAccounts(response.data);
       axiosClient.get("settings").then(({data})=>{
                // setSettings(data)
                setFirstDate(dayjs(data.financial_year_start))
                setSecondDate(dayjs(data.financial_year_end)) })
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
        let totalCreditSum = 0;
        let totalDebitSum = 0;
        // let totalCredits = account.credits.reduce(
        //   (accum, current) => accum + current.amount,
        //   0
        // );
        // let totalDebits = account.debits.reduce(
        //   (accum, current) => accum + current.amount,
        //   0
        // );
        // totalCreditSum += totalCredits;
        // totalDebitSum += totalDebits;
        // console.log(totalCredits, "total credits", totalDebits, "total dedits");
        // let largerNumber = Math.max(totalCredits, totalDebits);
        let creditBalance = 0;
        let debitBalance = 0;
        // if (totalCredits > totalDebits) {
        //   creditBalance = totalCredits - totalDebits;
        // } else {
        //   debitBalance = totalDebits - totalCredits;
        // }
        let label ;
        if(account.children.length > 0 ){
          //  label = `${account.name} ${account.totalBalance} `
           label = `${account.name}  `
        }else{
          //  label = `${account.name} (${creditBalance > 0 ? `${formatNumber(creditBalance)}+` : formatNumber(debitBalance)}) `
           label = account.name
        }
       
        return [
          account.id,
          {
            name: label,
            id: account.id,
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

    const result = {
      name: "شجره الحسابات",
      children: treeData,
    };

    return result;
  };
  useEffect(() => {
    document.title = 'شجره الحسابات ' ;
  }, []);

  const treeData = convertToTreeData(accounts);
  return (
    <>
    <DateComponent setFirstDate={setFirstDate} setSecondDate={setSecondDate} firstDate={firstDate} secondDate={secondDate} accounts={accounts} setAccounts={setAccounts}/>
      <Stack direction="row" gap={1}>
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

        <div style={{ display: "flex",padding:'10px' }} className="cent">
          <AccountTree data={treeData} onNodeClick={handleNodeClick} />
        </div>
      </Stack>
     
    </>
  );
}

export default AccountManager;
