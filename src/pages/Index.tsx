import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import DebugForm from "@/components/DebugForm";
import LoadingMessages from "@/components/LoadingMessages";
import ResultsSection from "@/components/ResultsSection";

interface AnalysisResult {
  whatWentWrong: string;
  howToFix: string[];
  preventionTips: string[];
}

// Mock analysis function - in production, this would call an AI API
const mockAnalyze = async (data: {
  errorCode: string;
  localEnv: string;
  prodEnv: string;
  difficulty: string;
}): Promise<AnalysisResult> => {
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const difficultyResponses = {
    junior: {
      whatWentWrong:
        "Your application is failing because of a version mismatch between your local Node.js (v18) and production (v16). The code uses features like optional chaining (?.) or nullish coalescing (??) that aren't fully supported in older Node versions. Additionally, it looks like your environment variables might not be loading properly in production.",
      howToFix: [
        "Update your production Node.js version to v18.x to match your local environment",
        "Add a .nvmrc file with '18' to your repo root to ensure consistent versions",
        "Check that your .env file is properly copied to production, or configure environment variables in your hosting provider's dashboard",
        "Run 'npm rebuild' after updating Node to ensure native dependencies are recompiled",
      ],
      preventionTips: [
        "Always use a .nvmrc file to lock Node versions across environments",
        "Set up a CI/CD pipeline that validates environment parity",
        "Use Docker containers to ensure identical environments",
        "Add a preinstall script that checks Node version requirements",
      ],
    },
    senior: {
      whatWentWrong:
        "Node runtime version delta (v16→v18) causing V8 engine API incompatibilities. ENV injection failure in production container—likely missing dotenv config or secrets manager binding.",
      howToFix: [
        "Pin runtime: .nvmrc + engines field in package.json",
        "Verify secrets manager IAM bindings and env injection in deployment manifest",
        "Add runtime validation in entrypoint script",
        "Consider buildtime env injection vs runtime for immutable deployments",
      ],
      preventionTips: [
        "Implement infrastructure-as-code with Terraform/Pulumi for env parity",
        "Add production readiness checks in CI pipeline",
        "Use feature flags for gradual rollouts",
        "Implement health checks that validate runtime dependencies",
      ],
    },
    intern: {
      whatWentWrong:
        "Okay so basically... your computer has a different version of Node than the server. It's like trying to play a PS5 game on a PS4—it just won't work. Also, the server doesn't know your secret passwords (environment variables) because nobody told it. Oops! 😅",
      howToFix: [
        "First, deep breath. This happens to literally everyone.",
        "Go to your hosting provider (like Vercel, Heroku, etc.) and find where you add 'Environment Variables'. Add ALL the stuff from your .env file there.",
        "Tell your team lead or senior dev that the server needs Node version 18 instead of 16. They'll know what to do.",
        "If all else fails, the classic: delete node_modules, run npm install again, and pray 🙏",
      ],
      preventionTips: [
        "Write down every environment variable you add locally—you'll need them later",
        "Ask your senior dev to show you the deployment setup",
        "When in doubt, console.log() EVERYTHING",
        "Remember: Stack Overflow is your best friend, not your enemy",
      ],
    },
  };

  return difficultyResponses[data.difficulty as keyof typeof difficultyResponses] || difficultyResponses.junior;
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const triggerConfetti = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#8B5CF6", "#A855F7", "#D946EF", "#EC4899"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#8B5CF6", "#A855F7", "#D946EF", "#EC4899"],
      });
    }, 250);
  }, []);

  const handleSubmit = async (data: {
    errorCode: string;
    localEnv: string;
    prodEnv: string;
    difficulty: string;
  }) => {
    setIsLoading(true);
    setResults(null);

    try {
      const analysisResult = await mockAnalyze(data);
      setResults(analysisResult);
      triggerConfetti();
      toast.success("Analysis complete! 🎉", {
        description: "We found the issue and have solutions ready.",
      });
    } catch (error) {
      toast.error("Analysis failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = () => {
    // Toggle audio playing state (in production, this would use ElevenLabs TTS)
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info("Playing explanation...", {
        description: "Audio feature coming soon with ElevenLabs integration!",
      });
      // Simulate audio ending after 5 seconds
      setTimeout(() => setIsPlaying(false), 5000);
    }
  };

  // Scroll to results when they appear
  useEffect(() => {
    if (results) {
      const resultsElement = document.getElementById("results-section");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [results]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />

        <section className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <DebugForm onSubmit={handleSubmit} isLoading={isLoading} />

            {isLoading && <LoadingMessages isLoading={isLoading} />}

            <div id="results-section">
              <ResultsSection
                results={results}
                onPlayAudio={handlePlayAudio}
                isPlaying={isPlaying}
              />
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
