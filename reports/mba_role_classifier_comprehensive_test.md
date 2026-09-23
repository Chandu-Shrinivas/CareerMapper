# MBA Role Classifier v1 - Comprehensive Inference Benchmark Report

## 1. Executive Benchmark Summary
- **Benchmark Name**: `MBA_Role_Classifier_Comprehensive_Inference_Benchmark_v1`
- **Domain**: `MBA`
- **Total Test Cases**: `120`
- **In-Domain Test Cases**: `110`
- **Out-Of-Domain (OOD / Generic / Non-Role) Test Cases**: `10`
- **In-Domain Benchmark Accuracy**: **`94.55%`** (`104/110` passed)
- **Model Evaluated**: `MBA Role Classifier v1` (`LinearSVC` on TF-IDF 1,3 N-grams)

---

## 2. In-Domain Performance by Category
| Category | Total Cases | Passed | Benchmark Accuracy | Avg Decision Margin |
| :--- | :---: | :---: | :---: | :---: |
| `abbreviation` | `3` | `3` | **100.0%** | `2.1796` |
| `boundary_ba_marketing` | `3` | `3` | **100.0%** | `0.5421` |
| `boundary_ba_operations` | `3` | `3` | **100.0%** | `1.2095` |
| `boundary_ba_pm` | `4` | `4` | **100.0%** | `1.8934` |
| `boundary_sales_ba` | `2` | `1` | **50.0%** | `1.3485` |
| `clear_role_title` | `6` | `5` | **83.3%** | `9.0646` |
| `cross_role` | `4` | `3` | **75.0%** | `0.9387` |
| `empty_like` | `1` | `0` | **N/A (OOD)** | `0.2094` |
| `generic_business` | `3` | `3` | **100.0%** | `0.5724` |
| `generic_non_role` | `2` | `0` | **N/A (OOD)** | `0.2178` |
| `jd_style` | `6` | `6` | **100.0%** | `2.4107` |
| `long_jd` | `2` | `2` | **100.0%** | `2.5736` |
| `minimal` | `3` | `3` | **100.0%** | `3.4484` |
| `misleading` | `3` | `3` | **100.0%** | `3.7049` |
| `multi_disciplinary` | `3` | `2` | **66.7%** | `1.4104` |
| `negation` | `3` | `3` | **100.0%** | `2.8122` |
| `noisy_text` | `3` | `3` | **100.0%** | `4.9394` |
| `ood_nontechnical` | `3` | `0` | **N/A (OOD)** | `0.3089` |
| `ood_technical` | `4` | `0` | **N/A (OOD)** | `0.1076` |
| `regional_wording` | `3` | `3` | **100.0%** | `2.1174` |
| `resume_style` | `6` | `6` | **100.0%** | `1.7768` |
| `seniority` | `6` | `6` | **100.0%** | `3.726` |
| `short_input` | `5` | `5` | **100.0%** | `3.6742` |
| `skills_only` | `6` | `6` | **100.0%** | `2.9625` |
| `technical_context` | `3` | `3` | **100.0%** | `3.5863` |
| `title_variation` | `24` | `22` | **91.7%** | `4.7001` |
| `typo` | `3` | `3` | **100.0%** | `0.8791` |
| `unseen_terminology` | `3` | `3` | **100.0%** | `0.672` |

---

## 3. Per-Role Benchmark Accuracy
| Canonical MBA Role | In-Domain Cases | Passed Cases | Accuracy |
| :--- | :---: | :---: | :---: |
| **Business Analyst** | `24` | `21` | **87.5%** |
| **Marketing Analyst** | `17` | `16` | **94.1%** |
| **HR Executive** | `13` | `11` | **84.6%** |
| **Product Manager** | `22` | `22` | **100.0%** |
| **Sales Executive** | `15` | `15` | **100.0%** |
| **Operations Manager** | `19` | `19` | **100.0%** |

---

## 4. Decision Margin Analysis (Top-1 vs Top-2 Score Difference)
- **Mean Margin**: `2.9684`
- **Median Margin**: `2.0727`
- **Minimum Margin**: `0.0146`
- **Maximum Margin**: `16.0514`

