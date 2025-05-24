import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Brands from "./pages/Brands";
import Products from "./pages/products";
import Providers from "./pages/providers";
import Header from "./components/Header"; // Asegúrate que la ruta sea correcta

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Aparece en todas las páginas */}
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/products" element={<Products />} />
        <Route path="/providers" element={<Providers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
