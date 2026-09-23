import os
import re
import pandas as pd
import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq

# Path definitions
DATASET_DIR = "c:/Users/Lenovo/Downloads/1.3Linkedin"
PARQUET_FILE = os.path.join(DATASET_DIR, "train-00000-of-00001.parquet")
CSV_JOB_POSTINGS = os.path.join(DATASET_DIR, "linkedin_job_postings.csv")
CSV_JOB_SKILLS = os.path.join(DATASET_DIR, "job_skills.csv")
CSV_JOB_SUMMARY = os.path.join(DATASET_DIR, "job_summary.csv")

OUTPUT_CSV = "data/civil_master.csv"
OUTPUT_PARQUET = "data/civil_master.parquet"
SYNC_CSV = "ml/datasets/final/civil_master.csv"
SYNC_PARQUET = "ml/datasets/final/civil_master.parquet"
AUDIT_CSV = "reports/civil_master_audit.csv"
ROLE_COUNTS_CSV = "reports/civil_master_role_counts.csv"

# Canonical Civil Roles
CANONICAL_ROLES = [
    "Structural Engineer",
    "Civil Site Engineer",
    "Construction Project Engineer",
    "Quantity Surveyor",
    "Geotechnical Engineer",
    "Transportation Engineer"
]

# Non-Civil Domain Filtering Regex
NON_CIVIL_REGEX = r"(?i)\b(software|network|it\b|data science|sales|marketing|recruiter|nursing|nurse|attorney|legal|clinical|electrical|electronics|mechanical\b|hvac|embedded|devops|frontend|backend|fullstack|php|java\b|python|traffic flagger|flagger|flight|aircraft|internet traffic|web traffic|traffic manager|mobile traffic|paid traffic)\b"

# Candidate Title Regexes
STRUCTURAL_TITLE = r"(?i)\b(structural engineer|structural design|structural analyst|bridge engineer|structural detailer|structural drafter|structural project engineer|structural BIM engineer|structural calculation|facade engineer)\b"
SITE_TITLE = r"(?i)\b(site civil engineer|civil site engineer|site engineer|construction site engineer|field civil engineer|civil field engineer|site supervision engineer|civil execution engineer|resident engineer|civil inspector|construction inspector)\b"
PROJECT_TITLE = r"(?i)\b(construction project engineer|construction project manager|construction project coordinator|construction manager|assistant construction project manager|construction engineering manager|construction planner|construction scheduler)\b"
QS_TITLE = r"(?i)\b(quantity surveyor|senior quantity surveyor|assistant quantity surveyor|mep quantity surveyor|cost estimator|construction estimator|boq engineer|estimation engineer|cost engineer|billing engineer|quantity takeoff)\b"
GEOTECH_TITLE = r"(?i)\b(geotechnical engineer|senior geotechnical engineer|geotechnical project manager|geotechnical staff engineer|soil engineer|geotechnical design engineer|foundation engineer|geologist engineer|geotechnical specialist)\b"
TRANS_TITLE = r"(?i)\b(transportation engineer|highway engineer|roadway engineer|traffic engineer|pavement engineer|transportation planning engineer|highway design engineer|traffic design engineer|road design engineer|transit engineer)\b"

# Combined candidate Civil regex for fast vectorized filtering
CIVIL_CANDIDATE_REGEX = f"({STRUCTURAL_TITLE}|{SITE_TITLE}|{PROJECT_TITLE}|{QS_TITLE}|{GEOTECH_TITLE}|{TRANS_TITLE}|(?i)\\bcivil engineer\\b|(?i)\\bsite civil\\b|(?i)\\bgeotechnical\\b|(?i)\\bhighway engineer\\b|(?i)\\bquantity surveyor\\b)"

