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

import "./App.css";
import EditarArticulo from "./views/Articulos/EditarArticulo";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "2rem" }}>
          <Routes>
            <Route path='/' element={<Navigate to='/articulos' />} />
            <Route path='/articulos' element={<Articulos />} />
            <Route path='/articulos/nuevo' element={<AltaArticulo />} />
            <Route path='/proveedores' element={<div>Proveedores</div>} />
            <Route path='/ordenes' element={<div>Órdenes de compra</div>} />
            <Route path='/ventas' element={<div>Ventas</div>} />
            <Route
              path='/articulos/editar/:codigo'
              element={<EditarArticulo />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
