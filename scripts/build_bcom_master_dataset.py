import pandas as pd
import pyarrow.parquet as pq
import re
import os
import sys

def create_directories():
    os.makedirs('data', exist_ok=True)
    os.makedirs('reports', exist_ok=True)
    os.makedirs('ml/datasets/final', exist_ok=True)

# Regex patterns to exclude non-B.Com domains
NON_BCOM_TITLE_PATTERNS = [
    r'\b(software engineer|software developer|backend developer|frontend developer|full stack|fullstack)\b',
    r'\b(java developer|python developer|\.net developer|c\+\+ developer|react developer|ios developer|android developer|web developer)\b',
    r'\b(devops|cloud architect|qa engineer|test engineer|automation engineer|systems engineer|database administrator|dba)\b',
    r'\b(network engineer|cybersecurity|security engineer|data engineer|machine learning|ai engineer)\b',
    r'\b(mechanical engineer|electrical engineer|electronics engineer|hardware engineer|embedded engineer|civil engineer|structural engineer|chemical engineer|cad designer|draftsman)\b',
    r'\b(nurse|registered nurse|\brn\b|doctor|physician|surgeon|therapist|radiologist|dentist|pharmacist|dental assistant|medical assistant|caregiver)\b',
    r'\b(plumber|electrician|mechanic|carpenter|welder|janitor|cleaner|housekeeper|cook|chef|baker|driver|truck driver|delivery driver|security guard)\b',
    r'\b(attorney|lawyer|paralegal|legal assistant|solicitor)\b',
    r'\b(recruiter|talent acquisition|hr generalist|human resources manager|people operations)\b',
    r'\b(marketing manager|digital marketing specialist|seo specialist|content writer|copywriter)\b',
    r'\b(inside sales|sales executive|account executive|b2b sales|sales representative|retail associate)\b'
]

NON_BCOM_REGEX = re.compile('|'.join(NON_BCOM_TITLE_PATTERNS), re.IGNORECASE)

BCOM_CANDIDATE_REGEX = re.compile(
    r'\b(accountant|accounting|financial analyst|finance analyst|fp&a|fpa|tax|auditor|audit|finance executive|finance officer|finance associate|treasury|bookkeeper|bookkeeping|accounts clerk|accounts assistant)\b',
    re.IGNORECASE
)

def is_non_bcom_role(title):
    t = str(title).strip()
    return bool(NON_BCOM_REGEX.search(t))

