import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Lightbulb, Volume2, VolumeX, Copy, Check, Share2, MessageSquareQuote, Github, Clock, Tag, Flame } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ErrorCategory } from "@/lib/gemini";

interface AnalysisResult {
  whatWentWrong: string;
  howToFix: string[];
  preventionTips: string[];
  tldr?: string;
  category?: ErrorCategory;
  severity?: "low" | "medium" | "high" | "critical";
  estimatedFixTime?: string;
}

interface ResultsSectionProps {
  results: AnalysisResult | null;
  onPlayAudio: () => void;
  isPlaying: boolean;
}

// Category colors and icons
const categoryStyles: Record<string, { bg: string; text: string; icon: string }> = {
  Environment: { bg: "bg-green-500/20", text: "text-green-400", icon: "🌍" },
  Dependencies: { bg: "bg-blue-500/20", text: "text-blue-400", icon: "📦" },
  Configuration: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: "⚙️" },
  API: { bg: "bg-purple-500/20", text: "text-purple-400", icon: "🔌" },
  Database: { bg: "bg-orange-500/20", text: "text-orange-400", icon: "🗄️" },
  Authentication: { bg: "bg-red-500/20", text: "text-red-400", icon: "🔐" },
  Network: { bg: "bg-cyan-500/20", text: "text-cyan-400", icon: "🌐" },
  Memory: { bg: "bg-pink-500/20", text: "text-pink-400", icon: "💾" },
  Permissions: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "🔒" },
  Build: { bg: "bg-indigo-500/20", text: "text-indigo-400", icon: "🔨" },
};

const severityStyles: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-green-500/20", text: "text-green-400", label: "Low" },
  medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Medium" },
  high: { bg: "bg-orange-500/20", text: "text-orange-400", label: "High" },
  critical: { bg: "bg-red-500/20", text: "text-red-400", label: "Critical" },
};

const ResultsSection = ({ results, onPlayAudio, isPlaying }: ResultsSectionProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedGithub, setCopiedGithub] = useState(false);

  if (!results) return null;

  const categoryStyle = categoryStyles[results.category || "Configuration"] || categoryStyles.Configuration;
  const severityStyle = severityStyles[results.severity || "medium"] || severityStyles.medium;

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!", {
      description: "Solution copied successfully",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAsGithubIssue = async () => {
    const issueBody = `## 🐛 Bug Report: Production Issue

### Problem
${results.whatWentWrong}

### Error Category
- **Type:** ${results.category || "Configuration"}
- **Severity:** ${results.severity || "medium"}
- **Estimated Fix Time:** ${results.estimatedFixTime || "15-30 minutes"}

### Root Cause Analysis
${results.tldr ? `> 💡 **TL;DR:** ${results.tldr}` : ""}

### Steps to Fix
${results.howToFix.map((step, i) => `${i + 1}. ${step}`).join('\\n')}

### Prevention
${results.preventionTips.map(tip => `- ${tip}`).join('\\n')}

---
*Analyzed by [ItWorksLocally.tech](https://itworkslocally.tech) 🚀*`;
    
    await navigator.clipboard.writeText(issueBody);
    setCopiedGithub(true);
    toast.success("GitHub Issue copied!", {
      description: "Paste this in your GitHub issue",
    });
    setTimeout(() => setCopiedGithub(false), 2000);
  };

  const copyAllSolutions = async () => {
    const allText = `🔍 What went wrong:
${results.whatWentWrong}

✅ How to fix it:
${results.howToFix.map((step, i) => `${i + 1}. ${step}`).join('\\n')}

💡 Prevention tips:
${results.preventionTips.map(tip => `• ${tip}`).join('\\n')}

${results.tldr ? `\\n📌 TL;DR: ${results.tldr}` : ''}

---
Analyzed by ItWorksLocally.tech 🚀`;
    
    await navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    toast.success("All solutions copied!", {
      description: "Share with your team or save for later",
    });
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Just debugged my "works locally, fails in prod" issue with AI! 🔧\\n\\nTL;DR: ${results.tldr || results.whatWentWrong.slice(0, 100)}...\\n\\nCheck it out: itworkslocally.tech`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" as const },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mt-12"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold gradient-text font-mono">Analysis Results</h2>
          {/* Category & Severity Badges */}
          <div className="flex items-center gap-2">
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1 ${categoryStyle.bg} ${categoryStyle.text}`}
            >
              <span>{categoryStyle.icon}</span>
              {results.category || "Configuration"}
            </motion.span>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1 ${severityStyle.bg} ${severityStyle.text}`}
            >
              <Flame className="w-3 h-3" />
              {severityStyle.label}
            </motion.span>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1 bg-primary/20 text-primary"
            >
              <Clock className="w-3 h-3" />
              {results.estimatedFixTime || "15-30 min"}
            </motion.span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyAsGithubIssue}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-green-500/20 border border-transparent hover:border-green-500/50 transition-all font-mono text-xs"
          >
            {copiedGithub ? (
              <>
                <Check className="w-4 h-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Github className="w-4 h-4 text-muted-foreground" />
                GitHub Issue
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyAllSolutions}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors font-mono text-xs"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-muted-foreground" />
                Copy All
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnTwitter}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors font-mono text-xs"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAudio}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors font-mono text-sm"
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-primary" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-primary" />
                Listen
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* TL;DR Card - Most shareable! */}
      {results.tldr && (
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="result-card p-6 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <MessageSquareQuote className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-mono font-bold text-lg mb-2 text-primary">
                TL;DR
              </h3>
              <p className="text-foreground leading-relaxed text-lg italic">
                "{results.tldr}"
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* What Went Wrong Card */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="result-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-destructive/10">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono font-bold text-lg mb-2 text-foreground">
              What went wrong
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {results.whatWentWrong}
            </p>
          </div>
        </div>
      </motion.div>

      {/* How to Fix Card */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="result-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-success/10">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono font-bold text-lg mb-4 text-foreground">
              How to fix it
            </h3>
            <div className="space-y-3">
              {results.howToFix.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <span className="step-badge flex-shrink-0">{index + 1}</span>
                  <div className="flex-1 flex items-start justify-between gap-2">
                    <p className="text-muted-foreground pt-1 font-mono text-sm">
                      {step}
                    </p>
                    <button
                      onClick={() => copyToClipboard(step, index)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-secondary transition-all"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prevention Tips Card */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="result-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono font-bold text-lg mb-4 text-foreground">
              Prevention tips
            </h3>
            <ul className="space-y-2">
              {results.preventionTips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-2 text-muted-foreground text-sm"
                >
                  <span className="text-primary mt-1">→</span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsSection;
