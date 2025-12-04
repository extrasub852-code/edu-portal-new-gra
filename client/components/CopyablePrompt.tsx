import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyablePromptProps {
  title: string;
  prompt: string;
  description?: string;
}

export function CopyablePrompt({ title, prompt, description }: CopyablePromptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="rounded-lg border border-[#003057]/20 bg-[#F7F9FC] p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#003057]">{title}</h4>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#003057] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#022d52]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      {description && (
        <p className="mb-2 text-xs text-[#003057]/70">{description}</p>
      )}
      <pre className="max-h-64 overflow-y-auto rounded-md bg-white p-3 text-xs text-[#003057] whitespace-pre-wrap break-words border border-[#003057]/10">
        {prompt}
      </pre>
    </div>
  );
}

