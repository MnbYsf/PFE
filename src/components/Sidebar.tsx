import { Home, MessageSquare, Shield, Mail, FileText, Settings, ChevronLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "chatbot", icon: MessageSquare, label: "Chatbot" },
    { id: "scan", icon: Shield, label: "Scan Websites" },
    { id: "phishing", icon: Mail, label: "Phishing Analyzer" },
    { id: "reports", icon: FileText, label: "Reports" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Floating Toggle Button - Only visible when sidebar is hidden */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            onClick={() => setIsVisible(true)}
            className="fixed top-6 left-6 z-50 p-3 rounded-xl gradient-primary shadow-glow hover:scale-110 transition-transform"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isVisible && !collapsed && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            className={`glass border-r flex flex-col z-40 ${
              collapsed ? "w-20" : "w-64"
            } fixed lg:sticky top-0 left-0 h-screen`}
            initial={{ x: -300, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              width: collapsed ? 80 : 256,
            }}
            exit={{ 
              x: -300, 
              opacity: 0,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close Button - Only on mobile */}
            <motion.button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors lg:hidden"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Logo */}
            <motion.div 
              className="p-6 border-b"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {!collapsed ? (
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <motion.div 
                    className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-gradient">Cyber Guard</h3>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow mx-auto"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "gradient-primary text-white shadow-glow"
                        : "glass-hover hover:bg-accent"
                    } ${collapsed ? "justify-center" : ""}`}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.1 + index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      x: collapsed ? 0 : 5,
                      transition: { type: "spring", stiffness: 400, damping: 20 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      whileHover={{ rotate: isActive ? 0 : 15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </nav>

            {/* Collapse Toggle */}
            <motion.button
              onClick={() => setCollapsed(!collapsed)}
              className="p-4 border-t flex items-center justify-center hover:bg-accent transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
