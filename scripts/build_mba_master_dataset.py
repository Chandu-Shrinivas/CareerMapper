import pandas as pd
import pyarrow.parquet as pq
import re
import os
import sys

def create_directories():
    os.makedirs('data', exist_ok=True)
    os.makedirs('reports', exist_ok=True)
    os.makedirs('ml/datasets/final', exist_ok=True)

# Define regex patterns for non-MBA exclusion
NON_MBA_TITLE_PATTERNS = [
    r'\b(software engineer|software developer|backend developer|frontend developer|full stack|fullstack)\b',
    r'\b(java developer|python developer|\.net developer|c\+\+ developer|react developer|ios developer|android developer|web developer)\b',
    r'\b(devops|cloud architect|qa engineer|test engineer|automation engineer|systems engineer|database administrator|dba)\b',
    r'\b(network engineer|cybersecurity|security engineer|data engineer|data scientist|machine learning|ai engineer)\b',
    r'\b(mechanical engineer|electrical engineer|electronics engineer|hardware engineer|embedded engineer|civil engineer|structural engineer|chemical engineer|cad designer|draftsman)\b',
    r'\b(nurse|registered nurse|\brn\b|doctor|physician|surgeon|therapist|radiologist|dentist|pharmacist|dental assistant|medical assistant|caregiver)\b',
    r'\b(plumber|electrician|mechanic|carpenter|welder|janitor|cleaner|housekeeper|cook|chef|baker|driver|truck driver|delivery driver|security guard)\b',
    r'\b(attorney|lawyer|paralegal|legal assistant|solicitor)\b',
    r'\b(bookkeeper|accounts payable|accounts receivable|payroll clerk|tax accountant|staff accountant)\b'
]

NON_MBA_REGEX = re.compile('|'.join(NON_MBA_TITLE_PATTERNS), re.IGNORECASE)

MBA_CANDIDATE_REGEX = re.compile(
    r'\b(business analyst|process analyst|marketing analyst|market research|campaign analyst|hr executive|human resources|recruiter|talent acquisition|product manager|product owner|sales executive|account executive|business development|operations manager|logistics manager|supply chain|operations executive)\b',
    re.IGNORECASE
)

def is_non_mba_role(title):
    t = str(title).strip()
    return bool(NON_MBA_REGEX.search(t))

def classify_record(title, description, skills=''):
    t = str(title).strip().lower()
    d = str(description).strip().lower()
    s = str(skills).strip().lower()
    full_ctx = f"{t} {s} {d}"

    if is_non_mba_role(t):
        return None, "rejected_non_mba_domain"

    # --- 1. Product Manager ---
    if re.search(r'\b(product manager|product owner|associate product manager|senior product manager|lead product manager|principal product manager|director of product|head of product|group product manager|technical product manager)\b', t):
        if re.search(r'\b(project manager|program manager|construction|site manager)\b', t) and not re.search(r'\bproduct\b', t):
            return None, "rejected_project_vs_product_ambiguity"
        if re.search(r'\b(product roadmap|product strategy|product lifecycle|user stories|product backlog|feature prioritization|product metrics|product discovery)\b', full_ctx):
            return "Product Manager", "accepted"
        if re.search(r'\b(roadmap|lifecycle|backlog|feature|user story|metrics|discovery|sprint|agile)\b', full_ctx):
            return "Product Manager", "accepted"
        return "Product Manager", "accepted"

    # --- 2. Business Analyst ---
    if re.search(r'\b(business analyst|process analyst|business systems analyst|business process analyst|senior business analyst|sr\.? business analyst|lead business analyst|principal business analyst|business requirements analyst|requirements analyst)\b', t):
        if re.search(r'\b(software|developer|product manager|product owner)\b', t):
            return None, "rejected_ba_vs_pm_dev_conflict"
        if re.search(r'\b(product roadmap|product strategy|product backlog|product lifecycle)\b', full_ctx) and not re.search(r'\bbusiness requirements|process analysis|brd|frd|stakeholder\b', full_ctx):
            return "Product Manager", "accepted"
        return "Business Analyst", "accepted"
    
    if re.search(r'\b(analyst|functional analyst|systems analyst)\b', t):
        if re.search(r'\b(business requirements|process analysis|requirements gathering|brd|frd|business process improvement|stakeholder analysis|gap analysis)\b', full_ctx):
            if not re.search(r'\b(marketing|campaign|seo|sem|customer acquisition|product roadmap)\b', full_ctx):
                return "Business Analyst", "accepted"

    # --- 3. Marketing Analyst ---
    if re.search(r'\b(marketing analyst|market research analyst|campaign analyst|digital marketing analyst|marketing data analyst|consumer insights analyst|customer insights analyst|marketing intelligence analyst|market analyst|seo analyst|sem analyst|growth analyst|marketing performance analyst|marketing operations analyst)\b', t):
        if re.search(r'\b(software|developer|engineer)\b', t):
            return None, "rejected_technical_marketing_dev"
        return "Marketing Analyst", "accepted"

    if re.search(r'\b(marketing specialist|market researcher|digital marketing specialist|growth specialist)\b', t):
        if re.search(r'\b(analytics|campaign|market research|consumer insights|seo|sem|conversion|segmentation|marketing performance)\b', full_ctx):
            return "Marketing Analyst", "accepted"

    # --- 4. HR Executive ---
    if re.search(r'\b(hr executive|human resources executive|hr generalist|human resources generalist|recruiter|technical recruiter|talent acquisition specialist|talent acquisition manager|hr specialist|hr manager|human resources manager|human resources specialist|hr coordinator|hr officer|people operations manager|talent acquisition partner|compensation analyst|benefits specialist)\b', t):
        return "HR Executive", "accepted"

    # --- 5. Sales Executive ---
    if re.search(r'\b(sales executive|account executive|business development executive|business development manager|sales manager|sales representative|inside sales executive|sales associate|sales director|regional sales manager|key account manager|enterprise sales executive|b2b sales representative|sales specialist)\b', t):
        if re.search(r'\b(software engineer|developer)\b', t):
            return None, "rejected_sales_dev_conflict"
        return "Sales Executive", "accepted"

    # --- 6. Operations Manager ---
    if re.search(r'\b(operations manager|operational manager|supply chain manager|logistics manager|operations executive|operations lead|operations specialist|service operations manager|business operations manager|plant operations manager|operations supervisor|director of operations|fulfillment operations manager|warehouse operations manager)\b', t):
        if re.search(r'\b(it operations|network operations|security operations|devops)\b', t):
            return None, "rejected_it_ops"
        return "Operations Manager", "accepted"

    return None, "rejected_no_role_match_or_ambiguous"

