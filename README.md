# ACME Salary Management Platform

An end-to-end, full-stack enterprise employee salary management & compensation analytics platform built for an organization with **10,000 employees** across 8 global regions.

---

## 🚀 Key Features

1. **Executive Compensation Dashboard ("How ACME Pays"):**
   - Real-time aggregate payroll metrics (Total Payroll Spend, Average Salary, Median Salary, Active Employee Count).
   - USD-normalized baseline currency conversion across 8 global currencies (`USD`, `EUR`, `GBP`, `INR`, `JPY`, `SGD`, `CAD`, `AUD`).
   - Interactive visualizations with Recharts:
     - Department Salary Spend & Headcount (Bar Chart).
     - Geographic Spend Distribution (Donut Chart).
     - Departmental Gender Pay Equity Ratio (Grouped Bar Chart).
     - Pay vs Performance Rating Progression (Area Chart).

2. **High-Performance Employee Directory (10,000 Staff Records):**
   - Server-side pagination and sub-100ms multi-facet filtering (Country, Department, Status, Gender).
   - Instant search across employee codes, names, emails, and job titles.
   - CRUD operations and modal to create new employee records.

3. **Historical Salary Progression & Salary Revision Workflow:**
   - Employee profile modal displaying interactive salary growth timeline over time.
   - Comprehensive audit log of all historical salary changes with change reasons (*Promotion, Annual Review, Market Adjustment*).
   - Salary Adjustment Form allowing HR managers to record new salary revisions.

4. **HR Smart Insights & Pay Intelligence:**
   - Automated insight cards answering executive questions regarding pay equity, departmental pay leads, performance impact, and promotion frequencies.

5. **Bulk Ingestion & CSV Export:**
   - Bulk CSV upload processor for importing thousands of employee records.
   - One-click CSV export of active or filtered compensation data.

---

## 🛠️ Technology Stack

- **Backend:** Ruby on Rails 7.0 API mode
- **Database:** SQLite3 with WAL mode & B-Tree indexes for fast 10,000 record queries
- **Frontend:** ReactJS + Vite + Tailwind CSS + Recharts + Lucide Icons
- **Testing:** RSpec + FactoryBot + Faker (28 passing specs, 0 failures)

---

## 💻 Quick Start & Local Execution

### 1. Backend Setup & Data Seeding
```bash
cd backend

# Install dependencies
bundle install

# Run database migrations
bundle exec rails db:migrate

# Seed 10,000 employees and ~20,000 salary history records (< 2 seconds)
bundle exec rails db:seed

# Run RSpec test suite
bundle exec rspec

# Start Rails API Server on port 3001
bundle exec rails s -p 3001
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run Vite dev server on port 3000
npm run dev -- --port 3000

# Build production bundle
npm run build
```

---

## 📁 Repository Structure & Artifacts

- [`docs/REQUIREMENTS.md`](file:///Users/sandeepsingh/Documents/Ruby/incubyte/acme-salary-management/docs/REQUIREMENTS.md): One-page Product Requirements Document (PRD) outlining goals, target persona, in-scope features, and deliberate non-goals.
- [`docs/ARCHITECTURE.md`](file:///Users/sandeepsingh/Documents/Ruby/incubyte/acme-salary-management/docs/ARCHITECTURE.md): System architecture diagram, database schema design, indexing strategy for 10k rows, and API spec.
- [`docs/DECISIONS.md`](file:///Users/sandeepsingh/Documents/Ruby/incubyte/acme-salary-management/docs/DECISIONS.md): Architectural Decision Records (ADRs) explaining technical trade-offs.
- [`backend/`](file:///Users/sandeepsingh/Documents/Ruby/incubyte/acme-salary-management/backend): Rails 7 API with optimized `SalaryAnalyticsService` and RSpec test suite.
- [`frontend/`](file:///Users/sandeepsingh/Documents/Ruby/incubyte/acme-salary-management/frontend): React SPA with Tailwind CSS styling and Recharts analytics.

---

## 🧪 Test Suite Summary

```bash
Finished in 0.30 seconds
28 examples, 0 failures
```
Coverage includes model validations, scopes, exchange rate logic, SQL analytics aggregation algorithms, and HTTP request endpoints.
