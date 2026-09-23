# B.Com Master Dataset Metadata & Quality Audit Report

**Status**: FROZEN
**Total Records**: 34,303
**Parquet Sync**: YES

## 1. Schema & Validation Checks Summary

| Check | Standard | Result | Pass/Fail |
|---|---|---|---|
| Column Schema | `['text', 'role', 'domain', 'source', 'source_job_id']` | `['text', 'role', 'domain', 'source', 'source_job_id', 'char_len', 'word_len']` | PASS |
| Null Check | 0 nulls across all columns | 0 nulls | PASS |
| Duplicate Source ID | 0 duplicate source_job_id | 0 duplicates | PASS |
| Duplicate Text | 0 duplicate normalized text | 0 duplicates | PASS |
| Domain Uniformity | `domain == 'B.Com'` for 100% records | {'B.Com': 34303} | PASS |
| Label Leakage | 0 injected target label markers | 0 detected | PASS |

## 2. Canonical Role Target Distribution

| Canonical Role | Record Count | Min Target (>=300) | Preferred Target (>=500) |
|---|---|---|---|
| **Accountant** | 12,177 | PASS | PASS |
| **Financial Analyst** | 3,196 | PASS | PASS |
| **Tax Consultant** | 10,650 | PASS | PASS |
| **Auditor** | 6,660 | PASS | PASS |
| **Finance Executive** | 522 | PASS | PASS |
| **Bookkeeper** | 1,098 | PASS | PASS |

## 3. Data Source Provenance Breakdown

| Source Identifier | Record Count | Percentage |
|---|---|---|
| `1.3M_linkedin_jobs_2024` | 33,812 | 98.57% |
| `kaggle_huggingface_parquet` | 491 | 1.43% |

## 4. Text Length Statistics

| Metric | Character Count | Word Count |
|---|---|---|
| Minimum | 318 | 44 |
| Maximum | 23,993 | 3,529 |
| Median | 3407.0 | 481.0 |
| Mean | 3962.9 | 560.2 |

## 5. Master Pipeline Audit & Rejection Metrics

| Pipeline Metric | Value |
|---|---|
| Total Records Inspected | 184,166 |
| Status: rejected | 149,863 |
| Status: accepted | 34,303 |
| Rejection Reason: rejected_no_role_match_or_ambiguous | 95,527 |
| Rejection Reason: rejected_non_bcom_domain | 50,333 |
| Rejection Reason: cross_source_duplicate | 2,499 |
| Rejection Reason: insufficient_text_length_or_missing_summary | 1,293 |
| Rejection Reason: rejected_non_finance_auditor | 202 |
| Rejection Reason: duplicate_normalized_text | 5 |
| Rejection Reason: insufficient_text_length_or_missing_fields | 4 |

## 6. Boundary Examples Analysis

### Accountant (Boundary pair vs Bookkeeper)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/accounting-technician-advanced-at-university-of-north-carolina-at-chapel-hill-3801447425`
- **Text Snippet**: *"Job Title: Accounting Technician - Advanced
Company: University of North Carolina at Chapel Hill
Skills: Microsoft Office, Excel, Word, Accounting, Accounting Standards, Regulations, Financial Analysis, Budget Management, Multitasking, Oral Communica..."*

### Bookkeeper (Boundary pair vs Accountant)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/bookkeeper-at-brandscape-an-fsr-company-3782774391`
- **Text Snippet**: *"Job Title: Bookkeeper
Company: Brandscape (an FSR company)
Skills: Accounting, Bookkeeping, Financial Statement Preparation, Accounts Payable, Accounts Receivable, Payroll Management, Tax Preparation, Financial Analysis, System Skills, Communication ..."*

### Accountant (Boundary pair vs Auditor)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/accounting-technician-advanced-at-university-of-north-carolina-at-chapel-hill-3801447425`
- **Text Snippet**: *"Job Title: Accounting Technician - Advanced
Company: University of North Carolina at Chapel Hill
Skills: Microsoft Office, Excel, Word, Accounting, Accounting Standards, Regulations, Financial Analysis, Budget Management, Multitasking, Oral Communica..."*

