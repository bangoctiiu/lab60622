import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';
import Topbar from '../layout/Topbar';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile-first layout for Portal (Tenant) */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <main className="flex-1 overflow-x-hidden pt-4 pb-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
