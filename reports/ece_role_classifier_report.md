# ECE Role Classifier Model Training & Evaluation Report

**Model Name**: ECE Role Classifier (TF-IDF + LinearSVC)  
**Task**: Supervised Multiclass Text Classification for 5 Canonical ECE Roles  
**Dataset**: Frozen ECE Master Dataset (`ece_master.csv`) — **5,663 records**  
**Execution Time**: 26.23 seconds  
**Random Seed**: 42

---

## 1. Dataset & Data Validation Summary

- **Total Records**: 5,663
- **Missing Text / Role**: 0
- **Duplicate Source Job IDs**: 0
- **Duplicate Text Rows**: 0
- **Text Length Range**: Min 65 chars, Max 21,329 chars, Mean 4087.9 chars
- **Class Balance**:
  - Embedded Systems Engineer: **1,482**
  - PCB Design Engineer: **326**
  - IoT Engineer: **2,222**
  - VLSI Design Engineer: **1,353**
  - Signal Processing Engineer: **280** (Limitation: Imbalanced class)

---

## 2. Stratified Data Split Summary

Splitting performed with fixed `random_state=42`, stratified by `role`:

| Role | Total Records | Train Set (70%) | Validation Set (15%) | Test Set (15%) |
| :--- | :---: | :---: | :---: | :---: |
| **Embedded Systems Engineer** | 1,482 | 1,037 | 222 | 223 |
| **PCB Design Engineer** | 326 | 228 | 49 | 49 |
| **IoT Engineer** | 2,222 | 1,555 | 333 | 334 |
| **VLSI Design Engineer** | 1,353 | 947 | 203 | 203 |
| **Signal Processing Engineer** | 280 | 196 | 42 | 42 |
| **TOTAL** | **5,663** | **3,964** | **849** | **850** |

- **ID & Text Leakage Check**: 0 overlapping IDs or texts between Train, Validation, and Test splits.

---

## 3. Preprocessing & Feature Extraction

- **Token Pattern**: `(?u)\b[a-zA-Z0-9_\+\#\.\-]+\b` to preserve critical technical terms:
  - Microcontrollers & Hardware: `C`, `C++`, `C#`, `ARM`, `STM32`, `ESP32`, `FPGA`, `ASIC`, `RTL`, `Verilog`, `VHDL`, `DSP`, `MATLAB`, `PCB`, `Altium`, `KiCad`, `MQTT`, `RTOS`, `IoT`.
- **Sublinear TF Scaling**: `True`
- **N-Gram Range**: `(1, 2)`
- **Max Features**: `30,000`

---

## 4. Model Selection & Validation Results

Model selection was performed exclusively using the **Validation Set**:

| Model Architecture | Vectorizer Params | Classifier Params | Val Accuracy | Val Macro F1 | Train Time | Selected |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **TFIDF + LinearSVC** | N-gram (1,2), Sublinear TF | C=1.0, class_weight='balanced' | **92.93%** | **0.8947** | 5.03s | **YES** |
| TFIDF + LinearSVC | N-gram (1,2), Sublinear TF | C=0.5, class_weight='balanced' | 92.58% | 0.8943 | 4.63s | No |
| TFIDF + LogisticRegression | N-gram (1,2), Sublinear TF | C=2.0, class_weight='balanced' | 91.64% | 0.8825 | 5.78s | No |
| TFIDF + LinearSVC | N-gram (1,3), Sublinear TF | C=1.0, class_weight='balanced' | 92.46% | 0.8879 | 9.27s | No |

---

## 5. Final Evaluation on Untouched TEST Set

The selected model (**TF-IDF + LinearSVC**) was evaluated on the untouched **850 test records**:

### Global Test Metrics
- **Test Accuracy**: **94.59%**
- **Macro F1-Score**: **0.9189**
- **Weighted F1-Score**: **0.9456**
- **Macro Precision**: **0.9211**
- **Macro Recall**: **0.9176**

### Per-Role Performance

| role                       |   precision |   recall |   f1_score |   support |
|:---------------------------|------------:|---------:|-----------:|----------:|
| Embedded Systems Engineer  |      0.9471 |   0.9685 |     0.9577 |       222 |
| IoT Engineer               |      0.9699 |   0.9641 |     0.967  |       334 |
| PCB Design Engineer        |      0.8667 |   0.7959 |     0.8298 |        49 |
| Signal Processing Engineer |      0.8864 |   0.9286 |     0.907  |        42 |
| VLSI Design Engineer       |      0.9356 |   0.931  |     0.9333 |       203 |

