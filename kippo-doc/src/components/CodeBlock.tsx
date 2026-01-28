import { Copy, Check, Terminal, FileCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const getLanguageIcon = (language: string) => {
  switch (language) {
    case 'bash':
    case 'shell':
    case 'powershell':
      return <Terminal size={14} className="text-green-400" />;
    default:
      return <FileCode size={14} className="text-blue-400" />;
  }
};

const getLanguageLabel = (language: string) => {
  const labels: Record<string, string> = {
    csharp: 'C#',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    json: 'JSON',
    bash: 'Bash',
    shell: 'Shell',
    powershell: 'PowerShell',
    xml: 'XML',
    plaintext: 'Text',
  };
  return labels[language] || language.toUpperCase();
};

export function CodeBlock({ code, language, filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    const highlight = async () => {
      try {
        // Normalize line endings and remove extra blank lines
        const normalizedCode = code.trim().replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
        let html = await codeToHtml(normalizedCode, {
          lang: language === 'plaintext' ? 'text' : language,
          theme: 'github-dark',
        });
        // Remove newlines between line spans to prevent double spacing
        html = html.replace(/<\/span>\n<span class="line">/g, '</span><span class="line">');
        setHighlightedCode(html);
      } catch {
        // Fallback for unsupported languages
        const escaped = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setHighlightedCode(`<pre><code>${escaped}</code></pre>`);
      }
    };
    highlight();
  }, [code, language]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizedCode = code.trim().replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  const lines = normalizedCode.split('\n');
  const shouldShowLineNumbers = showLineNumbers && lines.length > 1;

  return (
    <div className="group rounded-xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 my-4 shadow-xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          
          {/* Filename or language */}
          <div className="flex items-center gap-2 text-sm">
            {getLanguageIcon(language)}
            <span className="text-zinc-400 font-medium">
              {filename || getLanguageLabel(language)}
            </span>
          </div>
        </div>
        
        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            copied 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700'
          }`}
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div className="relative flex">
        {shouldShowLineNumbers && (
          <div className="flex-shrink-0 w-12 bg-zinc-900/50 border-r border-zinc-800 pt-4 pb-4 text-right pr-3 text-zinc-600 text-sm font-mono select-none">
            {lines.map((_, i) => (
              <div key={i} className="h-6">{i + 1}</div>
            ))}
          </div>
        )}
        <div 
          className={`shiki-wrapper flex-1 p-4 overflow-x-auto text-sm font-mono`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}
