import React, { useState } from "react";
import { ProjectDetails } from "../types";
import { Zap, Settings, Code, Send, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateDocumentation } from "../services/documentService";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputFormProps {
  onGenerate: (details: ProjectDetails & { content: string }) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading, setIsLoading, setError }) => {
  const [activeTab, setActiveTab] = useState<"quick" | "advanced">("quick");
  const [details, setDetails] = useState<ProjectDetails>({
    title: "",
    description: "",
    scale: "startup",
    structureMode: "assistive",
    customHeadings: "",
    advancedPrompt: "",
    apiDetails: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.title || !details.description) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const content = await generateDocumentation(details);
      onGenerate({ ...details, content });
    } catch (error: any) {
      setError(error.message || "Failed to generate documentation. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setDetails({
      title: "",
      description: "",
      scale: "startup",
      structureMode: "assistive",
      customHeadings: "",
      advancedPrompt: "",
      apiDetails: "",
    });
  };

  return (
    <div id="generate" className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-2xl overflow-hidden transition-colors duration-300">
      <div className="flex flex-col sm:flex-row border-b border-slate-200 dark:border-navy-700">
        <button
          onClick={() => setActiveTab("quick")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 text-sm font-medium transition-all border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-navy-700",
            activeTab === "quick" ? "bg-slate-50 dark:bg-navy-700 text-navy-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <Zap className="w-4 h-4" />
          Quick Generate
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 text-sm font-medium transition-all",
            activeTab === "advanced" ? "bg-slate-50 dark:bg-navy-700 text-navy-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <Settings className="w-4 h-4" />
          Advanced & Custom Structure
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Title</label>
            <input
              type="text"
              value={details.title}
              onChange={(e) => setDetails({ ...details, title: e.target.value })}
              placeholder="e.g. Enterprise Cloud Migration Strategy 2026"
              className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-xl px-4 py-3 text-navy-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Scale</label>
            <select
              value={details.scale}
              onChange={(e) => setDetails({ ...details, scale: e.target.value as any })}
              className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-xl px-4 py-3 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all"
            >
              <option value="personal">Personal</option>
              <option value="academic">Academic</option>
              <option value="startup">Startup</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Description</label>
          <textarea
            value={details.description}
            onChange={(e) => setDetails({ ...details, description: e.target.value })}
            placeholder="Provide a high-level overview of the project, its goals, and key stakeholders..."
            className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-xl px-4 py-3 text-navy-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all min-h-[100px]"
            required
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "advanced" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden"
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Headings (Optional)</label>
                <textarea
                  value={details.customHeadings}
                  onChange={(e) => setDetails({ ...details, customHeadings: e.target.value })}
                  placeholder="Enter custom headings separated by commas or new lines. If provided, the engine will only generate these sections."
                  className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-xl px-4 py-3 text-navy-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Advanced Requirements</label>
                  <textarea
                    value={details.advancedPrompt}
                    onChange={(e) => setDetails({ ...details, advancedPrompt: e.target.value })}
                    placeholder="Specific challenges, ROI metrics, or timeline constraints..."
                    className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-xl px-4 py-3 text-navy-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Structure Mode</label>
                  <select
                    value={details.structureMode}
                    onChange={(e) => setDetails({ ...details, structureMode: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-xl px-4 py-3 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all"
                  >
                    <option value="assistive">Assistive (Suggests missing)</option>
                    <option value="strict">Strict (Exact headings only)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-3 h-3" />
                    API Details (Optional)
                  </label>
                  <textarea
                    value={details.apiDetails}
                    onChange={(e) => setDetails({ ...details, apiDetails: e.target.value })}
                    placeholder="Endpoints, authentication methods, request/response structures..."
                    className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-600 rounded-xl px-4 py-3 text-navy-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all min-h-[100px] font-mono text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-navy-700">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-700 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading || !details.title || !details.description}
            className="flex-1 flex items-center justify-center gap-2 bg-navy-900 dark:bg-white text-white dark:text-navy-900 px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-navy-900/10 dark:shadow-white/5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Documentation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
