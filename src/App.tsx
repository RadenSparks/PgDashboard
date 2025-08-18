import React from 'react';
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
import CommentsPage from './components/pages/comments/CommentsPage';
import PermissionPage from './components/pages/permission/PermisionPage';
import { useState } from 'react';
import TagsPage from './components/pages/tags/TagsPage';
import MediaManager from './components/pages/media/MediaManager';
import CollectionsPage from './components/pages/collections/CollectionsPage';
import PublishersPage from './components/pages/publishers/PublishersPage';
import FeedbackRefundPage from './components/pages/feedback/FeedbackRefundPage';
import type { User } from '../src/redux/api/usersApi';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<ProtectedRoute><DashboardContent /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
            <Route path="/voucher" element={<ProtectedRoute><VoucherPage /></ProtectedRoute>} />
            <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
            <Route path="/permission" element={<ProtectedRoute><PermissionPage users={users} setUsers={setUsers} /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardContent /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
            <Route path="/media" element={<ProtectedRoute><MediaManager /></ProtectedRoute>} />
            <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
            <Route path="/comments" element={<ProtectedRoute><CommentsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
            <Route path="/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
            <Route path="/media" element={<ProtectedRoute><MediaManager /></ProtectedRoute>} />
            <Route path="/publishers" element={<ProtectedRoute><PublishersPage /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackRefundPage /></ProtectedRoute>} />
          </Route>
          <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
