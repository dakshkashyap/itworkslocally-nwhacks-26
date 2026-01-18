// import { useEffect } from "react";
// import { motion } from "framer-motion";
// import confetti from "canvas-confetti";
// import { toast } from "sonner";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import HeroSection from "@/components/HeroSection";
// import DebugForm from "@/components/DebugForm";
// import LoadingMessages from "@/components/LoadingMessages";
// import ResultsSection from "@/components/ResultsSection";
// import { useAnalysis } from "@/hooks/useAnalysis";
// import type { ExpertiseLevel } from "@/lib/gemini";

// const triggerConfetti = () => {
//   const duration = 2000;
//   const animationEnd = Date.now() + duration;
//   const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

//   const randomInRange = (min: number, max: number) =>
//     Math.random() * (max - min) + min;

//   const interval = setInterval(() => {
//     const timeLeft = animationEnd - Date.now();

//     if (timeLeft <= 0) {
//       clearInterval(interval);
//       return;
//     }

//     const particleCount = 50 * (timeLeft / duration);

//     confetti({
//       ...defaults,
//       particleCount,
//       origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
//       colors: ["#8B5CF6", "#A855F7", "#D946EF", "#EC4899"],
//     });
//     confetti({
//       ...defaults,
//       particleCount,
//       origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
//       colors: ["#8B5CF6", "#A855F7", "#D946EF", "#EC4899"],
//     });
//   }, 250);
// };

// const Index = () => {
//   const { isLoading, result, error, isPlaying, analyze, playVoice } = useAnalysis();

//   const handleSubmit = async (data: {
//     errorCode: string;
//     localEnv: string;
//     prodEnv: string;
//     difficulty: string;
//   }) => {
//     if (!data.errorCode.trim()) {
//       toast.error("Please paste your error log!");
//       return;
//     }

//     try {
//       await analyze(
//         data.errorCode,
//         data.localEnv,
//         data.prodEnv,
//         data.difficulty as ExpertiseLevel
//       );

//       triggerConfetti();
//       toast.success("Analysis complete! 🎉", {
//         description: "We found the issue and have solutions ready.",
//       });
//     } catch (err) {
//       toast.error("Analysis failed", {
//         description: error || "Something went wrong. Please check your API keys.",
//       });
//     }
//   };

//   useEffect(() => {
//     if (result) {
//       const resultsElement = document.getElementById("results-section");
//       if (resultsElement) {
//         setTimeout(() => {
//           resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
//         }, 100);
//       }
//     }
//   }, [result]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-1">
//         <HeroSection />

//         <section className="container mx-auto px-4 pb-20">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//             className="max-w-4xl mx-auto"
//           >
//             <DebugForm onSubmit={handleSubmit} isLoading={isLoading} />

//             {isLoading && <LoadingMessages isLoading={isLoading} />}

//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-6 p-4 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive font-mono"
//               >
//                 ⚠️ {error}
//               </motion.div>
//             )}

//             <div id="results-section">
//               <ResultsSection
//                 results={result}
//                 onPlayAudio={playVoice}
//                 isPlaying={isPlaying}
//               />
//             </div>
//           </motion.div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Index;

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import DebugForm from "@/components/DebugForm";
import LoadingMessages from "@/components/LoadingMessages";
import ResultsSection from "@/components/ResultsSection";
import { useAnalysis } from "@/hooks/useAnalysis";
import type { ExpertiseLevel } from "@/lib/gemini";

const triggerConfetti = () => {
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
};

const Index = () => {
  const { isLoading, result, error, isPlaying, analyze, playVoice } = useAnalysis();

  const handleSubmit = async (data: {
    errorCode: string;
    localEnv: string;
    prodEnv: string;
    difficulty: string;
  }) => {
    console.log("Form submitted with data:", data);
    
    if (!data.errorCode.trim()) {
      toast.error("Please paste your error log!");
      return;
    }

    try {
      await analyze(
        data.errorCode,
        data.localEnv,
        data.prodEnv,
        data.difficulty as ExpertiseLevel
      );

      triggerConfetti();
      toast.success("Analysis complete! 🎉", {
        description: "We found the issue and have solutions ready.",
      });
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Analysis failed", {
        description: error || "Something went wrong. Please check your API keys.",
      });
    }
  };

  useEffect(() => {
    if (result) {
      const resultsElement = document.getElementById("results-section");
      if (resultsElement) {
        setTimeout(() => {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative">
        <HeroSection />

        <section className="container mx-auto px-4 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <DebugForm onSubmit={handleSubmit} isLoading={isLoading} />

            {isLoading && <LoadingMessages isLoading={isLoading} />}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-destructive/20 border border-destructive/50 rounded-lg text-destructive font-mono"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <div id="results-section">
              <ResultsSection
                results={result}
                onPlayAudio={playVoice}
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
