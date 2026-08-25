import React, { useState, useEffect } from 'react';
import { Terminal, Database, Wrench, Brain, FileCode, Settings, Briefcase, Languages } from 'lucide-react';
import { BACKEND_URL } from '../services/api';

export interface SkillMetadata {
  canonical: string;
  display: string;
  category: string;
  iconUrl?: string;
  iconType?: 'devicon' | 'simpleicons' | 'lucide';
  iconName?: string;
}

interface SkillIconProps {
  skill: string | SkillMetadata;
  className?: string;
}

// Global client-side memory cache for resolved skills
const clientSkillCache = new Map<string, SkillMetadata>();

// Local normalization alias mapping (fallback)
const normalizeSkillName = (name: string): string => {
  const clean = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const aliases: Record<string, string> = {
    'react': 'react',
    'react.js': 'react',
    'reactjs': 'react',
    'react native': 'react',
    'react query': 'react',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'node.js': 'nodejs',
    'node': 'nodejs',
    'nodejs': 'nodejs',
    'express': 'express',
    'express.js': 'express',
    'mongodb': 'mongodb',
    'mongo': 'mongodb',
    'c++': 'cplusplus',
    'cpp': 'cplusplus',
    'c#': 'csharp',
    'csharp': 'csharp',
    'python': 'python',
    'java': 'java',
    'spring boot': 'spring',
    'spring': 'spring',
    'mysql': 'mysql',
    'postgresql': 'postgresql',
    'postgres': 'postgresql',
    'html': 'html5',
    'html5': 'html5',
    'css': 'css3',
    'css3': 'css3',
    'tailwind': 'tailwindcss',
    'tailwind css': 'tailwindcss',
    'tailwindcss': 'tailwindcss',
    'figma': 'figma',
    'git': 'git',
    'github': 'github',
    'docker': 'docker',
    'kubernetes': 'kubernetes',
    'aws': 'amazonwebservices',
    'amazon web services': 'amazonwebservices',
    'azure': 'azure',
    'postman': 'postman',
    'tableau': 'tableau',
    'jenkins': 'jenkins',
    'google cloud': 'googlecloud',
    'gcp': 'googlecloud',
    'redux': 'redux',
    'sass': 'sass',
    'webpack': 'webpack',
    'angular': 'angularjs',
    'vue': 'vuejs',
    'go': 'go',
    'golang': 'go',
    'scala': 'scala',
    'testing': 'selenium',
    'selenium': 'selenium',
    'jira': 'jira',
  };

  return aliases[clean] || clean;
};

// Return CDN SVG urls for Devicon or Simple Icons (fallback)
const getIconUrl = (normalizedName: string): { url: string; type: 'devicon' | 'simpleicons' } | null => {
  const deviconBrands = [
    'react', 'javascript', 'typescript', 'nodejs', 'express', 'mongodb', 
    'cplusplus', 'csharp', 'python', 'java', 'spring', 'mysql', 
    'postgresql', 'html5', 'css3', 'tailwindcss', 'figma', 'git', 
    'github', 'docker', 'kubernetes', 'amazonwebservices', 'azure', 
    'jenkins', 'googlecloud', 'redux', 'sass', 'webpack', 'angularjs', 
    'vuejs', 'go', 'scala', 'selenium', 'jira'
  ];

  if (deviconBrands.includes(normalizedName)) {
    return {
      url: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${normalizedName}/${normalizedName}-original.svg`,
      type: 'devicon'
    };
  }

  const simpleIcons = ['postman', 'tableau'];
  if (simpleIcons.includes(normalizedName)) {
    return {
      url: `https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${normalizedName}.svg`,
      type: 'simpleicons'
    };
  }

  return null;
};

// Heuristic categories-to-lucide mapping
const renderGenericIcon = (name: string, iconName: string | undefined, className: string) => {
  const baseClass = `${className} text-zinc-400 shrink-0`;
  
  if (iconName) {
    switch (iconName) {
      case 'Terminal': return <Terminal className={baseClass} />;
      case 'Database': return <Database className={baseClass} />;
      case 'Brain': return <Brain className={baseClass} />;
      case 'FileCode': return <FileCode className={baseClass} />;
      case 'Settings': return <Settings className={baseClass} />;
      case 'Briefcase': return <Briefcase className={baseClass} />;
      case 'Languages': return <Languages className={baseClass} />;
    }
  }

  const lower = name.toLowerCase();
  if (lower.includes('db') || lower.includes('sql') || lower.includes('database') || lower.includes('query')) {
    return <Database className={baseClass} />;
  }
  if (lower.includes('api') || lower.includes('server') || lower.includes('back') || lower.includes('rest')) {
    return <Terminal className={baseClass} />;
  }
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('model') || lower.includes('machine learning') || lower.includes('neural')) {
    return <Brain className={baseClass} />;
  }
  if (lower.includes('test') || lower.includes('qa') || lower.includes('cypress') || lower.includes('coverage') || lower.includes('selenium') || lower.includes('playwright')) {
    return <FileCode className={baseClass} />;
  }
  if (lower.includes('manage') || lower.includes('lead') || lower.includes('hr') || lower.includes('strategy') || lower.includes('product') || lower.includes('business')) {
    return <Briefcase className={baseClass} />;
  }
  if (lower.includes('communication') || lower.includes('english') || lower.includes('lang') || lower.includes('writing')) {
    return <Languages className={baseClass} />;
  }
  if (lower.includes('excel') || lower.includes('sheet') || lower.includes('sap') || lower.includes('erp') || lower.includes('salesforce') || lower.includes('settings')) {
    return <Settings className={baseClass} />;
  }
  
  return <Wrench className={baseClass} />;
};

// Debounced batch resolution queue variables
let resolveQueue: string[] = [];
let resolveTimeout: any = null;
const resolveCallbacks = new Map<string, Array<(data: SkillMetadata) => void>>();

const processQueue = async () => {
  const skillsToResolve = [...new Set(resolveQueue)];
  resolveQueue = [];
  resolveTimeout = null;

  if (skillsToResolve.length === 0) return;

  try {
    const response = await fetch(`${BACKEND_URL}/skills/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: skillsToResolve })
    });
    if (response.ok) {
      const data = await response.json();
      const resolved = data.resolved || {};
      for (const [key, val] of Object.entries(resolved)) {
        const metadata = val as SkillMetadata;
        clientSkillCache.set(key, metadata);
        const callbacks = resolveCallbacks.get(key);
        if (callbacks) {
          callbacks.forEach(cb => cb(metadata));
          resolveCallbacks.delete(key);
        }
      }
    }
  } catch (err) {
    console.warn('[SkillIcon] Failed to batch resolve skills:', err);
  }
};