### Auditor (Boundary pair vs Accountant)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/senior-internal-auditor-at-crown-equipment-corporation-3707141160`
- **Text Snippet**: *"Job Title: Senior Internal Auditor
Company: Crown Equipment Corporation
Skills: Auditing, Accounting, Finance, Internal Controls, Fraud Investigations, Risk Assessment, Analytical Skills, Problem Solving, MultiTasking, Communication Skills, Presentat..."*

### Accountant (Boundary pair vs Finance Executive)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/accounting-technician-advanced-at-university-of-north-carolina-at-chapel-hill-3801447425`
- **Text Snippet**: *"Job Title: Accounting Technician - Advanced
Company: University of North Carolina at Chapel Hill
Skills: Microsoft Office, Excel, Word, Accounting, Accounting Standards, Regulations, Financial Analysis, Budget Management, Multitasking, Oral Communica..."*

### Finance Executive (Boundary pair vs Accountant)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/treasury-analyst-ftc-at-grafton-banks-limited-3797509004`
- **Text Snippet**: *"Job Title: Treasury Analyst FTC
Company: GRAFTON BANKS LIMITED
Skills: Treasury Analyst, Treasury reporting, Treasury systems management, PO management, Banking Database maintenance and update, FX positions reporting, FX and money market deals confir..."*

### Financial Analyst (Boundary pair vs Finance Executive)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/senior-financial-analyst-at-jobot-3804046749`
- **Text Snippet**: *"Job Title: Senior Financial Analyst
Company: Jobot
Skills: Financial Planning, Financial Analysis, Capital Budgeting, Expense Budgeting, Financial Reporting, Forecasting, Financial Modeling, Cost Accounting, Data Analysis, Advanced Excel, ERP Systems..."*

### Finance Executive (Boundary pair vs Financial Analyst)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/treasury-analyst-ftc-at-grafton-banks-limited-3797509004`
- **Text Snippet**: *"Job Title: Treasury Analyst FTC
Company: GRAFTON BANKS LIMITED
Skills: Treasury Analyst, Treasury reporting, Treasury systems management, PO management, Banking Database maintenance and update, FX positions reporting, FX and money market deals confir..."*

### Tax Consultant (Boundary pair vs Accountant)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/tax-manager-personal-financial-services-at-pwc-3756650950`
- **Text Snippet**: *"Job Title: Tax Manager - Personal Financial Services
Company: PwC
Skills: Accounting, Bachelor Degree, CPA, Consulting, Financial planning, Income tax planning, Tax compliance, Wealth transfer planning, Building relationships, Budgeting, Coaching, Co..."*

### Accountant (Boundary pair vs Tax Consultant)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/accounting-technician-advanced-at-university-of-north-carolina-at-chapel-hill-3801447425`
- **Text Snippet**: *"Job Title: Accounting Technician - Advanced
Company: University of North Carolina at Chapel Hill
Skills: Microsoft Office, Excel, Word, Accounting, Accounting Standards, Regulations, Financial Analysis, Budget Management, Multitasking, Oral Communica..."*

## 7. Sample Records Audit (10 per role)

### Role: Accountant

1. **ID**: `https://www.linkedin.com/jobs/view/staff-accountant-at-jll-3728057182` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 584  
   *Snippet*: Job Title: Staff Accountant Company: JLL Skills: Financial accounting, Internal controls, ASC 606, SarbanesOxley, U.S. GAAP, Monthend close, Revenue r...

2. **ID**: `https://www.linkedin.com/jobs/view/staff-accountant-at-clocktower-staffing-3797829762` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 156  
   *Snippet*: Job Title: Staff Accountant Company: Clocktower Staffing Skills: Staff Accountant, Accounts Payable, Data Entry, Spreadsheets, Financial Records, Mont...

