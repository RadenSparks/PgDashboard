import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import DashboardContent from "./pages/DashboardContent";
import ChakraProvider from './components/ui/provider';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <main className="h-screen w-full">
        <Router>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<DashboardContent />} />
            </Route>
          </Routes>
        </Router>
      </main>
    </ChakraProvider>
  );
};

export default App;
