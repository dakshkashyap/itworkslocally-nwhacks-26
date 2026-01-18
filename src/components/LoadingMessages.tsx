import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const loadingMessages = [
  "Asking Stack Overflow...",
  "Blaming the intern...",
  "Checking if you tried turning it off and on...",
  "Consulting the rubber duck...",
  "Reading the docs (just kidding)...",
  "Deleting node_modules...",
  "Running npm install (again)...",
  "Checking if it's a DNS issue...",
  "Praying to the deployment gods...",
  "Adding more console.logs...",
  "Googling the error message...",
  "Checking if prod has the .env...",
];

interface LoadingMessagesProps {
  isLoading: boolean;
}

const LoadingMessages = ({ isLoading }: LoadingMessagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-12"
    >
      {/* Animated loading spinner */}
      <div className="relative w-24 h-24 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary/70 border-l-primary/30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🔍</span>
        </div>
      </div>

      {/* Loading message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-lg text-muted-foreground"
        >
          {loadingMessages[currentIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-48 h-1 mt-6 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full origin-left"
      />
    </motion.div>
  );
};

export default LoadingMessages;
