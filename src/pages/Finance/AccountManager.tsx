import React, { useState, useEffect, useRef, useMemo } from "react";
import "./finance.css";
import AccountForm from "./AccountForm";
import axiosClient from "../../../axios-client";
import AccountCard from "./AccountCard";

// Type definitions
interface Account {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits?: Array<{ amount: number }>;
  debits?: Array<{ amount: number }>;
  parents?: Array<{ id: number }>;
  balance?: number;
  totalCredits?: number;
  totalDebits?: number;
}

interface TreeNode {
  name: string;
  id: number;
  code: string;
  credits: Array<{ amount: number }>;
  debits: Array<{ amount: number }>;
  description?: string;
  balance: string;
  totalCredits: string;
  totalDebits: string;
  children: TreeNode[];
  attributes?: {
    balance: number;
    credits: number;
    debits: number;
  };
}
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
import { formatNumber, webUrl } from "../constants.js";
import DateComponent from "./DateComponent";
import Tree from "react-d3-tree";

function AccountManager() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [treeDataSortable, setTreeDataSortable] = useState<TreeNode[]>([]);
    const selectedAccountRef = useRef<Account | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [parentAccount, setParentAccount] = useState<Account | null>(null);
    const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
    const [treeKey, setTreeKey] = useState(0);

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

  const handleNodeClick = (accountId: number) => {
    const account = accounts.find((a) => a.id === accountId);
    console.log(account);
    setSelectedAccount(account || null);
  };

  const onNodeClick = (node: any) => {
    console.log(node, "node clicked");
    // Skip the root node (which has id: 0)
    if (node.id && node.id !== 0) {
      const account = accounts.find((a) => a.id === node.id);
      if (account) {
        console.log("Selected account:", account);
        setSelectedAccount(account);
      }
    }
  };



  const handleAccountAdded = () => {
    fetchAccounts();
  };
  const handleAccountUpdated = () => {
    fetchAccounts();
    setEditMode(false);
    setSelectedAccount(null);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setSelectedAccount(null);
    setEditMode(false);
  };

  const handleAddChildAccount = (parentAccount: Account) => {
    setParentAccount(parentAccount);
    setShowAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
    setParentAccount(null);
  };

  const handleChildAccountAdded = () => {
    fetchAccounts();
    handleCloseAddDialog();
  };

  const handleToggleTreeCollapse = () => {
    setIsTreeCollapsed(!isTreeCollapsed);
    setTreeKey(prev => prev + 1); // Force tree re-render
  };

  const convertToTreeData = (accounts: Account[]): TreeNode[] => {
    if (!Array.isArray(accounts)) {
      console.warn('convertToTreeData: accounts is not an array', accounts);
      return [{ name: "Accounts", id: 0, code: "", credits: [], debits: [], balance: "0", totalCredits: "0", totalDebits: "0", children: [] }];
    }
    
    const accountMap = new Map<number, TreeNode>(
      accounts.map((account) => {
        const totalCredits = (account.credits || []).reduce(
          (acc: number, curr: { amount: number }) => acc + (curr?.amount || 0),
          0
        );
        const totalDebits = (account.debits || []).reduce(
          (acc: number, curr: { amount: number }) => acc + (curr?.amount || 0),
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

    let treeData: TreeNode[] = [];

    accounts.forEach((account) => {
      const node = accountMap.get(account.id);

      if (node) {
        node.attributes = {
          balance: account.balance || 0,
          credits: account.totalCredits || 0,
          debits: account.balance || 0,
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

    return [{ name: "شجره الحسابات", id: 0, code: "", credits: [], debits: [], balance: "0", totalCredits: "0", totalDebits: "0", children: treeData }];
  };
  useEffect(() => {
    document.title = 'شجره الحسابات ' ;
  }, []);

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }: { nodeDatum: any; toggleNode: () => void }) => {
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const isSelected = selectedAccount && selectedAccount.id === nodeDatum.id;
    
    // Skip the root node (id: 0)
    const isRootNode = nodeDatum.id === 0;
    
    return (
      <g>
        {/* Main node circle and text */}
        <g
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onNodeClick(nodeDatum);
          }}
          style={{ cursor: 'pointer' }}
        >
          <circle r="15" fill={isSelected ? "#4CAF50" : "#fff"} stroke="#333" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fontSize="12">
            {nodeDatum.name}
          </text>
        </g>
        
        {/* Expand/collapse button */}
        {hasChildren && (
          <g
            onClick={(e) => {
              e.stopPropagation();
              toggleNode();
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle r="8" cx="25" cy="0" fill="orange" />
            <text x="25" y="3" textAnchor="middle" fontSize="10" fill="white">+</text>
          </g>
        )}
        
        {/* Add child account button */}
        {!isRootNode && (
          <g
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const account = accounts.find((a) => a.id === nodeDatum.id);
              if (account) {
                handleAddChildAccount(account);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle r="8" cx="45" cy="0" fill="#2196F3" />
            <text x="45" y="3" textAnchor="middle" fontSize="10" fill="white">+</text>
          </g>
        )}
      </g>
    );
  };



  useEffect(() => {
    if (accounts.length > 0) {
      const convertedTree = convertToTreeData(accounts);
      console.log('Tree data structure:', convertedTree);
      console.log('First node children:', convertedTree[0]?.children);
    }
  }, [accounts]);

  const treeData: TreeNode[] = useMemo(() => convertToTreeData(accounts), [accounts]);
  return (
    <>
      {/* Fixed Collapse/Expand Button */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1001,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '8px'
      }}>
        <Button
          variant="contained"
          color={isTreeCollapsed ? "primary" : "secondary"}
          onClick={handleToggleTreeCollapse}
          size="small"
          style={{ minWidth: '120px' }}
        >
          {isTreeCollapsed ? "Expand Tree" : "Collapse Tree"}
        </Button>
      </div>

    <DateComponent 
      setFirstDate={setFirstDate} 
      setSecondDate={setSecondDate} 
      firstDate={firstDate} 
      secondDate={secondDate} 
      accounts={accounts} 
      setAccounts={setAccounts}
      setData={() => {}}
      api={axiosClient}
    />
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
              parentAccount={null}
              onAccountAdded={handleAccountAdded}
              onAccountUpdated={handleAccountUpdated}
              onCancel={handleCancelEdit}
            />
          )}

                      {!selectedAccount && !editMode && (
              <AccountForm
                account={null}
                parentAccount={null}
                onAccountAdded={handleAccountAdded}
                onAccountUpdated={handleAccountUpdated}
                onCancel={() => {}}
              />
            )}
        </div>

        <div style={{ height: `${window.innerHeight - 100}px`, flex: 1 }}>
          {React.useMemo(() => (
            <Tree
              key={`tree-${treeKey}-${isTreeCollapsed ? 'collapsed' : 'expanded'}`}
              data={treeData}
              orientation="vertical"
              collapsible={true}
              initialDepth={isTreeCollapsed ? 0 : 10}
              separation={{ siblings: 2, nonSiblings: 2.5 }}
              translate={{ x: 200, y: 200 }}
              zoom={1}
              scaleExtent={{ min: 0.1, max: 1 }}
              pathFunc="diagonal"
              nodeSize={{ x: 200, y: 100 }}
              renderCustomNodeElement={renderCustomNodeElement}
              shouldCollapseNeighborNodes={false}
            />
          ), [treeData, isTreeCollapsed, treeKey])}
        </div>
      </Stack>
      
      {/* Add Child Account Dialog */}
      {showAddDialog && parentAccount && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>Add Child Account to: {parentAccount.name}</h3>
            <AccountForm
              account={null}
              parentAccount={parentAccount}
              onAccountAdded={handleChildAccountAdded}
              onAccountUpdated={handleChildAccountAdded}
              onCancel={handleCloseAddDialog}
            />
          </div>
        </div>
      )}
     
    </>
  );
}

export default AccountManager;
