import { motion } from "framer-motion";
import { Code, Server, Laptop, Sparkles } from "lucide-react";
import { useState } from "react";

interface DebugFormProps {
  onSubmit: (data: {
    errorCode: string;
    localEnv: string;
    prodEnv: string;
    difficulty: string;
  }) => void;
  isLoading: boolean;
}

const difficultyLevels = [
  { id: "junior", label: "Junior Dev", emoji: "🐣" },
  { id: "senior", label: "Senior Dev", emoji: "🦅" },
  { id: "intern", label: "Intern who just mass-applied", emoji: "💀" },
];

const DebugForm = ({ onSubmit, isLoading }: DebugFormProps) => {
  const [errorCode, setErrorCode] = useState("");
  const [localEnv, setLocalEnv] = useState("");
  const [prodEnv, setProdEnv] = useState("");
  const [difficulty, setDifficulty] = useState("junior");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ errorCode, localEnv, prodEnv, difficulty });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Error/Code Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <Code className="w-4 h-4 text-primary" />
          Error or Code Snippet
        </label>
        <div className="glow-border rounded-lg overflow-hidden">
          <textarea
            value={errorCode}
            onChange={(e) => setErrorCode(e.target.value)}
            placeholder={`// Paste your error message or code here
TypeError: Cannot read property 'undefined' of undefined
    at Object.<anonymous> (/app/src/index.js:42:13)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)`}
            className="w-full h-48 p-4 terminal-input rounded-lg resize-none focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Environment Inputs - Side by Side */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Local Environment */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <Laptop className="w-4 h-4 text-success" />
            Local Environment
            <span className="text-xs text-success">(works here)</span>
          </label>
          <div className="glow-border rounded-lg overflow-hidden">
            <textarea
              value={localEnv}
              onChange={(e) => setLocalEnv(e.target.value)}
              placeholder={`NODE_ENV=development
Node: v18.17.0
OS: macOS 14.0
RAM: 16GB
.env loaded: true`}
              className="w-full h-32 p-4 terminal-input rounded-lg resize-none focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Production Environment */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <Server className="w-4 h-4 text-destructive" />
            Production Environment
            <span className="text-xs text-destructive">(breaks here)</span>
          </label>
          <div className="glow-border rounded-lg overflow-hidden">
            <textarea
              value={prodEnv}
              onChange={(e) => setProdEnv(e.target.value)}
              placeholder={`NODE_ENV=production
Node: v16.14.0
OS: Linux (Ubuntu 22.04)
RAM: 512MB
.env loaded: ???`}
              className="w-full h-32 p-4 terminal-input rounded-lg resize-none focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Difficulty Toggle */}
      <div className="space-y-3">
        <label className="font-mono text-sm text-muted-foreground">
          Explain like I'm a:
        </label>
        <div className="flex flex-wrap gap-2">
          {difficultyLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setDifficulty(level.id)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                difficulty === level.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {level.emoji} {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <motion.button
        type="submit"
        disabled={isLoading || !errorCode.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl btn-glow font-mono font-bold text-lg text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Analyze
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default DebugForm;
