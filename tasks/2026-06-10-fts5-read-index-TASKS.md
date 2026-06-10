# FTS5 Read Index Construction Tasks
**Date:** 2026-06-10
**Epic:** Stage 3 - FTS5 Read Index Construction (CQRS Phase A)
**Status:** Done

## Task List (Linear-style)

---

### [FTS-1] Define `x_posts_fts` Virtual Table
**Status:** Done
**Priority:** High
**Assignee:** Database Agent
**Dependencies:** None
**Description:**
Create the raw SQL statements to initialize the `x_posts_fts` virtual table utilizing SQLite's native `FTS5` extension. Map it to index the `content` field.

---

### [FTS-2] Implement SQLite Synchronization Triggers
**Status:** Done
**Priority:** High
**Assignee:** Database Agent
**Dependencies:** [FTS-1]
**Description:**
Create the `INSERT`, `UPDATE`, and `DELETE` native SQLite triggers on the `x_posts` write model table. These triggers must automatically keep the `x_posts_fts` read model table in sync when the primary write table mutates.

---

### [FTS-3] Create Database Setup / Migration Runner
**Status:** Done
**Priority:** High
**Assignee:** Backend Agent
**Dependencies:** [FTS-2]
**Description:**
Implement a programmatic execution script (`src/db/setup.ts`) that will initialize the database schema. It should ensure the standard schemas are pushed, and then explicitly run the raw FTS5 and Trigger initialization SQL queries.
