import { IconButton, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

import { Item } from "../constants.js";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import DepoistItemsTable from "./DepoistItemsTable.jsx";
import NewInvoiceForm from "./NewInvoiceForm.jsx";
import AddItemToDepositForm from "./AddItemToDepositForm.jsx";

import { FormatListBulleted, ShoppingCart } from "@mui/icons-material";
import PurchaseInvoiceSummery from "./PurchaseInvoiceSummery.jsx";
import Invoices from "./Invoices.jsx";
import InvoicesFilter from "./InvoicesFilter.js";
import { PharmacyLayoutPros } from "../../types/pharmacy.js";
import DepositItems from "./DepositItems.js";
function ItemDeposit() {
  const navigate = useNavigate();
  const {
    setDialog,
    items,
    suppliers,
    invoices,
    setInvoices,
    selectedInvoice,
    setSelectedInvoice,
    depositLoading,
    excelLoading,
    setExeclLoading,
    setDepositItems,
    setDepositItemsSearch,
    depositItemsSearch,
    depositItems,depositItemsLinks ,setDepositItemsLinks
    
  } = useOutletContext<PharmacyLayoutPros>();
  const [incomeItems, setIncomeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [income, setIncome] = useState(null);
  const [update, setUpdate] = useState(0);
  const [data, setData] = useState();
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [layOut, setLayout] = useState({
    newForm: "0fr",
    invoices: "1fr",
    depositItems:"0fr",
    showInvoices: true,
    showNewForm: false,
    showDopsitItemTable: false,
    depositItemTable: "0fr",
    showAddtoDeposit: false,
    addToDepositForm: "0fr",
    addToInventoryStyleObj: {},
    incomeItemsStyleObj: {},
  });
  const { id } = useParams();
  useEffect(()=>{
    if (depositItemsSearch !='') {
        const timer = setTimeout(() => {
      axiosClient.get(`depositItems/search?word=${depositItemsSearch}`).then(({data})=>{
        console.log(data.links,'data links')
        setDepositItemsLinks(data.links)
        if (data.data.length > 0) {
          setLayout((prev)=>{
            return {...prev, invoices:'0fr',depositItems:'1fr',showInvoices:false}
          })
        }
        setDepositItems(data.data)
        
      })
    }, 300);
    return ()=>{
        clearTimeout(timer)
    }
    }
  
  },[depositItemsSearch])
  useEffect(() => {
    if (id) {
      axiosClient.post(`defineItemToLastDeposit/${id}`).then(({ data }) => {
        change(data.deposit);
      });
    }
  }, []);
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
  const showNewFormHandler = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showNewForm: true,
        invoices:"0fr",
        showInvoices:false,
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

  const showInvoices = () => {
    setSelectedInvoice(null);
    hideDepositItemsTable();
    hideAddToDeposit();
    hideNewFormHandler();
    showDepositsTable();
  };
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

  const change = (deposit) => {
    setInvoices(deposit);
    setInvoices((prev) => {
      return prev.map((d) => {
        if (d.id === deposit.id) {
          return { ...deposit };
        }
        return d;
      });
    });
  };

  return (
    <>
      {!selectedInvoice && <InvoicesFilter />}

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `50px  ${layOut.depositItemTable}  ${layOut.addToDepositForm}    ${layOut.invoices}     ${layOut.newForm}  ${layOut.depositItems}  `,
        }}
      >
        <Stack direction={"column"} gap={2}>
          <Item>
            <IconButton
              title="اظهار الفواتير"
              onClick={() => {
                showInvoices();
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
             
              }}
              variant="contained"
            >
              <CreateOutlinedIcon />
            </IconButton>
          </Item>
          <Item>
            <IconButton
              onClick={() => {
                navigate("/pharmacy/sell");
              }}
              title="POS"
            >
              <ShoppingCart />
            </IconButton>
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

        <div>
          {/* create table with all suppliers */}
          {layOut.showDopsitItemTable && (
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
            {depositLoading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={400}
              />
            ) : (
              <>
                {layOut.showInvoices && (
                  <>
                    <Invoices
                      hideDepositsTable={hideDepositsTable}
                      showDepositItemsTable={showDepositItemsTable}
                      setData={setData}
                    />
                  </>
                )}
              </>
            )}
          </>
        </div>

        <div>
        {layOut.showNewForm && (
          <NewInvoiceForm
            showInvoices={showInvoices}
            hideNewFormHandler={hideNewFormHandler}
            setDialog={setDialog}
            setUpdate={setUpdate}
            suppliers={suppliers}
          />
        )}
        </div>
       

        {depositLoading && <PurchaseInvoiceSummery deposit={depositLoading} />}
        <div>
         {depositItems.length > 0 && <DepositItems/>}
        </div>
      </div>
    </>
  );
}

export default ItemDeposit;
