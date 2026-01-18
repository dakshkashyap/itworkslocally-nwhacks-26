import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Cpu, Volume2, Zap, Server, Brain } from "lucide-react";

const steps = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Paste Your Error",
    description: "Drop in your error message, stack trace, or the code that's giving you trouble.",
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: "Compare Environments",
    description: "Tell us about your local setup and production environment—the more details, the better.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI Analysis",
    description: "Our AI compares both environments and identifies the root cause of the mismatch.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Get Solutions",
    description: "Receive step-by-step fixes tailored to your experience level—no more cryptic docs.",
  },
];

const techStack = [
  { name: "Gemini AI", color: "from-blue-500 to-cyan-500", description: "Powered by Google's latest AI" },
  { name: "ElevenLabs", color: "from-purple-500 to-pink-500", description: "Voice explanations" },
  { name: "Vultr", color: "from-green-500 to-emerald-500", description: "Cloud infrastructure" },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">How It Works</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From "it works on my machine" to "it works everywhere" in four simple steps.
            </p>
          </motion.div>
        </section>

        {/* Steps Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

              {/* Steps */}
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    className="relative flex gap-6 items-start"
                  >
                    {/* Step number circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="result-card p-6 flex-1">
                      <h3 className="text-xl font-bold font-mono mb-2 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-mono mb-4">
              Powered by <span className="gradient-text">Modern Tech</span>
            </h2>
            <p className="text-muted-foreground">
              Built with cutting-edge AI and cloud technologies
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-xl p-6 text-center min-w-[200px]"
              >
                <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${tech.color} text-white font-mono font-bold text-sm mb-3`}>
                  {tech.name}
                </div>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="result-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="w-5 h-5 text-primary" />
                <h3 className="font-mono font-bold">Smart Analysis</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered comparison of environment configurations to spot subtle differences that cause production failures.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="result-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <h3 className="font-mono font-bold">Voice Explanations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Tired of reading? Listen to explanations while you fix the bug. Perfect for when you're in the zone.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
