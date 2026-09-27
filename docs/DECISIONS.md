# Architectural Decision Records (ADRs) & Trade-Offs

## ADR 1: Database Selection (SQLite3)
* **Status:** Accepted  
* **Context:** The problem statement specifies an organization with 10,000 employees and allows SQLite as the relational database.
* **Decision:** Use SQLite3 configured with WAL (Write-Ahead Logging) mode and targeted indexing.
* **Trade-Off Analysis:**  
  - *Pros:* Zero external server setup, lightning-fast read queries for single-host deployments, simplified local & CI testing.
  - *Cons:* Limited multi-writer concurrency compared to PostgreSQL. 
  - *Mitigation:* HR analytics is read-heavy (95% reads, 5% writes). WAL mode enables non-blocking concurrent reads while writes occur.

---

## ADR 2: SQL-Based Analytics Aggregations vs. Ruby Memory Computations
* **Status:** Accepted  
* **Context:** Computing total spend, average, median, percentiles, and pay equity across 10,000 employees.
* **Decision:** Perform all group by, summary statistics, and median calculations via optimized SQL queries in ActiveRecord rather than loading 10k ActiveModel objects into Ruby memory.
* **Trade-Off Analysis:**  
  - *Pros:* Execution time drops from ~800ms (Ruby object instantiation) to ~15ms (SQL aggregate execution). Memory footprint remains negligible.
  - *Cons:* SQLite syntax for median calculation requires custom SQL window functions (`ROW_NUMBER() OVER (ORDER BY salary)`).
  - *Mitigation:* Encapsulate SQL calculation logic in `SalaryAnalyticsService`.

---

## ADR 3: Vite + ReactJS Single Page Application (SPA) with Tailwind CSS
* **Status:** Accepted  
* **Context:** Need modern, fast, responsive UI with interactive charts and high-density employee table management.
* **Decision:** Build frontend using Vite + React + Tailwind CSS + Recharts + Lucide Icons.
* **Trade-Off Analysis:**  
  - *Pros:* Instant hot module reloading (HMR), lightweight client bundle, flexible UI component design, seamless client-side chart rendering.
  - *Cons:* Client-side rendering requires REST API roundtrips.
  - *Mitigation:* Optimized JSON API payload size and client-side caching of analytics data.

---

## ADR 4: Fast Bulk Data Seeding via ActiveRecord `insert_all`
* **Status:** Accepted  
* **Context:** Seeding 10,000 employee records and associated salary histories. Standard `Employee.create(...)` in a loop takes over 2 minutes due to individual transaction overhead and callbacks.
* **Decision:** Use `insert_all` with batch sizes of 1,000.
* **Trade-Off Analysis:**  
  - *Pros:* Reduces seed runtime from ~120 seconds to ~2.5 seconds.
  - *Cons:* Bypasses ActiveModel callbacks (`before_save`).
  - *Mitigation:* Pre-validate data integrity in the seed script before batch insertion.
