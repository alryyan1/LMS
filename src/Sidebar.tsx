import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import BiotechIcon from "@mui/icons-material/Biotech";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BadgeDollarSign,
  Calendar,
  CircleGauge,
  DollarSign,
  Eye,
  Gift,
  HandPlatter,
  Pencil,
  Pill,
  Settings,
  Syringe,
  User,
} from "lucide-react";
import {
  AddShoppingCart,
  Category,
  DeviceHub,
  FormatListBulleted,
  PriceChange,
  ReceiptLong,
  Storefront,
  StairsOutlined,
  Report,
  Feed,
  CardMembership,
  AttachMoney,
  CurrencyExchange,
  People,
  Gif,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useStateContext } from "./appContext";
import { useTranslation } from "react-i18next";

function SidebarNav() {
  const { t } = useTranslation("sidebar");
  const [collapsed, setCollapsed] = useState(true);
  const { user } = useStateContext();
  console.log(user, "user in sidebar");
  const [selected, setSelected] = useState(""); // Track the selected menu item

  const handleMenuItemClick = (menuItem) => {
    setSelected(menuItem); // Update selected menu item
  };
  const menuItems = [
    { id: 1, title: "تعريف منتج", icon: <Pencil /> },
    { id: 1, title: "قائمه المنتجات", icon: <Category /> },
    { id: 1, title: "المبيعات", icon: <BadgeDollarSign /> },
    { id: 1, title: "المخزون", icon: <Storefront /> },
    { id: 1, title: "نافذه البيع", icon: <AddShoppingCart /> },
    { id: 1, title: "المشتروات ", icon: <StairsOutlined /> },
    { id: 1, title: "تسجيل", icon: <Pencil /> },
    { id: 1, title: "عينات ", icon: <Syringe /> },
    { id: 1, title: "نتائج", icon: <ReceiptLong /> }, //8
    { id: 1, title: "الاسعار", icon: <PriceChange /> },
    { id: 1, title: "الاعدادات ", icon: <Settings /> },
    { id: 1, title: "الربط ", icon: <DeviceHub /> },
    { id: 1, title: "CircleGauge ", icon: <CircleGauge /> }, //12
    { id: 1, title: "HandPlatter ", icon: <HandPlatter /> }, //13
    { id: 1, title: "User ", icon: <User /> }, //14
    { id: 1, title: "Activity ", icon: <Activity /> }, //15
    { id: 1, title: "Eye ", icon: <Eye /> }, //16
    { id: 1, title: "Feed ", icon: <Feed /> }, //17
    { id: 1, title: "CardMembership ", icon: <CardMembership /> }, //18
    { id: 1, title: "AttachMoney ", icon: <AttachMoney /> }, //19
    { id: 1, title: "Calendar ", icon: <Calendar /> }, //20
    { id: 1, title: "CurrencyExchange ", icon: <CurrencyExchange /> }, //21
  ];

  return (
    <Sidebar collapsed={collapsed}>
      <div style={{ padding: "10px", textAlign: "center" }}>
        <IconButton
          color={user?.isAdmin ? "primary" : ""}
          onClick={() => setCollapsed(!collapsed)}
        >
          <FormatListBulleted />
        </IconButton>
      </div>
       <Menu>
        <SubMenu 
          style={{ justifyContent: "center" }}
          icon={<People />}
          label={t("Clinic")}
        >
          {user?.sub_routes
            ?.filter((s) => {
              return s.sub_route.route_id == 5;
            })
            .map((r) => {
              return (
                <MenuItem
                  style={{ justifyContent: "center" }}
                  icon={menuItems[r.sub_route.icon].icon}
                  component={<Link to={r.sub_route.path}></Link>}
                  key={r.sub_route.id}
                >
                  {t(`${r.sub_route.name}`)}
                </MenuItem>
              );
            })}
        </SubMenu>

        <SubMenu
          style={{ justifyContent: "center" }}
          icon={<BiotechIcon />}
          label={t("Lab")}
        >
          {user?.sub_routes
            ?.filter((s) => {
              return s.sub_route.route_id == 4;
            })
            .map((r) => {
              return (
                <MenuItem
                  style={{ justifyContent: "center" }}
                  icon={menuItems[r.sub_route.icon].icon}
                  component={<Link to={r.sub_route.path}></Link>}
                  key={r.sub_route.id}
                >
                  {t(`${r.sub_route.name}`)}
                </MenuItem>
              );
            })}
        </SubMenu>
        <SubMenu
          style={{ justifyContent: "center" }}
          icon={<Pill />}
          label={t("Pharmacy")}
        >
          {user?.sub_routes
            ?.filter((s) => {
              return s.sub_route.route_id == 2;
            })
            .map((r) => {
              return (
                <MenuItem
                  style={{ justifyContent: "center" }}
                  icon={menuItems[r.sub_route.icon].icon}
                  component={<Link to={r.sub_route.path}></Link>}
                  key={r.sub_route.id}
                >
                  {t(`${r.sub_route.name}`)}
                </MenuItem>
              );
            })}
        </SubMenu>

        <SubMenu
          style={{ justifyContent: "center" }}
          icon={<Settings />}
          label={t("Settings")}
        >
          {user?.sub_routes
            ?.filter((s) => {
              return s.sub_route.route_id == 8;
            })
            .map((r) => {
              return (
                <MenuItem
                  style={{ justifyContent: "center" }}
                  icon={menuItems[r.sub_route.icon].icon}
                  component={<Link to={r.sub_route.path}></Link>}
                  key={r.sub_route.id}
                >
                  {t(`${r.sub_route.name}`)}
                </MenuItem>
              );
            })}
        </SubMenu>

        <SubMenu
          style={{ justifyContent: "center" }}
          icon={<CardMembership />}
          label={t("Insurance")}
        >
          {user?.sub_routes
            ?.filter((s) => {
              return s.sub_route.route_id == 6;
            })
            .map((r) => {
              return (
                <MenuItem
                  style={{ justifyContent: "center" }}
                  icon={menuItems[r.sub_route.icon].icon}
                  component={<Link to={r.sub_route.path}></Link>}
                  key={r.sub_route.id}
                >
                  {t(`${r.sub_route.name}`)}
                </MenuItem>
              );
            })}
        </SubMenu>
        <SubMenu
          style={{ justifyContent: "center" }}
          icon={<DollarSign />}
          label={t("finance")}
        >
          {user?.sub_routes
            ?.filter((s) => {
              return s.sub_route.route_id == 12;
            })
            .map((r) => {
              return (
                <MenuItem
                  style={{ justifyContent: "center" }}
                  icon={menuItems[r.sub_route.icon].icon}
                  component={<Link to={r.sub_route.path}></Link>}
                  key={r.sub_route.id}
                >
                  {t(`${r.sub_route.name}`)}
                </MenuItem>
              );
            })}
        </SubMenu>
        <SubMenu
          style={{ justifyContent: "center" }}
          icon={<CircleGauge />}
          label={t("Main")}
        >
          {user?.routes
            ?.filter((s) => {
              return s.route.is_multi == 0;
            })
            .map((r) => {
              return (
                <MenuItem
                  style={{ justifyContent: "center" }}
                  onClick={() => handleMenuItemClick(r.route.name)}
                  className={
                    selected === r.route.name ? "active-menu-item" : ""
                  }
                  icon={menuItems[r.route.icon].icon}
                  component={<Link to={r.route.path}></Link>}
                  key={r.id}
                >
                  {t(`${r.route.name}`)}
                </MenuItem>
              );
            })}
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}

export default SidebarNav;