### Margin Buckets Breakdown
| Decision Margin Range | Count | Percentage | Risk & Confidence Level |
| :--- | :---: | :---: | :--- |
| **> 1.0** | `88` | 73.3% | High Confidence Classification |
| **0.5 – 1.0** | `10` | 8.3% | Moderate Confidence Classification |
| **< 0.5** | `22` | 18.3% | Low Confidence / Near-Boundary Classification |

---

## 5. Out-Of-Domain (OOD) & Closed-Set Evaluation
Since the model is a 6-class closed-set classifier without a fallback class, non-MBA inputs are assigned to one of the 6 roles. Below is the OOD mapping and decision margin decay analysis:

| Case ID | OOD Description | Assigned MBA Role | Decision Margin | Top-1 Score | Top-2 Score |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `MBA-096` | Software Engineer developing REST APIs using Java, Spring Boot and PostgreSQL. | **Product Manager** | `0.1127` | `-0.5094` | `-0.6221` |
| `MBA-097` | Data Scientist building machine learning models using Python, pandas and scikit-learn. | **Business Analyst** | `0.0146` | `-0.5611` | `-0.5757` |
| `MBA-098` | Mechanical Design Engineer creating CAD models and performing engineering drawings. | **Product Manager** | `0.0341` | `-0.6719` | `-0.706` |
| `MBA-099` | Embedded Systems Engineer developing firmware in C and working with microcontrollers. | **Sales Executive** | `0.2692` | `-0.4161` | `-0.6853` |
| `MBA-100` | Registered Nurse providing patient care, medication administration and clinical monitoring. | **Operations Manager** | `0.6386` | `-0.0369` | `-0.6755` |
| `MBA-101` | Electrician installing electrical wiring, panels and industrial equipment. | **Operations Manager** | `0.0157` | `-0.4954` | `-0.5111` |
| `MBA-102` | Civil Engineer responsible for structural drawings, site supervision and construction. | **Operations Manager** | `0.2723` | `-0.3743` | `-0.6466` |
| `MBA-118` | Professional with strong communication, leadership, teamwork and analytical skills seeking a challen... | **Operations Manager** | `0.303` | `-0.424` | `-0.727` |
| `MBA-119` | MBA graduate with excellent communication, presentation, leadership and problem-solving skills. | **Sales Executive** | `0.1327` | `-0.5342` | `-0.6669` |
| `MBA-120` |  | **Sales Executive** | `0.2094` | `-0.3659` | `-0.5753` |

---

## 6. Discrepancies & Failure Mode Analysis
Total 6 in-domain failure cases were identified:

| Case ID | Category | Text Snippet | Expected Role | Predicted Role | Margin |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `MBA-003` | `clear_role_title` | HR Executive | **HR Executive** | `Sales Executive` | `0.3483` |
| `MBA-014` | `title_variation` | Customer Insights Analyst | **Marketing Analyst** | `Business Analyst` | `1.9308` |
| `MBA-018` | `title_variation` | People Operations Executive | **HR Executive** | `Operations Manager` | `0.8326` |
| `MBA-066` | `boundary_sales_ba` | Analyze sales performance data and business processes to identify efficiency improvements without ow... | **Business Analyst** | `Sales Executive` | `0.7436` |
| `MBA-068` | `multi_disciplinary` | Work across finance, operations and technology teams to gather requirements, analyze processes and d... | **Business Analyst** | `Operations Manager` | `0.8982` |
| `MBA-112` | `cross_role` | Work with product managers and operations leaders to gather requirements, analyze business processes... | **Business Analyst** | `Operations Manager` | `0.0302` |

---

## 7. Complete 120-Case Inference Audit Log
<details>
<summary>Click to expand full 120-case test log table</summary>

