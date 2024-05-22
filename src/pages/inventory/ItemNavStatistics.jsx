import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function ItemNavStatistics() {
  return (
    <>
    <ul className="inventroy-nav">
      <NavLink to={"line"}>الرسم الخطي</NavLink>
      <NavLink to={"pie"}>الرسم باي </NavLink>

    </ul>
    <Outlet/>
    </>
  )
}

export default ItemNavStatistics