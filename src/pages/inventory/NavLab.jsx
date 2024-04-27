import { NavLink } from "react-router-dom";

function NavLab() {

  return (
    <>
      <ul className="inventroy-nav">
        <NavLink to={"/laboratory/add"}>Add</NavLink>
        <NavLink to={"/laboratory/tests"}>Tests</NavLink>
      </ul>

    </>
  );
}

export default NavLab;
