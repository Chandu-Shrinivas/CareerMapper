# Civil Engineering Master Dataset Metadata & Quality Audit Report

**Status**: FROZEN
**Total Records**: 11,192
**Parquet Sync**: YES

## 1. Schema & Validation Checks Summary

| Check | Standard | Result | Pass/Fail |
|---|---|---|---|
| Column Schema | `['text', 'role', 'domain', 'source', 'source_job_id']` | `['text', 'role', 'domain', 'source', 'source_job_id']` | PASS |
| Null Check | 0 nulls across all columns | 0 nulls | PASS |
| Duplicate Source ID | 0 duplicate source_job_id | 0 duplicates | PASS |
| Duplicate Text | 0 duplicate normalized text | 0 duplicates | PASS |
| Domain Uniformity | `domain == 'Civil'` for 100% records | {'Civil': 11192} | PASS |
| Label Leakage | 0 injected target label markers | 0 detected | PASS |

## 2. Canonical Role Target Distribution

| Canonical Role | Record Count | Min Target (>=300) | Preferred Target (>=500) |
|---|---|---|---|
| **Structural Engineer** | 2,336 | PASS | PASS |
| **Civil Site Engineer** | 1,378 | PASS | PASS |
| **Construction Project Engineer** | 4,456 | PASS | PASS |
| **Quantity Surveyor** | 1,509 | PASS | PASS |
| **Geotechnical Engineer** | 574 | PASS | PASS |
| **Transportation Engineer** | 939 | PASS | PASS |

## 3. Data Source Provenance Breakdown

| Source Identifier | Record Count | Percentage |
|---|---|---|
| `1.3M_linkedin_jobs_2024` | 11,192 | 100.00% |

## 4. Text Length Statistics

| Metric | Character Count | Word Count |
|---|---|---|
| Minimum | 255 | 35 |
| Maximum | 23,297 | 3,282 |
| Median | 3922.0 | 535.0 |
| Mean | 4272.2 | 583.9 |

## 5. Master Pipeline Audit & Rejection Metrics

| Pipeline Metric | Value |
|---|---|
| Total Records Inspected | 160,936 |
| Status: rejected | 149,744 |
| Status: accepted | 11,192 |
| Rejection Reason: rejected_no_role_match_or_ambiguous | 103,277 |
| Rejection Reason: rejected_non_civil_domain | 46,181 |
| Rejection Reason: insufficient_text_length_or_missing_summary | 281 |
| Rejection Reason: duplicate_normalized_text | 5 |

## 6. Boundary Examples Analysis

### Structural Engineer (Boundary pair vs Civil Site Engineer)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/senior-structural-engineer-at-conrad-consulting-3798745261`
- **Text Snippet**: *"Job Title: Senior Structural Engineer
Company: Conrad Consulting
Skills: Structural Engineering, Concrete design, Tekla, Technical design, Chartership, Sustainable housing complexes, New build hotels, Office refurbishments, Distribution centers, Reta..."*

### Civil Site Engineer (Boundary pair vs Structural Engineer)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/construction-inspector-at-hill-international-inc-3797722174`
- **Text Snippet**: *"Job Title: Construction Inspector
Company: Hill International, Inc.
Skills: PennDOT, Construction Inspector, Construction Management, Project Management, Transportation Construction Inspector 1 (TCI1), PennDOT Concrete Technician Certification, NECEP..."*

### Civil Site Engineer (Boundary pair vs Construction Project Engineer)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/construction-inspector-at-hill-international-inc-3797722174`
- **Text Snippet**: *"Job Title: Construction Inspector
Company: Hill International, Inc.
Skills: PennDOT, Construction Inspector, Construction Management, Project Management, Transportation Construction Inspector 1 (TCI1), PennDOT Concrete Technician Certification, NECEP..."*

### Construction Project Engineer (Boundary pair vs Civil Site Engineer)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/construction-manager-at-crg-tec-recruitment-3802179696`
- **Text Snippet**: *"Job Title: Construction Manager
Company: CRG | TEC Recruitment
Skills: M&E, Construction Management, Energy efficiency, Sustainable, Modern technologies, Multimillion pound project, Public sector, Construction Management expertise
Description: Strong..."*

### Construction Project Engineer (Boundary pair vs Quantity Surveyor)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/construction-manager-at-crg-tec-recruitment-3802179696`
- **Text Snippet**: *"Job Title: Construction Manager
Company: CRG | TEC Recruitment
Skills: M&E, Construction Management, Energy efficiency, Sustainable, Modern technologies, Multimillion pound project, Public sector, Construction Management expertise
Description: Strong..."*

