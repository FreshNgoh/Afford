import React from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useAuth } from "./authProvider";

const Navbar = ({ isTopOfPage }) => {
  const links = [
    { href: "#", label: "Home" },
    { href: "#service", label: "Service" },
    { href: "#planningContent", label: "Plan" },
    { href: "#contact", label: "Contact" },
  ];

  const navBarBackground = isTopOfPage
    ? "bg-transparent"
    : "bg-blue-600 drop-shadow";

  const { isAuthenticated, user } = useAuth();

  return (
    <nav
      className={`w-full fixed top-0 px-6 z-20 transition-colors duration-300 ${navBarBackground}`}
    >
      <ul className="flex justify-between items-center py-3 text-xl font-pt-sans text-white">
        <a href="#" className="font-bold italic ">
          AFFORD
        </a>
        <div className="flex space-x-20">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-green-400"
            >
              {link.label}
            </a>
          ))}
        </div>
        {isAuthenticated ? (
          <>
            <Link to={`/user/dashboard/${user.id}`}>
              <CgProfile className="w-8 h-8 hover:text-green-400" />
            </Link>
          </>
        ) : (
          <Link to="/login">
            <CgProfile className="w-8 h-8 hover:text-red-500" />
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
