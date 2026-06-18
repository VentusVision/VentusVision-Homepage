import { motion, type Variants } from "framer-motion";
import { Search, ShieldCheck, ShoppingCart, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { glowHover, staggerContainer } from "../../lib/motion";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  span: string;
}

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: "Fuzzy Search Engine",
    description:
      "Typo-tolerant, lightning-fast search across millions of vehicle data records — find what you need before you finish typing.",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Strict Vanilla JS Security",
    description:
      "Hand-rolled XSS protection with zero third-party sanitizer dependencies — every payload is validated and neutralized in plain JavaScript before it ever touches the DOM.",
    span: "lg:col-span-1",
  },
  {
    icon: ShoppingCart,
    title: "Complex UUID Shopping Cart Logic",
    description:
      "Every line item tracked by collision-safe UUIDs, powering multi-session bundling, quoting, and checkout without ever colliding on a duplicate key.",
    span: "lg:col-span-1",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export function FeatureBentoGrid() {
  return (
    <section className="relative bg-ink px-6 py-28 text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Built for the way enterprises buy data.
          </h2>
          <p className="mt-4 text-white/50">
            Every feature engineered for security, speed, and a frictionless B2B checkout.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={glowHover}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl",
                feature.span,
              )}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/0 blur-3xl transition-colors duration-500 group-hover:bg-cyan-400/20" />

              <feature.icon className="h-8 w-8 text-cyan-300" strokeWidth={1.5} />

              <div className="mt-8">
                <h3 className="text-2xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-white/50">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