### Quantity Surveyor (Boundary pair vs Construction Project Engineer)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/quantity-surveyor-at-resourcing-group-3734243211`
- **Text Snippet**: *"Job Title: Quantity surveyor
Company: Resourcing Group
Skills: Quantity Surveyor, Costeffective resource models, Best practise, Financial Performance, Budgeting, Forecasting, Contract variations, Invoice payment, Contract management, Estimating, Proc..."*

### Structural Engineer (Boundary pair vs Geotechnical Engineer)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/senior-structural-engineer-at-conrad-consulting-3798745261`
- **Text Snippet**: *"Job Title: Senior Structural Engineer
Company: Conrad Consulting
Skills: Structural Engineering, Concrete design, Tekla, Technical design, Chartership, Sustainable housing complexes, New build hotels, Office refurbishments, Distribution centers, Reta..."*

### Geotechnical Engineer (Boundary pair vs Structural Engineer)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/geotechnical-engineer-with-pe-certificate-at-m-s-consulting-3787745163`
- **Text Snippet**: *"Job Title: Geotechnical Engineer with PE Certificate
Company: M&S Consulting
Skills: Geotechnical Engineering, Geological Mapping, Report Writing, Site Characterization, Numerical Modeling, Excavation Analysis, Support Analysis, Drilling, Exploration..."*

### Civil Site Engineer (Boundary pair vs Quantity Surveyor)
- **Source Job ID**: `https://www.linkedin.com/jobs/view/construction-inspector-at-hill-international-inc-3797722174`
- **Text Snippet**: *"Job Title: Construction Inspector
Company: Hill International, Inc.
Skills: PennDOT, Construction Inspector, Construction Management, Project Management, Transportation Construction Inspector 1 (TCI1), PennDOT Concrete Technician Certification, NECEP..."*

### Quantity Surveyor (Boundary pair vs Civil Site Engineer)
- **Source Job ID**: `https://uk.linkedin.com/jobs/view/quantity-surveyor-at-resourcing-group-3734243211`
- **Text Snippet**: *"Job Title: Quantity surveyor
Company: Resourcing Group
Skills: Quantity Surveyor, Costeffective resource models, Best practise, Financial Performance, Budgeting, Forecasting, Contract variations, Invoice payment, Contract management, Estimating, Proc..."*

## 7. Sample Records Audit (10 per role)

### Role: Structural Engineer

1. **ID**: `https://www.linkedin.com/jobs/view/principal-structural-engineer-at-stanley-consultants-3798687080` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 892  
   *Snippet*: Job Title: Principal Structural Engineer Company: Stanley Consultants Skills: Structural Engineering, Civil Engineering, Steel Structures, Concrete St...

2. **ID**: `https://www.linkedin.com/jobs/view/structural-engineer-at-metric-search-3803943398` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 349  
   *Snippet*: Job Title: Structural Engineer Company: Metric Search Skills: Structural Engineering, Project Management, Condition Assessment, Repair Design, Constru...

3. **ID**: `https://www.linkedin.com/jobs/view/senior-structural-engineer-at-imeg-3791598523` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 827  
   *Snippet*: Job Title: Senior Structural Engineer Company: IMEG Skills: Technical Leadership, Mentoring, Training, Technical Project Management, Marketing, Busine...

4. **ID**: `https://www.linkedin.com/jobs/view/lead-structural-engineer-at-r-t-patterson-company-3771567029` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 551  
   *Snippet*: Job Title: Lead Structural Engineer Company: R. T. Patterson Company Skills: Civil/Structural Engineering, Structural Engineering, AutoCAD, STAAD.Pro,...

5. **ID**: `https://uk.linkedin.com/jobs/view/mainstream-brighton-consultancy-senior-structural-engineer-at-ice-recruit-3795850550` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 264  
   *Snippet*: Job Title: MAINSTREAM BRIGHTON CONSULTANCY: Senior Structural Engineer Company: ICE Recruit Skills: Structural Engineering, Project Management, Client...

6. **ID**: `https://www.linkedin.com/jobs/view/structural-engineer-at-liberty-personnel-services-inc-3719685495` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 143  
   *Snippet*: Job Title: Structural Engineer Company: Liberty Personnel Services, Inc. Skills: Structural Engineering, Civil Engineering, PE certification, AutoCAD,...