3. **ID**: `https://www.linkedin.com/jobs/view/accountant-ii-at-california-state-university-stanislaus-3787716825` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 434  
   *Snippet*: Job Title: Accountant II Company: California State University, Stanislaus Skills: Accounting, Financial Analysis, Regulatory Compliance, Financial Rep...

4. **ID**: `https://www.linkedin.com/jobs/view/hybrid-schedule-sr-property-accountant-at-propivotal-staffing-3794763925` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 342  
   *Snippet*: Job Title: (Hybrid Schedule) Sr. Property Accountant Company: ProPivotal Staffing Skills: Accounting, Finance, Excel, Yardi, Reconciliation, Financial...

5. **ID**: `https://www.linkedin.com/jobs/view/technical-accounting-analyst-2-3-at-northrop-grumman-3795905786` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1011  
   *Snippet*: Job Title: Technical Accounting Analyst 2/3 Company: Northrop Grumman Skills: Technical Accounting, Revenue Recognition, Costpoint, SAP, HFM, Financia...

6. **ID**: `https://www.linkedin.com/jobs/view/accounting-and-operations-manager-at-parion-sciences-3796952889` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 803  
   *Snippet*: Job Title: Accounting and Operations Manager Company: Parion Sciences Skills: Accounting, General Ledger Analysis, Administrative Management, Microsof...

7. **ID**: `https://www.linkedin.com/jobs/view/staff-senior-accountant-at-robert-half-3797986538` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 813  
   *Snippet*: Job Title: Staff/Senior Accountant Company: Robert Half Skills: Journal entries, Monthend closings, Bank reconciliation, Fixed asset maintenance, Gene...

8. **ID**: `https://www.linkedin.com/jobs/view/entry-level-accountant-at-mass-markets-3762983360` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1382  
   *Snippet*: Job Title: Entry-Level Accountant Company: Mass Markets Skills: Accounting, Accounts receivable, Invoicing, Bank reconciliation, Journal entries, AP b...

9. **ID**: `https://www.linkedin.com/jobs/view/senior-accountant-at-systems-planning-and-analysis-inc-3720389569` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 549  
   *Snippet*: Job Title: Senior Accountant Company: Systems Planning and Analysis, Inc. Skills: Accounting, GAAP, Government contracting, Deltek Costpoint, Fixed as...

10. **ID**: `https://www.linkedin.com/jobs/view/accountant-ii-at-jobsinlogistics-com-3797551933` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 426  
   *Snippet*: Job Title: Accountant II Company: JobsInLogistics.com Skills: Data analysis, Journal entries, Balance sheet reconciliations, Financial statements, Fin...

### Role: Financial Analyst

1. **ID**: `https://www.linkedin.com/jobs/view/sr-financial-analyst-at-ohiohealth-3775348659` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 374  
   *Snippet*: Job Title: Sr Financial Analyst Company: OhioHealth Skills: Microsoft Suite, Accounting, Finance, Financial Analyst, Statistical Reports, Labor Distri...

2. **ID**: `https://www.linkedin.com/jobs/view/fp-a-analyst-at-soho-house-co-3758997911` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 799  
   *Snippet*: Job Title: FP&A Analyst Company: Soho House & Co Skills: FP&A, Hospitality, Retail, Microsoft Office Suite, Excel, Word, PowerPoint, Sage, TM1, Mymicr...

3. **ID**: `https://www.linkedin.com/jobs/view/treasury-analyst-at-premier-valley-bank-a-division-of-htlf-bank-3805554046` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 673  
   *Snippet*: Job Title: Treasury Analyst Company: Premier Valley Bank, a division of HTLF Bank Skills: Liquidity management, Asset liability management, Data minin...

4. **ID**: `https://ca.linkedin.com/jobs/view/financial-analyst-iii-at-university-health-network-3798655193` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 811  
   *Snippet*: Job Title: Financial Analyst III Company: University Health Network Skills: Budget preparation, Financial analysis, Accounting principles, Business pl...

