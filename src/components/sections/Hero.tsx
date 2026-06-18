import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeUp, springSnappy, staggerContainer, staggerWords, wordReveal } from "../../lib/motion";
import { GlowImageFrame } from "../ui/GlowImageFrame";

const HEADLINE = ["The", "Future", "of", "Vehicle", "Data,", "Marketplace-Ready."];

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 pb-24 pt-32 text-white">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-cyan-300 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" />
          CARUSO Data Marketplace
        </motion.span>

        <motion.h1
          variants={staggerWords}
          className="max-w-5xl text-balance text-6xl font-extrabold leading-[1.05] tracking-tighter sm:text-7xl lg:text-8xl"
        >
          {HEADLINE.map((word, i) => (
            <span key={word} className="mr-4 inline-block overflow-hidden align-top last:mr-0">
              <motion.span
                variants={wordReveal}
                className={
                  i === HEADLINE.length - 1
                    ? "inline-block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent"
                    : "inline-block"
                }
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lg text-white/50">
          One secure, fuzzy-searchable marketplace for every vehicle data stream your B2B
          platform will ever need.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(34,211,238,0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-black shadow-glow"
          >
            Explore the Marketplace
            <ArrowRight className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, borderColor: "rgba(34,211,238,0.6)" }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white/80 backdrop-blur-md"
          >
            Read the Docs
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-20 w-full max-w-5xl"
      >
        <GlowImageFrame
          src="/caruso-ui-mockup.png"
          alt="CARUSO Data Marketplace product screenshot"
          label="CARUSO UI Preview"
          float
          className="h-[420px] w-full sm:h-[480px]"
        />
      </motion.div>
    </section>
  );
}