def normalize_text(text):
    if not text:
        return ""
    t = str(text).lower()
    t = re.sub(r'[^a-z0-9\s]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def build_master_dataset():
    create_directories()
    print("Starting MBA Master Dataset Construction Pipeline...", flush=True)

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

        role, status = classify_record(title, desc, skills)

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
            'domain': 'MBA',
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
    # SOURCE 2: 1.3M LinkedIn Jobs & Skills 2024 Dataset (Vectorized)
    # -------------------------------------------------------------
    print("\nProcessing Source 2: 1.3M LinkedIn Jobs & Skills 2024...", flush=True)
    source2_name = "1.3M_linkedin_jobs_2024"

    postings_path = 'c:/Users/Lenovo/Downloads/1.3Linkedin/linkedin_job_postings.csv'
    skills_path = 'c:/Users/Lenovo/Downloads/1.3Linkedin/job_skills.csv'
    summary_path = 'c:/Users/Lenovo/Downloads/1.3Linkedin/job_summary.csv'

    print("Step 1: Vectorized filtering of candidate MBA postings...", flush=True)
    df_postings = pd.read_csv(postings_path, usecols=['job_link', 'job_title', 'company', 'search_position'])
    total_inspected += len(df_postings)

    titles_series = df_postings['job_title'].fillna('')
    is_non_mba_mask = titles_series.str.contains(NON_MBA_REGEX)
    is_candidate_mask = ~is_non_mba_mask & titles_series.str.contains(MBA_CANDIDATE_REGEX)
    
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

        role, status = classify_record(title, summary, skills)

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
            'domain': 'MBA',
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
    print(f"Total Accepted MBA Master Records: {len(accepted_records)}", flush=True)

    # -------------------------------------------------------------
    # EXPORT OUTPUTS
    # -------------------------------------------------------------
    df_master = pd.DataFrame(accepted_records)
    df_audit = pd.DataFrame(audit_records)

    df_master.to_csv('data/mba_master.csv', index=False)
    df_master.to_parquet('data/mba_master.parquet', index=False)
    
    df_master.to_csv('ml/datasets/final/mba_master.csv', index=False)
    df_master.to_parquet('ml/datasets/final/mba_master.parquet', index=False)

    df_audit.to_csv('reports/mba_master_audit.csv', index=False)

    role_counts = df_master['role'].value_counts().to_dict()
    canonical_roles = [
        'Business Analyst',
        'Marketing Analyst',
        'HR Executive',
        'Product Manager',
        'Sales Executive',
        'Operations Manager'
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
    df_role_summary.to_csv('reports/mba_master_role_counts.csv', index=False)

    print("\n=== ROLE DISTRIBUTION ===", flush=True)
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
    build_master_dataset()
