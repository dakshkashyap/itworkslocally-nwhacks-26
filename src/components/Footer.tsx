import { Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="border-t border-border/50 bg-card/50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              Built at{" "}
              <span className="text-primary font-semibold">nwHacks 2026</span>
            </span>
          </div>

          {/* Center */}
          <p className="font-mono text-xs text-muted-foreground text-center">
            No bugs were fixed in the making of this website{" "}
            <span className="text-primary">(ironic)</span>
          </p>

          {/* Right - Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