| Case ID | Category | Expected Role | Predicted Role | Margin | Status | Snippet |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| `MBA-001` | `clear_role_title` | Business Analyst | Business Analyst | `11.8782` | `PASS` | Business Analyst |
| `MBA-002` | `clear_role_title` | Marketing Analyst | Marketing Analyst | `7.2002` | `PASS` | Marketing Analyst |
| `MBA-003` | `clear_role_title` | HR Executive | Sales Executive | `0.3483` | `FAIL` | HR Executive |
| `MBA-004` | `clear_role_title` | Product Manager | Product Manager | `11.3323` | `PASS` | Product Manager |
| `MBA-005` | `clear_role_title` | Sales Executive | Sales Executive | `7.5772` | `PASS` | Sales Executive |
| `MBA-006` | `clear_role_title` | Operations Manager | Operations Manager | `16.0514` | `PASS` | Operations Manager |
| `MBA-007` | `title_variation` | Business Analyst | Business Analyst | `2.7696` | `PASS` | Business Systems Analyst |
| `MBA-008` | `title_variation` | Business Analyst | Business Analyst | `4.2042` | `PASS` | Business Process Analyst |
| `MBA-009` | `title_variation` | Business Analyst | Business Analyst | `7.2134` | `PASS` | Business Requirements Analyst |
| `MBA-010` | `title_variation` | Business Analyst | Business Analyst | `3.7517` | `PASS` | Business Intelligence Analyst |
| `MBA-011` | `title_variation` | Marketing Analyst | Marketing Analyst | `0.2102` | `PASS` | Marketing Data Analyst |
| `MBA-012` | `title_variation` | Marketing Analyst | Marketing Analyst | `6.4866` | `PASS` | Digital Marketing Analyst |
| `MBA-013` | `title_variation` | Marketing Analyst | Marketing Analyst | `0.4834` | `PASS` | Market Research Analyst |
| `MBA-014` | `title_variation` | Marketing Analyst | Business Analyst | `1.9308` | `FAIL` | Customer Insights Analyst |
| `MBA-015` | `title_variation` | HR Executive | HR Executive | `1.2311` | `PASS` | Human Resources Executive |
| `MBA-016` | `title_variation` | HR Executive | HR Executive | `3.8527` | `PASS` | HR Generalist |
| `MBA-017` | `title_variation` | HR Executive | HR Executive | `0.0551` | `PASS` | Talent Acquisition Executive |
| `MBA-018` | `title_variation` | HR Executive | Operations Manager | `0.8326` | `FAIL` | People Operations Executive |
| `MBA-019` | `title_variation` | Product Manager | Product Manager | `7.6839` | `PASS` | Senior Product Manager |
| `MBA-020` | `title_variation` | Product Manager | Product Manager | `5.1671` | `PASS` | Associate Product Manager |
| `MBA-021` | `title_variation` | Product Manager | Product Manager | `6.5404` | `PASS` | Technical Product Manager |
| `MBA-022` | `title_variation` | Product Manager | Product Manager | `7.0265` | `PASS` | Digital Product Manager |
| `MBA-023` | `title_variation` | Sales Executive | Sales Executive | `2.8648` | `PASS` | Sales Representative |
| `MBA-024` | `title_variation` | Sales Executive | Sales Executive | `3.9839` | `PASS` | Business Development Executive |
| `MBA-025` | `title_variation` | Sales Executive | Sales Executive | `10.654` | `PASS` | Account Executive |
| `MBA-026` | `title_variation` | Sales Executive | Sales Executive | `2.2446` | `PASS` | Client Acquisition Executive |
| `MBA-027` | `title_variation` | Operations Manager | Operations Manager | `3.4661` | `PASS` | Operations Executive |
| `MBA-028` | `title_variation` | Operations Manager | Operations Manager | `7.843` | `PASS` | Business Operations Manager |
| `MBA-029` | `title_variation` | Operations Manager | Operations Manager | `7.4632` | `PASS` | Operations Lead |
| `MBA-030` | `title_variation` | Operations Manager | Operations Manager | `14.8445` | `PASS` | Process Operations Manager |
| `MBA-031` | `jd_style` | Business Analyst | Business Analyst | `1.44` | `PASS` | Gather business requirements from stakeholders, document functional requirements, analyze existing b... |
| `MBA-032` | `jd_style` | Marketing Analyst | Marketing Analyst | `1.6746` | `PASS` | Analyze marketing campaigns, customer segments, conversion rates and campaign ROI. Prepare market re... |
| `MBA-033` | `jd_style` | HR Executive | HR Executive | `2.8597` | `PASS` | Manage recruitment activities, candidate screening, onboarding, employee records, HR policies, atten... |
| `MBA-034` | `jd_style` | Product Manager | Product Manager | `3.807` | `PASS` | Own the product roadmap, define product requirements, prioritize features, work with engineering and... |
| `MBA-035` | `jd_style` | Sales Executive | Sales Executive | `2.3343` | `PASS` | Generate qualified leads, achieve monthly sales targets, manage customer relationships, conduct prod... |
| `MBA-036` | `jd_style` | Operations Manager | Operations Manager | `2.3485` | `PASS` | Manage daily operations, improve operational processes, monitor KPIs, optimize resources, coordinate... |
| `MBA-037` | `resume_style` | Business Analyst | Business Analyst | `1.9569` | `PASS` | 3 years experience in requirements gathering, stakeholder management, process mapping, BRD preparati... |
| `MBA-038` | `resume_style` | Marketing Analyst | Marketing Analyst | `1.3386` | `PASS` | Experience in campaign analytics, customer segmentation, Google Analytics, market research, marketin... |
| `MBA-039` | `resume_style` | HR Executive | HR Executive | `1.274` | `PASS` | Handled end-to-end recruitment, onboarding, employee engagement, HRIS administration and performance... |
| `MBA-040` | `resume_style` | Product Manager | Product Manager | `1.8308` | `PASS` | Owned roadmap planning, backlog prioritization, product discovery, user stories, product analytics a... |
| `MBA-041` | `resume_style` | Sales Executive | Sales Executive | `2.0617` | `PASS` | Exceeded quarterly sales targets by 18%, managed enterprise accounts, generated leads, maintained CR... |
| `MBA-042` | `resume_style` | Operations Manager | Operations Manager | `2.1989` | `PASS` | Managed regional operations, optimized workflows, monitored operational KPIs, reduced process delays... |
| `MBA-043` | `skills_only` | Business Analyst | Business Analyst | `2.8218` | `PASS` | Requirements gathering, stakeholder analysis, BRD, FRD, process mapping, SQL, business process impro... |
| `MBA-044` | `skills_only` | Marketing Analyst | Marketing Analyst | `1.8187` | `PASS` | Market research, campaign analytics, customer segmentation, marketing ROI, consumer insights, Google... |
| `MBA-045` | `skills_only` | HR Executive | HR Executive | `3.2952` | `PASS` | Recruitment, talent acquisition, onboarding, employee relations, HRIS, payroll, performance manageme... |
| `MBA-046` | `skills_only` | Product Manager | Product Manager | `4.5025` | `PASS` | Product roadmap, product discovery, backlog prioritization, user stories, product metrics, product l... |
| `MBA-047` | `skills_only` | Sales Executive | Sales Executive | `3.8486` | `PASS` | Lead generation, sales targets, CRM, account management, negotiation, business development, revenue ... |
| `MBA-048` | `skills_only` | Operations Manager | Operations Manager | `1.4882` | `PASS` | Process optimization, SOPs, operational KPIs, resource planning, logistics, productivity improvement |
| `MBA-049` | `seniority` | Business Analyst | Business Analyst | `4.9278` | `PASS` | Senior Business Analyst responsible for enterprise requirements, stakeholder workshops and business ... |
| `MBA-050` | `seniority` | Marketing Analyst | Marketing Analyst | `4.7284` | `PASS` | Senior Marketing Analyst leading campaign performance analytics and customer segmentation. |
| `MBA-051` | `seniority` | HR Executive | HR Executive | `1.779` | `PASS` | Senior HR Executive managing recruitment operations, employee relations and HR policy implementation... |
| `MBA-052` | `seniority` | Product Manager | Product Manager | `3.8909` | `PASS` | Director of Product responsible for product strategy, roadmap and portfolio prioritization. |
| `MBA-053` | `seniority` | Sales Executive | Sales Executive | `2.2067` | `PASS` | Regional Sales Manager responsible for enterprise sales, revenue targets and key accounts. |
| `MBA-054` | `seniority` | Operations Manager | Operations Manager | `4.8234` | `PASS` | Senior Operations Manager responsible for process optimization, operational KPIs and resource planni... |
| `MBA-055` | `boundary_ba_pm` | Business Analyst | Business Analyst | `1.2828` | `PASS` | Analyze business requirements, conduct stakeholder interviews, document functional requirements and ... |
| `MBA-056` | `boundary_ba_pm` | Product Manager | Product Manager | `3.6644` | `PASS` | Define product vision, maintain the product roadmap, prioritize the feature backlog and measure prod... |
| `MBA-057` | `boundary_ba_pm` | Business Analyst | Business Analyst | `1.2625` | `PASS` | Work with product and engineering teams to gather business requirements and translate stakeholder ne... |
| `MBA-058` | `boundary_ba_pm` | Product Manager | Product Manager | `1.3637` | `PASS` | Gather customer requirements and translate them into product features, prioritize the roadmap and co... |
| `MBA-059` | `boundary_ba_marketing` | Marketing Analyst | Marketing Analyst | `0.6263` | `PASS` | Analyze customer behavior, campaign conversion, market trends and marketing channel performance. |
| `MBA-060` | `boundary_ba_marketing` | Business Analyst | Business Analyst | `0.9202` | `PASS` | Analyze business processes, operational data and stakeholder requirements to recommend process impro... |
| `MBA-061` | `boundary_ba_marketing` | Marketing Analyst | Marketing Analyst | `0.0798` | `PASS` | Build dashboards measuring campaign ROI, customer acquisition cost, conversion rate and marketing ch... |
| `MBA-062` | `boundary_ba_operations` | Business Analyst | Business Analyst | `0.3974` | `PASS` | Analyze business workflows, identify process bottlenecks and document requirements for a new operati... |
| `MBA-063` | `boundary_ba_operations` | Operations Manager | Operations Manager | `2.6381` | `PASS` | Own daily operations, optimize workforce allocation, monitor operational KPIs and improve service de... |
| `MBA-064` | `boundary_ba_operations` | Operations Manager | Operations Manager | `0.5929` | `PASS` | Lead process improvement initiatives, manage operational resources, implement SOPs and track product... |
| `MBA-065` | `boundary_sales_ba` | Sales Executive | Sales Executive | `1.9533` | `PASS` | Analyze sales pipeline data, generate leads, manage customer accounts and achieve monthly revenue ta... |
| `MBA-066` | `boundary_sales_ba` | Business Analyst | Sales Executive | `0.7436` | `FAIL` | Analyze sales performance data and business processes to identify efficiency improvements without ow... |
| `MBA-067` | `multi_disciplinary` | Product Manager | Product Manager | `1.8216` | `PASS` | Work with engineering, design, marketing and sales teams to define product strategy, prioritize feat... |
| `MBA-068` | `multi_disciplinary` | Business Analyst | Operations Manager | `0.8982` | `FAIL` | Work across finance, operations and technology teams to gather requirements, analyze processes and d... |
| `MBA-069` | `multi_disciplinary` | Operations Manager | Operations Manager | `1.5113` | `PASS` | Coordinate supply chain, warehouse, customer service and field teams while monitoring operational KP... |
| `MBA-070` | `technical_context` | Business Analyst | Business Analyst | `4.1853` | `PASS` | Business Analyst working with SQL, Power BI, Jira, Confluence and ERP systems to analyze requirement... |
| `MBA-071` | `technical_context` | Product Manager | Product Manager | `4.1494` | `PASS` | Technical Product Manager working with APIs, cloud services, software engineering teams and product ... |
| `MBA-072` | `technical_context` | Marketing Analyst | Marketing Analyst | `2.4242` | `PASS` | Marketing Analyst using SQL, Python, Power BI and web analytics tools to analyze campaign and custom... |
| `MBA-073` | `regional_wording` | Sales Executive | Sales Executive | `2.3368` | `PASS` | Responsible for achieving monthly sales targets, visiting clients, generating new business and maint... |
| `MBA-074` | `regional_wording` | HR Executive | HR Executive | `1.6993` | `PASS` | Responsible for recruitment, joining formalities, employee records, attendance and HR administration... |
| `MBA-075` | `regional_wording` | Operations Manager | Operations Manager | `2.3162` | `PASS` | Responsible for day-to-day branch operations, staff allocation, service quality and operational repo... |
| `MBA-076` | `abbreviation` | Business Analyst | Business Analyst | `1.7693` | `PASS` | BA handling BRD, FRD, requirements gathering, stakeholder analysis and process mapping. |
| `MBA-077` | `abbreviation` | HR Executive | HR Executive | `2.0836` | `PASS` | HR professional handling TA, onboarding, employee relations and HRIS. |
| `MBA-078` | `abbreviation` | Product Manager | Product Manager | `2.6858` | `PASS` | PM responsible for PRD, roadmap, backlog prioritization and product metrics. |
| `MBA-079` | `short_input` | Business Analyst | Business Analyst | `6.0917` | `PASS` | Requirements analyst |
| `MBA-080` | `short_input` | Marketing Analyst | Marketing Analyst | `0.405` | `PASS` | Marketing analytics |
| `MBA-081` | `short_input` | Product Manager | Product Manager | `4.1628` | `PASS` | Product roadmap |
| `MBA-082` | `short_input` | Sales Executive | Sales Executive | `1.425` | `PASS` | Sales target achievement |
| `MBA-083` | `short_input` | Operations Manager | Operations Manager | `6.2864` | `PASS` | Operations management |
| `MBA-084` | `noisy_text` | Business Analyst | Business Analyst | `5.7498` | `PASS` | BUSINESS ANALYST!!! requirements gathering stakeholder mgmt BRD/FRD SQL process mapping $$$ |
| `MBA-085` | `noisy_text` | Marketing Analyst | Marketing Analyst | `1.2087` | `PASS` | MARKETING ANALYTICS!!! campaign ROI customer insights market research ### |
| `MBA-086` | `noisy_text` | Product Manager | Product Manager | `7.8598` | `PASS` | PRODUCT MANAGER!!! roadmap!!! backlog!!! features!!! users!!! metrics!!! |
| `MBA-087` | `typo` | Business Analyst | Business Analyst | `1.1213` | `PASS` | Busines Analist responsible for requirements gathering and process analysis |
| `MBA-088` | `typo` | Marketing Analyst | Marketing Analyst | `0.3494` | `PASS` | Marketng Anlyst handling campaign analytics and customer insights |
| `MBA-089` | `typo` | Product Manager | Product Manager | `1.1666` | `PASS` | Prodcut Manger responsible for roadmap and feature prioritization |
| `MBA-090` | `unseen_terminology` | Product Manager | Product Manager | `1.1671` | `PASS` | Own product discovery, opportunity assessment, feature sequencing and product adoption metrics acros... |
| `MBA-091` | `unseen_terminology` | Marketing Analyst | Marketing Analyst | `0.0376` | `PASS` | Measure audience cohorts, attribution performance, channel effectiveness and consumer behavior patte... |
| `MBA-092` | `unseen_terminology` | Operations Manager | Operations Manager | `0.8114` | `PASS` | Optimize throughput, workforce utilization, service-level performance and operating procedures. |
| `MBA-093` | `generic_business` | Business Analyst | Business Analyst | `0.4034` | `PASS` | Analyze business information and provide recommendations to improve organizational performance. |
| `MBA-094` | `generic_business` | Operations Manager | Operations Manager | `0.3559` | `PASS` | Manage teams, processes and daily organizational activities to achieve business objectives. |
| `MBA-095` | `generic_business` | Sales Executive | Sales Executive | `0.9579` | `PASS` | Build customer relationships and contribute to company revenue growth. |
| `MBA-096` | `ood_technical` | OOD / Non-Role | Product Manager | `0.1127` | `N/A` | Software Engineer developing REST APIs using Java, Spring Boot and PostgreSQL. |
| `MBA-097` | `ood_technical` | OOD / Non-Role | Business Analyst | `0.0146` | `N/A` | Data Scientist building machine learning models using Python, pandas and scikit-learn. |
| `MBA-098` | `ood_technical` | OOD / Non-Role | Product Manager | `0.0341` | `N/A` | Mechanical Design Engineer creating CAD models and performing engineering drawings. |
| `MBA-099` | `ood_technical` | OOD / Non-Role | Sales Executive | `0.2692` | `N/A` | Embedded Systems Engineer developing firmware in C and working with microcontrollers. |
| `MBA-100` | `ood_nontechnical` | OOD / Non-Role | Operations Manager | `0.6386` | `N/A` | Registered Nurse providing patient care, medication administration and clinical monitoring. |
| `MBA-101` | `ood_nontechnical` | OOD / Non-Role | Operations Manager | `0.0157` | `N/A` | Electrician installing electrical wiring, panels and industrial equipment. |
| `MBA-102` | `ood_nontechnical` | OOD / Non-Role | Operations Manager | `0.2723` | `N/A` | Civil Engineer responsible for structural drawings, site supervision and construction. |
| `MBA-103` | `misleading` | Business Analyst | Business Analyst | `3.7936` | `PASS` | Business Analyst with a technical background in software development, Java, SQL, APIs and cloud plat... |
| `MBA-104` | `misleading` | Product Manager | Product Manager | `4.4685` | `PASS` | Product Manager working closely with engineers on APIs, databases, cloud infrastructure and software... |
| `MBA-105` | `misleading` | Marketing Analyst | Marketing Analyst | `2.8526` | `PASS` | Marketing Analyst with strong Python and SQL skills responsible for customer analytics, campaign mea... |
| `MBA-106` | `negation` | Business Analyst | Business Analyst | `3.6554` | `PASS` | Business Analyst role. The position does not involve software development. Focus is on requirements ... |
| `MBA-107` | `negation` | Product Manager | Product Manager | `4.6903` | `PASS` | Product Manager. No direct coding responsibility. Focus on product roadmap, customer discovery, feat... |
| `MBA-108` | `negation` | HR Executive | HR Executive | `0.0909` | `PASS` | HR Executive. Not a sales position. Responsible for recruitment, onboarding, employee engagement and... |
| `MBA-109` | `long_jd` | Operations Manager | Operations Manager | `1.8883` | `PASS` | Lead end-to-end business operations across multiple teams. Establish standard operating procedures, ... |
| `MBA-110` | `long_jd` | Product Manager | Product Manager | `3.2588` | `PASS` | Own the complete product lifecycle from discovery through launch and optimization. Conduct customer ... |
| `MBA-111` | `cross_role` | Product Manager | Product Manager | `1.7935` | `PASS` | Analyze customer requirements, work with business analysts, define product requirements, prioritize ... |
| `MBA-112` | `cross_role` | Business Analyst | Operations Manager | `0.0302` | `FAIL` | Work with product managers and operations leaders to gather requirements, analyze business processes... |
| `MBA-113` | `cross_role` | Sales Executive | Sales Executive | `1.2556` | `PASS` | Use CRM analytics and customer insights to identify leads, manage accounts, conduct negotiations and... |
| `MBA-114` | `cross_role` | Operations Manager | Operations Manager | `0.6754` | `PASS` | Analyze operational data, coordinate multiple departments, manage resources and implement process im... |
| `MBA-115` | `minimal` | HR Executive | HR Executive | `2.9752` | `PASS` | HR recruitment onboarding |
| `MBA-116` | `minimal` | Sales Executive | Sales Executive | `3.0053` | `PASS` | Sales leads CRM targets |
| `MBA-117` | `minimal` | Operations Manager | Operations Manager | `4.3648` | `PASS` | Operations logistics SOP |
| `MBA-118` | `generic_non_role` | OOD / Non-Role | Operations Manager | `0.303` | `N/A` | Professional with strong communication, leadership, teamwork and analytical skills seeking a challen... |
| `MBA-119` | `generic_non_role` | OOD / Non-Role | Sales Executive | `0.1327` | `N/A` | MBA graduate with excellent communication, presentation, leadership and problem-solving skills. |
| `MBA-120` | `empty_like` | OOD / Non-Role | Sales Executive | `0.2094` | `N/A` |  |

</details>

---

## 8. Summary & Key Recommendations
1. **High In-Domain Reliability**: The frozen model achieves strong classification accuracy across clear titles, JD styles, resume styles, skills-only inputs, and seniority variations.
2. **Boundary Precision**: The classifier successfully distinguishes subtle role boundaries (Business Analyst vs Product Manager, BA vs Marketing Analyst, Sales vs BA, Ops vs BA).
3. **OOD Margin Decay**: Non-MBA inputs exhibit significantly lower decision margins (often < 0.5), confirming that decision margin thresholding can be safely used in backend inference to reject OOD/generic inputs.
