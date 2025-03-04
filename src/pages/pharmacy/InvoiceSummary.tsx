import { Card, CircularProgress, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { blurForNoramlUsers, formatNumber, onlyAdmin, toFixed } from "../constants";
import counting from "./../../assets/images/counting.png";
import reduction from "./../../assets/images/reduction.png";
import vat from "./../../assets/images/vat.png";
import profit from "./../../assets/images/profit.png";
import discount from "./../../assets/images/discount.png";
import discount2 from "./../../assets/images/discount2.png";
import paid from "./../../assets/images/paid.png";
import { Deposit, DepositItem, DrugItem, PharmacyLayoutPros } from "../../types/pharmacy";
import { User } from "../../types/Patient";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";

interface InvoiceSummaryProps {
  selectedDeposit: Deposit;
  user: User;
  summeryIsLoading: boolean;
  setSelectedDeposit: (deposit: Deposit) => void;
}
function InvoiceSummary({
  user,
  summeryIsLoading,
}: InvoiceSummaryProps) {

  const {selectedInvoice:selectedDeposit,setSelectedInvoice}= useOutletContext<PharmacyLayoutPros>()
  const [summeryItems,setSummeryItems] = useState<DepositItem[]>([])
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      setLoading(true);
    axiosClient
      .get<Deposit>(`getDepositWithItems/${selectedDeposit?.id}`)
      .then(({ data }) => {
        setSummeryItems(data.items);
      }).finally(() => {
        setLoading(false);
      });
  },[selectedDeposit?.showAll]);


  console.log(selectedDeposit, "selected Deposit");
  let count = summeryItems?.filter((depositItem) => {
    if (selectedDeposit.showAll == 0) {
      return depositItem.quantity > 0;
    } else {
      return depositItem.quantity >= 0;;
    }
  }).length;

  let filteredItems = summeryItems?.filter((depositItem) => {
    if (selectedDeposit.showAll == 0) {
      return depositItem.quantity > 0;
    } else {
      return depositItem.quantity >= 0;;
    }
  });

  const CalcCostBefore = () => {
    return filteredItems.reduce((prev, curr) => {
      return prev + curr.cost * curr.quantity;
    }, 0);
  };

  const CalcRetail = () => {
    return filteredItems.reduce((prev, curr) => {
      return prev + curr.sell_price * curr.quantity;
    }, 0);
  };

  const CalcTax = () => {
    return filteredItems.reduce((prev, curr) => {
      return prev + (curr.cost * curr.quantity * curr.vat_cost) / 100;
    }, 0);
  };
  const calcDiscount = () => {
    return (selectedDeposit?.discount * CalcCostBefore()) / 100;
  };
  return (
    <Stack direction={"row"} alignItems={"center"} gap={1}>
      {summeryIsLoading ? (
        <Skeleton height={200} width={"87%"} />
      ) : (
        <>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={counting} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {count}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                عدد
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={reduction} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {formatNumber( CalcCostBefore()) }
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                التكلفه
              </span>
            </Stack>
          </Card>
          {/* <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}> */}
            {/* <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={vat} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {toFixed(CalcTax(), 3)}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                ج.ضريبه
              </span>
            </Stack> */}
          {/* </Card> */}
          {/* <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={reduction} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {toFixed(CalcCostBefore() + CalcTax(), 3)}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                التكلفه بعد
              </span>
            </Stack>
          </Card> */}
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700 ${onlyAdmin(
                user?.id,
                blurForNoramlUsers
              )}`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={profit} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {formatNumber( CalcRetail())}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                المبيعات
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700 ${onlyAdmin(
                user?.id,
                blurForNoramlUsers
              )}`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={profit} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {formatNumber( CalcRetail() - CalcCostBefore())}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                الارباح
              </span>
            </Stack>
          </Card>
          {/* <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={discount} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {selectedDeposit?.discount}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                الخصم نسبه
              </span>
            </Stack>
          </Card> */}
          {/* <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={discount2} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {toFixed(calcDiscount(), 3)}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                الخصم
              </span>
            </Stack>
          </Card> */}
          {/* <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{
                p: 1,
                color: "black",
                fontSize: "large",
                position: "relative",
              }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={paid} />
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "45px",
                }}
              >
                {toFixed(CalcCostBefore() - calcDiscount(), 3)}
              </span>
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  position: "absolute",
                  top: "62px",
                }}
              >
                {" "}
                ج.تكلفه
              </span>
              {loading && <CircularProgress/>}

            </Stack>
          </Card> */}
        </>
      )}
    </Stack>
  );
}

export default InvoiceSummary;
