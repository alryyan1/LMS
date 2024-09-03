import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "./appContext";
import { useThemeContext } from "./ThemeContext";
import { useTranslation } from "react-i18next";
import { IconButton, CircularProgress, Snackbar } from "@mui/material";
import { Language, Brightness4 as Brightness4Icon } from "@mui/icons-material";
import UserDropDown from "./components/UserDropDown";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "/src/components/ui/navigation-menu";
import { Button } from "/src/components/ui/button";

const NewNavbar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setToken, setUser } = useStateContext();
  const { setMode, mode } = useThemeContext();
  const { i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/user")
      .then(({ data }) => setUser(data))
      .catch((err) => setError("Failed to fetch user data"))
      .finally(() => setLoading(false));
  }, [setUser]);

  const logoutHandler = () => {
    setLoading(true);
    axiosClient
      .post("logout")
      .then(() => {
        setToken(null);
        setUser(null);
      })
      .catch((err) => setError("Logout failed"))
      .finally(() => setLoading(false));
  };

  const changeLang = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const changeMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  const dropdownStyles =
    "grid gap-3 p-6 bg-white shadow-lg rounded-md w-[300px] lg:w-[400px] transition-all duration-300 transform ease-in-out opacity-100";

  const pharmacyMenuItems = [
    { path: "/pharmacy/add", label: "تعريف المنتج" },
    { path: "/pharmacy/sell", label: "نافذة البيع" },
    { path: "/pharmacy/items", label: "قائمة المنتجات" },
    { path: "/pharmacy/reports", label: "المبيعات" },
    { path: "/pharmacy/quantities", label: "حركة المخزون" },
    { path: "/pharmacy/deposit", label: "فاتورة وارد جديد" },
    { path: "/clinic/denos", label: "المصروفات" },
  ];

  const laboratoryMenuItems = [
    { path: "/laboratory/add", label: "التسجيل" },
    { path: "/laboratory/result", label: "إدخال النتائج" },
    { path: "/laboratory/sample", label: "سحب العينات" },
    { path: "/laboratory/tests", label: "إدارة التحاليل" },
    { path: "/laboratory/price", label: "قائمة الأسعار" },
    { path: "/laboratory/cbc-lis", label: "CBC LIS" },
    { path: "/laboratory/chemistry-lis", label: "Chemistry LIS" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-gray-100 shadow-md w-full p-2">
      <div className="flex justify-end">
        <div className="w-full rtl" style={{ direction: "rtl" }}>
          {/* Navigation Menu */}
          <NavigationMenu className="text-right">
            <NavigationMenuList className="flex flex-row-reverse space-x-reverse space-x-4">
              <NavigationMenuItem>
                <NavLink
                  to="/dashboard"
                  className="font-semibold hover:text-blue-500"
                >
                  الرئيسية
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/inventory"
                  className="font-semibold hover:text-blue-500"
                >
                  المخزن
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/audit"
                  className="font-semibold hover:text-blue-500"
                >
                  التدقيق
                </NavLink>
              </NavigationMenuItem>

              {/* Pharmacy Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  الصيدلية
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className={dropdownStyles}>
                    {pharmacyMenuItems.map((item) => (
                      <li key={item.path}>
                        <NavLink to={item.path} className="hover:text-blue-500">
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Laboratory Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  المختبر
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className={dropdownStyles}>
                    {laboratoryMenuItems.map((item) => (
                      <li key={item.path}>
                        <NavLink to={item.path} className="hover:text-blue-500">
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Other Menu Items */}
              <NavigationMenuItem>
                <NavLink
                  to="/insurance"
                  className="font-semibold hover:text-blue-500"
                >
                  التعاقدات
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/services"
                  className="font-semibold hover:text-blue-500"
                >
                  الخدمات
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/settings"
                  className="font-semibold hover:text-blue-500"
                >
                  الاعدادات
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <UserDropDown user={user} />
              </NavigationMenuItem>

              {/* Language and Theme Toggles */}
              <NavigationMenuItem>
                <IconButton title="language" onClick={changeLang}>
                  <Language />
                </IconButton>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <IconButton title="theme" onClick={changeMode}>
                  <Brightness4Icon />
                </IconButton>
              </NavigationMenuItem>

              {/* Logout Button */}
              <NavigationMenuItem>
                <Button
                  onClick={logoutHandler}
                  className="flex items-center space-x-2 font-semibold hover:text-red-500 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-7.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15M9 12h12m0 0l-3-3m3 3l-3 3"
                        />
                      </svg>
                      <span>تسجيل الخروج</span>
                    </>
                  )}
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Error Notification */}
          {error && (
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={() => setError(null)}
              message={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewNavbar;
