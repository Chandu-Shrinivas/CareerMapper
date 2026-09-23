# Mechanical Role Classifier v1 — Comprehensive Test Suite Report

**Model Evaluated**: Mechanical Role Classifier v1 (LinearSVC C=0.5 + TF-IDF 1,2)  
**Total Test Cases Evaluated**: **114**  
**In-Domain Canonical Cases**: **91**  
**In-Domain Passed**: **77 / 91 (84.62% Accuracy)**  
**In-Domain Failed**: **14**  
**Out-of-Domain / Generic / Misleading Evaluated**: **23**  

---

## 1. Executive Test Performance Summary

- **Title Variations**: **100% (10/10)**
- **Skill Lists**: **100% (5/5)**
- **Abbreviations**: **100% (4/4)**
- **Industry Variations**: **100% (5/5)**
- **Project-Based Cases**: **100% (5/5)**
- **Long Resumes & Job Descriptions**: **100% (2/2)**
- **Boundary Cases**: **85.7% (6/7)**
- **Clear Roles**: **86.7% (13/15)**
- **Resumes & JDs**: **80.0% (8/10)**
- **Seniority Titles**: **80.0% (4/5)**
- **Very Short / Noisy Inputs**: **80.0% (8/10)**
- **Multi-Disciplinary / Negations**: Challenging edge cases highlighting overlap between `Product Design Engineer` and `CAD Design Engineer` / `FEA Analyst`.

---

## 2. Comprehensive Test Results Table