7. **ID**: `https://www.linkedin.com/jobs/view/senior-structural-engineer-at-dice-3805520218` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 805  
   *Snippet*: Job Title: Senior Structural Engineer Company: Dice Skills: Senior Structural Engineer, Revit, AutoCAD, P.E. or S.E., Professional Engineer (PE) licen...

8. **ID**: `https://ca.linkedin.com/jobs/view/senior-structural-engineer-at-oil-and-gas-job-search-ltd-3767976530` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 553  
   *Snippet*: Job Title: Senior Structural Engineer Company: Oil and Gas Job Search Ltd Skills: Senior Structural Engineer, Structural Engineering, Steel Structures...

9. **ID**: `https://uk.linkedin.com/jobs/view/senior-structural-engineer-at-accentis-limited-3804364020` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 471  
   *Snippet*: Job Title: Senior Structural Engineer Company: Accentis Limited Skills: Structural Design, Structural Surveys, Residential Building Projects, Commerci...

10. **ID**: `https://www.linkedin.com/jobs/view/sr-structural-engineer-at-rightworks-3805524557` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 111  
   *Snippet*: Job Title: Sr. Structural Engineer Company: RightWorks Skills: Civil Engineering, Roadway Design, Bridge Engineering, Structural Engineering, Project ...

### Role: Civil Site Engineer

1. **ID**: `https://www.linkedin.com/jobs/view/cei-roadway-and-bridge-construction-inspector-1-at-cdm-smith-3727347361` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 938  
   *Snippet*: Job Title: CEI Roadway and Bridge Construction Inspector 1 Company: CDM Smith Skills: Transportation Infrastructure Inspection, Construction Processes...

2. **ID**: `https://www.linkedin.com/jobs/view/construction-inspector-at-hdr-3785918593` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 639  
   *Snippet*: Job Title: Construction Inspector Company: HDR Skills: Construction Inspection, Documentation, Microsoft Office Suite, Problemsolving, Teamwork, Readi...

3. **ID**: `https://www.linkedin.com/jobs/view/construction-inspector-opportunities-in-florida-at-hdr-3721875918` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 607  
   *Snippet*: Job Title: Construction Inspector Opportunities in Florida Company: HDR Skills: Construction Inspection, Civil Infrastructure, Project Controls, Desig...

4. **ID**: `https://www.linkedin.com/jobs/view/construction-inspector-at-actalent-3807504302` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 446  
   *Snippet*: Job Title: COnstruction Inspector Company: Actalent Skills: 5G telecom, Telecom installation, Report generation, Communication, People skills, Constru...

5. **ID**: `https://www.linkedin.com/jobs/view/transportation-construction-inspector-2415-aa-at-wade-trim-3804366875` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 614  
   *Snippet*: Job Title: Transportation Construction Inspector - 2415.AA Company: Wade Trim Skills: FieldManager/Book, HMA concrete, MDOTlet contract requirements, ...

6. **ID**: `https://www.linkedin.com/jobs/view/construction-inspector-at-actalent-3805986280` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 506  
   *Snippet*: Job Title: Construction Inspector Company: Actalent Skills: Construction inspection, MDOT, Density testing, Concrete testing, Field book, Civil engine...

7. **ID**: `https://www.linkedin.com/jobs/view/construction-inspector-iii-at-kci-technologies-inc-3790155063` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 914  
   *Snippet*: Job Title: Construction Inspector III Company: KCI Technologies, Inc. Skills: Civil Engineering Technology, Roadway construction, Structure constructi...

8. **ID**: `https://www.linkedin.com/jobs/view/civil-site-engineer-pe-at-hdr-3648927244` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 999  
   *Snippet*: Job Title: Civil Site Engineer - PE Company: HDR Skills: Civil Engineering, Site Design, AutoCAD, Civil 3D, MicroStation, InRoads, Microsoft Office, Z...

9. **ID**: `https://www.linkedin.com/jobs/view/resident-engineer-at-the-johnson-group-inc-3798677860` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 401  
   *Snippet*: Job Title: Resident Engineer Company: The Johnson Group Inc. Skills: Resident Engineer, Construction Project Management, Transportation Projects, Infr...

10. **ID**: `https://www.linkedin.com/jobs/view/senior-site-civil-engineer-pe-at-hdr-3765547226` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1061  
   *Snippet*: Job Title: Senior Site Civil Engineer - PE Company: HDR Skills: Civil engineering, Site civil design, Concrete, Steel, Mass timber, HVAC, Instrumentat...

