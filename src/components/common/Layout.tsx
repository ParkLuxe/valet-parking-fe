/**
 * Enhanced Main Layout Component
 * Features responsive design with glassmorphism and smooth transitions
 */

import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

export interface LayoutProps {
  children?: any;
}

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 pt-24"
        >
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] rounded-tl-[20px] rounded-bl-[20px] p-6 min-h-[calc(100vh-6rem)] shadow-2xl">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