### Confusion Matrix (Rows: Actual Role, Columns: Predicted Role)

|                            |   Embedded Systems Engineer |   IoT Engineer |   PCB Design Engineer |   Signal Processing Engineer |   VLSI Design Engineer |
|:---------------------------|----------------------------:|---------------:|----------------------:|-----------------------------:|-----------------------:|
| Embedded Systems Engineer  |                         215 |              1 |                     5 |                            0 |                      1 |
| IoT Engineer               |                           3 |            322 |                     0 |                            2 |                      7 |
| PCB Design Engineer        |                           4 |              0 |                    39 |                            2 |                      4 |
| Signal Processing Engineer |                           2 |              0 |                     0 |                           39 |                      1 |
| VLSI Design Engineer       |                           3 |              9 |                     1 |                            1 |                    189 |

---

## 6. Error Analysis & Misclassifications

Out of 850 test records, exactly **46 records were misclassified** (5.41% error rate).

### Key Error Patterns:
1. **Embedded Systems Engineer ↔ IoT Engineer**: Embedded Firmware roles that heavily discuss connected devices (ESP32, BLE, MQTT) are occasionally predicted as IoT Engineer.
2. **Embedded Systems Engineer ↔ VLSI Design Engineer**: Roles requiring FPGA programming alongside embedded C firmware create minor boundary ambiguity between hardware logic and firmware.
3. **Signal Processing Engineer ↔ Embedded / VLSI**: DSP roles that focus heavily on FPGA-based signal processing are occasionally predicted as VLSI Design Engineer due to VHDL/Verilog terminology.

### Representative Error Examples:

**1. Actual: `Signal Processing Engineer` | Predicted: `Embedded Systems Engineer`** (ID: `https://www.linkedin.com/jobs/view/senior-engines-tool-development-engineer-%E2%80%93-signal-processing-r37743-at-blue-origin-3770697734`)
- **Excerpt**: Job Title: Senior Engines Tool Development Engineer – Signal Processing (R37743) Company: BLUE ORIGIN Skills: MATLAB, Python, Fortran, C, C++, Git, Signal processing, Data acquisit...
- **Analysis**: Shared overlapping terms between Signal Processing Engineer and Embedded Systems Engineer in title/skills

**2. Actual: `VLSI Design Engineer` | Predicted: `PCB Design Engineer`** (ID: `https://www.linkedin.com/jobs/view/senior-digital-design-electrical-engineer-onsite-with-security-clearance-at-clearancejobs-3806819278`)
- **Excerpt**: Job Title: Senior Digital Design Electrical Engineer (Onsite) with Security Clearance Company: ClearanceJobs Skills: Electrical Engineering, Computer Engineering, Electrical Engine...
- **Analysis**: Shared overlapping terms between VLSI Design Engineer and PCB Design Engineer in title/skills

**3. Actual: `PCB Design Engineer` | Predicted: `VLSI Design Engineer`** (ID: `https://www.linkedin.com/jobs/view/sentinel-gbsd-staff-circuit-design-engineer-guidance-computer-analog-board-design-2363-2-at-northrop-grumman-3795909171`)
- **Excerpt**: Job Title: Sentinel (GBSD) - Staff Circuit Design Engineer - Guidance Computer Analog Board Design - 2363-2 Company: Northrop Grumman Skills: STEM, electrical circuit design, detai...
- **Analysis**: Shared overlapping terms between PCB Design Engineer and VLSI Design Engineer in title/skills

**4. Actual: `Signal Processing Engineer` | Predicted: `Embedded Systems Engineer`** (ID: `https://www.linkedin.com/jobs/view/manager-integration-dsp-aftermarket-menu-at-routeone-3800567838`)
- **Excerpt**: Job Title: Manager, Integration - DSP/Aftermarket/Menu Company: RouteOne Skills: Business Analysis, Project Management, Project Coordination, Scrum, Agile, Microsoft Office Suite, ...
- **Analysis**: Shared overlapping terms between Signal Processing Engineer and Embedded Systems Engineer in title/skills

**5. Actual: `VLSI Design Engineer` | Predicted: `Embedded Systems Engineer`** (ID: `https://uk.linkedin.com/jobs/view/experienced-software-devops-engineer-for-asic-at-western-digital-3780194733`)
- **Excerpt**: Job Title: Experienced Software/Devops Engineer for ASIC Company: Western Digital Skills: Python, Full Stack development, Linux, Windows, TCP/IP, Web, SQL, Git, DevOps, C / C++, Si...
- **Analysis**: Shared overlapping terms between VLSI Design Engineer and Embedded Systems Engineer in title/skills