const queueSkillResolution = (skillName: string, callback: (data: SkillMetadata) => void) => {
  const lowerKey = skillName.toLowerCase().trim();
  
  // Synchronous Cache check
  if (clientSkillCache.has(lowerKey)) {
    callback(clientSkillCache.get(lowerKey)!);
    return;
  }

  // Synchronous Local Heuristic Pre-fill for instant brand icons
  const normalized = normalizeSkillName(skillName);
  const localIcon = getIconUrl(normalized);
  if (localIcon) {
    const localMeta: SkillMetadata = {
      canonical: normalized,
      display: skillName,
      category: 'Technology',
      iconUrl: normalized,
      iconType: localIcon.type
    };
    clientSkillCache.set(lowerKey, localMeta);
    callback(localMeta);
    return;
  }

  // Register callback
  let callbacks = resolveCallbacks.get(lowerKey);
  if (!callbacks) {
    callbacks = [];
    resolveCallbacks.set(lowerKey, callbacks);
  }
  callbacks.push(callback);

  // Add to queue
  resolveQueue.push(skillName);
  if (resolveTimeout) clearTimeout(resolveTimeout);
  resolveTimeout = setTimeout(processQueue, 50);
};

export const SkillIcon: React.FC<SkillIconProps> = ({ skill, className = 'size-4' }) => {
  const [resolvedMeta, setResolvedMeta] = useState<SkillMetadata | null>(() => {
    if (typeof skill === 'object' && skill !== null) {
      return skill as SkillMetadata;
    }
    const skillStr = String(skill || '').trim();
    const lowerKey = skillStr.toLowerCase();
    if (clientSkillCache.has(lowerKey)) {
      return clientSkillCache.get(lowerKey)!;
    }
    const normalized = normalizeSkillName(skillStr);
    const localIcon = getIconUrl(normalized);
    if (localIcon) {
      const localMeta: SkillMetadata = {
        canonical: normalized,
        display: skillStr,
        category: 'Technology',
        iconUrl: normalized,
        iconType: localIcon.type
      };
      clientSkillCache.set(lowerKey, localMeta);
      return localMeta;
    }
    return null;
  });

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof skill === 'object' && skill !== null) {
      setResolvedMeta(skill as SkillMetadata);
      return;
    }

    const skillStr = String(skill || '').trim();
    if (!skillStr) return;

    queueSkillResolution(skillStr, (metadata) => {
      setResolvedMeta(metadata);
    });
  }, [skill]);

  // Extract display parameters
  const skillName = typeof skill === 'object' && skill !== null ? skill.display : String(skill || '');
  
  if (hasError || !resolvedMeta || !resolvedMeta.iconUrl || resolvedMeta.iconType === 'lucide') {
    return renderGenericIcon(skillName, resolvedMeta?.iconName, className);
  }

  // Brand icon url resolution
  let srcUrl = '';
  if (resolvedMeta.iconType === 'devicon') {
    srcUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${resolvedMeta.iconUrl}/${resolvedMeta.iconUrl}-original.svg`;
  } else if (resolvedMeta.iconType === 'simpleicons') {
    srcUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${resolvedMeta.iconUrl}.svg`;
  }

  if (!srcUrl) {
    return renderGenericIcon(skillName, resolvedMeta.iconName, className);
  }

  return (
    <div className={`${className} flex items-center justify-center shrink-0 overflow-hidden`}>
      <img
        src={srcUrl}
        alt={`${skillName} icon`}
        className="w-full h-full object-contain"
        style={{ filter: resolvedMeta.iconType === 'simpleicons' ? 'invert(1) brightness(0.7)' : 'none' }}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
