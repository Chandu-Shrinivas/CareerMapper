# Mechanical Role Classifier — 65 Test Cases Benchmark (T2 Suite)

**Total Test Cases**: 65  
**In-Domain Cases**: 53  
**OOD / Misleading / Generic Cases**: 12  

---

## 1. Executive Summary Table

| Metric | Baseline ML Model | Shadow Hybrid Layer |
| :--- | :---: | :---: |
| **In-Domain Accuracy (53 cases)** | **92.45%** (49/53) | **88.68%** (47/53) |
| **Baseline Macro F1** | **0.9332** | 0.7593 |
| **OOD Rejection Rate (12 cases)** | **0.0%** (Closed-Set) | **41.67%** (5/12) |
| **Perfect Categories (100% Accuracy)** | **12 of 17 categories** | **11 of 17 categories** |

---

## 2. Comprehensive Test Cases Results Table

| ID | Category | Expected Role | Baseline ML Pred | Shadow Hybrid Pred | Decision Margin | Hybrid Status | Text Snippet |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **T2_001** | CAD | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `2.09` | ✅ PASSED | Mechanical drafter creating detailed 2D drawings and 3D assemblies in AutoCAD an... |
| **T2_002** | CAD | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `0.68` | ✅ PASSED | Creo Parametric designer responsible for part modeling, assembly design, drawing... |
| **T2_003** | CAD | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `1.79` | ✅ PASSED | CATIA V6 mechanical designer specializing in surface modeling, sheet metal desig... |
| **T2_004** | CAD | `CAD Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `0.10` | ❌ FAILED (ACCEPTED_BASELINE) | Detailing engineer preparing manufacturing drawings, GD&T callouts, dimensions a... |
| **T2_005** | FEA | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `2.53` | ✅ PASSED | CAE engineer performing nonlinear structural analysis, contact analysis and fati... |
| **T2_006** | FEA | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `2.18` | ✅ PASSED | CFD analyst developing computational models for turbulent airflow and heat trans... |
| **T2_007** | FEA | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `2.00` | ✅ PASSED | Finite element engineer performing modal analysis, vibration analysis and dynami... |
| **T2_008** | FEA | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `1.79` | ✅ PASSED | Simulation specialist using COMSOL Multiphysics for thermal-fluid simulations an... |
| **T2_009** | Manufacturing | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.40` | ✅ PASSED | Process engineer responsible for CNC machining, cycle-time reduction, tooling op... |
| **T2_010** | Manufacturing | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.72` | ✅ PASSED | Plant manufacturing engineer implementing Kaizen, 5S, Lean Six Sigma and continu... |
| **T2_011** | Manufacturing | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.54` | ✅ PASSED | Production engineer responsible for assembly line balancing, work instructions, ... |
| **T2_012** | Manufacturing | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `1.02` | ✅ PASSED | Industrialization engineer responsible for transferring new products into mass p... |
| **T2_013** | Product_Design | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `2.20` | ✅ PASSED | Mechanical product development engineer responsible for concept generation, arch... |
| **T2_014** | Product_Design | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `2.41` | ✅ PASSED | New Product Development engineer managing concept-to-production activities, BOMs... |
| **T2_015** | Product_Design | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `2.86` | ✅ PASSED | Mechanical design engineer developing consumer products, coordinating prototypes... |
| **T2_016** | Product_Design | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `0.86` | ✅ PASSED | Product engineer responsible for mechanical architecture, tolerance stack-up, DF... |
| **T2_017** | HVAC | `HVAC Engineer` | `HVAC Engineer` | `HVAC Engineer` | `0.74` | ✅ PASSED | HVAC design engineer calculating cooling loads and designing air distribution, d... |
| **T2_018** | HVAC | `HVAC Engineer` | `HVAC Engineer` | `HVAC Engineer` | `1.70` | ✅ PASSED | Building services engineer specializing in HVAC, VRF systems, air handling units... |
| **T2_019** | HVAC | `HVAC Engineer` | `HVAC Engineer` | `HVAC Engineer` | `3.19` | ✅ PASSED | Refrigeration and air-conditioning engineer designing commercial cooling systems... |
| **T2_020** | HVAC | `HVAC Engineer` | `HVAC Engineer` | `HVAC Engineer` | `2.33` | ✅ PASSED | MEP mechanical engineer responsible for HVAC layouts, duct sizing, chilled water... |
| **T2_021** | CAD_vs_Product | `Product Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `1.60` | ❌ FAILED (ACCEPTED_BASELINE) | Mechanical designer using SolidWorks to develop new consumer products from conce... |
| **T2_022** | CAD_vs_Product | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `2.22` | ✅ PASSED | CAD specialist using SolidWorks primarily for drafting, detailing, drawing revis... |
| **T2_023** | CAD_vs_Product | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `1.01` | ✅ PASSED | Mechanical engineer using CATIA for product development, DFM, prototype builds a... |
| **T2_024** | CAD_vs_Product | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `1.42` | ✅ PASSED | Mechanical drafter using CATIA to create production drawings and update engineer... |
| **T2_025** | Product_vs_Manufacturing | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `0.05` | ✅ PASSED | Product engineer responsible for DFM, DFA, BOM creation and manufacturing feasib... |
| **T2_026** | Product_vs_Manufacturing | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.85` | ✅ PASSED | Manufacturing engineer responsible for CNC programming support, tooling, process... |
| **T2_027** | Product_vs_Manufacturing | `Product Design Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `0.15` | ❌ FAILED (ACCEPTED_BASELINE) | Mechanical product engineer coordinating prototype builds and working with manuf... |
| **T2_028** | Product_vs_Manufacturing | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `1.57` | ✅ PASSED | Manufacturing process engineer supporting new product introduction, tooling deve... |
| **T2_029** | Product_vs_FEA | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `0.82` | ✅ PASSED | Product development engineer using ANSYS FEA to validate designs before prototyp... |
| **T2_030** | Product_vs_FEA | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `1.90` | ✅ PASSED | FEA analyst supporting product teams by performing structural and fatigue simula... |
| **T2_031** | Product_vs_FEA | `Product Design Engineer` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `0.22` | ❌ FAILED (ACCEPTED_BASELINE) | Mechanical product engineer responsible for design, prototyping and coordinating... |
| **T2_032** | Product_vs_FEA | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `3.24` | ✅ PASSED | Simulation engineer performing thermal and structural FEA to assess component pe... |
| **T2_033** | Manufacturing_vs_FEA | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `1.45` | ✅ PASSED | Manufacturing engineer using simulation to optimize metal forming and machining ... |
| **T2_034** | Manufacturing_vs_FEA | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `2.69` | ✅ PASSED | FEA engineer simulating manufacturing loads and material deformation using finit... |
| **T2_035** | HVAC_vs_Product | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `1.43` | ✅ PASSED | Product design engineer developing a new air-conditioning unit including mechani... |
| **T2_036** | HVAC_vs_Product | `HVAC Engineer` | `HVAC Engineer` | `HVAC Engineer` | `2.05` | ✅ PASSED | HVAC engineer designing the complete cooling and ventilation system for a commer... |
| **T2_037** | seniority | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `0.89` | ✅ PASSED | Junior Mechanical CAD Engineer with SolidWorks, AutoCAD and engineering drawing ... |
| **T2_038** | seniority | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `2.72` | ✅ PASSED | Staff Simulation Engineer specializing in CFD and multiphysics analysis.... |
| **T2_039** | seniority | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.94` | ✅ PASSED | Associate Manufacturing Engineer supporting CNC production and process improveme... |
| **T2_040** | seniority | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `3.31` | ✅ PASSED | Principal Product Design Engineer leading new product development and design val... |
| **T2_041** | minimal | `CAD Design Engineer` | `CAD Design Engineer` | `REJECTED_OOD` | `1.18` | ❌ FAILED (REJECTED_OOD) | AutoCAD... |
| **T2_042** | minimal | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `REJECTED_OOD` | `2.58` | ❌ FAILED (REJECTED_OOD) | CFD... |
| **T2_043** | minimal | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `1.16` | ✅ PASSED | CNC machining... |
| **T2_044** | minimal | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `0.44` | ✅ PASSED | DFM DFA BOM... |
| **T2_045** | minimal | `HVAC Engineer` | `HVAC Engineer` | `HVAC Engineer` | `3.25` | ✅ PASSED | Chilled water HVAC... |
| **T2_046** | OOD | `None (OOD / Generic)` | `Product Design Engineer` | `REJECTED_OOD` | `0.07` | 🛡️ OOD REJECTED (REJECTED_OOD) | Backend engineer developing microservices with Java, Spring Boot, Docker and Kub... |
| **T2_047** | OOD | `None (OOD / Generic)` | `Product Design Engineer` | `REJECTED_OOD` | `0.21` | 🛡️ OOD REJECTED (REJECTED_OOD) | Embedded firmware developer using STM32, ARM Cortex, FreeRTOS and C.... |
| **T2_048** | OOD | `None (OOD / Generic)` | `Product Design Engineer` | `Product Design Engineer` | `0.38` | ℹ️ OOD ACCEPTED | Electronics engineer designing PCBs and high-speed digital circuits.... |
| **T2_049** | OOD | `None (OOD / Generic)` | `FEA/CFD Analyst` | `REJECTED_OOD` | `2.77` | 🛡️ OOD REJECTED (REJECTED_OOD) | Civil structural engineer performing reinforced concrete design and structural a... |
| **T2_050** | OOD | `None (OOD / Generic)` | `FEA/CFD Analyst` | `REJECTED_OOD` | `0.10` | 🛡️ OOD REJECTED (REJECTED_OOD) | Business analyst gathering requirements and building Power BI dashboards.... |
| **T2_051** | misleading | `None (OOD / Generic)` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `0.03` | ℹ️ OOD ACCEPTED | Software engineer developing an application that integrates with SolidWorks APIs... |
| **T2_052** | misleading | `None (OOD / Generic)` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `1.41` | ℹ️ OOD ACCEPTED | Sales representative selling ANSYS simulation software to engineering companies.... |
| **T2_053** | misleading | `None (OOD / Generic)` | `Manufacturing Engineer` | `Manufacturing Engineer` | `1.02` | ℹ️ OOD ACCEPTED | IT support engineer working for a manufacturing company and maintaining factory ... |
| **T2_054** | misleading | `None (OOD / Generic)` | `HVAC Engineer` | `HVAC Engineer` | `1.87` | ℹ️ OOD ACCEPTED | Electrical engineer designing control systems for HVAC equipment. No HVAC mechan... |
| **T2_055** | generic | `None (OOD / Generic)` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `1.06` | ℹ️ OOD ACCEPTED | Mechanical engineer... |
| **T2_056** | generic | `None (OOD / Generic)` | `Product Design Engineer` | `Product Design Engineer` | `9.93` | ℹ️ OOD ACCEPTED | Design engineer... |
| **T2_057** | generic | `None (OOD / Generic)` | `Product Design Engineer` | `REJECTED_OOD` | `0.23` | 🛡️ OOD REJECTED (REJECTED_OOD) | Mechanical engineering professional with industry experience.... |
| **T2_058** | resume | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `1.82` | ✅ PASSED | 5 years of experience in mechanical engineering. Skilled in SolidWorks, GD&T, DF... |
| **T2_059** | resume | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `1.30` | ✅ PASSED | 4 years of experience preparing mechanical drawings and CAD models using AutoCAD... |
| **T2_060** | resume | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.76` | ✅ PASSED | 6 years of experience in CNC manufacturing, production planning, Lean Six Sigma,... |
| **T2_061** | real_world_style | `CAD Design Engineer` | `CAD Design Engineer` | `CAD Design Engineer` | `0.46` | ✅ PASSED | Responsibilities include developing detailed 3D models, maintaining engineering ... |
| **T2_062** | real_world_style | `Product Design Engineer` | `Product Design Engineer` | `Product Design Engineer` | `0.81` | ✅ PASSED | Responsibilities include product concept development, DFM reviews, prototype coo... |
| **T2_063** | real_world_style | `Manufacturing Engineer` | `Manufacturing Engineer` | `Manufacturing Engineer` | `2.37` | ✅ PASSED | Responsibilities include process optimization, root cause analysis, production l... |
| **T2_064** | real_world_style | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `FEA/CFD Analyst` | `1.60` | ✅ PASSED | Responsibilities include CFD modeling, mesh generation, solver setup, post-proce... |
| **T2_065** | real_world_style | `HVAC Engineer` | `HVAC Engineer` | `HVAC Engineer` | `1.87` | ✅ PASSED | Responsibilities include HVAC load calculations, equipment selection, duct sizin... |