# Context keywords for verification
STRUCTURAL_KEYWORDS = r"(?i)\b(structural|etabs|staad|sap2000|reinforced concrete|steel structure|foundation design|seismic|wind load|structural calculation|beam|column|slab|truss|bridge design|structural detailing|autocad|revit structure)\b"
SITE_KEYWORDS = r"(?i)\b(site execution|site supervision|construction supervision|site inspection|contractor coordination|site safety|field execution|bar bending schedule|site coordination|site engineer|quality control at site|daily progress report|dpr)\b"
PROJECT_KEYWORDS = r"(?i)\b(construction management|project execution|project schedule|ms project|primavera|p6|construction coordination|project delivery|subcontractor management|progress monitoring|construction site management|project planning)\b"
QS_KEYWORDS = r"(?i)\b(quantity takeoff|boq|bill of quantities|estimation|costing|billing|rate analysis|tendering|measurement|cost control|variation claims|interim payment certificate|ipc|tender documentation)\b"
GEOTECH_KEYWORDS = r"(?i)\b(geotechnical|soil mechanics|soil testing|foundation engineering|bearing capacity|slope stability|pile foundation|borehole|site investigation|grouting|retaining wall|rock mechanics|geotechnical investigation)\b"
TRANS_KEYWORDS = r"(?i)\b(highway|road design|traffic engineering|transportation planning|pavement design|traffic modelling|synchro|vissim|civil3d|roadway|intersection design|traffic study|transit infrastructure)\b"

def clean_text(txt):
    if not txt or pd.isna(txt):
        return ""
    txt = str(txt)
    txt = re.sub(r'<[^>]+>', ' ', txt) # remove HTML tags
    txt = re.sub(r'\s+', ' ', txt)
    return txt.strip()

