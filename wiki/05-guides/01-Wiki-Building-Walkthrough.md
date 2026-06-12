# 01 Wiki Building & Walkthrough Guide

## Overview
This document explains how the **PostDesk Memory Bank (Wiki)** was constructed and provides a walkthrough for interns and AI agents on how to navigate, extend, and learn from it.

## 1. How We Built Our Project Wiki
Our wiki was intentionally designed as an Obsidian-style, AI-friendly knowledge base. The goals were to reduce cognitive load, provide a "second brain" for the project, and ensure context persists across human and AI sessions.

### 1.1 Methodology
- **Auditing and Extraction:** We began by auditing disorganized documentation (`/docs`, unstructured notes) and product specifications. We extracted core technical invariants, such as Vertical Slice Architecture (VSA), Parse Don't Validate, and CQRS patterns.
- **Atomic Categorization:** We separated monolithic knowledge into atomic, deeply specific markdown files grouping related domains.
- **Prefix Architecture:** To ensure chronological and logical sorting, we prefixed folders and files with numbers (e.g., `01-architecture`, `02-standards`). This ensures local file browsers and AI context windows load constraints in priority order.
- **Pruning & Refactoring:** We migrated files from outdated `docs/` and root `wiki/` folders into proper sub-directories, securely mapping our application's guidelines into categorical primitives.

### 1.2 Structure Intent
- `01-architecture/`: The "Why". Explains high-level philosophy and how the system conceptually fits together (VSA, CQRS).
- `02-standards/`: The "What" and "How". Hard rules, coding conventions, folder mappings, and tooling configurations.
- `03-agents/`: Instructions designed explicitly for AI coding agents instructing them how to traverse our codebase and update the wiki securely.
- `04-tasks/`: The "When". Agile task tracking, maintaining states like `Todo`, `In Progress`, and `Done` locally as a single source of truth.

## 2. Walkthrough Guide (Learning Path)
Whether you are a new engineering intern or an AI coding agent context-loading into the workspace, follow this exact sequence:

### Step 1: The Index
Start your journey at `/wiki/00-Index.md`. This is the universal entry point and map. 

### Step 2: System Philosophies (Architecture)
Read `01-architecture/01-Architecture-Concepts.md` and `01-architecture/02-Blueprint-Learning.md`. These files will teach you:
- How **Vertical Slice Architecture** isolates features into their own self-contained folders (e.g., `features/posts`).
- How we split Read (Queries) from Write (Commands) using **CQRS**.
- The power of strictly shaping API payloads using **Valibot** via "Parse, Don't Validate".

### Step 3: Coding Directives (Standards)
Read through the `02-standards/` directory. You will discover:
- `01-Tool-Stack.md`: Explains our core stack dependencies (Hono, React 19, LibSQL/SQLite) and why we use them.
- `02-Folder-Structure.md`: Detailed mapping of current file layout and our target VSA destination boundaries.
- `03-Coding-Conventions.md`: Strict execution rules, such as using `Result<T, AppError>` (monads) instead of throwing errors.

### Step 4: Collaboration & Action
- Review `03-agents/01-Wiki-Guidelines.md` for strict instructions on how AI agents can mutate and maintain the memory bank.
- Navigate to `04-tasks/` to identify the next development task. Active tasks, bugs, and DX improvements are natively tracked here.

## 3. Continuous Evolution
The knowledge base is living text. If a new architectural feature is added or a new pattern is discovered, the wiki MUST be updated synchronously within that same step or single AI turn. There should be no separation between code changes and memory bank updates.
