import React, { useState } from 'react';

interface CompanyLogoProps {
  companyName: string;
  companyLogo?: string;
  companyDomain?: string;
  className?: string;
}

// Global in-memory cache for resolved company logo URLs or failures
const logoUrlCache = new Map<string, string | 'INITIALS'>();

// Known company domain lookup table (key = normalized company name, no spaces/punctuation)
const knownDomains: Record<string, string> = {
  // ── Global Tech Giants ───────────────────────────────────────────────────
  'google': 'google.com',
  'alphabet': 'abc.xyz',
  'microsoft': 'microsoft.com',
  'apple': 'apple.com',
  'amazon': 'amazon.com',
  'amazonwebservices': 'aws.amazon.com',
  'aws': 'aws.amazon.com',
  'meta': 'meta.com',
  'facebook': 'facebook.com',
  'netflix': 'netflix.com',
  'uber': 'uber.com',
  'twitter': 'twitter.com',
  'x': 'x.com',
  'linkedin': 'linkedin.com',
  'salesforce': 'salesforce.com',
  'oracle': 'oracle.com',
  'sap': 'sap.com',
  'ibm': 'ibm.com',
  'intel': 'intel.com',
  'nvidia': 'nvidia.com',
  'qualcomm': 'qualcomm.com',
  'adobe': 'adobe.com',
  'atlassian': 'atlassian.com',
  'slack': 'slack.com',
  'zoom': 'zoom.us',
  'dropbox': 'dropbox.com',
  'spotify': 'spotify.com',
  'airbnb': 'airbnb.com',
  'stripe': 'stripe.com',
  'shopify': 'shopify.com',
  'twilio': 'twilio.com',
  'github': 'github.com',
  'gitlab': 'gitlab.com',
  'cloudflare': 'cloudflare.com',
  'datadog': 'datadoghq.com',
  'snowflake': 'snowflake.com',
  'palantir': 'palantir.com',
  'workday': 'workday.com',
  'servicenow': 'servicenow.com',
  'hubspot': 'hubspot.com',
  'zendesk': 'zendesk.com',
  'mongodb': 'mongodb.com',
  'elastic': 'elastic.co',
  'hashicorp': 'hashicorp.com',
  'confluent': 'confluent.io',
  'databricks': 'databricks.com',
  'figma': 'figma.com',
  'notion': 'notion.so',
  'airtable': 'airtable.com',
  'asana': 'asana.com',
  'jira': 'atlassian.com',
  'clickup': 'clickup.com',

  // ── Indian IT Giants ─────────────────────────────────────────────────────
  'tcs': 'tcs.com',
  'tataconsultancyservices': 'tcs.com',
  'infosys': 'infosys.com',
  'wipro': 'wipro.com',
  'hcl': 'hcltech.com',
  'hcltech': 'hcltech.com',
  'hcltechnologies': 'hcltech.com',
  'techm': 'techmahindra.com',
  'techmahindra': 'techmahindra.com',
  'ltimindtree': 'ltimindtree.com',
  'mphasis': 'mphasis.com',
  'hexaware': 'hexaware.com',
  'niit': 'niit.com',
  'cognizant': 'cognizant.com',
  'accenture': 'accenture.com',
  'capgemini': 'capgemini.com',

  // ── Indian Unicorns & Startups ────────────────────────────────────────────
  'razorpay': 'razorpay.com',
  'swiggy': 'swiggy.com',
  'zomato': 'zomato.com',
  'phonepe': 'phonepe.com',
  'paytm': 'paytm.com',
  'ola': 'olacabs.com',
  'olacabs': 'olacabs.com',
  'flipkart': 'flipkart.com',
  'meesho': 'meesho.com',
  'cred': 'cred.club',
  'zepto': 'zeptonow.com',
  'blinkit': 'blinkit.com',
  'byju': 'byjus.com',
  'byjus': 'byjus.com',
  'unacademy': 'unacademy.com',
  'vedantu': 'vedantu.com',
  'upgrad': 'upgrad.com',
  'freshworks': 'freshworks.com',
  'zoho': 'zoho.com',
  'postman': 'postman.com',
  'browserstack': 'browserstack.com',
  'chargebee': 'chargebee.com',
  'clevertap': 'clevertap.com',
  'appsflyer': 'apgsflyer.com',
  'inmobi': 'inmobi.com',
  'juspay': 'juspay.in',
  'groww': 'groww.in',
  'zerodha': 'zerodha.com',
  'angelone': 'angelone.in',
  'smallcase': 'smallcase.com',
  'navi': 'navi.com',
  'slice': 'sliceit.com',
  'moneytap': 'moneytap.com',
  'lendingkart': 'lendingkart.com',
  'oyo': 'oyorooms.com',
  'oyorooms': 'oyorooms.com',
  'makemytrip': 'makemytrip.com',
  'goibibo': 'goibibo.com',
  'cleartrip': 'cleartrip.com',
  'ixigo': 'ixigo.com',
  'nykaa': 'nykaa.com',
  'myntra': 'myntra.com',
  'ajio': 'ajio.com',
  'pepperfry': 'pepperfry.com',
  'dunzo': 'dunzo.in',
  'rapido': 'rapido.bike',
  'cure': 'cult.fit',
  'curefit': 'cult.fit',
  'cultfit': 'cult.fit',
  'mfine': 'mfine.co',
  'practo': 'practo.com',
  'pharmeasy': 'pharmeasy.in',
  'tata1mg': '1mg.com',
  'healthifyme': 'healthifyme.com',
  'licious': 'licious.in',
  'meatigo': 'meatigo.com',
  'bigbasket': 'bigbasket.com',
  'jiomart': 'jiomart.com',
  'reliance': 'ril.com',
  'jio': 'jio.com',
  'airtel': 'airtel.in',
  'vodafone': 'vodafoneidea.com',
  'vi': 'myvi.in',
  'bsnl': 'bsnl.co.in',
  'hdfc': 'hdfc.com',
  'hdfcbank': 'hdfcbank.com',
  'icici': 'icicibank.com',
  'icicibank': 'icicibank.com',
  'sbi': 'sbi.co.in',
  'axisbank': 'axisbank.com',
  'kotak': 'kotak.com',
  'kotakbank': 'kotak.com',
  'indusind': 'indusind.com',
  'idfc': 'idfcfirstbank.com',
  'bajajfinserv': 'bajajfinserv.in',

  // ── Job Platforms (for the ExternalPlatforms bar) ────────────────────────
  'naukri': 'naukri.com',
  'indeed': 'indeed.com',
  'glassdoor': 'glassdoor.com',
  'foundit': 'foundit.in',
  'internshala': 'internshala.com',
  'shine': 'shine.com',
  'monster': 'monsterindia.com',
  'timesjobs': 'timesjobs.com',
  'workindia': 'workindia.in',
  'hirist': 'hirist.tech',
  'instahyre': 'instahyre.com',
  'cutshort': 'cutshort.io',
  'wellfound': 'wellfound.com',
  'angel': 'angellist.com',
  'angellist': 'angellist.com',
  'remoteok': 'remoteok.com',
  'ycombinator': 'ycombinator.com',
  'lever': 'lever.co',
  'greenhouse': 'greenhouse.io',
  'icims': 'icims.com',
  'bamboohr': 'bamboohr.com',

  // ── Consulting & Services ─────────────────────────────────────────────────
  'deloitte': 'deloitte.com',
  'pwc': 'pwc.com',
  'kpmg': 'kpmg.com',
  'ey': 'ey.com',
  'ernst': 'ey.com',
  'mckinsey': 'mckinsey.com',
  'bcg': 'bcg.com',
  'bostonconsgrouping': 'bcg.com',
  'bain': 'bain.com',
  'thoughtworks': 'thoughtworks.com',
  'globallogic': 'globallogic.com',
  'nagarro': 'nagarro.com',
  'persistent': 'persistent.com',
  'mindtree': 'ltimindtree.com',
  'birlasoft': 'birlasoft.com',
  'cyient': 'cyient.com',
  'syntel': 'atos.net',
  'nisum': 'nisum.com',

  // ── Gaming & Media ────────────────────────────────────────────────────────
  'epic': 'epicgames.com',
  'epicgames': 'epicgames.com',
  'unity': 'unity.com',
  'unitytech': 'unity.com',
  'ea': 'ea.com',
  'electronicarts': 'ea.com',
  'zynga': 'zynga.com',
  'dream11': 'dream11.com',
  'mpl': 'mpl.live',
  'hotstar': 'hotstar.com',
  'jiocinema': 'jiocinema.com',
  'sonyliv': 'sonyliv.com',
  'zee5': 'zee5.com',
};