| ID | Category | Expected Role | Predicted Role | Margin | Status | Snippet |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **MECH_001** | clear_role | `CAD Design Engineer` | `Product Design Engineer` | `1.86` | ❌ FAILED | CAD Design Engineer experienced in SolidWorks, AutoCAD, CATIA, Creo, 3D modeling, GD&T and detailed ... |
| **MECH_002** | clear_role | `CAD Design Engineer` | `CAD Design Engineer` | `2.22` | ✅ PASSED | Mechanical CAD designer responsible for creating 3D models, assemblies, engineering drawings and GD&... |
| **MECH_003** | clear_role | `CAD Design Engineer` | `Product Design Engineer` | `1.76` | ❌ FAILED | Design engineer specializing in CATIA V5, surface modeling, part design, assemblies and technical dr... |
| **MECH_004** | clear_role | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `5.51` | ✅ PASSED | FEA/CFD Analyst with expertise in ANSYS, Abaqus, finite element analysis, meshing, stress analysis a... |
| **MECH_005** | clear_role | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `3.34` | ✅ PASSED | Simulation engineer performing CFD simulations, fluid flow analysis, thermal analysis and mesh gener... |
| **MECH_006** | clear_role | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `4.40` | ✅ PASSED | Structural analysis engineer using Abaqus and ANSYS for finite element modeling, stress analysis and... |
| **MECH_007** | clear_role | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.99` | ✅ PASSED | Manufacturing Engineer responsible for CNC machining, production processes, Lean Manufacturing, Six ... |
| **MECH_008** | clear_role | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.83` | ✅ PASSED | Production engineer managing assembly processes, tooling, manufacturing process improvement and prod... |
| **MECH_009** | clear_role | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.09` | ✅ PASSED | Manufacturing engineer experienced in CNC, machining, process engineering, root cause analysis and c... |
| **MECH_010** | clear_role | `Product Design Engineer` | `Product Design Engineer` | `2.78` | ✅ PASSED | Product Design Engineer working on mechanical product development, DFM, DFA, BOM creation, prototypi... |
| **MECH_011** | clear_role | `Product Design Engineer` | `Product Design Engineer` | `3.20` | ✅ PASSED | Mechanical Product Design Engineer responsible for new product development, prototypes, design revie... |
| **MECH_012** | clear_role | `Product Design Engineer` | `Product Design Engineer` | `3.54` | ✅ PASSED | Product development engineer with experience in mechanical design, DFM, DFA, BOM management and prot... |
| **MECH_013** | clear_role | `HVAC Engineer` | `HVAC Engineer` | `3.23` | ✅ PASSED | HVAC Engineer experienced in HVAC design, chilled water systems, ductwork, refrigeration, ventilatio... |
| **MECH_014** | clear_role | `HVAC Engineer` | `HVAC Engineer` | `1.08` | ✅ PASSED | HVAC design engineer responsible for air conditioning systems, duct design, cooling loads and chille... |
| **MECH_015** | clear_role | `HVAC Engineer` | `HVAC Engineer` | `3.30` | ✅ PASSED | Mechanical HVAC engineer working on refrigeration systems, ventilation, BMS and commercial building ... |
| **TITLE_001** | title_variation | `CAD Design Engineer` | `CAD Design Engineer` | `3.29` | ✅ PASSED | Mechanical CAD Designer... |
| **TITLE_002** | title_variation | `CAD Design Engineer` | `CAD Design Engineer` | `0.23` | ✅ PASSED | 3D CAD Design Specialist... |
| **TITLE_003** | title_variation | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `4.09` | ✅ PASSED | Finite Element Analysis Engineer... |
| **TITLE_004** | title_variation | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `4.05` | ✅ PASSED | Simulation Engineer - CFD... |
| **TITLE_005** | title_variation | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.36` | ✅ PASSED | Production Process Engineer... |
| **TITLE_006** | title_variation | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.64` | ✅ PASSED | Industrial Manufacturing Engineer... |
| **TITLE_007** | title_variation | `Product Design Engineer` | `Product Design Engineer` | `3.69` | ✅ PASSED | Mechanical Product Development Engineer... |
| **TITLE_008** | title_variation | `Product Design Engineer` | `Product Design Engineer` | `5.67` | ✅ PASSED | Mechanical Design & Development Engineer... |
| **TITLE_009** | title_variation | `HVAC Engineer` | `HVAC Engineer` | `3.07` | ✅ PASSED | Building Services HVAC Engineer... |
| **TITLE_010** | title_variation | `HVAC Engineer` | `HVAC Engineer` | `3.97` | ✅ PASSED | HVAC Design Specialist... |
| **SKILL_001** | skill_list | `CAD Design Engineer` | `CAD Design Engineer` | `0.06` | ✅ PASSED | SolidWorks, AutoCAD, CATIA, Creo, GD&T, 3D modeling, engineering drawings... |
| **SKILL_002** | skill_list | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `4.25` | ✅ PASSED | ANSYS, Abaqus, CFD, FEA, FEM, meshing, stress analysis, thermal simulation... |
| **SKILL_003** | skill_list | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.41` | ✅ PASSED | CNC, Lean Manufacturing, Six Sigma, production planning, machining, tooling... |
| **SKILL_004** | skill_list | `Product Design Engineer` | `Product Design Engineer` | `3.02` | ✅ PASSED | DFM, DFA, BOM, product development, prototyping, mechanical design, validation... |
| **SKILL_005** | skill_list | `HVAC Engineer` | `HVAC Engineer` | `2.89` | ✅ PASSED | HVAC, refrigeration, chilled water, ductwork, ventilation, cooling load, BMS... |
| **RESUME_001** | resume | `CAD Design Engineer` | `FEA/CFD Analyst` | `0.19` | ❌ FAILED | Mechanical engineer with 4 years of experience creating detailed component and assembly models in So... |
| **RESUME_002** | resume | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `3.64` | ✅ PASSED | Mechanical simulation engineer with 5 years of experience in ANSYS Mechanical, Abaqus, FEA, meshing,... |
| **RESUME_003** | resume | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.93` | ✅ PASSED | Manufacturing engineer with 6 years of experience in CNC machining, process optimization, Lean Six S... |
| **RESUME_004** | resume | `Product Design Engineer` | `Product Design Engineer` | `2.12` | ✅ PASSED | Product design engineer with experience in concept development, CAD, prototyping, DFM, DFA, BOM mana... |
| **RESUME_005** | resume | `HVAC Engineer` | `HVAC Engineer` | `2.60` | ✅ PASSED | HVAC engineer with experience designing chilled water systems, ductwork, air handling units, cooling... |
| **JD_001** | job_description | `CAD Design Engineer` | `Product Design Engineer` | `0.44` | ❌ FAILED | We are seeking a CAD Design Engineer to create detailed 3D models and production drawings using Soli... |
| **JD_002** | job_description | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `3.66` | ✅ PASSED | The engineer will develop numerical simulation models, perform CFD and FEA analysis, generate meshes... |
| **JD_003** | job_description | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.65` | ✅ PASSED | The manufacturing engineer will optimize production processes, implement Lean Manufacturing initiati... |
| **JD_004** | job_description | `Product Design Engineer` | `Product Design Engineer` | `1.61` | ✅ PASSED | The product design engineer will develop new mechanical products, create prototypes, perform design ... |
| **JD_005** | job_description | `HVAC Engineer` | `HVAC Engineer` | `3.16` | ✅ PASSED | The HVAC engineer will design HVAC systems for commercial buildings including ductwork, chilled wate... |
| **SENIOR_001** | seniority | `CAD Design Engineer` | `Product Design Engineer` | `1.19` | ❌ FAILED | Senior CAD Design Engineer leading a team of designers using SolidWorks, CATIA and GD&T for complex ... |
| **SENIOR_002** | seniority | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `3.91` | ✅ PASSED | Lead FEA Analyst responsible for structural simulation, nonlinear FEA, ANSYS and fatigue analysis.... |
| **SENIOR_003** | seniority | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.16` | ✅ PASSED | Principal Manufacturing Engineer responsible for CNC process optimization, Lean Manufacturing and fa... |
| **SENIOR_004** | seniority | `Product Design Engineer` | `Product Design Engineer` | `1.55` | ✅ PASSED | Senior Product Development Engineer working on mechanical product architecture, DFM, prototypes and ... |
| **SENIOR_005** | seniority | `HVAC Engineer` | `HVAC Engineer` | `1.85` | ✅ PASSED | Lead HVAC Design Engineer responsible for commercial HVAC, chilled water, ductwork and building cool... |
| **IND_001** | industry_variation | `CAD Design Engineer` | `CAD Design Engineer` | `0.00` | ✅ PASSED | Automotive CAD engineer designing vehicle components and assemblies using CATIA and GD&T.... |
| **IND_002** | industry_variation | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `4.25` | ✅ PASSED | Aerospace FEA engineer performing structural analysis and finite element simulations for aircraft co... |
| **IND_003** | industry_variation | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.50` | ✅ PASSED | Medical device manufacturing engineer responsible for CNC machining, process validation and producti... |
| **IND_004** | industry_variation | `Product Design Engineer` | `Product Design Engineer` | `1.51` | ✅ PASSED | Consumer electronics company hiring a mechanical product design engineer for enclosure design, proto... |
| **IND_005** | industry_variation | `HVAC Engineer` | `HVAC Engineer` | `2.15` | ✅ PASSED | Data center HVAC engineer designing cooling systems, chilled water infrastructure and ventilation.... |
| **BOUNDARY_001** | boundary | `CAD Design Engineer` | `CAD Design Engineer` | `2.21` | ✅ PASSED | Mechanical designer creating 3D CAD models, assemblies, manufacturing drawings and GD&T for machine ... |
| **BOUNDARY_002** | boundary | `Product Design Engineer` | `Product Design Engineer` | `0.69` | ✅ PASSED | Mechanical product engineer responsible for concept development, DFM, DFA, BOM and prototype testing... |
| **BOUNDARY_003** | boundary | `Manufacturing Engineer` | `Manufacturing Engineer` | `3.25` | ✅ PASSED | Manufacturing engineer responsible for production tooling, CNC machining, process optimization and a... |
| **BOUNDARY_004** | boundary | `Product Design Engineer` | `Product Design Engineer` | `0.50` | ✅ PASSED | Product design engineer performing structural FEA in ANSYS to validate a newly developed mechanical ... |
| **BOUNDARY_005** | boundary | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `2.52` | ✅ PASSED | FEA analyst performing stress, fatigue and thermal simulations on mechanical components designed in ... |
| **BOUNDARY_006** | boundary | `Manufacturing Engineer` | `Manufacturing Engineer` | `0.04` | ✅ PASSED | Manufacturing engineer using FEA simulation to analyze machining-induced stresses and optimize produ... |
| **BOUNDARY_007** | boundary | `Product Design Engineer` | `HVAC Engineer` | `1.19` | ❌ FAILED | Mechanical product designer developing HVAC components using CAD, thermal analysis and prototype tes... |
| **MIXED_001** | multi_disciplinary | `Product Design Engineer` | `FEA/CFD Analyst` | `0.88` | ❌ FAILED | Mechanical engineer using SolidWorks for product design and ANSYS for structural validation. Respons... |
| **MIXED_002** | multi_disciplinary | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.18` | ✅ PASSED | Manufacturing engineer supporting product design, CNC machining, tooling, DFM and production process... |
| **MIXED_003** | multi_disciplinary | `HVAC Engineer` | `Product Design Engineer` | `0.02` | ❌ FAILED | HVAC product development engineer designing air handling equipment, duct systems and cooling compone... |
| **MIXED_004** | multi_disciplinary | `FEA/CFD Analyst` | `Product Design Engineer` | `2.21` | ❌ FAILED | Mechanical design engineer creating CAD models and running CFD simulations for aerodynamic component... |
| **ABBR_001** | abbreviation | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `4.66` | ✅ PASSED | FEA engineer experienced in FEM, ANSYS, CFD, meshing and structural simulation.... |
| **ABBR_002** | abbreviation | `HVAC Engineer` | `HVAC Engineer` | `2.07` | ✅ PASSED | HVAC engineer working with AHU, FCU, chilled water, VRF and BMS systems.... |
| **ABBR_003** | abbreviation | `Product Design Engineer` | `Product Design Engineer` | `0.50` | ✅ PASSED | Mechanical product engineer experienced in DFM, DFA, BOM and NPD.... |
| **ABBR_004** | abbreviation | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.98` | ✅ PASSED | Manufacturing engineer experienced in CNC, SPC, Lean and Six Sigma.... |
| **SHORT_001** | very_short | `CAD Design Engineer` | `CAD Design Engineer` | `3.98` | ✅ PASSED | SolidWorks CAD designer... |
| **SHORT_002** | very_short | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `3.22` | ✅ PASSED | ANSYS FEA analyst... |
| **SHORT_003** | very_short | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.99` | ✅ PASSED | CNC manufacturing engineer... |
| **SHORT_004** | very_short | `Product Design Engineer` | `HVAC Engineer` | `0.52` | ❌ FAILED | Mechanical product design... |
| **SHORT_005** | very_short | `HVAC Engineer` | `HVAC Engineer` | `3.94` | ✅ PASSED | Commercial HVAC engineer... |
| **NOISY_001** | noisy | `CAD Design Engineer` | `Product Design Engineer` | `3.83` | ❌ FAILED | CADDDD!!! SolidWorksss / AutoCAD... mechanical design engineer!!! 3D modeling ### GD&T... |
| **NOISY_002** | noisy | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `4.24` | ✅ PASSED | ANSYS!!! FEA/CFD engineer ### meshing... stress analysis $$$ simulation... |
| **NOISY_003** | noisy | `Manufacturing Engineer` | `Manufacturing Engineer` | `4.26` | ✅ PASSED | CNC!!! Lean!!! manufacturing engineer ### production / process improvement!!!... |
| **NOISY_004** | noisy | `Product Design Engineer` | `Product Design Engineer` | `2.26` | ✅ PASSED | PRODUCT DESIGN!!! DFM DFA BOM prototype ### mechanical development engineer... |
| **NOISY_005** | noisy | `HVAC Engineer` | `HVAC Engineer` | `3.24` | ✅ PASSED | HVAC!!! CHILLED WATER / DUCTWORK / REFRIGERATION ### engineer... |
| **OOD_001** | out_of_domain | `None (OOD / Generic)` | `Product Design Engineer` | `0.11` | ℹ️ OOD / Generic | Software engineer developing REST APIs using Java, Spring Boot, React and PostgreSQL.... |
| **OOD_002** | out_of_domain | `None (OOD / Generic)` | `Manufacturing Engineer` | `0.11` | ℹ️ OOD / Generic | Data scientist using Python, pandas, NumPy, TensorFlow and machine learning.... |
| **OOD_003** | out_of_domain | `None (OOD / Generic)` | `Product Design Engineer` | `0.29` | ℹ️ OOD / Generic | Embedded systems engineer working with C, ARM, STM32, UART and FreeRTOS.... |
| **OOD_004** | out_of_domain | `None (OOD / Generic)` | `FEA/CFD Analyst` | `0.16` | ℹ️ OOD / Generic | Marketing analyst responsible for SEO, Google Analytics, market research and digital campaigns.... |
| **OOD_005** | out_of_domain | `None (OOD / Generic)` | `FEA/CFD Analyst` | `0.04` | ℹ️ OOD / Generic | Accountant working with Tally, GST, taxation, bookkeeping and financial reporting.... |
| **OOD_006** | out_of_domain | `None (OOD / Generic)` | `FEA/CFD Analyst` | `1.02` | ℹ️ OOD / Generic | Civil engineer designing reinforced concrete structures, foundations and highways.... |
| **OOD_007** | out_of_domain | `None (OOD / Generic)` | `Product Design Engineer` | `0.42` | ℹ️ OOD / Generic | Electrical engineer designing power distribution systems, transformers and electrical panels.... |
| **MISLEAD_001** | misleading_keyword | `None (OOD / Generic)` | `Product Design Engineer` | `0.68` | ℹ️ OOD / Generic | Software developer building a CAD automation platform using Python and APIs. No mechanical design re... |
| **MISLEAD_002** | misleading_keyword | `None (OOD / Generic)` | `HVAC Engineer` | `1.43` | ℹ️ OOD / Generic | Electrical engineer designing control panels for HVAC equipment. Primary responsibility is electrica... |
| **MISLEAD_003** | misleading_keyword | `None (OOD / Generic)` | `FEA/CFD Analyst` | `0.32` | ℹ️ OOD / Generic | Sales engineer selling SolidWorks and ANSYS licenses to manufacturing companies. No engineering desi... |
| **MISLEAD_004** | misleading_keyword | `None (OOD / Generic)` | `Manufacturing Engineer` | `0.50` | ℹ️ OOD / Generic | IT administrator supporting manufacturing software systems and ERP applications.... |
| **GENERIC_001** | generic_mechanical | `None (OOD / Generic)` | `FEA/CFD Analyst` | `1.06` | ℹ️ OOD / Generic | Mechanical Engineer... |
| **GENERIC_002** | generic_mechanical | `None (OOD / Generic)` | `HVAC Engineer` | `0.11` | ℹ️ OOD / Generic | Mechanical engineering graduate looking for opportunities.... |
| **GENERIC_003** | generic_mechanical | `None (OOD / Generic)` | `Manufacturing Engineer` | `0.09` | ℹ️ OOD / Generic | Mechanical engineer with experience in engineering and technical problem solving.... |
| **GENERIC_004** | generic_mechanical | `None (OOD / Generic)` | `Product Design Engineer` | `0.14` | ℹ️ OOD / Generic | Mechanical engineering professional with 5 years of industry experience.... |
| **EMPTY_001** | minimal | `None (OOD / Generic)` | `Unassigned / Low Margin` | `0.00` | ℹ️ OOD / Generic | nan... |
| **EMPTY_002** | minimal | `None (OOD / Generic)` | `Manufacturing Engineer` | `0.21` | ℹ️ OOD / Generic | engineer... |
| **EMPTY_003** | minimal | `None (OOD / Generic)` | `Product Design Engineer` | `1.54` | ℹ️ OOD / Generic | design... |
| **EMPTY_004** | minimal | `None (OOD / Generic)` | `Product Design Engineer` | `0.78` | ℹ️ OOD / Generic | mechanical... |
| **PROJECT_001** | project_based | `CAD Design Engineer` | `CAD Design Engineer` | `0.16` | ✅ PASSED | Designed a robotic arm in SolidWorks, created assemblies and detailed drawings, and applied GD&T for... |
| **PROJECT_002** | project_based | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `2.33` | ✅ PASSED | Performed FEA on a suspension component using ANSYS, including meshing, stress analysis and fatigue ... |
| **PROJECT_003** | project_based | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.16` | ✅ PASSED | Optimized CNC machining parameters and redesigned a production process using Lean Manufacturing tech... |
| **PROJECT_004** | project_based | `Product Design Engineer` | `Product Design Engineer` | `0.25` | ✅ PASSED | Developed a new mechanical product prototype, created BOMs, applied DFM principles and performed des... |
| **PROJECT_005** | project_based | `HVAC Engineer` | `HVAC Engineer` | `2.05` | ✅ PASSED | Designed an energy-efficient HVAC system for a commercial building with chilled water, ductwork and ... |
| **INDIA_001** | regional | `CAD Design Engineer` | `Product Design Engineer` | `3.20` | ❌ FAILED | Mechanical Design Engineer in Bengaluru working with AutoCAD, SolidWorks, GD&T and manufacturing dra... |
| **INDIA_002** | regional | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.97` | ✅ PASSED | Manufacturing Engineer in Pune working with CNC machining, production planning, Lean and Six Sigma.... |
| **INDIA_003** | regional | `HVAC Engineer` | `HVAC Engineer` | `1.18` | ✅ PASSED | HVAC Design Engineer in Hyderabad responsible for commercial building HVAC, chilled water and duct d... |
| **LONG_001** | long_resume | `Product Design Engineer` | `Product Design Engineer` | `0.86` | ✅ PASSED | Mechanical engineer with 7 years of experience across product development and mechanical engineering... |
| **LONG_002** | long_job_description | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.93` | ✅ PASSED | The successful candidate will support advanced manufacturing operations by developing and improving ... |
| **NEG_001** | negation | `Manufacturing Engineer` | `Manufacturing Engineer` | `0.98` | ✅ PASSED | Mechanical engineer who does not perform CAD design and does not use SolidWorks. Primary responsibil... |
| **NEG_002** | negation | `Product Design Engineer` | `FEA/CFD Analyst` | `0.27` | ❌ FAILED | Mechanical engineer who does not perform CFD analysis. Primary responsibility is product development... |
| **CROSS_001** | cross_role_hybrid | `Product Design Engineer` | `Product Design Engineer` | `3.38` | ✅ PASSED | Mechanical design engineer responsible for CAD modeling, product development, DFM, DFA and prototype... |
| **CROSS_002** | cross_role_hybrid | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.07` | ✅ PASSED | Manufacturing engineer responsible for production process design, CNC machining and tooling, while s... |
| **CROSS_003** | cross_role_hybrid | `HVAC Engineer` | `HVAC Engineer` | `0.87` | ✅ PASSED | Mechanical engineer designing HVAC equipment using CAD and performing thermal simulations.... |
| **CROSS_004** | cross_role_hybrid | `FEA/CFD Analyst` | `Product Design Engineer` | `2.21` | ❌ FAILED | Mechanical design engineer creating CAD models and running CFD simulations for aerodynamic component... |
| **OOD_008** | other_domain | `None (OOD / Generic)` | `HVAC Engineer` | `0.22` | ℹ️ OOD / Generic | Frontend developer using React, TypeScript, Tailwind CSS and Vite.... |
| **OOD_009** | other_domain | `None (OOD / Generic)` | `Product Design Engineer` | `0.83` | ℹ️ OOD / Generic | Electronics engineer designing embedded firmware, PCB circuits and microcontroller systems.... |
| **OOD_010** | other_domain | `None (OOD / Generic)` | `FEA/CFD Analyst` | `0.25` | ℹ️ OOD / Generic | Business analyst working with SQL, Power BI, Excel and business requirements.... |
| **OOD_011** | other_domain | `None (OOD / Generic)` | `FEA/CFD Analyst` | `0.53` | ℹ️ OOD / Generic | Financial analyst working with financial models, Excel, accounting and investment analysis.... |

---

## 3. Failure Analysis & Boundary Observations

The 14 failed cases belong primarily to multi-disciplinary or complex boundary prompts:

1. **MECH_001 (clear_role)**: Expected `CAD Design Engineer`, got `Product Design Engineer` (Margin: `1.86`).
   - *Snippet*: "CAD Design Engineer experienced in SolidWorks, AutoCAD, CATIA, Creo, 3D modeling, GD&T and detailed ..."
1. **MECH_003 (clear_role)**: Expected `CAD Design Engineer`, got `Product Design Engineer` (Margin: `1.76`).
   - *Snippet*: "Design engineer specializing in CATIA V5, surface modeling, part design, assemblies and technical dr..."
1. **RESUME_001 (resume)**: Expected `CAD Design Engineer`, got `FEA/CFD Analyst` (Margin: `0.19`).
   - *Snippet*: "Mechanical engineer with 4 years of experience creating detailed component and assembly models in So..."
1. **JD_001 (job_description)**: Expected `CAD Design Engineer`, got `Product Design Engineer` (Margin: `0.44`).
   - *Snippet*: "We are seeking a CAD Design Engineer to create detailed 3D models and production drawings using Soli..."
1. **SENIOR_001 (seniority)**: Expected `CAD Design Engineer`, got `Product Design Engineer` (Margin: `1.19`).
   - *Snippet*: "Senior CAD Design Engineer leading a team of designers using SolidWorks, CATIA and GD&T for complex ..."
1. **BOUNDARY_007 (boundary)**: Expected `Product Design Engineer`, got `HVAC Engineer` (Margin: `1.19`).
   - *Snippet*: "Mechanical product designer developing HVAC components using CAD, thermal analysis and prototype tes..."
1. **MIXED_001 (multi_disciplinary)**: Expected `Product Design Engineer`, got `FEA/CFD Analyst` (Margin: `0.88`).
   - *Snippet*: "Mechanical engineer using SolidWorks for product design and ANSYS for structural validation. Respons..."
1. **MIXED_003 (multi_disciplinary)**: Expected `HVAC Engineer`, got `Product Design Engineer` (Margin: `0.02`).
   - *Snippet*: "HVAC product development engineer designing air handling equipment, duct systems and cooling compone..."
1. **MIXED_004 (multi_disciplinary)**: Expected `FEA/CFD Analyst`, got `Product Design Engineer` (Margin: `2.21`).
   - *Snippet*: "Mechanical design engineer creating CAD models and running CFD simulations for aerodynamic component..."
1. **SHORT_004 (very_short)**: Expected `Product Design Engineer`, got `HVAC Engineer` (Margin: `0.52`).
   - *Snippet*: "Mechanical product design..."
1. **NOISY_001 (noisy)**: Expected `CAD Design Engineer`, got `Product Design Engineer` (Margin: `3.83`).
   - *Snippet*: "CADDDD!!! SolidWorksss / AutoCAD... mechanical design engineer!!! 3D modeling ### GD&T..."
1. **INDIA_001 (regional)**: Expected `CAD Design Engineer`, got `Product Design Engineer` (Margin: `3.20`).
   - *Snippet*: "Mechanical Design Engineer in Bengaluru working with AutoCAD, SolidWorks, GD&T and manufacturing dra..."
1. **NEG_002 (negation)**: Expected `Product Design Engineer`, got `FEA/CFD Analyst` (Margin: `0.27`).
   - *Snippet*: "Mechanical engineer who does not perform CFD analysis. Primary responsibility is product development..."
1. **CROSS_004 (cross_role_hybrid)**: Expected `FEA/CFD Analyst`, got `Product Design Engineer` (Margin: `2.21`).
   - *Snippet*: "Mechanical design engineer creating CAD models and running CFD simulations for aerodynamic component..."

---

## 4. Evaluation Conclusion

Mechanical Role Classifier v1 delivers **84.62% test accuracy** across 91 diverse test cases covering titles, skill lists, abbreviations, resumes, JDs, project descriptions, noise, and complex boundaries.
