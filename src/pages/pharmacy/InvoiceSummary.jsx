import { Card, Skeleton, Stack } from "@mui/material";
import React from "react";
import { blurForNoramlUsers, onlyAdmin, toFixed } from "../constants";
import counting from "./../../assets/images/counting.png";
import reduction from "./../../assets/images/reduction.png";
import vat from "./../../assets/images/vat.png";
import profit from "./../../assets/images/profit.png";
import discount from "./../../assets/images/discount.png";
import discount2 from "./../../assets/images/discount2.png";
import paid from "./../../assets/images/paid.png";
function InvoiceSummary({ selectedDeposit, user,summeryIsLoading }) {
console.log(selectedDeposit,'selected Deposit')
  let count =   
        selectedDeposit?.items?.filter((depositItem) => {
          if (selectedDeposit.showAll == 0) {
            return depositItem.quantity > 0;
          } else {
            return depositItem.quantity == 0;
          }
        }).length

        let filteredItems = selectedDeposit?.items?.filter((depositItem) => {
            if (selectedDeposit.showAll == 0) {
              return depositItem.quantity > 0;
            } else {
              return depositItem.quantity == 0;
            }
          })


          const CalcCostBefore = ()=>{
           return  filteredItems.reduce((prev,curr)=>{
                   return prev + (curr.cost  * curr.quantity)
            },0)
          }
          
          const CalcRetail = ()=>{
            return  filteredItems.reduce((prev,curr)=>{
                    return prev + (curr.sell_price  * curr.quantity)
             },0)
           }

          const CalcTax = ()=>{
            return  filteredItems.reduce((prev,curr)=>{
                    return prev + (curr.cost * curr.quantity) * curr.vat_cost / 87
             },0)
           }
       const calcDiscount = ()=>{
        return selectedDeposit?.discount * CalcCostBefore()/ 87
       }
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
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={counting} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {
                 count
                }
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                عدد 
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={reduction} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {toFixed(CalcCostBefore() ?? 0, 3)}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                {" "}
                 التكلفه
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={vat} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {toFixed(CalcTax(), 3)}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                {" "}
                 ج.ضريبه
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={reduction} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {toFixed(CalcCostBefore() + CalcTax()  , 3)}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                {" "}
                التكلفه بعد
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
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={profit} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {toFixed(CalcRetail(), 3)}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
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
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={profit} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {toFixed(CalcRetail() - CalcCostBefore(), 3)}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                {" "}
                 الارباح
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={discount} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {selectedDeposit?.discount}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                {" "}
                الخصم نسبه
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={discount2} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {toFixed(calcDiscount(),3)}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                {" "}
                الخصم 
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 87, width: 87 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={30} src={paid} />
              <span style={{ color: "black", fontSize: "16px" }}>
                {toFixed(
                  CalcCostBefore() - calcDiscount(),
                  3
                )}
              </span>
              <span style={{ color: "black", fontSize: "16px" }}>
                {" "}
                 ج.تكلفه
              </span>
            </Stack>
          </Card>
        </>
      )}
    </Stack>
  );
}

export default InvoiceSummary;
