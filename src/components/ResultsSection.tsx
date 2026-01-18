import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Lightbulb, Volume2, VolumeX, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AnalysisResult {
  whatWentWrong: string;
  howToFix: string[];
  preventionTips: string[];
}

interface ResultsSectionProps {
  results: AnalysisResult | null;
  onPlayAudio: () => void;
  isPlaying: boolean;
}

const ResultsSection = ({ results, onPlayAudio, isPlaying }: ResultsSectionProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!results) return null;

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!", {
      description: "Solution copied successfully",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text font-mono">Analysis Results</h2>
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
              Listen to explanation
            </>
          )}
        </motion.button>
      </div>

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
