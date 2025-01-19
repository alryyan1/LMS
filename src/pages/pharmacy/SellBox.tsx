import { FavoriteBorder, Lock } from "@mui/icons-material";
import { Badge, Box, Grow, Icon } from "@mui/material";
import "animate.css";
import axiosClient from "../../../axios-client";
import { Deduct } from "../../types/Shift";
import { useEffect } from "react";
interface SellboxProbs {
  onClick: (sell: any) => void;
  sell: any;
  index: number;
  activeSell: Deduct;
  setActiveSell: (sell: any) => void;
  update: (sell: any) => void;
}
function SellBox({
  onClick,
  sell,
  index,
  activeSell,
  setActiveSell,
  update,
}: SellboxProbs) {
  // useEffect(() => {
  //   const controller = new AbortController();
  //   axiosClient(`sells/find/${sell.id}`, {
  //     signal: controller.signal,
  //   }).then(({ data }) => {
  //     update(data);
  //   });
  //   return () => controller.abort();
  // }, [activeSell?.id]);

  return (
    <Grow timeout={2000} in>
      {sell.deducted_items.length > 0 ? (
        <Badge
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "bottom",
          }}
          badgeContent={sell.deducted_items.length}
          color={sell.complete == 0 ? "error" : "success"}
        >
          <Box
            style={{
              backgroundColor:
                sell.complete == 1 && activeSell?.id != sell.id
                  ? "#00e676"
                  : "",
            }}
            onClick={() => {
              onClick(sell);
            }}
            sx={
              activeSell?.id == sell.id
                ? {
                    borderBottom: "4px solid blue",
                    fontWeight: "bolder",
                    backgroundColor: (theme) => theme.palette.warning.light,
                  }
                : {}
            }
          >
            {sell.number}
            {sell?.doctorvisit && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "3px",
                  width: "10px",
                }}
              >
                {" "}
                <Icon>
                  <FavoriteBorder />
                </Icon>
              </span>
            )}
          </Box>
        </Badge>
      ) : (
        <Box
          onClick={() => {
            onClick(sell);
            axiosClient(`sells/find/${sell.id}`).then(({ data }) => {
              setActiveSell(data);
            });
          }}
          sx={
            activeSell?.id == sell.id
              ? {
                  borderBottom: "4px solid blue",
                  fontWeight: "bolder",
                  backgroundColor: (theme) => theme.palette.warning.light,
                }
              : {}
          }
        >
          {sell.number}
          {sell.doctorvisit && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "3px",
                width: "10px",
              }}
            >
              {" "}
              <Icon>
                <FavoriteBorder />
              </Icon>
            </span>
          )}
        </Box>
      )}
    </Grow>
  );
}

export default SellBox;
