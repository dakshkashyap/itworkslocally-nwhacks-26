import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      
      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main headline with gradient */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text animate-gradient">It Works Locally</span>
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground font-mono mb-4"
          >
            ...but not in production?{" "}
            <span className="text-foreground">We've got you.</span>
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            AI-powered debugging assistant that analyzes your environment differences 
            and tells you exactly what went wrong—in language even your PM can understand.
          </motion.p>

          {/* Tech Stack Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {[
              { name: "Gemini 2.0", color: "bg-blue-500/20 text-blue-400" },
              { name: "ElevenLabs", color: "bg-purple-500/20 text-purple-400" },
              { name: "React", color: "bg-cyan-500/20 text-cyan-400" },
              { name: "Built with Lovable", color: "bg-pink-500/20 text-pink-400" },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`px-3 py-1 rounded-full text-xs font-mono ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-10 w-20 h-20 rounded-full bg-primary/5 blur-xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none"
      />
    </section>
  );
};

export default HeroSection;
