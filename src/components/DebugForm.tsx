import { motion } from "framer-motion";
import { Code, Server, Laptop, Sparkles, Zap, Keyboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

// Demo examples for quick testing - judges love this!
const demoExamples = [
  {
    name: "🔥 Classic Node.js",
    errorCode: `Error: Cannot find module 'dotenv'
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/app/server.js:1:1)`,
    localEnv: `NODE_ENV=development
Node: v20.10.0
OS: Windows 11
Dependencies: installed via npm install
.env: ✅ loaded`,
    prodEnv: `NODE_ENV=production
Node: v18.17.0
OS: Linux (Docker Alpine)
Dependencies: npm ci --production
.env: ❌ missing from container`,
  },
  {
    name: "🐍 Python Drama",
    errorCode: `ModuleNotFoundError: No module named 'pandas'
Traceback (most recent call last):
  File "/app/main.py", line 2, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'`,
    localEnv: `Python: 3.11.4
pip packages: installed from requirements.txt
Virtual env: ✅ activated
OS: macOS 14.0`,
    prodEnv: `Python: 3.9.7
pip packages: ???
Virtual env: system python
OS: AWS Lambda`,
  },
  {
    name: "⚛️ React Build Fail",
    errorCode: `TypeError: Cannot read properties of undefined (reading 'map')
    at ProductList (webpack://app/./src/components/ProductList.jsx:15:23)
    at renderWithHooks (webpack://app/./node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at mountIndeterminateComponent (webpack://app/./node_modules/react-dom/cjs/react-dom.development.js:17811:13)`,
    localEnv: `React: 18.2.0
API: localhost:3001 (mock data)
Data: Always returns array
Browser: Chrome 120`,
    prodEnv: `React: 18.2.0
API: api.production.com
Data: Returns null on empty
CDN: Cloudflare`,
  },
];

const DebugForm = ({ onSubmit, isLoading }: DebugFormProps) => {
  const [errorCode, setErrorCode] = useState("");
  const [localEnv, setLocalEnv] = useState("");
  const [prodEnv, setProdEnv] = useState("");
  const [difficulty, setDifficulty] = useState("junior");
  const formRef = useRef<HTMLFormElement>(null);

  // Keyboard shortcut: Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && errorCode.trim() && !isLoading) {
        e.preventDefault();
        onSubmit({ errorCode, localEnv, prodEnv, difficulty });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [errorCode, localEnv, prodEnv, difficulty, isLoading, onSubmit]);

  const loadExample = (example: typeof demoExamples[0]) => {
    setErrorCode(example.errorCode);
    setLocalEnv(example.localEnv);
    setProdEnv(example.prodEnv);
  };

    const handleSubmit = (e: React.FormEvent) => {
    console.log("handleSubmit called");
    e.preventDefault();
    console.log("Form data:", { errorCode, localEnv, prodEnv, difficulty });
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
      {/* Quick Demo Examples */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-yellow-500" />
          Quick Demo Examples
        </label>
        <div className="flex flex-wrap gap-2">
          {demoExamples.map((example) => (
            <button
              key={example.name}
              type="button"
              onClick={() => loadExample(example)}
              className="px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-primary/20 border border-border hover:border-primary/50 font-mono text-xs transition-all"
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>

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
      <div className="space-y-2">
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
        <p className="text-center text-xs text-muted-foreground font-mono flex items-center justify-center gap-1">
          <Keyboard className="w-3 h-3" />
          Pro tip: Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px]">Enter</kbd> to analyze
        </p>
      </div>
    </motion.form>
  );
};

export default DebugForm;
