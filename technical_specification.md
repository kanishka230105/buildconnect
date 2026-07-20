# Technical Specification Document: Build Connect

This document serves as the formal technical specification for **Build Connect**, a premium construction management, real estate marketplace, and AI contractor matching platform. 

---

## 1. Functional Requirements

### 1.1 Core Stakeholder Roles
The system enforces strict segregation of duties and interfaces across four primary stakeholder roles:
*   **Builder (Developer/Owner):**
    *   Initiates construction projects and splits them into distinct work packages (e.g., foundation, masonry, electrical).
    *   Defines parameters, budgets, timelines, and compliance requirements for each package.
    *   Reviews, counters, accepts, or rejects contractor quotations.
    *   Manages company compliance profiles (GST, PAN, certificates).
*   **Contractor (Specialist/Vendor):**
    *   Browses the bidding board for active project work packages.
    *   Submits competitive quotations and counters builder bids.
    *   Maintains profiles listing specific construction skills, machinery, and past project portfolios.
    *   Monitors personal trust metrics and compliance status.
*   **Verify-on-Visit Agent (Field Inspector):**
    *   Performs physical, geo-fenced site visits to check project progress.
    *   Submits field metrics, verification forms, and geo-tagged media.
    *   Validates project coordinates and milestone completions.
*   **Platform Administrator:**
    *   Oversees the global user base, manages role assignments, and manages account suspension toggles.
    *   Manages manual Layer 2 compliance document verification.
    *   Monitors platform health and review indicators.

### 1.2 Role-Based Access Control (RBAC) Dashboard Logic
*   **API Security Guards:** Every HTTP request to the backend must bear a validated JWT. Middleware inspects the token's payload (`role` claim: `admin` | `builder` | `contractor` | `agent`) to permit or block route execution.
*   **Dynamic Navigation Routing:** The frontend uses Next.js layout structures where layout guards verify session claims before loading pages, redirecting unauthenticated or unauthorized users to `/login`.
*   **Multi-Tenant Isolation:** Database queries automatically filter tables using active `user_id` context to prevent cross-tenant data leaks.

### 1.3 Automated Layer 1 (L1) AI & Parameter Check Gate
*   **Input Validation Check:** All uploaded compliance documents (GST registrations, corporate filings) undergo structural parameter validation.
*   **AI Pre-Screening:** The Python FastAPI backend uses OCR models to check document authenticity, match names, extract key tax identifiers (PAN/GSTIN), and score documents for trust evaluation.
*   **Initial Trust Indexing:** If L1 parameters pass, the system grants a base profile trust score. If anomalies are detected, the document is flagged for manual review, and the profile trust score is downgraded.

### 1.4 Layer 2 (L2) Crowdsourced "Verify on Visit" Loop
*   **Validation Verification Loop:** To prevent fraudulent project listings, the platform utilizes a crowdsourced verification loop. Visiting agents or contractors check physical milestones.
*   **Proof of Presence:** Verification submissions require geo-location telemetry (latitude/longitude coordinates matching the construction site within a 50-meter radius) and cryptographic time-stamped images.
*   **Trust Adjustments:** Positive field verification increases the builder's trust index; deviations or missing progress trigger immediate suspensions.

### 1.5 Semantic Lead Inbox Module
*   **Bid Extraction:** Converts incoming messy contractor queries and bid descriptions into structured JSON parameters using NLP embedding services in FastAPI.
*   **Vector Query Matching:** Matches builder work package needs with contractor skill vectors to prioritize inbox leads.
*   **Communication Flow:** Connects matches directly through built-in support routes, SMS, and deep links to WhatsApp/Email.

---

## 2. Non-Functional Requirements

### 2.1 Cloud Secret Isolation
*   **Environment Enforcement:** No secrets (database credentials, JWT salts, email passwords) may be checked into Git. The environment variables are isolated inside `.env` (backend) and `.env.local` (frontend).
*   **Credential Rotations:** Production deployments use external cloud key managers (e.g., Supabase vault or AWS Secrets Manager) to load credentials dynamically.