### Role: Construction Project Engineer

1. **ID**: `https://www.linkedin.com/jobs/view/long-term-opportunity-for-construction-manager-ii-at-plano-tx-at-tekwissen-%C2%AE-3712863544` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 747  
   *Snippet*: Job Title: Long term Opportunity for Construction Manager II at Plano TX Company: TekWissen ® Skills: Construction Management, Project Management, Qua...

2. **ID**: `https://www.linkedin.com/jobs/view/professional-administrator-construction-manager-cmiii-at-avani-tech-solutions-private-limited-3760248916` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 354  
   *Snippet*: Job Title: Professional - Administrator Construction Manager (CMIII) Company: Avani Tech Solutions Private Limited Skills: OSP Construction, Project M...

3. **ID**: `https://www.linkedin.com/jobs/view/construction-project-engineer-at-mcgrath-associates-inc-3797930244` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 149  
   *Snippet*: Job Title: Construction Project Engineer Company: McGrath & Associates, Inc. Skills: Shop drawing review, Estimating, Plan takeoff, Subcontractor coor...

4. **ID**: `https://www.linkedin.com/jobs/view/construction-manager-at-snf-holding-company-3740537308` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 547  
   *Snippet*: Job Title: Construction Manager Company: SNF Holding Company Skills: Construction Management, Project Management, Quality Assurance, Quality Control, ...

5. **ID**: `https://www.linkedin.com/jobs/view/construction-project-manager-at-ashton-woods-homes-3770774081` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 462  
   *Snippet*: Job Title: Construction Project Manager Company: Ashton Woods Homes Skills: Construction Project Management, Subcontractor Relations, Customer Care, S...

6. **ID**: `https://uk.linkedin.com/jobs/view/construction-manager-at-morgan-sindall-infrastructure-3800266514` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 573  
   *Snippet*: Job Title: Construction Manager Company: Morgan Sindall Infrastructure Skills: Construction Management, Highways Works, Degree in Relevant Subject, IC...

7. **ID**: `https://www.linkedin.com/jobs/view/high-end-residential-construction-project-manager-at-cybercoders-3681507033` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 741  
   *Snippet*: Job Title: High End Residential Construction Project Manager Company: CyberCoders Skills: Construction Science, Engineering, Architecture, CAD, Micros...

8. **ID**: `https://www.linkedin.com/jobs/view/construction-project-manager-at-pleasant-valley-corporation-3785773874` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 567  
   *Snippet*: Job Title: Construction Project Manager Company: Pleasant Valley Corporation Skills: Construction project management, Project scheduling, Subcontracto...

9. **ID**: `https://www.linkedin.com/jobs/view/construction-manager-food-processing-at-perry-construction-management-llc-3800191309` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 533  
   *Snippet*: Job Title: Construction Manager - Food Processing Company: Perry Construction Management, LLC Skills: Construction Management, Project Execution, Proj...

10. **ID**: `https://www.linkedin.com/jobs/view/construction-project-manager-at-jobot-3804045930` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 579  
   *Snippet*: Job Title: Construction Project Manager Company: Jobot Skills: Commercial Property Restoration, Residential Property Restoration, MultiFamily Property...

### Role: Quantity Surveyor

1. **ID**: `https://uk.linkedin.com/jobs/view/quantity-surveyor-at-cityscape-3798563180` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 329  
   *Snippet*: Job Title: Quantity Surveyor Company: Cityscape Skills: Construction, Cost Estimation, Project Management, Procurement, Contract Negotiation, Supplier...

2. **ID**: `https://uk.linkedin.com/jobs/view/managing-quantity-surveyor-2300009z-at-galliford-try-3736879213` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1660  
   *Snippet*: Job Title: Managing Quantity Surveyor (2300009Z) Company: Galliford Try Skills: Quantity Surveying, Project Management, Commercial Management, Cost Co...

3. **ID**: `https://uk.linkedin.com/jobs/view/construction-quantity-surveyor-hertfordshire-at-jca-engineering-3742733577` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 625  
   *Snippet*: Job Title: Construction Quantity Surveyor (Hertfordshire) Company: JCA Engineering Skills: Construction, Quantity Surveying, Contracts Management, Fin...

4. **ID**: `https://www.linkedin.com/jobs/view/quantity-surveyor-passive-fire-protection-at-clickjobs-io-3802811511` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 90  
   *Snippet*: Job Title: Quantity Surveyor Passive Fire Protection Company: ClickJobs.io Skills: Quantity Surveyor, Passive Fire Protection, Fire Curtains, Smoke Cu...

