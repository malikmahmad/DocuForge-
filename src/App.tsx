import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { InputForm } from "./components/InputForm";
import { DocViewer } from "./components/DocViewer";
import { LoadingState } from "./components/LoadingState";
import { ProjectDetails } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Sparkles, AlertCircle, ArrowUp, 
  CheckCircle2, BarChart3, ShieldCheck, Globe, 
  ChevronDown, Linkedin, Github, Mail, User
} from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top on component mount (when page loads/refreshes)
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGenerate = (data: any) => {
    setProjectTitle(data.title);
    setGeneratedContent(data.content);
    // Scroll to viewer
    setTimeout(() => {
      document.getElementById("viewer")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-900 transition-colors duration-300">
      <Header />
      
      <main className="flex-1">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4"
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 shadow-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                  <ChevronDown className="w-4 h-4 rotate-45" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden border-b border-slate-100 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-navy-900 dark:text-white leading-tight"
                >
                  Forge Your <span className="text-slate-400 dark:text-navy-600">Vision</span> Into Reality
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg"
                >
                  Generate professional documentation in seconds. Structured, comprehensive, and ready for review.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-4"
                >
                  <button
                    onClick={() => document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-8 py-4 bg-navy-900 dark:bg-white text-white dark:text-navy-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-xl shadow-navy-900/10 dark:shadow-white/5"
                  >
                    Start Generating
                  </button>
                  <button
                    onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-8 py-4 bg-slate-100 dark:bg-navy-800 text-navy-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-navy-700 transition-all"
                  >
                    How It Works
                  </button>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative hidden lg:block"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-navy-600/20 to-transparent blur-3xl rounded-full" />
                <div className="relative bg-white dark:bg-navy-800 p-8 rounded-3xl border border-slate-200 dark:border-navy-700 shadow-2xl">
                  <div className="space-y-4">
                    <div className="h-4 w-1/2 bg-slate-100 dark:bg-navy-900 rounded-full" />
                    <div className="h-4 w-3/4 bg-slate-100 dark:bg-navy-900 rounded-full" />
                    <div className="h-32 w-full bg-slate-50 dark:bg-navy-900/50 rounded-2xl border border-slate-100 dark:border-navy-700" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-12 bg-slate-100 dark:bg-navy-900 rounded-xl" />
                      <div className="h-12 bg-slate-100 dark:bg-navy-900 rounded-xl" />
                      <div className="h-12 bg-slate-100 dark:bg-navy-900 rounded-xl" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-slate-50 dark:bg-navy-900/50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-navy-900 dark:text-white">Professional Standard</h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
                DocuForge is a professional-grade platform designed for organizations that demand excellence. We automate the creation of critical documentation sections, ensuring your projects are presented with precision.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 border-y border-slate-100 dark:border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Streamlined Workflow</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { step: "01", title: "Input Details", desc: "Enter project title, description, and key metrics." },
                { step: "02", title: "Auto-Forge", desc: "Our engine generates 15+ structured enterprise sections." },
                { step: "03", title: "Review & Edit", desc: "Fine-tune the content for your specific needs." },
                { step: "04", title: "Export & Present", desc: "Download in PDF, Word, or Markdown formats." },
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="text-5xl font-display font-black text-navy-900/10 dark:text-white/10">{item.step}</div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section id="generate" className="py-12 md:py-20 bg-slate-50 dark:bg-navy-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-10">
              {/* User Input Section (Up / Top) */}
              <div className="w-full">
                <InputForm 
                  onGenerate={handleGenerate} 
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              </div>

              {/* Documentation Generating Section (Down / Bottom) */}
              <div id="viewer" className="w-full min-h-[600px] lg:min-h-[750px] scroll-mt-24">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <LoadingState />
                  ) : generatedContent ? (
                    <DocViewer title={projectTitle} content={generatedContent} />
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white dark:bg-navy-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-navy-700 shadow-inner">
                      <FileText className="w-16 h-16 text-slate-300 dark:text-navy-700" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Ready to Forge</h3>
                        <p className="text-sm text-slate-500 max-w-sm">
                          Enter your project details above and click "Forge Documentation" to generate your structured technical document.
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Enterprise Features</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: <BarChart3 />, title: "SLA & Compliance", desc: "Automatic generation of Service Level Agreements and compliance strategies." },
                { icon: <ShieldCheck />, title: "Risk Assessment", desc: "Detailed risk matrices with Risk ID, Probability, and Mitigation." },
                { icon: <Globe />, title: "Scale-Aware Infrastructure", desc: "Designs tailored for Academic, Startup, or Enterprise SaaS." },
                { icon: <CheckCircle2 />, title: "15+ Structured Sections", desc: "From Executive Summary to SLA and Compliance." },
                { icon: <FileText />, title: "Stakeholder Insights", desc: "Comprehensive stakeholder overview and project assumptions." },
                { icon: <Sparkles />, title: "Precision Engine", desc: "Clean hierarchical numbering and professional corporate tone." },
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-navy-900 dark:bg-navy-700 rounded-xl flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-navy-900 dark:text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is DocuForge secure for enterprise data?", a: "Yes, we use industry-standard encryption and our template-based generation ensures your data never leaves our secure environment." },
                { q: "Can I customize the generated sections?", a: "Absolutely. Once generated, you can edit the content directly or use the Advanced Prompt mode for more specific requirements." },
                { q: "What formats are supported for export?", a: "We support high-fidelity PDF, Microsoft Word (.docx), and Markdown (.md) formats." },
                { q: "Who is behind DocuForge?", a: "DocuForge is developed by Muhammad Ahmad, a Full Stack Developer specializing in enterprise-grade solutions." },
              ].map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden transition-all">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-navy-900 dark:text-white">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section id="privacy" className="py-24 bg-slate-50 dark:bg-navy-900/50 border-t border-slate-100 dark:border-navy-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-navy-800 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-navy-700 shadow-xl">
              <h2 className="text-3xl font-display font-bold text-navy-900 dark:text-white mb-8">Privacy Policy</h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  At DocuForge, we prioritize the security and privacy of your enterprise data. This policy outlines how we handle information when you use our documentation platform.
                </p>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">1. Data Collection</h3>
                  <p>We only collect the project details you explicitly provide in the generator forms. This includes project titles, descriptions, and technical specifications required to forge your documentation.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">2. Data Usage</h3>
                  <p>Your data is used exclusively to generate professional documentation. We do not sell, rent, or share your project information with third parties for marketing purposes.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">3. Security Standards</h3>
                  <p>We implement industry-standard encryption and security protocols. Our platform is designed with enterprise-grade security in mind, ensuring SOC2 Type II compliance standards for data handling.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">4. Data Retention</h3>
                  <p>Project data is stored securely in our database to allow you to retrieve and manage your generated documents. You have the right to delete your projects at any time.</p>
                </div>
                <p className="pt-6 border-t border-slate-100 dark:border-navy-700 text-sm italic">
                  Last updated: March 31, 2026. For any privacy-related inquiries, please contact our security team.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-navy-900 dark:bg-navy-700 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-navy-900 dark:text-white tracking-tight">
                  Docu<span className="text-slate-400 dark:text-navy-600">Forge</span>
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The premier documentation platform for modern organizations. Built for precision, speed, and professional presentation.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/malikmahmad" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-navy-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-all"><Github className="w-5 h-5" /></a>
                <a href="https://www.linkedin.com/in/muhammad-ahmad-788b62338" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-navy-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
                <a href="mailto:mahmad937ak@gmail.com" className="p-2 bg-slate-100 dark:bg-navy-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-all"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-navy-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#generate" className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors">Generate</a></li>
                <li><a href="#how-it-works" className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors">About Us</a></li>
                <li><a href="#privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

                <div className="space-y-6">
                  <h4 className="font-bold text-navy-900 dark:text-white mb-6">Developer</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-navy-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900 dark:text-white">Muhammad Ahmad</p>
                      <p className="text-xs text-slate-500">Full Stack Developer</p>
                    </div>
                  </div>
                </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 dark:border-navy-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © 2026 DocuForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="scroll-to-top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