### 2.2 Blueprint & KYB Document Encryption at Rest
*   **Encrypted Storage:** Blueprints and corporate Know-Your-Business (KYB) documents are uploaded to secure S3 storage buckets.
*   **Envelope Encryption:** Files are encrypted at rest using AES-256 via AWS KMS keys.
*   **Temporary URL Generation:** Next.js requests access tokens through signed, time-limited presigned URLs (expires in 15 minutes) to prevent direct public file exposure.

### 2.3 Performance Targets & Next.js Server-Side Rendering (SSR)
*   **Server-Side Rendering (SSR):** Dashboard index views and public project pages use Next.js SSR to query statistics directly before rendering, ensuring fast loads on mobile devices.
*   **Latency Metrics:** Server API response times must remain under 150ms for 95% of requests.
*   **Search Engine Optimization (SEO):** Semantic HTML5 syntax, page titles, and meta tags are generated dynamically to optimize SEO ranks.

### 2.4 High-Velocity Cache Layer (Redis)
*   **Bidding Volatility Caching:** Active quotation and bid amounts undergo high frequency read/write traffic. The system uses a Redis cache layer on port 6379 to manage this.
*   **Dashboard Speed-up:** Caches compiled aggregate dashboard statistics (e.g., project counts, trust index) for up to 5 minutes, mitigating load on Supabase PostgreSQL.

### 2.5 Strict Relational Integrity Constraints
*   **Foreign Key Enforcement:** All profiles (`builders`, `contractors`) reference `users(id)` with `ON DELETE CASCADE` constraints.
*   **Domain Checks:** Constraint validation at the database level guarantees data sanity (e.g., budget fields must be positive numeric values, roles must fall within enum definitions).
*   **Transactional Isolation:** Bidding actions run within `SERIALIZABLE` database transactions to prevent double-bidding anomalies.

---

## 3. System Architecture

### 3.1 Decoupled Multi-Service Mapping
The system separates responsibilities into three distinct physical layers:
1.  **Frontend Layer (Next.js):** Served on port `3000`. Manages the React application, page routes, layouts, and pre-renders static and server pages.
2.  **API & Processing Layer (FastAPI):** Served on port `5000`. Acts as the main engine, managing heavy math computations, semantic analysis, and background tasks.
3.  **Database Layer (Supabase PostgreSQL):** Hosted in the cloud. Serves as the single source of truth for user tables, profiles, project configurations, and security audit logs.

### 3.2 Text-Block Component Diagram

```
+--------------------------------------------------------------------------------+
|                               FRONTEND LAYER                                   |
|                        Next.js Application (Port 3000)                        |
|                                                                                |
|  +-------------------------+  +------------------------+  +-----------------+  |
|  |    Landing & Home UI    |  |  Builder/Contractor    |  | Login & Signup  |  |
|  |     (React/Tailwind)    |  |   Dashboards (React)   |  |   Forms (TSX)   |  |
|  +------------+------------+  +-----------+------------+  +--------+--------+  |
+---------------|---------------------------|------------------------|-----------+
                | Request Pages             | API Requests           | JWT Auth
                v                           v                        v
+--------------------------------------------------------------------------------+
|                                BACKEND LAYER                                   |
|                       Python FastAPI Gateway (Port 5000)                       |
|                                                                                |
|  +-------------------------+  +------------------------+  +-----------------+  |
|  |     API Router &        |  |   L1 Document OCR      |  |  Semantic Lead  |  |
|  |   Auth Middleware       |  |   & AI Match Engine    |  |  Inbox Module   |  |
|  +------------+------------+  +-----------+------------+  +--------+--------+  |
+---------------|---------------------------|------------------------|-----------+
                | Read / Write              | Data Cache             | Check Auth
                v                           v                        v
+--------------------------------------------------------------------------------+
|                               DATABASE LAYER                                   |
|                     Supabase Cloud PostgreSQL (Port 6543)                      |
|                                                                                |
|  +-------------------------+  +------------------------+  +-----------------+  |
|  |   Core Users Schema     |  |   Projects & Bids      |  |  Redis Cache    |  |
|  |      (RBAC Rules)       |  |      Data Tables       |  |  (Volatile)     |  |
|  +-------------------------+  +------------------------+  +-----------------+  |
+--------------------------------------------------------------------------------+
```
