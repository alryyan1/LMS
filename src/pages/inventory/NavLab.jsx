import { NavLink } from "react-router-dom";

function NavLab() {

  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"/laboratory/add"}>تسجيل مريض</NavLink>
        <NavLink to={"/laboratory/tests"}>اداره التحاليل</NavLink>
        <NavLink to={"/laboratory/tests"}>ادخال النتائج </NavLink>
        <NavLink to={"/laboratory/tests"}>سحب العينات </NavLink>
        <NavLink to={"/laboratory/tests"}>المرضي</NavLink>
      </ul>

    </>
  );
}

export default NavLab;
