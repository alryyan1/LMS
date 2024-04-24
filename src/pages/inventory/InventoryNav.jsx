import { Link, NavLink, Outlet } from "react-router-dom";

function InventoryNav() {
  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"client/create"}>
          انشاءعميل جديد
        </NavLink>

        <NavLink to={"supplier/create"}>
          انشاء مورد جديد
        </NavLink>
        <NavLink to={"item/create"}>
          انشاء صنف جديد
        </NavLink>
        <NavLink to={"section/create"}>
          انشاء قسم جديد
        </NavLink>
        <NavLink to={"income/create"}>
          اذن وارد
        </NavLink>
        <NavLink to={"section/create"}>
اذن منصرف        
</NavLink>
        <NavLink to={"section/create"}>
        المخزون
        </NavLink>
      </ul>
      

      <div>{<Outlet></Outlet>}</div>
    </>
  );
}

export default InventoryNav;
