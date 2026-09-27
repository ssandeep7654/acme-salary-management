# ACME Salary Management - Product Requirements Document (PRD)

**Author:** HR Engineering & Product Team  
**Persona:** HR Manager of ACME Organization (10,000 Employees)  
**Status:** Approved  
**Version:** 1.0.0  

---

## 1. Executive Summary & Goal
ACME Organization has grown to **10,000 employees** distributed across 8 global regions (United States, United Kingdom, India, Germany, Japan, Singapore, Canada, Australia). Currently, compensation management relies on fragmented, static Excel spreadsheets. This manual workflow creates data drift, limits real-time visibility into global compensation spend, slows down salary revision approvals, and hinders the HR leadership's ability to answer critical pay equity and salary distribution questions.

The goal of the **ACME Salary Management Platform** is to deliver a fast, secure, web-based compensation management portal that provides real-time global pay analytics, seamless employee salary record search across 10,000 employees, historical salary tracking, and bulk import/export capabilities.

---

## 2. Target User Persona
* **Role:** Global HR Manager / Compensation & Benefits Lead
* **Needs:**
  1. Quick, macro-level visibility into total organization salary spend, country distributions, median pay, and gender pay equity.
  2. Micro-level ability to search, filter, and view individual employee compensation histories.
  3. Ability to execute salary adjustments (promotions, market revisions, annual merit increases) with full historical auditability.
  4. Instant answers to analytical queries (e.g., "Which department has the highest pay gap?", "What is our median salary in India vs. US?").
  5. Reliable bulk spreadsheet import/export to transition smoothly from existing Excel files.

---

## 3. In-Scope Features & Functional Requirements

### 3.1 Global HR Compensation Dashboard ("How ACME Pays")
* **Real-time Payroll Metrics:** Total annual payroll spend (normalized to USD), average salary, median salary, active employee count, and overall gender pay equity ratio.
* **Country & Currency Breakdown:** Visual breakdown of employee headcount and total spend across currencies (USD, EUR, GBP, INR, JPY, SGD, CAD, AUD) with standardized exchange conversion.
* **Departmental Compensation Analysis:** Headcount, total spend, average, and median salary per department (Engineering, Product, Sales, Marketing, HR, Finance, Operations).
* **Gender Pay Equity Insights:** Department-level and role-level comparison of male vs. female median/mean salary and pay gap ratios.

### 3.2 High-Performance Employee Directory & Directory Search (10,000 Records)
* **Server-Side Pagination & Fast Search:** Instant search across employee code, first name, last name, email, and job title with sub-100ms response time for 10,000 records.
* **Multi-Facet Filtering:** Filter by Country, Department, Employment Status (Active, On Leave, Terminated), Gender, and Salary Range.
* **Sorting:** Dynamic multi-column sorting (Salary, Name, Hire Date, Department).

### 3.3 Employee Salary Detail & Audit Trail
* **Salary History Log:** Detailed log of all historical salary revisions including base salary, bonus, currency, effective date range, and change reason (e.g., "Initial Offer", "Annual Performance Review", "Promotion", "Market Adjustment").
* **Salary Progression Visualization:** Interactive timeline chart showing an employee's salary growth over their tenure.
* **Salary Adjustment Workflow:** Modal form to record new salary revisions with immediate current salary updates.

### 3.4 HR Smart Insights & Natural Query Assistant
* **Pre-calculated Quick Insights:** Automated detection of top-paid departments, pay equity outliers, tenure-to-compensation correlations, and recent promotion frequencies.

### 3.5 Bulk CSV Import & Export
* **Bulk Spreadsheet Ingestion:** High-speed CSV upload capability to ingest thousands of employee records simultaneously with validation error reporting.
* **Custom Report Export:** One-click CSV export of current or filtered employee compensation datasets.

---

## 4. Deliberate Non-Goals & Rationale

| Non-Goal Feature | Reasoning & Justification |
| :--- | :--- |
| **Real-Time Tax Engine & Payroll Payout Execution** | Tax rules vary drastically by jurisdiction (e.g., US W2/1099, India Form 16, UK PAYE). Automated tax calculation and bank transfers require third-party payment gateways (Gusto, ADP) and specialized compliance tools. Out of scope for salary management & analysis. |
| **Multi-Tier Executive Approval Workflows** | Implementing complex multi-level approval chains (HRBP -> Director -> VP Finance -> CEO) introduces heavy workflow orchestration. For Phase 1, focus is on compensation visibility, analytics, and direct manager/HR record updates. |
| **Multi-Currency Live Forex Exchange Rate API** | Live forex APIs introduce external dependency latency and API key overhead. Hardcoded/configurable standardized corporate baseline exchange rates are standard for internal financial reporting. |
| **Employee Self-Service Portal** | The target persona is strictly the HR Manager and Compensation Analyst. Employee paystub downloads or self-service requests belong in a separate employee portal. |

---

## 5. Success & Verification Criteria
1. **Performance:** Database query response under 100ms for searches and paginated requests across 10,000 employees.
2. **Seeding:** Seed script generates 10,000 realistic employees in < 15 seconds.
3. **Data Integrity:** Strict validation on unique employee codes, valid email formats, and positive non-zero salary amounts.
4. **Testing:** High automated test coverage (>85%) on backend models, analytics aggregations, and API endpoints using RSpec.
