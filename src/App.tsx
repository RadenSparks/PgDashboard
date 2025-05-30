import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import DashboardContent from "./pages/DashboardContent";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import VoucherPage from "./pages/VoucherPage";
import PostsPage from "./pages/PostsPage";
import OrdersPage from "./pages/OrdersPage";
import ContactsPage from "./pages/ContactsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import ChakraProvider from './components/ui/provider';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <main className="h-screen w-full">
        <Router>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/voucher" element={<VoucherPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </main>
    </ChakraProvider>
  );
};

export default App;