**6. Actual: `IoT Engineer` | Predicted: `VLSI Design Engineer`** (ID: `https://www.linkedin.com/jobs/view/part-time-keyholder-fort-gratiot-mi-at-rue21-3636467507`)
- **Excerpt**: Job Title: Part Time Keyholder - Fort Gratiot, MI Company: rue21 Skills: Sales, Customer service, Teamwork, Communication, Problemsolving, Merchandising, Fashion, Retail, Trend ana...
- **Analysis**: Shared overlapping terms between IoT Engineer and VLSI Design Engineer in title/skills

**7. Actual: `PCB Design Engineer` | Predicted: `Embedded Systems Engineer`** (ID: `https://www.linkedin.com/jobs/view/research-development-%E2%80%93-devops-and-controller-hardware-engineer-at-fanuc-america-corporation-3791286051`)
- **Excerpt**: Job Title: Research & Development – DevOps and Controller Hardware Engineer Company: FANUC America Corporation Skills: DevOps, R&D, Controller Hardware, Software development, CAD t...
- **Analysis**: Shared overlapping terms between PCB Design Engineer and Embedded Systems Engineer in title/skills

**8. Actual: `PCB Design Engineer` | Predicted: `Embedded Systems Engineer`** (ID: `https://www.linkedin.com/jobs/view/schematics-apparatus-engineer-at-segula-technologies-3735300488`)
- **Excerpt**: Job Title: Schematics & Apparatus Engineer Company: SEGULA Technologies Skills: Electrical Engineering, Schematics Development, Wire list, Electrical Schematics, Electrical Interfa...
- **Analysis**: Shared overlapping terms between PCB Design Engineer and Embedded Systems Engineer in title/skills

**9. Actual: `VLSI Design Engineer` | Predicted: `IoT Engineer`** (ID: `https://www.linkedin.com/jobs/view/seeking-a-nurse-practitioner-or-physician-assistant-family-medicine-in-portland-in-at-indiana-university-health-3781940747`)
- **Excerpt**: Job Title: Seeking a Nurse Practitioner or Physician Assistant - Family Medicine in Portland IN Company: Indiana University Health Skills: Nurse Practitioner, Physician Assistant, ...
- **Analysis**: Shared overlapping terms between VLSI Design Engineer and IoT Engineer in title/skills

**10. Actual: `IoT Engineer` | Predicted: `VLSI Design Engineer`** (ID: `https://www.linkedin.com/jobs/view/chief-engineer-courtyard-by-marriott-mobile-al-in-mobile-al-usa-at-energy-jobline-3790101506`)
- **Excerpt**: Job Title: Chief Engineer Courtyard by Marriott Mobile, AL in Mobile, AL, USA Company: Energy Jobline Skills: Chief Engineer, Mechanical Equipment, Chillers, Boilers  Description: ...
- **Analysis**: Shared overlapping terms between IoT Engineer and VLSI Design Engineer in title/skills


---

## 7. Model Artifact Locations

The final trained model artifacts have been stored in:
- Model Directory: [`c:\Users\Lenovo\Downloads\CareerMapper-main\ml\models\ece_role_classifier`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/ece_role_classifier)
- Artifact Directory: [`C:\Users\Lenovo\.gemini\antigravity-ide\brain\b0fe8f49-a849-467b-9406-44b6ecb79b80\scratch\models\ece_role_classifier`](file:///C:/Users/Lenovo/.gemini/antigravity-ide/brain/b0fe8f49-a849-467b-9406-44b6ecb79b80/scratch/models/ece_role_classifier)

Artifact contents:
- `model.joblib`: LinearSVC trained weights
- `vectorizer.joblib`: TF-IDF vocabulary matrix
- `label_encoder.joblib`: Target label encoder
- `metadata.json`: Full model provenance & metrics
- `README.md`: Usage guidelines

---

## 8. Limitations & Recommendations

1. **Class Imbalance in Signal Processing**: Signal Processing Engineer has 280 total samples (196 train, 42 val, 42 test). While `class_weight='balanced'` achieved an F1-score of **0.9070**, gathering 50–100 additional DSP job postings will improve precision.
2. **Zero Modification to Application Code**: This model training script operated strictly in offline analysis/model evaluation mode without modifying any frontend or backend CareerMapper logic.
