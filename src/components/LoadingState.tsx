import React from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Database, ShieldCheck } from "lucide-react";

export const LoadingState: React.FC = () => {
  const steps = [
    { icon: <FileText className="w-5 h-5" />, text: "Analyzing project scope..." },
    { icon: <Sparkles className="w-5 h-5" />, text: "Synthesizing enterprise strategy..." },
    { icon: <Database className="w-5 h-5" />, text: "Calculating ROI & financial metrics..." },
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Finalizing professional structure..." },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 md:space-y-8 p-6 md:p-12 text-center bg-white dark:bg-navy-800 transition-colors duration-300">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 md:w-24 md:h-24 border-4 border-slate-100 dark:border-navy-700 border-t-navy-900 dark:border-t-white rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-navy-900 dark:text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-3 md:space-y-4 max-w-xs">
        <h3 className="text-lg md:text-xl font-display font-bold text-navy-900 dark:text-white">Forging Documentation</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Our engine is crafting a high-level professional document tailored to your enterprise requirements.</p>
      </div>

      <div className="grid gap-2 md:gap-3 w-full max-w-sm">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5 }}
            className="flex items-center gap-3 md:gap-4 bg-slate-50 dark:bg-navy-900/50 border border-slate-100 dark:border-navy-700 p-3 md:p-4 rounded-xl"
          >
            <div className="text-navy-600 dark:text-navy-400 shrink-0">{step.icon}</div>
            <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 text-left">{step.text}</span>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
              className="ml-auto w-1.5 h-1.5 md:w-2 md:h-2 bg-navy-900 dark:bg-white rounded-full shrink-0"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
