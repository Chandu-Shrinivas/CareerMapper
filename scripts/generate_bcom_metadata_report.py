import os
import re
import pandas as pd
import numpy as np

def generate_bcom_metadata():
    csv_path = "data/bcom_master.csv"
    parquet_path = "data/bcom_master.parquet"
    audit_path = "reports/bcom_master_audit.csv"
    report_path = "reports/bcom_master_metadata.md"

    print("--- Running B.Com Master Dataset Metadata & Quality Audit ---")

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"{csv_path} not found!")

    df = pd.read_csv(csv_path)
    df_parquet = pd.read_parquet(parquet_path)

    # 1. Schema Validation
    expected_cols = ["text", "role", "domain", "source", "source_job_id"]
    schema_valid = (list(df.columns) == expected_cols) and (list(df_parquet.columns) == expected_cols)

    # Parquet vs CSV sync check
    parquet_sync = len(df) == len(df_parquet)

    # 2. Null Checks
    null_counts = df.isnull().sum().to_dict()
    total_nulls = sum(null_counts.values())

    # 3. Duplicate Source ID Check
    dup_source_ids = df["source_job_id"].duplicated().sum()

    # 4. Duplicate Normalized Text Check
    norm_text = df["text"].astype(str).str.lower().str.replace(r"\s+", " ", regex=True).str.strip()
    dup_norm_text = norm_text.duplicated().sum()

    # 5. Provenance Validation
    sources_present = df["source"].value_counts().to_dict()

    # 6. Domain Validation
    domain_counts = df["domain"].value_counts().to_dict()
    domain_valid = (set(df["domain"].unique()) == {"B.Com"})

    # 7. Label Leakage Check
    # Check if text starts with explicit artificial prefixes or target labels injected
    leakage_patterns = [r"^role:\s*", r"^label:\s*", r"^target:\s*"]
    leakage_count = sum(df["text"].str.contains("|".join(leakage_patterns), case=False, regex=True))

    # Text Statistics
    df["char_len"] = df["text"].astype(str).str.len()
    df["word_len"] = df["text"].astype(str).str.split().str.len()

    char_stats = {
        "min": int(df["char_len"].min()),
        "max": int(df["char_len"].max()),
        "median": float(df["char_len"].median()),
        "mean": float(df["char_len"].mean())
    }
    word_stats = {
        "min": int(df["word_len"].min()),
        "max": int(df["word_len"].max()),
        "median": float(df["word_len"].median()),
        "mean": float(df["word_len"].mean())
    }

    # Role Counts
    role_counts = df["role"].value_counts().to_dict()
    canonical_roles = [
        "Accountant",
        "Financial Analyst",
        "Tax Consultant",
        "Auditor",
        "Finance Executive",
        "Bookkeeper"
    ]

    role_status = {}
    for r in canonical_roles:
        cnt = role_counts.get(r, 0)
        role_status[r] = {
            "count": cnt,
            "min_300": "PASS" if cnt >= 300 else "FAIL",
            "pref_500": "PASS" if cnt >= 500 else "FEWER THAN 500"
        }

    # Audit CSV info
    audit_info = {}
    if os.path.exists(audit_path):
        audit_df = pd.read_csv(audit_path)
        status_counts = audit_df["status"].value_counts().to_dict()
        rejection_counts = audit_df["rejection_reason"].dropna().value_counts().to_dict()
        audit_info["Total Records Inspected"] = f"{len(audit_df):,}"
        for k, v in status_counts.items():
            audit_info[f"Status: {k}"] = f"{v:,}"
        for k, v in rejection_counts.items():
            audit_info[f"Rejection Reason: {k}"] = f"{v:,}"

    # 8. Extract 10 Random Samples per Role
    samples_by_role = {}
    for r in canonical_roles:
        sub = df[df["role"] == r]
        sample_size = min(10, len(sub))
        sampled = sub.sample(n=sample_size, random_state=42) if sample_size > 0 else sub
        samples_by_role[r] = sampled[["source_job_id", "source", "word_len", "text"]].to_dict(orient="records")

    # 9. Inspect Boundary Examples
    # Accountant vs Bookkeeper
    # Accountant vs Auditor
    # Accountant vs Finance Executive
    # Financial Analyst vs Finance Executive
    # Tax Consultant vs Accountant
    boundary_pairs = [
        ("Accountant", "Bookkeeper"),
        ("Accountant", "Auditor"),
        ("Accountant", "Finance Executive"),
        ("Financial Analyst", "Finance Executive"),
        ("Tax Consultant", "Accountant")
    ]
    boundary_examples = []
    for r1, r2 in boundary_pairs:
        ex1 = df[df["role"] == r1].sample(n=min(1, len(df[df["role"] == r1])), random_state=101)
        ex2 = df[df["role"] == r2].sample(n=min(1, len(df[df["role"] == r2])), random_state=101)
        if not ex1.empty:
            boundary_examples.append({"role": r1, "vs_role": r2, "source_id": ex1.iloc[0]["source_job_id"], "snippet": ex1.iloc[0]["text"][:250] + "..."})
        if not ex2.empty:
            boundary_examples.append({"role": r2, "vs_role": r1, "source_id": ex2.iloc[0]["source_job_id"], "snippet": ex2.iloc[0]["text"][:250] + "..."})

    # Write Markdown Report
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# B.Com Master Dataset Metadata & Quality Audit Report\n\n")
        f.write("**Status**: FROZEN\n")
        f.write(f"**Total Records**: {len(df):,}\n")
        f.write(f"**Parquet Sync**: {'YES' if parquet_sync else 'NO'}\n\n")

        f.write("## 1. Schema & Validation Checks Summary\n\n")
        f.write("| Check | Standard | Result | Pass/Fail |\n")
        f.write("|---|---|---|---|\n")
        f.write(f"| Column Schema | `['text', 'role', 'domain', 'source', 'source_job_id']` | `{list(df.columns)}` | {'PASS' if schema_valid else 'FAIL'} |\n")
        f.write(f"| Null Check | 0 nulls across all columns | {total_nulls} nulls | {'PASS' if total_nulls == 0 else 'FAIL'} |\n")
        f.write(f"| Duplicate Source ID | 0 duplicate source_job_id | {dup_source_ids} duplicates | {'PASS' if dup_source_ids == 0 else 'FAIL'} |\n")
        f.write(f"| Duplicate Text | 0 duplicate normalized text | {dup_norm_text} duplicates | {'PASS' if dup_norm_text == 0 else 'FAIL'} |\n")
        f.write(f"| Domain Uniformity | `domain == 'B.Com'` for 100% records | {domain_counts} | {'PASS' if domain_valid else 'FAIL'} |\n")
        f.write(f"| Label Leakage | 0 injected target label markers | {leakage_count} detected | {'PASS' if leakage_count == 0 else 'FAIL'} |\n\n")

        f.write("## 2. Canonical Role Target Distribution\n\n")
        f.write("| Canonical Role | Record Count | Min Target (>=300) | Preferred Target (>=500) |\n")
        f.write("|---|---|---|---|\n")
        for r in canonical_roles:
            st = role_status[r]
            f.write(f"| **{r}** | {st['count']:,} | {st['min_300']} | {st['pref_500']} |\n")
        f.write("\n")

        f.write("## 3. Data Source Provenance Breakdown\n\n")
        f.write("| Source Identifier | Record Count | Percentage |\n")
        f.write("|---|---|---|\n")
        for src, cnt in sources_present.items():
            pct = (cnt / len(df)) * 100
            f.write(f"| `{src}` | {cnt:,} | {pct:.2f}% |\n")
        f.write("\n")

        f.write("## 4. Text Length Statistics\n\n")
        f.write("| Metric | Character Count | Word Count |\n")
        f.write("|---|---|---|\n")
        f.write(f"| Minimum | {char_stats['min']} | {word_stats['min']} |\n")
        f.write(f"| Maximum | {char_stats['max']:,} | {word_stats['max']:,} |\n")
        f.write(f"| Median | {char_stats['median']:.1f} | {word_stats['median']:.1f} |\n")
        f.write(f"| Mean | {char_stats['mean']:.1f} | {word_stats['mean']:.1f} |\n\n")

        if audit_info:
            f.write("## 5. Master Pipeline Audit & Rejection Metrics\n\n")
            f.write("| Pipeline Metric | Value |\n")
            f.write("|---|---|\n")
            for k, v in audit_info.items():
                f.write(f"| {k} | {v} |\n")
            f.write("\n")

        f.write("## 6. Boundary Examples Analysis\n\n")
        for be in boundary_examples:
            f.write(f"### {be['role']} (Boundary pair vs {be['vs_role']})\n")
            f.write(f"- **Source Job ID**: `{be['source_id']}`\n")
            f.write(f"- **Text Snippet**: *\"{be['snippet']}\"*\n\n")

        f.write("## 7. Sample Records Audit (10 per role)\n\n")
        for r in canonical_roles:
            f.write(f"### Role: {r}\n\n")
            for idx, s in enumerate(samples_by_role[r], 1):
                snip = s['text'][:150].replace('\n', ' ')
                f.write(f"{idx}. **ID**: `{s['source_job_id']}` | **Source**: `{s['source']}` | **Words**: {s['word_len']}  \n")
                f.write(f"   *Snippet*: {snip}...\n\n")

    print(f"Report generated successfully at: {report_path}")

if __name__ == "__main__":
    generate_bcom_metadata()