5. **ID**: `https://www.linkedin.com/jobs/view/financial-analyst-at-nexus-solutions-3783158748` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 218  
   *Snippet*: Job Title: Financial Analyst Company: Nexus Solutions Skills: Revenue Planning, Data Analysis, Data Monitoring, Data Synthesis, Financial Forecasting,...

6. **ID**: `https://www.linkedin.com/jobs/view/principal-corporate-finance-analyst-at-nextera-energy-inc-3763873987` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1203  
   *Snippet*: Job Title: Principal Corporate Finance Analyst Company: NextEra Energy, Inc. Skills: Structured Finance, Asset Backed Securities, Securitization, Risk...

7. **ID**: `https://uk.linkedin.com/jobs/view/senior-finance-analyst-at-beam-projects-3803893416` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 515  
   *Snippet*: Job Title: Senior Finance Analyst Company: Beam Projects Skills: Communication, Accounting, Analytical Skills, Financial Reporting, Audit, Taxation, R...

8. **ID**: `https://www.linkedin.com/jobs/view/financial-analyst-ii-at-jobs-for-humanity-3805351936` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 764  
   *Snippet*: Job Title: Financial Analyst II Company: Jobs for Humanity Skills: Accounting, Finance, Financial Analysis, Budgeting, Forecasting, Reporting, Analyti...

9. **ID**: `https://www.linkedin.com/jobs/view/financial-analyst-at-sinai-chicago-3801444643` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 155  
   *Snippet*: Job Title: Financial Analyst Company: Sinai Chicago Skills: Financial Analysis, Trend Analysis, Data Interpretation, Business Intelligence, Financial ...

10. **ID**: `https://ca.linkedin.com/jobs/view/corporate-finance-analyst-at-stalwart-insurance-group-3800578891` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 460  
   *Snippet*: Job Title: Corporate Finance Analyst Company: Stalwart Insurance Group Skills: Corporate Finance, Investment Banking, Financial Accounting, Business V...

### Role: Tax Consultant

1. **ID**: `https://www.linkedin.com/jobs/view/first-year-tax-professional-at-h-r-block-3749377458` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 466  
   *Snippet*: Job Title: First Year Tax Professional Company: H&R Block Skills: Tax interviews, Tax preparation, Client retention, Teamwork, IRS and state requireme...

2. **ID**: `https://uk.linkedin.com/jobs/view/corporate-senior-tax-manager-at-public-practice-recruitment-ltd-experts-in-public-practice-accountancy-recruitment-uk-wide-3794246640` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 656  
   *Snippet*: Job Title: Corporate Senior Tax Manager Company: Public Practice Recruitment Ltd - Experts in Public Practice Accountancy Recruitment UK-Wide Skills: ...

3. **ID**: `https://www.linkedin.com/jobs/view/accountant-fully-part-qualified-at-bike-builders-bible-inc-3785708610` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 352  
   *Snippet*: Job Title: Accountant - Fully / Part qualified. Company: Bike Builders Bible Inc Skills: AAT qualification, ACCA qualification, YearEnd and Periodic M...

4. **ID**: `https://www.linkedin.com/jobs/view/senior-associate-audit-tax-at-r%C3%B6dl-partner-usa-3758471477` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 475  
   *Snippet*: Job Title: Senior Associate (Audit & Tax) Company: Rödl & Partner USA Skills: Audit, Tax, Accounting, Manufacturing, Distribution, CCH Axcess, ProSyst...

5. **ID**: `https://www.linkedin.com/jobs/view/first-year-tax-professional-at-h-r-block-3671826448` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 431  
   *Snippet*: Job Title: First Year Tax Professional Company: H&R Block Skills: Customer service, Sales, Marketing, Teamwork, IRS compliance, Tax preparation, H&R B...

