import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Sparkles, AlertTriangle, 
  Trash2, RefreshCw, ChevronDown, Copy, Check
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetTitle } from './ui/sheet';
import { api } from '../services/api';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'cm_chat_messages';

// Pulsing glowing logo for the AI Career Coach
const AssistantLogo = ({ className = "size-8" }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center shrink-0", className)}>
    <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-md animate-pulse" />
    <div className="relative size-full rounded-full border border-emerald-400/40 bg-zinc-950 flex items-center justify-center shadow-lg">
      <Sparkles className="size-1/2 text-emerald-400 animate-pulse" />
    </div>
  </div>
);

// Regex-based inline styles tokenizer/renderer
const renderInline = (text: string): React.ReactNode[] => {
  let currentText = text;
  const elements: React.ReactNode[] = [];
  let key = 0;
  
  while (currentText) {
    const linkMatch = currentText.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch1 = currentText.match(/\*\*([^*]+)\*\*/);
    const boldMatch2 = currentText.match(/__([^_]+)__/);
    const italicMatch1 = currentText.match(/\*([^*]+)\*/);
    const italicMatch2 = currentText.match(/_([^_]+)_/);
    const codeMatch = currentText.match(/`([^`]+)`/);
    
    let firstMatch: { index: number; length: number; render: () => React.ReactNode } | null = null;
    
    const updateFirstMatch = (match: RegExpMatchArray | null, renderFunc: (m: RegExpMatchArray) => React.ReactNode) => {
      if (match && match.index !== undefined) {
        if (!firstMatch || match.index < firstMatch.index) {
          firstMatch = {
            index: match.index,
            length: match[0].length,
            render: () => renderFunc(match)
          };
        }
      }
    };
    
    updateFirstMatch(linkMatch, (m) => (
      <a 
        href={m[2]} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-emerald-400 hover:text-emerald-300 underline font-medium hover:underline transition-all"
        key={key++}
      >
        {m[1]}
      </a>
    ));
    
    updateFirstMatch(boldMatch1, (m) => <strong className="font-bold text-white" key={key++}>{m[1]}</strong>);
    updateFirstMatch(boldMatch2, (m) => <strong className="font-bold text-white" key={key++}>{m[1]}</strong>);
    updateFirstMatch(italicMatch1, (m) => <em className="italic text-zinc-300" key={key++}>{m[1]}</em>);
    updateFirstMatch(italicMatch2, (m) => <em className="italic text-zinc-300" key={key++}>{m[1]}</em>);
    updateFirstMatch(codeMatch, (m) => (
      <code className="px-1.5 py-0.5 bg-zinc-800/80 border border-zinc-700/60 text-emerald-400 rounded text-[11px] font-mono break-all" key={key++}>
        {m[1]}
      </code>
    ));
    
    if (firstMatch) {
      const matchObj = firstMatch as { index: number; length: number; render: () => React.ReactNode };
      if (matchObj.index > 0) {
        elements.push(currentText.substring(0, matchObj.index));
      }
      elements.push(matchObj.render());
      currentText = currentText.substring(matchObj.index + matchObj.length);
    } else {
      elements.push(currentText);
      break;
    }
  }
  
  return elements;
};

// Copyable CodeBlock wrapper
const CodeBlock: React.FC<{ code: string; lang?: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  return (
    <div className="my-3 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 font-mono text-[11px] leading-relaxed">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-[10px] select-none">
        <span>{lang || 'code'}</span>
        <button 
          onClick={handleCopy} 
          className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Responsive Table component
const TableBlock: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => {
  return (
    <div className="my-3 overflow-x-auto border border-zinc-800 rounded-lg max-w-full shadow-sm scrollbar-thin">
      <table className="w-full text-[11px] border-collapse text-left">
        <thead>
          <tr className="bg-zinc-900 border-b border-zinc-800 select-none">
            {headers.map((h, i) => (
              <th key={i} className="p-2.5 font-semibold text-white border-r border-zinc-800 last:border-r-0 whitespace-nowrap">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/20 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="p-2.5 text-zinc-300 border-r border-zinc-800 last:border-r-0 min-w-[100px] max-w-[200px] break-words">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Recursive lists renderer
const renderListItems = (items: { text: string; depth: number }[], isOrdered: boolean): React.ReactNode => {
  if (items.length === 0) return null;
  
  const minDepth = Math.min(...items.map(item => item.depth));
  const groups: { item: { text: string; depth: number }; subItems: { text: string; depth: number }[] }[] = [];
  
  for (const item of items) {
    if (item.depth <= minDepth) {
      groups.push({ item, subItems: [] });
    } else {
      if (groups.length > 0) {
        groups[groups.length - 1].subItems.push(item);
      } else {
        groups.push({ item, subItems: [] });
      }
    }
  }
  
  const ListTag = isOrdered ? 'ol' : 'ul';
  const listClass = isOrdered ? 'list-decimal pl-5 space-y-1 my-1' : 'list-disc pl-5 space-y-1 my-1';
  
  return (
    <ListTag className={listClass}>
      {groups.map((group, idx) => (
        <li key={idx} className="text-zinc-300 leading-relaxed text-xs">
          <span>{renderInline(group.item.text)}</span>
          {group.subItems.length > 0 && renderListItems(group.subItems, isOrdered)}
        </li>
      ))}
    </ListTag>
  );
};

interface Block {
  type: 'code' | 'heading' | 'table' | 'list' | 'blockquote' | 'hr' | 'paragraph';
  lang?: string;
  level?: number;
  headers?: string[];
  rows?: string[][];
  items?: { text: string; depth: number }[];
  ordered?: boolean;
  content?: string;
}

// Markdown Block parsing
const parseBlocks = (text: string): Block[] => {
  const lines = text.split('\n');
  const blocks: Block[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // 1. Code blocks
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      let codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({
        type: 'code',
        lang,
        content: codeLines.join('\n')
      });
      continue;
    }
    
    // 2. Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2].trim()
      });
      i++;
      continue;
    }
    
    // 3. Blockquotes
    if (line.trim().startsWith('>')) {
      let quoteLines: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('>') || (lines[i].trim() !== '' && quoteLines.length > 0))) {
        const l = lines[i].trim();
        if (l.startsWith('>')) {
          quoteLines.push(l.slice(1).trim());
        } else {
          quoteLines.push(l);
        }
        i++;
      }
      blocks.push({
        type: 'blockquote',
        content: quoteLines.join('\n')
      });
      continue;
    }
    
    // 4. Horizontal Separator
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    
    // 5. Tables
    if (line.trim().startsWith('|')) {
      let tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      
      if (tableLines.length > 0) {
        const parseRow = (rowStr: string) => {
          const clean = rowStr.replace(/^\|/, '').replace(/\|$/, '');
          return clean.split('|').map(cell => cell.trim());
        };
        
        const firstRow = parseRow(tableLines[0]);
        let headers = firstRow;
        let rows: string[][] = [];
        let startIndex = 1;
        
        if (tableLines[1] && tableLines[1].replace(/[\s|:-]/g, '') === '') {
          startIndex = 2;
        }
        
        for (let j = startIndex; j < tableLines.length; j++) {
          rows.push(parseRow(tableLines[j]));
        }
        
        blocks.push({
          type: 'table',
          headers,
          rows
        });
        continue;
      }
    }
    
    // 6. Lists
    const listMatch = line.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      let listItems: { text: string; depth: number }[] = [];
      let isOrdered = !isNaN(parseInt(listMatch[2]));
      
      while (i < lines.length) {
        const currentLine = lines[i];
        const match = currentLine.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/);
        if (match) {
          listItems.push({
            depth: match[1].length,
            text: match[3].trim()
          });
          i++;
        } else if (currentLine.trim() !== '' && listItems.length > 0 && 
                   !currentLine.trim().startsWith('```') && 
                   !currentLine.match(/^(#{1,6})\s+/) && 
                   !currentLine.trim().startsWith('|') && 
                   !currentLine.trim().startsWith('>')) {
          listItems[listItems.length - 1].text += '\n' + currentLine.trim();
          i++;
        } else {
          break;
        }
      }
      
      blocks.push({
        type: 'list',
        ordered: isOrdered,
        items: listItems
      });
      continue;
    }
    
    // 7. Paragraphs
    if (line.trim() === '') {
      i++;
      continue;
    }
    
    let paraLines: string[] = [];
    while (i < lines.length && 
           lines[i].trim() !== '' && 
           !lines[i].trim().startsWith('```') && 
           !lines[i].match(/^(#{1,6})\s+/) && 
           !lines[i].trim().startsWith('>') && 
           !lines[i].trim().startsWith('|') && 
           !lines[i].trim().startsWith('---') && 
           !lines[i].trim().startsWith('***') && 
           !lines[i].match(/^(\s*)([*+-]|\d+\.)\s+/)) {
      paraLines.push(lines[i].trim());
      i++;
    }
    
    if (paraLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: paraLines.join(' ')
      });
    }
  }
  
  return blocks;
};

