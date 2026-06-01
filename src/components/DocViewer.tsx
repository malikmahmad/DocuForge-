import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { FileDown, FileText, Share2, Copy, Check, Printer } from "lucide-react";
import { exportToPDF, exportToWord, exportToMarkdown } from "../utils/exportUtils";
import { useState } from "react";

interface DocViewerProps {
  title: string;
  content: string;
}

export const DocViewer: React.FC<DocViewerProps> = ({ title, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-2xl overflow-hidden flex flex-col h-full transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-6 py-4 border-b border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-navy-900 dark:bg-navy-700 p-1.5 rounded-md shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-navy-900 dark:text-white truncate max-w-[150px] xs:max-w-[200px] md:max-w-md">
            {title || "Untitled Document"}
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg transition-all"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-navy-700 mx-1" />
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-white bg-navy-900 dark:bg-navy-700 hover:opacity-90 rounded-lg transition-all"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Print</span>
            </button>
            <button
              onClick={() => exportToPDF(title, content)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-white bg-navy-900 dark:bg-navy-700 hover:opacity-90 rounded-lg transition-all"
              title="Export as PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">PDF</span>
            </button>
            <button
              onClick={() => exportToWord(title, content)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-white bg-navy-900 dark:bg-navy-700 hover:opacity-90 rounded-lg transition-all"
              title="Export as Word"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Word</span>
            </button>
            <button
              onClick={() => exportToMarkdown(title, content)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-white bg-navy-900 dark:bg-navy-700 hover:opacity-90 rounded-lg transition-all"
              title="Export as Markdown"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">MD</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-white dark:bg-navy-800">
        <div className="max-w-4xl mx-auto">
          <div className="markdown-body text-sm md:text-base">
            <Markdown rehypePlugins={[rehypeRaw]}>{content}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