// Normalize company names ("Google LLC" -> "Google")
export const normalizeCompanyName = (rawName: string = ''): { cleanName: string; key: string } => {
  const cleanName = rawName
    .replace(/,?\s*(llc|inc\.?|pvt\.?\s*ltd\.?|ltd\.?|corp\.?|corporation|technologies|services|software|solutions|labs|group)$/i, '')
    .replace(/,?\s*(llc|inc\.?|pvt\.?\s*ltd\.?|ltd\.?|corp\.?|corporation|technologies|services|software|solutions|labs|group)$/i, '')
    .trim();

  const key = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return { cleanName: cleanName || rawName, key: key || 'company' };
};

// Extract initials (Google -> "G", Tata Consultancy Services -> "TCS")
export const getCompanyInitials = (name: string = ''): string => {
  const { cleanName } = normalizeCompanyName(name);
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'CO';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companyName,
  companyLogo,
  companyDomain,
  className = 'size-10'
}) => {
  const { cleanName, key } = normalizeCompanyName(companyName);

  // Determine domain if available
  let domain = companyDomain?.trim();
  if (!domain && knownDomains[key]) {
    domain = knownDomains[key];
  }

  // Check cache first
  const cachedStatus = logoUrlCache.get(key);
  
  // Local state tracking image src attempt level
  // 0: try primary companyLogo or Clearbit
  // 1: try Google Favicon CDN
  // 2: fallback to Initials
  const [attemptLevel, setAttemptLevel] = useState<number>(cachedStatus === 'INITIALS' ? 2 : 0);
  const [currentSrc, setCurrentSrc] = useState<string | null>(() => {
    if (cachedStatus && cachedStatus !== 'INITIALS') return cachedStatus;
    if (companyLogo && companyLogo.startsWith('http')) return companyLogo;
    if (domain) return `https://logo.clearbit.com/${domain}`;
    return null;
  });

  const handleError = () => {
    if (attemptLevel === 0 && domain) {
      // Try Google Favicon CDN as fallback
      const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      setCurrentSrc(fallbackFavicon);
      setAttemptLevel(1);
    } else {
      // Mark as INITIALS fallback in cache
      logoUrlCache.set(key, 'INITIALS');
      setAttemptLevel(2);
      setCurrentSrc(null);
    }
  };

  const handleLoadSuccess = () => {
    if (currentSrc) {
      logoUrlCache.set(key, currentSrc);
    }
  };

  const initials = getCompanyInitials(companyName);

  if (attemptLevel >= 2 || !currentSrc) {
    return (
      <div 
        className={`${className} rounded border border-zinc-800 bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0 select-none`}
        title={cleanName}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${className} rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0`}>
      <img
        src={currentSrc}
        alt={`${cleanName} logo`}
        className="w-full h-full object-contain p-0.5"
        onLoad={handleLoadSuccess}
        onError={handleError}
      />
    </div>
  );
};
