import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Order from "./pages/Order";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/customers/:customerId/orders" element={<Order />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
