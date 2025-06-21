// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./views/navegacion/Sidebar";
import Articulos from "./views/Articulos/Articulos";
import AltaArticulo from "./views/Articulos/AltaArticulo";
import EditarArticulo from "./views/Articulos/EditarArticulo";
import Proveedores from "./views/Proveedores/Proveedores";
import AltaProveedor from "./views/Proveedores/AltaProveedor";
import EditarProveedor from "./views/Proveedores/EditarProveedor";
import OrdenesCompra from "./views/OrdenDeCompra/OrdenesCompra";
import AltaOrdenCompra from "./views/OrdenDeCompra/AltaOrdenCompra";
import EditarOrdenCompra from "./views/OrdenDeCompra/EditarOrdenCompra";
import EliminarOrdenCompra from "./views/OrdenDeCompra/EliminarOrdenCompra";
import Ventas from "./views/Ventas/Ventas";
import AltaVenta from "./views/Ventas/AltaVenta";

import "./App.css";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "2rem" }}>
          <Routes>
            <Route path='/' element={<Navigate to='/articulos' />} />
            
            {/* Rutas de Artículos */}
            <Route path='/articulos' element={<Articulos />} />
            <Route path='/articulos/nuevo' element={<AltaArticulo />} />
            <Route path='/articulos/editar/:codigo' element={<EditarArticulo />} />
            
            {/* Rutas de Proveedores */}
            <Route path='/proveedores' element={<Proveedores />} />
            <Route path='/proveedores/alta' element={<AltaProveedor />} />
            <Route path='/proveedores/editar/:id' element={<EditarProveedor />} />
            
            {/* Rutas de Órdenes de Compra */}
            <Route path='/ordenes-compra' element={<OrdenesCompra />} />
            <Route path='/ordenes-compra/alta' element={<AltaOrdenCompra />} />
            <Route path='/ordenes-compra/editar/:id' element={<EditarOrdenCompra />} />
            <Route path='/ordenes-compra/eliminar/:id' element={<EliminarOrdenCompra />} />
            
            {/* Rutas de Ventas */}
            <Route path='/ventas' element={<Ventas />} />
            <Route path='/ventas/alta' element={<AltaVenta />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
