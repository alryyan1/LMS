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
                    return prev + (curr.cost * curr.quantity) * curr.vat_cost / 100
             },0)
           }
       const calcDiscount = ()=>{
        return selectedDeposit?.discount * CalcCostBefore()/ 100
       }
  return (
    <Stack direction={"row"} alignItems={"center"} gap={2}>
      {summeryIsLoading ? (
        <Skeleton height={200} width={"100%"} />
      ) : (
        <>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={50} src={counting} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {
                 count
                }
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                عدد الاصناف
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={50} src={reduction} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {toFixed(CalcCostBefore() ?? 0, 3)}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                التكلفه قبل
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={50} src={vat} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {toFixed(CalcTax(), 3)}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                اجمالي الضريبه
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={50} src={reduction} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {toFixed(CalcCostBefore() + CalcTax()  , 3)}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                التكلفه بعد
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
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
              <img width={50} src={profit} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {toFixed(CalcRetail(), 3)}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                 المبيعات
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
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
              <img width={50} src={profit} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {toFixed(CalcRetail() - CalcCostBefore(), 3)}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                 الارباح
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={50} src={discount} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {selectedDeposit?.discount}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                الخصم نسبه
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={50} src={discount2} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {toFixed(calcDiscount(),3)}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                الخصم ريال
              </span>
            </Stack>
          </Card>
          <Card sx={{ backgroundColor: "#ffffff73", height: 142, width: 142 }}>
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              className={` hover:bg-sky-700`}
              sx={{ p: 1, color: "black", fontSize: "large" }}
              direction={"column"}
              gap={1}
            >
              <img width={50} src={paid} />
              <span style={{ color: "black", fontSize: "20px" }}>
                {toFixed(
                  CalcCostBefore() - calcDiscount(),
                  3
                )}
              </span>
              <span style={{ color: "black", fontSize: "20px" }}>
                {" "}
                التكلفه النهائيه
              </span>
            </Stack>
          </Card>
        </>
      )}
    </Stack>
  );
}

export default InvoiceSummary;
