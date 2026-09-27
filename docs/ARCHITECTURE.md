# ACME Salary Management - Technical Architecture & System Design

## 1. System Overview & Architecture Diagram

The ACME Salary Management System follows a decoupled client-server architecture:

```
+-----------------------------------------------------------------------------------+
|                                 ReactJS Frontend                                  |
|  +-------------------+  +--------------------+  +------------------------------+  |
|  | HR Analytics Dash |  | Employee Directory |  | HR Smart Insights / Q&A      |  |
|  +-------------------+  +--------------------+  +------------------------------+  |
|  +-----------------------------------------------------------------------------+  |
|  | Recharts / Tailwind CSS UI Components / Axios HTTP Client                   |  |
+-----------------------------------------------------------------------------------+
                                         |
                                         | REST API (JSON)
                                         v
+-----------------------------------------------------------------------------------+
|                             Ruby on Rails Backend API                             |
|  +-------------------+  +--------------------+  +------------------------------+  |
|  | Api::V1::         |  | Api::V1::          |  | Api::V1::                    |  |
|  | EmployeesController| | AnalyticsController| | Auth & Adjustments Controllers|  |
|  +-------------------+  +--------------------+  +------------------------------+  |
|  +-----------------------------------------------------------------------------+  |
|  | SalaryAnalyticsService (SQL Aggregations) / BulkImportService               |  |
+-----------------------------------------------------------------------------------+
                                         |
                                         | Active Record ORM
                                         v
+-----------------------------------------------------------------------------------+
|                                SQLite3 Database                                   |
|  +-------------------+  +--------------------+  +------------------------------+  |
|  | employees table   |  | salary_histories   |  | users table                  |  |
|  | (10,000 records)  |  | table              |  | (HR Auth)                    |  |
|  +-------------------+  +--------------------+  +------------------------------+  |
|  Indexes: employee_code, email, country, department, employment_status, current_salary|
+-----------------------------------------------------------------------------------+
```

---

## 2. Database Schema & Indexing Strategy

### 2.1 Entity Relationship Diagram

```
+--------------------------------+       +------------------------------------+
|           employees            |       |          salary_histories          |
+--------------------------------+       +------------------------------------+
| id (PK)                        |1    * | id (PK)                            |
| employee_code (Unique, String) |-------| employee_id (FK -> employees.id)   |
| first_name (String)            |       | salary (Decimal)                   |
| last_name (String)             |       | bonus (Decimal)                    |
| email (Unique, String)         |       | currency (String)                  |
| country (String, Indexed)      |       | effective_from (Date, Indexed)     |
| department (String, Indexed)   |       | effective_to (Date)                |
| job_title (String)             |       | change_reason (String)             |
| employment_status (Indexed)    |       | notes (Text)                       |
| current_salary (Decimal, Idx)  |       +------------------------------------+
| currency (String)              |
| gender (String)                |
| hire_date (Date)               |
| performance_rating (Integer)   |
| created_at, updated_at         |
+--------------------------------+
```

### 2.2 Performance & Indexing Design for 10,000 Employees
To guarantee sub-100ms API responses when searching and filtering across 10,000 employees:
1. **B-Tree Composite & Single Column Indexes:**
   - `index_employees_on_employee_code` (Unique)
   - `index_employees_on_email` (Unique)
   - `index_employees_on_country`
   - `index_employees_on_department`
   - `index_employees_on_employment_status`
   - `index_employees_on_current_salary`
   - `index_salary_histories_on_employee_id_and_effective_from`
2. **Database Aggregations:** Analytics computations (`AVG`, `MEDIAN`, `SUM`, `COUNT`) are performed in pure SQL via database queries rather than loading 10,000 ActiveRecord objects into Ruby memory.
3. **Bulk Ingestion Optimization:** Seeding and CSV upload use Rails `insert_all` / bulk raw SQL inserts in transactions of 1,000 records per batch, completing 10,000 records in under 3 seconds.

---

## 3. API Specifications

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate HR Manager | `{ email, password }` |
| `GET` | `/api/v1/employees` | Paginated employee list | `page, per_page, query, country, department, employment_status, sort_by, order` |
| `GET` | `/api/v1/employees/:id` | Employee profile & history | None |
| `POST` | `/api/v1/employees` | Create employee | `{ employee_code, first_name, last_name, email, country, department, job_title, current_salary, currency, gender, hire_date, performance_rating }` |
| `PUT` | `/api/v1/employees/:id` | Update employee | Employee attributes |
| `DELETE` | `/api/v1/employees/:id` | Soft/hard delete employee | None |
| `POST` | `/api/v1/employees/:id/salary_adjustments` | Record salary revision | `{ salary, bonus, currency, effective_from, change_reason, notes }` |
| `GET` | `/api/v1/analytics/overview` | Overall org payroll metrics | None |
| `GET` | `/api/v1/analytics/by_country` | Country/Currency breakdown | None |
| `GET` | `/api/v1/analytics/by_department` | Department pay breakdown | None |
| `GET` | `/api/v1/analytics/gender_pay_equity` | Gender pay gap metrics | None |
| `GET` | `/api/v1/analytics/insights` | HR Smart Assistant Q&A | None |
| `POST` | `/api/v1/employees/bulk_import` | Ingest CSV file | Multipart file payload |
| `GET` | `/api/v1/employees/export` | Download filtered CSV | Filter query parameters |

---

## 4. Normalized Currency Baseline
ACME operates in 8 currencies. To provide meaningful comparison graphs, the backend computes exchange-rate converted values in **USD** using baseline conversion rates:
- USD: 1.0
- EUR: 1.08
- GBP: 1.28
- CAD: 0.74
- AUD: 0.66
- SGD: 0.75
- INR: 0.012
- JPY: 0.0067
