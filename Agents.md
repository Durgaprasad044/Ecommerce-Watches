# Agents.md — Multi-Agent System Architecture
## WatchVault: Multi-Vendor Watch Ecommerce Platform

---

## Overview

This file gives a **compact view** of the agents in WatchVault.  
Each agent owns a clear domain and collaborates via HTTP APIs, events, and the shared Supabase database.

---

## Agent Index

| # | Agent Name | Domain | One-line Summary |
|---|------------|--------|------------------|
| 1 | Authentication Agent | Identity & Access | Handles auth, sessions, and roles. |
| 2 | Watch Management Agent | Product Lifecycle | Manages watch CRUD, filters, and vendor ownership. |
| 3 | Order Processing Agent | Commerce | Validates carts, creates orders, coordinates payments. |
| 4 | Inventory Monitoring Agent | Stock Control | Keeps stock accurate and triggers low‑stock alerts. |
| 5 | Referral Tracking Agent | Growth | Manages referral codes and rewards. |
| 6 | Analytics Agent | Business Intelligence | Provides vendor dashboards and key metrics. |
| 7 | Recommendation Agent | AI / Personalization | Suggests watches based on behavior and trends. |
| 8 | Notification Agent | Communication | Sends email/in‑app notifications on key events. |
| 9 | Review Moderation Agent | Trust & Safety | Verifies and moderates customer reviews. |

---

## Agent Summaries

- **Authentication Agent**
  - Owns registration, login, JWT issuance/verification, password reset.
  - Exposes a clean API for other services to verify user identity and role.

- **Watch Management Agent**
  - Owns watch listing lifecycle (create, update, soft delete, fetch, filter).
  - Enforces vendor ownership on all mutations.

- **Order Processing Agent**
  - Owns cart validation, order creation, state transitions, and payment integration.
  - Emits events for inventory updates and notifications.

- **Inventory Monitoring Agent**
  - Owns stock deduction/restoration and low‑stock detection.
  - Prevents overselling through atomic stock operations.

- **Referral Tracking Agent**
  - Owns referral code generation, validation, and reward granting.
  - Guards against abuse (self‑referral, duplicate rewards).

- **Analytics Agent**
  - Owns aggregated metrics for vendor dashboards (revenue, top products, AOV).
  - Reads from orders and related tables only; never mutates transactional data.

- **Recommendation Agent**
  - Owns recommendation logic based on user behavior and watch attributes.
  - Provides personalized and fallback (trending) recommendations.

- **Notification Agent**
  - Owns sending and logging of all emails/in‑app notifications.
  - Consumed by other agents via simple event payloads.

- **Review Moderation Agent**
  - Owns ingestion, validation, and publishing of reviews.
  - Ensures only verified purchasers can post and keeps aggregate ratings accurate.

---

## Communication (High Level)

- **Shared DB**: All agents read/write via Supabase (PostgreSQL) using clear table boundaries.
- **Events**: Order and inventory flows emit events like `ORDER_PLACED`, `STOCK_DEDUCTED`, `LOW_STOCK`.
- **HTTP APIs**: Frontend and external callers interact only with well‑defined HTTP endpoints per domain.
