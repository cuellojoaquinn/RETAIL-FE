import "./Sidebar.css";
import {
  MdShoppingCart,
  MdInventory,
  MdPeopleAlt,
  MdRequestQuote,
} from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: <MdRequestQuote />, label: "Orden de compra", path: "/orden-compra" },
    { icon: <MdPeopleAlt />, label: "Proveedores", path: "/proveedores" },
    { icon: <MdInventory />, label: "Articulos", path: "/articulos" },
    { icon: <MdShoppingCart />, label: "Ventas", path: "/ventas" },
  ];

  return (
    <div className='sidebar'>
      {items.map((item) => (
        <div
          key={item.label}
          className={`sidebar-item ${
            location.pathname.startsWith(item.path) ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
