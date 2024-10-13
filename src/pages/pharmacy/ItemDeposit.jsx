import {
  IconButton,
  Skeleton,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

import { Item, } from "../constants.js";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import DepoistItemsTable from "./DepoistItemsTable.jsx";
import NewInvoiceForm from "./NewInvoiceForm.jsx";
import AddItemToDepositForm from "./AddItemToDepositForm.jsx";

import {
  FormatListBulleted,
  ShoppingCart,
} from "@mui/icons-material";
import PurchaseInvoiceSummery from "./PurchaseInvoiceSummery.jsx";
import Invoices from "./Invoices.jsx";
import InvoicesFilter from "./InvoicesFilter.jsx";
function ItemDeposit() {
 const navigate =  useNavigate()
 const { setDialog, items, suppliers,           invoices, setInvoices,
  selectedInvoice, setSelectedInvoice,depositLoading,excelLoading,setExeclLoading } =
  useOutletContext();
  console.log(excelLoading,'setExeclLoading')
  const [layOut, setLayout] = useState({
    newForm: "0fr",
    depositsTable: "2fr",
    showInvoices: true,
    showNewForm: false,
    showDopsitItemTable: false,
    depositItemTable: "0fr",
    showAddtoDeposit: false,
    addToDepositForm: "0fr",
    addToInventoryStyleObj: {},
    incomeItemsStyleObj: {},
  });
  const {id} =  useParams()
  useEffect(()=>{
     if (id) {
       
        axiosClient.post(`defineItemToLastDeposit/${id}`).then(({data})=>{
          change(data.deposit)
        })
      }
  },[])
  const showNewFormHandler = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showNewForm: true,
        newForm: "400px",
      };
    });
  };
  const hideNewFormHandler = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showNewForm: false,
        newForm: "0fr",
      };
    });
  };
 
  const showInvoices = ()=>{
    setSelectedInvoice(null)
    hideDepositItemsTable();
    hideAddToDeposit();
    hideNewFormHandler();
    showDepositsTable();
  }
  const hideDepositItemsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showDopsitItemTable: false,
        depositItemTable: "0fr",
      };
    });
  };
  const showDepositItemsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showDopsitItemTable: true,
        depositItemTable: "3fr",
      };
    });
  };

  const hideDepositsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showInvoices: false,
        depositsTable: "0fr",
      };
    });
  };
  const showDepositsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showInvoices: true,
        depositsTable: "1fr",
      };
    });
  };
  const hideAddToDeposit = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showAddtoDeposit: false,
        addToDepositForm: "0fr",
      };
    });
  };
  const [incomeItems, setIncomeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [income, setIncome] = useState(null);
  const [update, setUpdate] = useState(0);
  const [data, setData] = useState();
    const [invoiceItems,setInvoiceItems] = useState([])
  const  change = (deposit)=> {
    setInvoices(deposit)
    setInvoices((prev)=>{
      return prev.map((d)=>{
        if(d.id===deposit.id){
          return {...deposit}
        }
        return d
      })
    })
  }
  useEffect(() => {
    axiosClient.get("inventory/deposit/last").then(({ data: data }) => {
      if (data != "") {
        // console.log(data, "is data");
        setIncome(data);
        // console.log(data);

        setIncomeItems(data.items);
        if (data.complete) {
          setLayout((prev) => {
            return {
              ...prev,
              incomeItemsStyleObj: {},
              addToInventoryStyleObj: {},
            };
          });
          setShow(true);
        }
      } else {
        setShow(true);
      }
    });
  }, [update]);

  useEffect(() => {
    document.title = "المشتروات ";
  }, []);


  return (
    <>

  {!selectedInvoice &&  <InvoicesFilter />  }

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `  ${layOut.depositItemTable}  ${layOut.addToDepositForm}    ${layOut.depositsTable}     ${layOut.newForm}  `,
        }}
      >
        <div>
          {/* create table with all suppliers */}
          {setInvoices && layOut.showDopsitItemTable && (
            <DepoistItemsTable
            invoiceItems={invoiceItems}
            setInvoiceItems={setInvoiceItems}
            setSelectedDeposit={setSelectedInvoice}
            change={change}
              setLayout={setLayout}
              setData={setData}
              data={data}
              selectedDeposit={selectedInvoice}
            />
          )}
        </div>
        <div style={layOut.addToInventoryStyleObj}>
          {setInvoices && layOut.showAddtoDeposit && (
            <AddItemToDepositForm
              invoiceItems={invoiceItems}
              setInvoiceItems={setInvoiceItems}
              setData={setData}
              setUpdate={setUpdate}
              setSelectedDeposit={setInvoices}
              items={items}
              selectedDeposit={setInvoices}
              setLayout={setLayout}
              setDialog={setDialog}
            />
          )}
        </div>
        <div>
          <>
          {depositLoading  ?  <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={400}
              /> : <>
              
              {layOut.showInvoices &&  (
                <>
             
                           <Invoices hideDepositsTable={hideDepositsTable} showDepositItemsTable={showDepositItemsTable} setData={setData}/>

                </>
          )}
              </>}
           
          </>
       
        </div>

        {layOut.showNewForm && (
          <NewInvoiceForm
            showInvoices={showInvoices}
            hideNewFormHandler={hideNewFormHandler}
            setDialog={setDialog}
            setUpdate={setUpdate}
            suppliers={suppliers}
          />
        )}
        <Stack direction={"column"} gap={2}>
          <Item>
            <IconButton
              title="اظهار الفواتير"
              onClick={() => {
                showInvoices()
              }}
              variant="contained"
            >
              <FormatListBulleted />
            </IconButton>
          </Item>
          <Item>
            <IconButton
              title="انشاء فاتوره"
              onClick={() => {
                hideDepositItemsTable();

                hideAddToDeposit();
                showNewFormHandler();
                setLayout((prev) => {
                  return {
                    ...prev,
                    depositsTable: "1fr",
                  };
                });
              }}
              variant="contained"
            >
              <CreateOutlinedIcon />
            </IconButton>
          </Item>
          <Item>
            <IconButton  onClick={()=>{
            
              navigate('/pharmacy/sell')
            }} title="POS" ><ShoppingCart/></IconButton>
          </Item>
          {/* <Item>
            <IconButton
             title="اضافه صنف الي فاتوره"
              onClick={() => {
                showAddToDeposit();
                showDepositItemsTable()
              }}
              variant="contained"
            >
              <Download />
            </IconButton>
          </Item> */}
        </Stack>
        {depositLoading && (
          <PurchaseInvoiceSummery deposit={depositLoading} />
        )}
      </div>
    </>
  );
}

export default ItemDeposit;