5. **ID**: `https://uk.linkedin.com/jobs/view/quantity-surveyor-at-eden-brown-built-environment-3805589412` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 319  
   *Snippet*: Job Title: Quantity Surveyor Company: Eden Brown Built Environment Skills: Quantity Surveying, Cost Management, Contract Management, Subcontractor Man...

6. **ID**: `https://uk.linkedin.com/jobs/view/managing-quantity-surveyor-at-elvet-recruitment-3797507129` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 184  
   *Snippet*: Job Title: Managing Quantity Surveyor Company: Elvet Recruitment Skills: Quantity Surveying, NEC contracts, Contractual and client relationship manage...

7. **ID**: `https://uk.linkedin.com/jobs/view/quantity-surveyor-at-conrad-consulting-3790156391` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 102  
   *Snippet*: Job Title: Quantity Surveyor Company: Conrad Consulting Skills: Quantity Surveyor Description: £35,000 - £45,000 (Permanent) Sheffield, Yorkshire and ...

8. **ID**: `https://uk.linkedin.com/jobs/view/quantity-surveyor-at-zac-recruitment-3802176868` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 182  
   *Snippet*: Job Title: Quantity Surveyor Company: ZAC Recruitment Skills: Quantity Surveying, Commercial Awareness, Legal Knowledge, IT skills, Communication Skil...

9. **ID**: `https://uk.linkedin.com/jobs/view/senior-quantity-surveyor-at-digitized-logos-inc-3804005833` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 287  
   *Snippet*: Job Title: Senior Quantity Surveyor Company: Digitized Logos, Inc. Skills: Quantity Surveying, Highway Maintenance, NEC contracts, CICES or RICS accre...

10. **ID**: `https://uk.linkedin.com/jobs/view/quantity-surveyor-230000g1-at-galliford-try-3785804614` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1103  
   *Snippet*: Job Title: Quantity Surveyor (230000G1) Company: Galliford Try Skills: Quantity Surveying, JCT, NEC, RICS, IOB, Construction, Design and Build, Cost M...

### Role: Geotechnical Engineer

