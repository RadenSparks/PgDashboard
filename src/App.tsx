import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import { ChakraProvider } from '@chakra-ui/react';
import CategoriesPage from './components/pages/categories/CategoriesPage';
import ContactsPage from './components/pages/contacts/ContactsPage';
import DashboardContent from './components/pages/dashboard/DashboardContent';
import OrdersPage from './components/pages/orders/OrdersPage';
import PostsPage from './components/pages/posts/PostsPage';
import ProductsPage from './components/pages/products/ProductsPage';
import SettingsPage from './components/pages/settings/SettingsPage';
import UsersPage from './components/pages/users/UsersPage';
import VoucherPage from './components/pages/vouchers/VoucherPage';


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