6. **ID**: `https://www.linkedin.com/jobs/view/first-year-tax-professional-at-h-r-block-3748892777` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 445  
   *Snippet*: Job Title: First Year Tax Professional Company: H&R Block Skills: Communication, Sales, Marketing, Retail, Customer service, Tax prep, Tax knowledge, ...

7. **ID**: `https://www.linkedin.com/jobs/view/bookkeeper-tax-preparer-at-klinedinst-pc-3787925276` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 249  
   *Snippet*: Job Title: Bookkeeper / Tax Preparer Company: Klinedinst PC Skills: Accounting, QuickBooks, Accounting CS, UltraTax, Financial Statements, Tax Returns...

8. **ID**: `https://www.linkedin.com/jobs/view/first-year-tax-professional-at-h-r-block-3672422654` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 433  
   *Snippet*: Job Title: First Year Tax Professional Company: H&R Block Skills: Tax Preparation, Client Communication, Income Tax Course, Retail Experience, Custome...

9. **ID**: `https://www.linkedin.com/jobs/view/sr-tax-manager-%24180-220k-at-cybercoders-3749036412` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 499  
   *Snippet*: Job Title: Sr Tax Manager | $180-220K Company: CyberCoders Skills: Accounting, Tax accounting, Tax compliance, Microsoft Office, Tax planning, Tax pro...

10. **ID**: `https://www.linkedin.com/jobs/view/first-year-tax-professional-at-h-r-block-3673379061` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 465  
   *Snippet*: Job Title: First Year Tax Professional Company: H&R Block Skills: Communication skills, Customer service skills, Retail experience, Sales experience, ...

### Role: Auditor

1. **ID**: `https://uk.linkedin.com/jobs/view/group-audit-manager-part-time-job-share-full-time-at-zurich-insurance-3784586155` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1135  
   *Snippet*: Job Title: Group Audit Manager - Part-time / Job-Share / Full-time Company: Zurich Insurance Skills: Audit, Risk Management, Compliance, Internal Audi...

2. **ID**: `https://uk.linkedin.com/jobs/view/semi-senior-accountant-at-acca-careers-3786991924` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 393  
   *Snippet*: Job Title: Semi Senior Accountant Company: ACCA Careers Skills: AAT/ACCA, Accounting Systems, Sage, Iris, QuickBooks, Xero, CCH Central, Microsoft Off...

3. **ID**: `https://www.linkedin.com/jobs/view/staff-accountant-at-cummings-st-thomas-3805290686` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 181  
   *Snippet*: Job Title: Staff Accountant Company: Cummings St. Thomas Skills: Accounting, General ledger, Journal entries, Audit, Financial statements, Balance she...

4. **ID**: `https://ca.linkedin.com/jobs/view/can-senior-auditor-internal-audit-at-walmart-canada-3778941181` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 381  
   *Snippet*: Job Title: (CAN) Senior Auditor, Internal Audit Company: Walmart Canada Skills: Internal Audit, Data Analytics, Audit Planning, Risk Assessment, Contr...