1. **ID**: `https://www.linkedin.com/jobs/view/geotechnical-engineer-at-hdr-3735845080` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 806  
   *Snippet*: Job Title: Geotechnical Engineer Company: HDR Skills: Geotechnical Engineering, Civil Engineering, Structural Engineering, Geotechnical Software (gINT...

2. **ID**: `https://www.linkedin.com/jobs/view/senior-geotechnical-engineer-at-slr-consulting-3607074393` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 802  
   *Snippet*: Job Title: Senior Geotechnical Engineer Company: SLR Consulting Skills: Geotechnical Engineering, Project Management, Subsurface Exploration and Testi...

3. **ID**: `https://uk.linkedin.com/jobs/view/geotechnical-engineer-at-fielders-3805020857` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 129  
   *Snippet*: Job Title: Geotechnical Engineer Company: Fielders Skills: Project Management, Interpretative reporting, Design, Chartership, Flood risk, Coal mine re...

4. **ID**: `https://www.linkedin.com/jobs/view/geotechnical-engineer-at-stantec-3679462942` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1070  
   *Snippet*: Job Title: Geotechnical Engineer Company: Stantec Skills: Geotechnical Engineering, AutoCAD Civil3D, Geostudio Software Suite, Plaxis, ENSOFT LPILE, F...

5. **ID**: `https://www.linkedin.com/jobs/view/geotechnical-engineer-3-at-black-veatch-3799362516` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 935  
   *Snippet*: Job Title: Geotechnical Engineer 3 Company: Black & Veatch Skills: Civil Engineering, Hydraulic Engineering, Structural Engineering, Geotechnical Engi...

6. **ID**: `https://www.linkedin.com/jobs/view/senior-geotechnical-engineer-at-mentor-imc-group-3785380115` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 639  
   *Snippet*: Job Title: Senior Geotechnical Engineer Company: Mentor IMC Group Skills: Ground Engineering, Geotechnical Site Investigation, Geotechnical Consultanc...

7. **ID**: `https://www.linkedin.com/jobs/view/senior-geotechnical-staff-engineer-at-terracon-3786311977` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 667  
   *Snippet*: Job Title: Senior Geotechnical Staff Engineer Company: Terracon Skills: Engineering, Consulting, Field Investigations, Engineering Analysis, Calculati...

8. **ID**: `https://au.linkedin.com/jobs/view/senior-geotechnical-engineer-at-stantec-3693594471` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 909  
   *Snippet*: Job Title: Senior Geotechnical Engineer Company: Stantec Skills: Geotechnical engineering, Slope stability, Pavements, Landfills, Dams, Foundations, R...

9. **ID**: `https://www.linkedin.com/jobs/view/senior-geotechnical-engineer-at-terracon-3799642878` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 767  
   *Snippet*: Job Title: Senior Geotechnical Engineer Company: Terracon Skills: Geotechnical engineering, Consulting, Transmission lines, Slope stability assessment...

10. **ID**: `https://www.linkedin.com/jobs/view/sr-geotechnical-engineer-at-dragados-usa-inc-2966505186` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 601  
   *Snippet*: Job Title: Sr. Geotechnical Engineer Company: Dragados USA, Inc. Skills: Geotechnical Analysis, Construction Site Assessment, Geotechnical Exploration...

### Role: Transportation Engineer

1. **ID**: `https://www.linkedin.com/jobs/view/civil-highway-engineer-at-hdr-3558603371` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 910  
   *Snippet*: Job Title: Civil/Highway Engineer Company: HDR Skills: Civil Engineering, Highway Engineering, AutoCAD Civil 3D, Microstation, Inroads, Microsoft Offi...

2. **ID**: `https://www.linkedin.com/jobs/view/transportation-engineer-hybrid-at-latitude-inc-3787733172` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 180  
   *Snippet*: Job Title: Transportation Engineer (Hybrid) Company: Latitude Inc Skills: Project Management, Roadway Engineering, Traffic Engineering, Bridge Enginee...

3. **ID**: `https://www.linkedin.com/jobs/view/transportation-engineer-iii-iv-laredo-design-advanced-project-development-at-texas-department-of-transportation-3759689671` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1626  
   *Snippet*: Job Title: Transportation Engineer III/IV - Laredo Design/Advanced Project Development Company: Texas Department of Transportation Skills: Project man...

4. **ID**: `https://www.linkedin.com/jobs/view/senior-transportation-engineer-at-jobot-3804050926` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 375  
   *Snippet*: Job Title: Senior Transportation Engineer Company: Jobot Skills: Civil Engineering, PE licensure, MicroStation, OpenRoads, AutoCAD, ODOT, OTIC, Projec...

5. **ID**: `https://www.linkedin.com/jobs/view/highway-roadway-engineer-at-hdr-3786575069` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1544  
   *Snippet*: Job Title: Highway/Roadway Engineer* Company: HDR Skills: Highway/Roadway Engineering, Civil Engineering, Project Management, Intersection Design, Con...

6. **ID**: `https://www.linkedin.com/jobs/view/highway-roadway-engineer-at-hdr-3786571739` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1575  
   *Snippet*: Job Title: Highway/Roadway Engineer* Company: HDR Skills: Highway Engineering, Roadway Design, Civil Engineering, DOT and Local Government Experience,...

7. **ID**: `https://www.linkedin.com/jobs/view/senior-traffic-engineer-4377-at-stv-3695176015` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1246  
   *Snippet*: Job Title: Senior Traffic Engineer - 4377 Company: STV Skills: Traffic Engineering, Roadway Design, Traffic Safety, Crash Analysis, Transportation Pla...

8. **ID**: `https://uk.linkedin.com/jobs/view/senior-highway-engineer-s278-s38-technical-approval-at-waterman-aspen-3804004106` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 491  
   *Snippet*: Job Title: Senior Highway Engineer (S278/S38 Technical Approval) Company: Waterman Aspen Skills: S278, S38, DMRB, TSRGD, Design Standards, Traffic Reg...

9. **ID**: `https://ca.linkedin.com/jobs/view/highway-roadway-engineer-at-hdr-3786576150` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 1524  
   *Snippet*: Job Title: Highway/Roadway Engineer* Company: HDR Skills: Highway Engineering, Roadway Engineering, Transportation Planning, Civil Engineering, Projec...

10. **ID**: `https://www.linkedin.com/jobs/view/senior-transportation-engineer-at-jobot-3804055232` | **Source**: `1.3M_linkedin_jobs_2024` | **Words**: 377  
   *Snippet*: Job Title: Senior Transportation Engineer Company: Jobot Skills: Civil Engineering, Project Management, Staff Management, Transportation Engineering, ...

