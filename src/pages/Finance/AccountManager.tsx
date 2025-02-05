import React, { useState, useEffect } from 'react';
import './finance.css';
import AccountForm from './AccountForm';
import AccountTree from './AccountTree';
import axiosClient from '../../../axios-client';
import AccountCard from './AccountCard';
import { Grid, Stack } from '@mui/material';

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
            const accountMap = new Map(accounts.map((account) => [account.id, {
                name: account.name,
                id:account.id,
                code:account.code,
                 description:account.description,
                parent: account.parents.length > 0 ? {id:account.parents[0].id , name:account.parents[0].name} : null,
                children: [],
            }]));

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
        <Grid  container >
            <Grid item xs={3}>
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
            </Grid>

        
            <Grid  xs={9}>
                <AccountTree
                    data={treeData}
                    onNodeClick={handleNodeClick}
                />
             </Grid >

        </Grid>
    );
}

export default AccountManager;