5. **ID**: `https://uk.linkedin.com/jobs/view/ftc-12-months-contract-senior-internal-auditor-top-lloyd-s-of-london-insurer-at-miryco-consultants-ltd-3796892533` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 254  
   *Snippet*: Job Title: FTC 12 Months Contract Senior Internal Auditor (Top Lloyd's of London Insurer) Company: Miryco Consultants Ltd Skills: Internal Audit, Fina...

6. **ID**: `https://ca.linkedin.com/jobs/view/lead-auditor-nuclear-industry-suppliers-at-candu-owners-group-3801649530` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 862  
   *Snippet*: Job Title: Lead Auditor, Nuclear Industry Suppliers Company: CANDU Owners Group Skills: NQA1, Lead Auditor, Supplier Audits, Quality assurance audits,...

7. **ID**: `https://www.linkedin.com/jobs/view/senior-internal-auditor-at-pinnacle-partners-inc-3801118919` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 238  
   *Snippet*: Job Title: Senior Internal Auditor Company: Pinnacle Partners, Inc Skills: Financial auditing, Operational auditing, Internal audit program, Audit pla...

8. **ID**: `https://www.linkedin.com/jobs/view/claims-auditor-at-starr-insurance-3759389734` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 530  
   *Snippet*: Job Title: Claims Auditor Company: Starr Insurance Skills: Insurance, Claims Handling, Claims Auditing, Claim Systems, Data Analysis, Risk Management,...

9. **ID**: `https://www.linkedin.com/jobs/view/audit-manager-at-carr-riggs-ingram-3752084918` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 394  
   *Snippet*: Job Title: Audit Manager Company: Carr, Riggs & Ingram Skills: Accounting, Auditing, Financial Statements, Reporting Requirements, Quality Control, Re...

10. **ID**: `https://uk.linkedin.com/jobs/view/audit-and-accounts-senior-at-michael-page-3672411046` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 353  
   *Snippet*: Job Title: Audit and Accounts Senior Company: Michael Page Skills: Accounting, Financial Reporting, Auditing, Financial Management, Office Management,...

### Role: Finance Executive

1. **ID**: `https://uk.linkedin.com/jobs/view/chief-finance-officer-at-rochester-cathedral-3803770604` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 277  
   *Snippet*: Job Title: Chief Finance Officer Company: Rochester Cathedral Skills: Chief Finance Officer, Financial strategy, Financial objectives, Financial guida...

2. **ID**: `https://uk.linkedin.com/jobs/view/finance-officer-prisons-and-probation-ombudsman-ref-83246-at-ministry-of-justice-uk-3804257583` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 2461  
   *Snippet*: Job Title: Finance Officer - Prisons and Probation Ombudsman (Ref: 83246) Company: Ministry of Justice UK Skills: Financial management, Budgeting, For...

3. **ID**: `pq_9cff672d-4020-52b0-9894-6a5fcca59d10` | **Source**: `kaggle_huggingface_parquet` | **Words**: 483  
   *Snippet*: Job Title: CFO / Finance manager Vilnius or Prague Company: "Preis HR agency" Skills: Other Description: As a member of the team, you’ll join like-min...

4. **ID**: `https://www.linkedin.com/jobs/view/treasury-analyst-at-ftd-3768186318` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 482  
   *Snippet*: Job Title: Treasury Analyst Company: FTD Skills: Finance, Accounting, Cash Management, Treasury Operations, Risk Management, Financial Analysis, Budge...

5. **ID**: `pq_7ca2600d-5fa5-58f3-a31a-8a62a7bb3221` | **Source**: `kaggle_huggingface_parquet` | **Words**: 164  
   *Snippet*: Job Title: Financial Controller Company: PIN-UP Global Skills: Other Description: **Requirements** • University degree in economics, finance, account...

6. **ID**: `https://www.linkedin.com/jobs/view/treasury-management-support-representative-ii-at-first-hawaiian-bank-3794072915` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 802  
   *Snippet*: Job Title: Treasury Management Support Representative II Company: First Hawaiian Bank Skills: Treasury Management Services, Customer Service, Troubles...

7. **ID**: `https://www.linkedin.com/jobs/view/treasury-analyst-at-arrow-search-partners-3771144877` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 179  
   *Snippet*: Job Title: Treasury Analyst Company: Arrow Search Partners Skills: Accounting, Shadow general ledger, Margin calculation, Currency exposures, Net asse...

8. **ID**: `https://uk.linkedin.com/jobs/view/senior-research-finance-officer-at-acca-careers-3803163246` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 341  
   *Snippet*: Job Title: Senior Research Finance Officer Company: ACCA Careers Skills: Research Finance, Budget Management, Financial Regulatory Compliance, Financi...

9. **ID**: `pq_39aa0154-9ab5-53b3-b8c1-65e18922948d` | **Source**: `kaggle_huggingface_parquet` | **Words**: 456  
   *Snippet*: Job Title: Senior Project Manager, Finance Operations Technology Company: DataArt Skills: Project Manager Description: **About the vacancy ** One of...

10. **ID**: `https://au.linkedin.com/jobs/view/finance-officer-hybrid-working-at-robert-half-3802938859` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 289  
   *Snippet*: Job Title: Finance Officer - Hybrid Working Company: Robert Half Skills: Accounting, Financial Services, Trust Accounting, Allocations, Receipting, Re...

### Role: Bookkeeper

1. **ID**: `https://www.linkedin.com/jobs/view/bookkeeper-at-insight-global-3801111966` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 263  
   *Snippet*: Job Title: Bookkeeper Company: Insight Global Skills: Bookkeeping, Accounting, Data Entry, Bank Reconciliation, Accounts Payable, Accounts Receivable,...

2. **ID**: `https://www.linkedin.com/jobs/view/accounting-clerk-at-ascendo-resources-3760408003` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 67  
   *Snippet*: Job Title: Accounting Clerk Company: Ascendo Resources Skills: Accounting, Reconciliation, Cash applications, Accounting software, Microsoft Excel, Qu...

3. **ID**: `https://www.linkedin.com/jobs/view/accountant-bookkeeper-at-serenity-air-inc-3805933958` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 327  
   *Snippet*: Job Title: Accountant/Bookkeeper Company: Serenity Air, Inc Skills: Accounting, Financial Reporting, Budget Preparation, Accounting Software, Payroll ...

4. **ID**: `https://www.linkedin.com/jobs/view/accounting-clerk-at-robert-half-finance-accounting-3789323839` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 267  
   *Snippet*: Job Title: Accounting Clerk Company: Robert Half Finance & Accounting Skills: Accounting, Financial records, Accounting policies, Statements, Reports,...

5. **ID**: `https://www.linkedin.com/jobs/view/full-charge-bookkeeper-at-robert-half-3792253716` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 371  
   *Snippet*: Job Title: Full Charge Bookkeeper Company: Robert Half Skills: Bookkeeping, Monthly reconciliation, Journal entries, Accounting duties, Accounting rec...

6. **ID**: `https://www.linkedin.com/jobs/view/senior-bookkeeper-central-office-sy23-24-at-needham-public-schools-3737871456` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 984  
   *Snippet*: Job Title: Senior Bookkeeper [Central Office] (SY23-24) Company: Needham Public Schools Skills: Bookkeeping, Accounts Payable, Accounts Receivable, Fi...

7. **ID**: `https://www.linkedin.com/jobs/view/full-charge-bookkeeper-at-suncap-technology-3768043522` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 145  
   *Snippet*: Job Title: Full Charge Bookkeeper Company: Suncap Technology Skills: Bookkeeping, Accounts payable, Accounts receivable, Payroll processing, Vendor ma...

8. **ID**: `https://uk.linkedin.com/jobs/view/accounts-assistant-finance-purchase-ledger-team-at-sewell-group-3791413647` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 621  
   *Snippet*: Job Title: Accounts Assistant - Finance/Purchase Ledger Team Company: Sewell Group Skills: Accounts payable, OCR scanning, Microsoft Office, Excel, Su...

9. **ID**: `https://www.linkedin.com/jobs/view/office-manager-bookkeeper-jj-at-staff-financial-group-3799903392` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 323  
   *Snippet*: Job Title: Office Manager / Bookkeeper (JJ) Company: Staff Financial Group Skills: Microsoft Office Suite, QuickBooks, Accounting Software, Accounts R...

10. **ID**: `https://ca.linkedin.com/jobs/view/bookkeeper-at-markham-offices-3787780944` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 601  
   *Snippet*: Job Title: Bookkeeper Company: Markham Offices Skills: Bookkeeper, Accounting, Accounts Receivable, Accounts Payable, Journal Entries, QuickBooks, Mic...