def normalize_text_for_dedup(txt):
    t = txt.lower()
    t = re.sub(r'[^a-z0-9\s]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()

def map_civil_role(title, company, skills, summary, description):
    full_ctx = f"{title} {company} {skills} {summary} {description}".lower()

    # Reject non-Civil roles
    if re.search(NON_CIVIL_REGEX, title) and not re.search(r'\b(civil|construction|structural|geotechnical|highway|pavement|traffic control flagger)\b', title):
        # Exclude if it's explicitly non-civil
        return None, "rejected_non_civil_domain"

    # Reject non-finance/non-civil traffic flaggers (e.g., Traffic Control Flagger)
    if re.search(r'\btraffic control flagger|flagger\b', title) and not re.search(r'\bengineer|planning|design\b', title):
        return None, "rejected_non_engineering_flagger"

    # Strict role mapping order based on title + context
    # 1. Structural Engineer
    if re.search(STRUCTURAL_TITLE, title) or (re.search(r'\b(structural|bridge|facade)\b', title) and re.search(STRUCTURAL_KEYWORDS, full_ctx)):
        return "Structural Engineer", "accepted"

    # 2. Geotechnical Engineer
    if re.search(GEOTECH_TITLE, title) or (re.search(r'\b(geotechnical|soil|foundation|geology)\b', title) and re.search(GEOTECH_KEYWORDS, full_ctx)):
        return "Geotechnical Engineer", "accepted"

    # 3. Transportation Engineer
    if re.search(TRANS_TITLE, title) or (re.search(r'\b(transportation|highway|roadway|traffic|pavement|transit)\b', title) and re.search(TRANS_KEYWORDS, full_ctx)):
        return "Transportation Engineer", "accepted"

    # 4. Quantity Surveyor
    if re.search(QS_TITLE, title) or (re.search(r'\b(quantity surveyor|estimator|boq|cost engineer|billing engineer)\b', title) and re.search(QS_KEYWORDS, full_ctx)):
        return "Quantity Surveyor", "accepted"

    # 5. Civil Site Engineer
    if re.search(SITE_TITLE, title) or (re.search(r'\b(site civil|civil site|site engineer|field engineer|resident engineer)\b', title) and re.search(SITE_KEYWORDS, full_ctx)):
        return "Civil Site Engineer", "accepted"

    # 6. Construction Project Engineer
    if re.search(PROJECT_TITLE, title) or (re.search(r'\b(construction project engineer|construction manager|construction coordinator|construction planner)\b', title) and re.search(PROJECT_KEYWORDS, full_ctx)):
        return "Construction Project Engineer", "accepted"

    # Generic "Civil Engineer" title contextual mapping
    if re.search(r'\bcivil engineer\b', title) or re.search(r'\bsenior civil engineer\b', title):
        # Disambiguate generic Civil Engineer title based on text context
        if re.search(STRUCTURAL_KEYWORDS, full_ctx) and re.search(r'\b(structural|analysis|staad|etabs|concrete|steel|bridge)\b', full_ctx):
            return "Structural Engineer", "accepted"
        elif re.search(GEOTECH_KEYWORDS, full_ctx) and re.search(r'\b(soil|foundation|geotechnical|bearing capacity|pile)\b', full_ctx):
            return "Geotechnical Engineer", "accepted"
        elif re.search(TRANS_KEYWORDS, full_ctx) and re.search(r'\b(highway|road|traffic|pavement|transportation)\b', full_ctx):
            return "Transportation Engineer", "accepted"
        elif re.search(QS_KEYWORDS, full_ctx) and re.search(r'\b(quantity|boq|estimation|costing|billing)\b', full_ctx):
            return "Quantity Surveyor", "accepted"
        elif re.search(SITE_KEYWORDS, full_ctx) and re.search(r'\b(site|execution|supervision|inspection|contractor|construction)\b', full_ctx):
            return "Civil Site Engineer", "accepted"
        elif re.search(PROJECT_KEYWORDS, full_ctx) and re.search(r'\b(project|schedule|planning|coordination|ms project|primavera)\b', full_ctx):
            return "Construction Project Engineer", "accepted"

    # Generic titles with ambiguous context
    return None, "rejected_no_role_match_or_ambiguous"


def run_pipeline():
    print("Starting Civil Engineering Master Dataset Construction Pipeline...", flush=True)

    os.makedirs("data", exist_ok=True)
    os.makedirs("ml/datasets/final", exist_ok=True)
    os.makedirs("reports", exist_ok=True)

    accepted_records = []
    audit_records = []
    seen_source_ids = set()
    seen_norm_texts = set()

    rejection_counts = {
        "rejected_no_role_match_or_ambiguous": 0,
        "rejected_non_civil_domain": 0,
        "rejected_non_engineering_flagger": 0,
        "cross_source_duplicate": 0,
        "duplicate_normalized_text": 0,
        "insufficient_text_length_or_missing_summary": 0,
        "insufficient_text_length_or_missing_fields": 0
    }

    # ==========================================
    # SOURCE 1: Kaggle Parquet Dataset
    # ==========================================
    if os.path.exists(PARQUET_FILE):
        print(f"\nProcessing Source 1: {PARQUET_FILE}...", flush=True)
        df_pq = pd.read_parquet(PARQUET_FILE)

        for _, row in df_pq.iterrows():
            raw_id = str(row.get('id', row.get('__index_level_0__', '')))
            source_job_id = f"pq_{raw_id}"
            title = clean_text(row.get('Position', ''))
            company = clean_text(row.get('Company Name', ''))
            skills = clean_text(row.get('Primary Keyword', ''))
            description = clean_text(row.get('Long Description', ''))
            summary = ""

            if source_job_id in seen_source_ids:
                rejection_counts["cross_source_duplicate"] += 1
                audit_records.append({
                    "source": "kaggle_huggingface_parquet",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": "cross_source_duplicate",
                    "assigned_role": ""
                })
                continue

            role, status = map_civil_role(title, company, skills, summary, description)
            if not role:
                rejection_counts[status] = rejection_counts.get(status, 0) + 1
                audit_records.append({
                    "source": "kaggle_huggingface_parquet",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": status,
                    "assigned_role": ""
                })
                continue

            full_text = f"Job Title: {title}\nCompany: {company}\nSkills: {skills}\nDescription: {description}"
            if len(full_text) < 200 or len(description) < 50:
                rejection_counts["insufficient_text_length_or_missing_fields"] += 1
                audit_records.append({
                    "source": "kaggle_huggingface_parquet",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": "insufficient_text_length_or_missing_fields",
                    "assigned_role": role
                })
                continue

            norm_txt = normalize_text_for_dedup(full_text)
            if norm_txt in seen_norm_texts:
                rejection_counts["duplicate_normalized_text"] += 1
                audit_records.append({
                    "source": "kaggle_huggingface_parquet",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": "duplicate_normalized_text",
                    "assigned_role": role
                })
                continue

            seen_source_ids.add(source_job_id)
            seen_norm_texts.add(norm_txt)

            accepted_records.append({
                "text": full_text,
                "role": role,
                "domain": "Civil",
                "source": "kaggle_huggingface_parquet",
                "source_job_id": source_job_id
            })

            audit_records.append({
                "source": "kaggle_huggingface_parquet",
                "source_job_id": source_job_id,
                "title": title,
                "company": company,
                "status": "accepted",
                "rejection_reason": "",
                "assigned_role": role
            })

        print(f"Parquet source complete. Accepted so far: {len(accepted_records)}", flush=True)

    # ==========================================
    # SOURCE 2: 1.3M LinkedIn Jobs & Skills 2024
    # ==========================================
    if os.path.exists(CSV_JOB_POSTINGS):
        print(f"\nProcessing Source 2: 1.3M LinkedIn Jobs & Skills 2024...", flush=True)

        print("Step 1: Vectorized filtering of candidate Civil postings...", flush=True)
        postings_df = pd.read_csv(CSV_JOB_POSTINGS, usecols=['job_link', 'job_title', 'company', 'search_position'])
        titles_series = postings_df['job_title'].astype(str)

        is_non_civil_mask = titles_series.str.contains(NON_CIVIL_REGEX, case=False, regex=True)
        is_candidate_mask = ~is_non_civil_mask & (
            titles_series.str.contains(CIVIL_CANDIDATE_REGEX, case=False, regex=True) |
            postings_df['search_position'].astype(str).str.contains(r'(?i)\bcivil\b|(?i)\bstructural\b|(?i)\bconstruction\b|(?i)\bgeotechnical\b', case=False, regex=True)
        )

        candidate_postings = postings_df[is_candidate_mask].copy()
        candidate_job_links = set(candidate_postings['job_link'])
        print(f"Candidate postings identified: {len(candidate_postings):,} out of {len(postings_df):,}", flush=True)

        print("Step 2: Stream loading matching skills for candidate postings...", flush=True)
        skills_dict = {}
        if os.path.exists(CSV_JOB_SKILLS):
            for chunk in pd.read_csv(CSV_JOB_SKILLS, chunksize=100000, usecols=['job_link', 'job_skills']):
                matched_chunk = chunk[chunk['job_link'].isin(candidate_job_links)]
                for _, r in matched_chunk.iterrows():
                    skills_dict[r['job_link']] = clean_text(r['job_skills'])
        print(f"Skills loaded for {len(skills_dict):,} candidates.", flush=True)

        print("Step 3: Stream loading matching summaries for candidate postings...", flush=True)
        summary_dict = {}
        if os.path.exists(CSV_JOB_SUMMARY):
            for chunk in pd.read_csv(CSV_JOB_SUMMARY, chunksize=100000, usecols=['job_link', 'job_summary']):
                matched_chunk = chunk[chunk['job_link'].isin(candidate_job_links)]
                for _, r in matched_chunk.iterrows():
                    summary_dict[r['job_link']] = clean_text(r['job_summary'])
        print(f"Summaries loaded for {len(summary_dict):,} candidates.", flush=True)

        print("Step 4: Evaluating candidate records and constructing final text...", flush=True)
        for _, row in candidate_postings.iterrows():
            source_job_id = str(row['job_link'])
            title = clean_text(row['job_title'])
            company = clean_text(row['company'])
            skills = skills_dict.get(source_job_id, "")
            summary = summary_dict.get(source_job_id, "")
            description = summary

            if source_job_id in seen_source_ids:
                rejection_counts["cross_source_duplicate"] += 1
                audit_records.append({
                    "source": "1.3M_linkedin_jobs_2024",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": "cross_source_duplicate",
                    "assigned_role": ""
                })
                continue

            role, status = map_civil_role(title, company, skills, summary, description)
            if not role:
                rejection_counts[status] = rejection_counts.get(status, 0) + 1
                audit_records.append({
                    "source": "1.3M_linkedin_jobs_2024",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": status,
                    "assigned_role": ""
                })
                continue

            full_text = f"Job Title: {title}\nCompany: {company}\nSkills: {skills}\nDescription: {description}"
            if len(full_text) < 200 or len(description) < 30:
                rejection_counts["insufficient_text_length_or_missing_summary"] += 1
                audit_records.append({
                    "source": "1.3M_linkedin_jobs_2024",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": "insufficient_text_length_or_missing_summary",
                    "assigned_role": role
                })
                continue

            norm_txt = normalize_text_for_dedup(full_text)
            if norm_txt in seen_norm_texts:
                rejection_counts["duplicate_normalized_text"] += 1
                audit_records.append({
                    "source": "1.3M_linkedin_jobs_2024",
                    "source_job_id": source_job_id,
                    "title": title,
                    "company": company,
                    "status": "rejected",
                    "rejection_reason": "duplicate_normalized_text",
                    "assigned_role": role
                })
                continue

            seen_source_ids.add(source_job_id)
            seen_norm_texts.add(norm_txt)

            accepted_records.append({
                "text": full_text,
                "role": role,
                "domain": "Civil",
                "source": "1.3M_linkedin_jobs_2024",
                "source_job_id": source_job_id
            })

            audit_records.append({
                "source": "1.3M_linkedin_jobs_2024",
                "source_job_id": source_job_id,
                "title": title,
                "company": company,
                "status": "accepted",
                "rejection_reason": "",
                "assigned_role": role
            })

    # Convert to DataFrame
    df_accepted = pd.DataFrame(accepted_records)
    df_audit = pd.DataFrame(audit_records)

    print("\nAll sources processed successfully!", flush=True)
    print(f"Total Source Records Inspected: {len(df_audit):,}", flush=True)
    print(f"Total Accepted Civil Master Records: {len(df_accepted):,}", flush=True)

    # Role counts breakdown
    role_counts = df_accepted['role'].value_counts().reset_index()
    role_counts.columns = ['role', 'accepted_count']
    role_counts['min_300_met'] = role_counts['accepted_count'] >= 300
    role_counts['preferred_500_met'] = role_counts['accepted_count'] >= 500

    print("\n=== CIVIL ROLE DISTRIBUTION ===", flush=True)
    print(role_counts.to_string(index=False), flush=True)

    # Save output datasets
    df_accepted.to_csv(OUTPUT_CSV, index=False)
    df_accepted.to_parquet(OUTPUT_PARQUET, index=False)
    df_accepted.to_csv(SYNC_CSV, index=False)
    df_accepted.to_parquet(SYNC_PARQUET, index=False)
    print(f"\nSaved master datasets to {OUTPUT_CSV} and synchronized to {SYNC_CSV}", flush=True)

    # Save audit logs
    df_audit.to_csv(AUDIT_CSV, index=False)
    role_counts.to_csv(ROLE_COUNTS_CSV, index=False)
    print(f"Saved audit log to {AUDIT_CSV}", flush=True)

    # Print Source Distribution
    print("\n=== SOURCE DISTRIBUTION ===", flush=True)
    for src, cnt in df_accepted['source'].value_counts().items():
        print(f"  {src}: {cnt:,}", flush=True)

    # Print Rejection Reasons Summary
    print("\n=== REJECTION REASONS ===", flush=True)
    for reason, cnt in sorted(rejection_counts.items(), key=lambda x: x[1], reverse=True):
        if cnt > 0:
            print(f"  {reason}: {cnt:,}", flush=True)

if __name__ == "__main__":
    run_pipeline()
