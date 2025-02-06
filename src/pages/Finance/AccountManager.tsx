import React, { useState, useEffect } from 'react';
import './finance.css';
import AccountForm from './AccountForm';
import AccountTree from './AccountTree';
import axiosClient from '../../../axios-client';
import AccountCard from './AccountCard';
import { Grid, Stack } from '@mui/material';
import { formatNumber } from '../constants';

function AccountManager() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await axiosClient.get('accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    const handleNodeClick = (accountId) => {
        const account = accounts.find((a)=>a.id === accountId);
        console.log(account)
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
     }

     const handleCancelEdit= () => {
        setSelectedAccount(null);
        setEditMode(false)
    }


     const convertToTreeData = (accounts) => {
            const accountMap = new Map(accounts.map((account) => {
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
                  console.log(
                    totalCredits,
                    "total credits",
                    totalDebits,
                    "total dedits"
                  );
                  let largerNumber = Math.max(totalCredits, totalDebits);
                  let creditBalance = 0;
                  let debitBalance = 0;
                  if (totalCredits > totalDebits) {
                    creditBalance = totalCredits - totalDebits;
                  } else {
                    debitBalance = totalDebits - totalCredits;
                  }
                return [account.id, {
                    name: `${account.name} (${creditBalance > 0 ? formatNumber(creditBalance)  :formatNumber(debitBalance) }) `,
                    id:account.id,
                    code:account.code,
                     description:account.description,
                    parent: account.parents.length > 0 ? {id:account.parents[0].id , name:account.parents[0].name} : null,
                    children: [],
                }]
            }));

            const treeData = [];

            accounts.forEach((account) => {
                const node = accountMap.get(account.id);

                if (account.parents.length > 0) {
                    const parentNode = accountMap.get(account.parents[0].id);
                    if (parentNode)
                    {
                     parentNode.children.push(node);
                    }
                    else
                    {
                      treeData.push(node)
                    }
                } else {
                    treeData.push(node);
                }
            });

            const result = {
              name: 'شجره الحسابات',
              children: treeData,
            }

            return result;
        };


    const treeData = convertToTreeData(accounts)
    return (
        <Stack direction='row' gap={1}>
            <div style={{width:'300px'}}>
            <h1>Account Tree</h1>
              {selectedAccount && !editMode && (
               <AccountCard handleEditAccount={handleEditAccount} selectedAccount={selectedAccount} />

              )}

                { editMode &&
                  <AccountForm
                        account={selectedAccount}
                        onAccountAdded={handleAccountAdded}
                        onAccountUpdated={handleAccountUpdated}
                        onCancel={handleCancelEdit}
                      />
                   }

             {!selectedAccount && !editMode &&
                  <AccountForm
                        onAccountAdded={handleAccountAdded}
                        onAccountUpdated={handleAccountUpdated}
                      />
                  }
            </div>

        
            <div style={{display:'flex'}} className='cent' >
                <AccountTree
                    data={treeData}
                    onNodeClick={handleNodeClick}
                />
             </div >

        </Stack>
    );
}

export default AccountManager;