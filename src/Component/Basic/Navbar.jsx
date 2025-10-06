import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
    <h1 className="text-2xl font-bold">MyLanding</h1>
    <ul className="flex space-x-6">
      <li><NavLink to="/" className={({isActive}) => isActive ? "text-yellow-300" : "hover:text-yellow-300"}>Home</NavLink></li>
      <li><NavLink to="/about" className={({isActive}) => isActive ? "text-yellow-300" : "hover:text-yellow-300"}>About</NavLink></li>
      <li><NavLink to="/services" className={({isActive}) => isActive ? "text-yellow-300" : "hover:text-yellow-300"}>Services</NavLink></li>
      <li><NavLink to="/contact" className={({isActive}) => isActive ? "text-yellow-300" : "hover:text-yellow-300"}>Contact</NavLink></li>
    </ul>
  </nav>
);

export default Navbar;