// Main Markdown Renderer component
export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const blocks = parseBlocks(content);
  
  return (
    <div className="space-y-3 text-zinc-300 leading-relaxed text-xs">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'code':
            return <CodeBlock key={idx} code={block.content || ''} lang={block.lang} />;
          case 'heading':
            const HeadingTag = `h${block.level || 4}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            const headingClasses = {
              h1: 'text-base font-bold text-white mt-4 mb-2 pb-1 border-b border-zinc-800/80',
              h2: 'text-sm font-bold text-white mt-3.5 mb-1.5',
              h3: 'text-xs font-semibold text-white mt-3 mb-1',
              h4: 'text-xs font-semibold text-zinc-200 mt-2.5 mb-1',
              h5: 'text-[11px] font-semibold text-zinc-300 mt-2 mb-0.5',
              h6: 'text-[10px] font-semibold text-zinc-400 mt-1.5 mb-0.5',
            };
            return (
              <HeadingTag key={idx} className={headingClasses[HeadingTag]}>
                {renderInline(block.content || '')}
              </HeadingTag>
            );
          case 'blockquote':
            return (
              <blockquote key={idx} className="pl-3 border-l-2 border-emerald-500 text-zinc-400 italic my-2 py-0.5 bg-zinc-900/10 rounded-r">
                {renderInline(block.content || '')}
              </blockquote>
            );
          case 'hr':
            return <hr key={idx} className="my-4 border-zinc-800/80" />;
          case 'table':
            return <TableBlock key={idx} headers={block.headers || []} rows={block.rows || []} />;
          case 'list':
            return <div key={idx} className="my-2">{renderListItems(block.items || [], block.ordered || false)}</div>;
          case 'paragraph':
          default:
            return (
              <p key={idx} className="my-2 leading-relaxed break-words">
                {renderInline(block.content || '')}
              </p>
            );
        }
      })}
    </div>
  );
};

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        if (isOpen) {
          setIsOpen(false);
          setIsMobileSheetOpen(true);
        }
      } else {
        if (isMobileSheetOpen) {
          setIsMobileSheetOpen(false);
          setIsOpen(true);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, isMobileSheetOpen]);

  // Load chat history from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
  }, []);

  // Save chat history
  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newMsgs));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMobileSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input
  useEffect(() => {
    if (isOpen && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMobile]);

  const getContext = () => {
    let userProfile = null;
    try {
      const raw = localStorage.getItem('cm_profile_draft');
      if (raw) userProfile = JSON.parse(raw);
    } catch (e) {}

    let careerProfile = null;
    try {
      const raw = localStorage.getItem('careerProfile') || localStorage.getItem('cm_career_profile');
      if (raw) {
        careerProfile = JSON.parse(raw);
      } else if (userProfile) {
        careerProfile = { 
          recommendations: userProfile.recommendations || (userProfile.topMatch ? [userProfile.topMatch] : []) 
        };
      }
    } catch (e) {}

    let currentJob = null;
    try {
      const raw = sessionStorage.getItem('cm_current_job');
      if (raw) currentJob = JSON.parse(raw);
    } catch (e) {}

    let activeTargetRole = null;
    try {
      const raw = localStorage.getItem('cm_target_role');
      if (raw) activeTargetRole = JSON.parse(raw);
    } catch (e) {}

    return { userProfile, careerProfile, currentJob, activeTargetRole };
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim() || isLoading) return;

    setError(null);
    if (!textToSend) setInputValue('');

    const newMessages = [...messages, { role: 'user', content: messageText } as Message];
    saveMessages(newMessages);
    setIsLoading(true);

    try {
      const context = getContext();
      const res = await api.sendChatMessage(newMessages, context);
      
      if (res && res.reply) {
        saveMessages([...newMessages, { role: 'assistant', content: res.reply }]);
      } else {
        setError('No response from assistant. Please try again.');
      }
    } catch (err: any) {
      console.error('[ASSISTANT CHAT ERROR]', err);
      setError(err.message || 'Network request failed. Check connection.');
    } finally {
      setIsLoading(false);
      if (!isMobile) {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  };

  const handleClearHistory = () => {
    saveMessages([]);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOpen = () => {
    if (isMobile) {
      setIsMobileSheetOpen(!isMobileSheetOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const suggestedQuestions = [
    "Which career suits my skills?",
    "What skills should I learn next?",
    "Find jobs matching my profile",
    "How can I improve my profile?"
  ];

  const renderChatHeader = () => (
    <div className="p-4 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-zinc-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <AssistantLogo className="size-8" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white uppercase tracking-wider leading-none">Career Intelligence Assistant</span>
          <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 mt-1 leading-none select-none">
            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Online Coach
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {messages.length > 0 && (
          <Button 
            onClick={handleClearHistory} 
            variant="ghost" 
            className="size-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
        <Button 
          onClick={() => {
            setIsOpen(false);
            setIsMobileSheetOpen(false);
          }} 
          variant="ghost" 
          className="size-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg cursor-pointer"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );

  const renderMessagesArea = () => (
    <ScrollArea className="flex-1 p-4 overflow-y-auto min-h-0 bg-zinc-950/20 scrollbar-thin">
      {messages.length === 0 ? (
        <div className="py-8 text-center space-y-6 max-w-sm mx-auto select-none">
          <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-md">
            <Sparkles className="size-6 text-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2 px-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Career Intelligence Coach</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Unlock targeted career insights, identify skill gaps, and explore jobs aligned to your profile.
            </p>
          </div>
          <div className="space-y-2 px-4 pt-4 text-left">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 pl-1">Suggested Prompts</span>
            <div className="grid grid-cols-1 gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-3 bg-zinc-900/40 border border-zinc-900/60 rounded-xl hover:border-zinc-800 hover:bg-zinc-900/80 text-[11px] text-zinc-300 transition-all font-medium flex items-center justify-between cursor-pointer group"
                >
                  <span>{q}</span>
                  <ChevronDown className="size-3.5 -rotate-90 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 flex flex-col pt-2 pb-6">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex gap-3 items-start w-full",
                m.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {m.role === 'assistant' && <AssistantLogo className="size-8" />}
              
              <div 
                className={cn(
                  "px-4 py-3 text-xs leading-relaxed max-w-[85%] shadow-sm",
                  m.role === 'user' 
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-2xl rounded-tr-none' 
                    : 'bg-zinc-900/40 border border-zinc-900/60 text-zinc-200 rounded-2xl rounded-tl-none flex-1 font-normal'
                )}
              >
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                ) : (
                  <MarkdownRenderer content={m.content} />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-start w-full">
              <AssistantLogo className="size-8" />
              <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-2xl rounded-tl-none px-4 py-3.5 flex gap-1.5 items-center shadow-sm select-none">
                <div className="size-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="size-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="size-1.5 bg-emerald-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3 items-start w-full">
              <AssistantLogo className="size-8" />
              <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-2xl rounded-tl-none text-[11px] text-red-300 max-w-[85%] flex flex-col gap-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
                <Button 
                  onClick={() => {
                    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                    if (lastUserMsg) {
                      handleSend(lastUserMsg.content);
                    }
                  }}
                  variant="outline" 
                  className="h-7 text-[10px] border-red-900/40 hover:bg-red-900/20 font-bold self-start cursor-pointer rounded-lg"
                >
                  <RefreshCw className="size-3 mr-1.5" />
                  Retry Send
                </Button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );

  const renderInputArea = () => (
    <div className="p-3 border-t border-zinc-900 shrink-0 bg-zinc-950/80 backdrop-blur-md flex items-end gap-2">
      <textarea
        ref={inputRef}
        rows={1}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about careers, skills, or jobs..."
        disabled={isLoading}
        className="flex-1 bg-zinc-900/60 border border-zinc-800/80 focus:border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none max-h-24 min-h-[38px] scrollbar-none transition-colors"
        style={{ height: '38px' }}
      />
      <Button 
        onClick={() => handleSend()} 
        disabled={!inputValue.trim() || isLoading}
        className="size-9 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-950 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0"
      >
        <Send className="size-4" />
      </Button>
    </div>
  );

  return (
    <>
      {/* Floating launcher button */}
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <Button
          onClick={toggleOpen}
          className="size-14 sm:size-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.35)] bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 text-white font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Open AI Career Assistant"
        >
          <div className="relative flex items-center justify-center size-10">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse" />
            <Sparkles className="size-6 text-emerald-400 relative z-10" />
          </div>
        </Button>
      </div>

      {/* Desktop Chat Panel Overlay */}
      {!isMobile && isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[420px] max-h-[82vh] h-[640px] bg-zinc-950 border border-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-50 transition-all duration-200 select-text"
          role="dialog"
          aria-label="AI Career Assistant Chat"
        >
          {renderChatHeader()}
          {renderMessagesArea()}
          {renderInputArea()}
        </div>
      )}

      {/* Mobile Chat Bottom Sheet */}
      {isMobile && (
        <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
          <SheetContent 
            side="bottom" 
            className="h-[92vh] w-full bg-zinc-950 border-zinc-900 p-0 flex flex-col rounded-t-2xl z-50 select-text outline-none"
          >
            <div className="hidden"><SheetTitle>AI Career Assistant</SheetTitle></div>
            {renderChatHeader()}
            {renderMessagesArea()}
            {renderInputArea()}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