def classify_bcom_record(title, description, skills=''):
    t = str(title).strip().lower()
    d = str(description).strip().lower()
    s = str(skills).strip().lower()
    full_ctx = f"{t} {s} {d}"

    if is_non_bcom_role(t):
        return None, "rejected_non_bcom_domain"

    # --- 1. Tax Consultant ---
    # Tax specific responsibilities must dominate
    if re.search(r'\b(tax consultant|tax advisor|tax analyst|tax associate|tax specialist|tax manager|corporate tax|tax compliance|tax planning|tax accountant)\b', t):
        if re.search(r'\b(software|developer|engineer)\b', t):
            return None, "rejected_tax_dev_conflict"
        return "Tax Consultant", "accepted"

    if re.search(r'\b(taxation|income tax|corporate tax|gst|vat|tax returns|tax filing|tax advisory)\b', full_ctx):
        if re.search(r'\b(tax consultant|tax advisor|tax specialist|tax analyst|tax associate)\b', full_ctx) or ('tax' in t and 'account' not in t):
            return "Tax Consultant", "accepted"

    # --- 2. Auditor ---
    # Audit, internal audit, statutory audit, controls testing, SOX
    if re.search(r'\b(auditor|internal auditor|external auditor|audit associate|audit executive|statutory auditor|audit manager|sox auditor|senior auditor|sr auditor|lead auditor)\b', t):
        if re.search(r'\b(software|developer|engineer|quality auditor|qa auditor)\b', t):
            return None, "rejected_non_finance_auditor"
        return "Auditor", "accepted"

    if re.search(r'\b(internal audit|external audit|statutory audit|audit planning|audit evidence|controls testing|sox compliance|audit procedures)\b', full_ctx):
        if not re.search(r'\b(software qa|quality assurance|code audit)\b', full_ctx):
            return "Auditor", "accepted"

    # --- 3. Financial Analyst ---
    # FP&A, financial modeling, forecasting, budgeting, valuation, investment analysis
    if re.search(r'\b(financial analyst|fp&a analyst|fpa analyst|investment analyst|financial planning analyst|corporate financial analyst|finance analyst|senior financial analyst|sr financial analyst|lead financial analyst)\b', t):
        if re.search(r'\b(software engineer|data scientist)\b', t):
            return None, "rejected_fa_dev_conflict"
        return "Financial Analyst", "accepted"

    if re.search(r'\b(financial modeling|financial forecasting|fp&a|financial planning and analysis|variance analysis|financial valuation|investment analysis)\b', full_ctx):
        if re.search(r'\b(analyst|finance)\b', t) and not re.search(r'\b(data scientist|software|developer)\b', t):
            return "Financial Analyst", "accepted"

    # --- 4. Bookkeeper ---
    # Daily transaction entry, bookkeeping, ledger posting, invoices, receipts, QuickBooks, Xero
    if re.search(r'\b(bookkeeper|junior bookkeeper|accounting clerk|bookkeeping specialist|accounts clerk|accounts assistant|full charge bookkeeper)\b', t):
        return "Bookkeeper", "accepted"

    if re.search(r'\b(bookkeeping|quickbooks|xero|ledger posting|daily transactions|invoice entry|accounts clerk)\b', full_ctx):
        if not re.search(r'\b(financial statements|month end closing|statutory audit|tax planning|corporate finance)\b', full_ctx):
            if re.search(r'\b(bookkeeper|clerk|bookkeeping)\b', t) or ('bookkeeper' in full_ctx and 'senior accountant' not in full_ctx):
                return "Bookkeeper", "accepted"

    # --- 5. Finance Executive ---
    # Corporate finance operations, treasury, cash-flow management, financial controls, finance officer
    if re.search(r'\b(finance executive|finance officer|finance associate|finance operations executive|corporate finance executive|treasury executive|cash management executive|finance manager|financial controller|treasury analyst|treasury manager|finance lead)\b', t):
        if re.search(r'\b(software|developer|engineer)\b', t):
            return None, "rejected_finance_exec_dev"
        return "Finance Executive", "accepted"

    if re.search(r'\b(treasury management|cash flow management|corporate finance operations|financial controls|finance operations)\b', full_ctx):
        if re.search(r'\b(finance|treasury)\b', t):
            return "Finance Executive", "accepted"

    # --- 6. Accountant ---
    # General ledger, journal entries, AP/AR, bank reconciliation, financial statements, month/year-end closing
    if re.search(r'\b(accountant|staff accountant|general accountant|accounts accountant|accounting specialist|senior accountant|sr\.? accountant|lead accountant|principal accountant|cost accountant|management accountant)\b', t):
        if re.search(r'\b(software|developer|engineer)\b', t):
            return None, "rejected_accountant_dev_conflict"
        # Check boundary vs Tax Consultant
        if re.search(r'\b(tax consultant|tax advisor|tax returns|gst filing)\b', full_ctx) and not re.search(r'\bgeneral ledger|financial statements|reconciliation|ap/ar\b', full_ctx):
            return "Tax Consultant", "accepted"
        # Check boundary vs Auditor
        if re.search(r'\b(internal auditor|statutory auditor|audit planning|controls testing)\b', full_ctx) and not re.search(r'\bgeneral ledger|journal entries|accounts payable\b', full_ctx):
            return "Auditor", "accepted"
        return "Accountant", "accepted"

    if re.search(r'\b(general ledger|journal entries|accounts payable|accounts receivable|bank reconciliation|financial statements|month-end closing|year-end closing)\b', full_ctx):
        if re.search(r'\b(accounting|accountant)\b', t) or ('accountant' in full_ctx and 'software' not in t):
            return "Accountant", "accepted"

    return None, "rejected_no_role_match_or_ambiguous"

