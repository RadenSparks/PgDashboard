import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import { ChakraProvider } from '@chakra-ui/react';
import CategoriesPage from './components/pages/categories/CategoriesPage';
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
import SignUp from './components/pages/signup/signup';
import CommentsPage from './components/pages/comments/CommentsPage';
import PermissionPage from './components/pages/permission/PermisionPage';
import TagsPage from './components/pages/tags/TagsPage';
import { initialUsers, type User } from './components/pages/users/usersData';
import MediaManager from './components/pages/media/MediaManager';
import CollectionsPage from './components/pages/collections/CollectionsPage';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

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
              <Route path="/permission" element={<ProtectedRoute><PermissionPage users={users} setUsers={setUsers} /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UsersPage users={users} setUsers={setUsers} /></ProtectedRoute>} />
              <Route path="/comments" element={<ProtectedRoute><CommentsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
              <Route path="/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
            </Route>
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          </Routes>
        </Router>
      </main>
    </ChakraProvider>
  );
};

export default App;
