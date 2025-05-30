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
import ProtectedRoute from './components/pages/route/protected-route';
import PublicRoute from './components/pages/route/public-route';
import SignIn from './components/pages/signin/signin';


const App: React.FC = () => {
  return (
    <ChakraProvider>
      <main className="h-screen w-full">
        <Router>
          <Routes>

            <Route element={<RootLayout />}>              
                <Route path="/" element={<ProtectedRoute><DashboardContent /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
                <Route path="/voucher" element={<ProtectedRoute><VoucherPage /></ProtectedRoute>} />
                <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />                
          </Route>           
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
          </Routes>
        </Router>
      </main>
    </ChakraProvider>
  );
};

export default App;