def normalize_text(text):
    if not text:
        return ""
    t = str(text).lower()
    t = re.sub(r'[^a-z0-9\s]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def build_bcom_master_dataset():
    create_directories()
    print("Starting B.Com Master Dataset Construction Pipeline...", flush=True)

    audit_records = []
    accepted_records = []

    seen_source_ids = set()
    seen_normalized_texts = set()
    seen_cross_source_fingerprints = set()

    total_inspected = 0

    # -------------------------------------------------------------
    # SOURCE 1: Kaggle / HuggingFace Parquet Dataset
    # -------------------------------------------------------------
    parquet_path = 'c:/Users/Lenovo/Downloads/1.3Linkedin/train-00000-of-00001.parquet'
    print(f"\nProcessing Source 1: {parquet_path}...", flush=True)
    df_pq = pd.read_parquet(parquet_path)
    
    source1_name = "kaggle_huggingface_parquet"

    for idx, row in df_pq.iterrows():
        total_inspected += 1
        source_job_id = f"pq_{row.get('id', idx)}"
        title = str(row.get('Position', '')).strip()
        company = str(row.get('Company Name', '')).strip()
        skills = str(row.get('Primary Keyword', '')).strip()
        desc = str(row.get('Long Description', '')).strip()

        if not title or not desc or len(desc) < 100:
            audit_records.append({
                'source': source1_name,
                'source_job_id': source_job_id,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'insufficient_text_length_or_missing_fields',
                'assigned_role': ''
            })
            continue

        role, status = classify_bcom_record(title, desc, skills)

        if not role:
            audit_records.append({
                'source': source1_name,
                'source_job_id': source_job_id,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': status,
                'assigned_role': ''
            })
            continue

        if source_job_id in seen_source_ids:
            audit_records.append({
                'source': source1_name,
                'source_job_id': source_job_id,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'duplicate_source_id',
                'assigned_role': role
            })
            continue

        constructed_text = f"Job Title: {title}\nCompany: {company}\nSkills: {skills}\nDescription: {desc}"
        norm_txt = normalize_text(constructed_text)

        if norm_txt in seen_normalized_texts:
            audit_records.append({
                'source': source1_name,
                'source_job_id': source_job_id,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'duplicate_normalized_text',
                'assigned_role': role
            })
            continue

        fp = f"{normalize_text(title)}|{normalize_text(company)}|{norm_txt[:150]}"
        if fp in seen_cross_source_fingerprints:
            audit_records.append({
                'source': source1_name,
                'source_job_id': source_job_id,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'cross_source_duplicate',
                'assigned_role': role
            })
            continue

        seen_source_ids.add(source_job_id)
        seen_normalized_texts.add(norm_txt)
        seen_cross_source_fingerprints.add(fp)

        accepted_records.append({
            'text': constructed_text,
            'role': role,
            'domain': 'B.Com',
            'source': source1_name,
            'source_job_id': source_job_id
        })

        audit_records.append({
            'source': source1_name,
            'source_job_id': source_job_id,
            'title': title,
            'company': company,
            'status': 'accepted',
            'rejection_reason': '',
            'assigned_role': role
        })

    print(f"Parquet source complete. Accepted: {len(accepted_records)}", flush=True)

    # -------------------------------------------------------------
    # SOURCE 2: 1.3M LinkedIn Jobs & Skills 2024 Dataset
    # -------------------------------------------------------------
    print("\nProcessing Source 2: 1.3M LinkedIn Jobs & Skills 2024...", flush=True)
    source2_name = "1.3M_linkedin_jobs_2024"

    postings_path = 'c:/Users/Lenovo/Downloads/1.3Linkedin/linkedin_job_postings.csv'
    skills_path = 'c:/Users/Lenovo/Downloads/1.3Linkedin/job_skills.csv'
    summary_path = 'c:/Users/Lenovo/Downloads/1.3Linkedin/job_summary.csv'

    print("Step 1: Vectorized filtering of candidate B.Com postings...", flush=True)
    df_postings = pd.read_csv(postings_path, usecols=['job_link', 'job_title', 'company', 'search_position'])
    total_inspected += len(df_postings)

    titles_series = df_postings['job_title'].fillna('')
    is_non_bcom_mask = titles_series.str.contains(NON_BCOM_REGEX)
    is_candidate_mask = ~is_non_bcom_mask & titles_series.str.contains(BCOM_CANDIDATE_REGEX)
    
    df_candidates = df_postings[is_candidate_mask].copy()
    candidate_links = set(df_candidates['job_link'])
    print(f"Candidate postings identified: {len(df_candidates)} out of {len(df_postings)}", flush=True)

    print("Step 2: Stream loading matching skills for candidate postings...", flush=True)
    skills_map = {}
    for chunk in pd.read_csv(skills_path, chunksize=200000):
        chunk_filtered = chunk[chunk['job_link'].isin(candidate_links)]
        for jl, sk in zip(chunk_filtered['job_link'], chunk_filtered['job_skills']):
            skills_map[jl] = str(sk)

    print(f"Skills loaded for {len(skills_map)} candidates.", flush=True)

    print("Step 3: Stream loading matching summaries for candidate postings...", flush=True)
    summary_map = {}
    for chunk in pd.read_csv(summary_path, chunksize=200000):
        chunk_filtered = chunk[chunk['job_link'].isin(candidate_links)]
        for jl, sm in zip(chunk_filtered['job_link'], chunk_filtered['job_summary']):
            summary_map[jl] = str(sm)

    print(f"Summaries loaded for {len(summary_map)} candidates.", flush=True)

    print("Step 4: Evaluating candidate records and constructing final text...", flush=True)
    for _, row in df_candidates.iterrows():
        job_link = str(row['job_link']).strip()
        title = str(row.get('job_title', '')).strip()
        company = str(row.get('company', '')).strip()

        if job_link in seen_source_ids:
            audit_records.append({
                'source': source2_name,
                'source_job_id': job_link,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'duplicate_source_id',
                'assigned_role': ''
            })
            continue

        skills = skills_map.get(job_link, "").strip()
        summary = summary_map.get(job_link, "").strip()

        if summary.lower() == 'nan':
            summary = ""
        if skills.lower() == 'nan':
            skills = ""

        if not summary or len(summary) < 100:
            audit_records.append({
                'source': source2_name,
                'source_job_id': job_link,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'insufficient_text_length_or_missing_summary',
                'assigned_role': ''
            })
            continue

        role, status = classify_bcom_record(title, summary, skills)

        if not role:
            audit_records.append({
                'source': source2_name,
                'source_job_id': job_link,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': status,
                'assigned_role': ''
            })
            continue

        constructed_text = f"Job Title: {title}\nCompany: {company}\nSkills: {skills}\nDescription: {summary}"
        norm_txt = normalize_text(constructed_text)

        if norm_txt in seen_normalized_texts:
            audit_records.append({
                'source': source2_name,
                'source_job_id': job_link,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'duplicate_normalized_text',
                'assigned_role': role
            })
            continue

        fp = f"{normalize_text(title)}|{normalize_text(company)}|{norm_txt[:150]}"
        if fp in seen_cross_source_fingerprints:
            audit_records.append({
                'source': source2_name,
                'source_job_id': job_link,
                'title': title,
                'company': company,
                'status': 'rejected',
                'rejection_reason': 'cross_source_duplicate',
                'assigned_role': role
            })
            continue

        seen_source_ids.add(job_link)
        seen_normalized_texts.add(norm_txt)
        seen_cross_source_fingerprints.add(fp)

        accepted_records.append({
            'text': constructed_text,
            'role': role,
            'domain': 'B.Com',
            'source': source2_name,
            'source_job_id': job_link
        })

        audit_records.append({
            'source': source2_name,
            'source_job_id': job_link,
            'title': title,
            'company': company,
            'status': 'accepted',
            'rejection_reason': '',
            'assigned_role': role
        })

    print(f"\nAll sources processed successfully!", flush=True)
    print(f"Total Source Records Inspected: {total_inspected}", flush=True)
    print(f"Total Accepted B.Com Master Records: {len(accepted_records)}", flush=True)

    # -------------------------------------------------------------
    # EXPORT OUTPUTS
    # -------------------------------------------------------------
    df_master = pd.DataFrame(accepted_records)
    df_audit = pd.DataFrame(audit_records)

    df_master.to_csv('data/bcom_master.csv', index=False)
    df_master.to_parquet('data/bcom_master.parquet', index=False)
    
    df_master.to_csv('ml/datasets/final/bcom_master.csv', index=False)
    df_master.to_parquet('ml/datasets/final/bcom_master.parquet', index=False)

    df_audit.to_csv('reports/bcom_master_audit.csv', index=False)

    role_counts = df_master['role'].value_counts().to_dict()
    canonical_roles = [
        'Accountant',
        'Financial Analyst',
        'Tax Consultant',
        'Auditor',
        'Finance Executive',
        'Bookkeeper'
    ]

    summary_rows = []
    for r in canonical_roles:
        cnt = role_counts.get(r, 0)
        summary_rows.append({
            'role': r,
            'accepted_count': cnt,
            'min_300_met': cnt >= 300,
            'preferred_500_met': cnt >= 500
        })

    df_role_summary = pd.DataFrame(summary_rows)
    df_role_summary.to_csv('reports/bcom_master_role_counts.csv', index=False)

    print("\n=== B.COM ROLE DISTRIBUTION ===", flush=True)
    print(df_role_summary, flush=True)

    source_counts = df_master['source'].value_counts().to_dict()
    print("\n=== SOURCE DISTRIBUTION ===", flush=True)
    for s, c in source_counts.items():
        print(f"  {s}: {c}", flush=True)

    rejection_counts = df_audit[df_audit['status'] == 'rejected']['rejection_reason'].value_counts().to_dict()
    print("\n=== REJECTION REASONS ===", flush=True)
    for r, c in rejection_counts.items():
        print(f"  {r}: {c}", flush=True)

if __name__ == '__main__':
    build_bcom_master_dataset()
