import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        {/* 404 with glitch effect */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold font-mono leading-none gradient-text">
            404
          </h1>
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 text-[150px] md:text-[200px] font-bold font-mono leading-none text-primary/30 translate-x-1"
          >
            404
          </motion.div>
        </div>

        {/* Terminal-style message */}
        <div className="glass-card rounded-xl p-6 max-w-md mx-auto mb-8">
          <div className="flex items-center gap-2 mb-4 text-left">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="font-mono text-xs text-muted-foreground ml-2">terminal</span>
          </div>
          <div className="text-left font-mono text-sm space-y-2">
            <p className="text-muted-foreground">
              <span className="text-success">$</span> curl this-page
            </p>
            <p className="text-destructive">
              Error: Page not found in production
            </p>
            <p className="text-muted-foreground">
              <span className="text-success">$</span> <span className="text-primary">_</span>
            </p>
          </div>
        </div>

        {/* Message */}
        <p className="text-xl text-muted-foreground mb-8 font-mono">
          This page works locally, we promise! 😅
        </p>

        {/* Back home button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-glow font-mono font-bold text-primary-foreground"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
