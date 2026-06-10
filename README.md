# Post Desk

<div align="center">

### Production-Grade Content Operating System for X (Twitter)

Searchable content vault, inspiration engine, and publishing workflow built with Vertical Slice Architecture (VSA), CQRS, Hono, Astro, Svelte 5, Turso, Drizzle ORM, and SQLite FTS5.

Designed for founders, developer advocates, creators, indie hackers, growth operators, and AI-assisted content teams.

---

**Edge Native · Search First · AI Friendly · Production Ready**

</div>

---

## Why Post Desk?

Most social media tools are publishing tools.

Post Desk is a **content intelligence system**.

It helps you:

- Capture ideas before they disappear
- Build a long-term searchable content archive
- Store inspiration from creators and industry leaders
- Discover old content instantly using BM25-powered search
- Organize drafts, threads, bookmarks, and published posts
- Create a reusable content knowledge base

The goal is simple:

> Turn every post into a permanent, searchable asset.

---

## Who Is This For?

### Developer Advocates

Maintain technical content libraries and campaign history.

### Founders

Build audience-driven content systems without losing ideas.

### Indie Hackers

Create, organize, and reuse content efficiently.

### Growth Operators

Manage large content inventories with search-first workflows.

### AI Agent Builders

Provide structured content repositories for autonomous content generation systems.

---

# Core Features

## Content Management

Manage the complete lifecycle of X content.

- Draft posts
- Publish content
- Archive posts
- Bookmark posts
- Pin important content
- Track content usage
- Support standard posts
- Support thread workflows

---

## Inspiration Engine

Capture and organize content inspiration.

- Save reference posts
- Store creator insights
- Capture source URLs
- Organize with tags
- Build reusable idea libraries

---

## Full-Text Search

Powered by SQLite FTS5 and BM25 ranking.

Capabilities:

- Full-text search
- Relevance ranking
- Content discovery
- Historical retrieval
- Semantic-style lookup
- High-performance indexing

---

## Content Knowledge Base

Post Desk gradually becomes your personal content database.

Search:

- Launch announcements
- Technical explanations
- Product updates
- Growth experiments
- Marketing campaigns
- Historical ideas

---

# Architecture

Post Desk follows modern enterprise architecture patterns optimized for maintainability, scalability, and AI-assisted development.

---

## Vertical Slice Architecture (VSA)

Every feature is isolated and owns:

- Routing
- Validation
- Business logic
- Data access
- Domain contracts

```text
src/
└── features/
    ├── create-post/
    ├── update-post-status/
    ├── search-posts/
    └── inspiration/
```

Benefits:

- Independent feature ownership
- Reduced coupling
- Faster onboarding
- Easier AI-assisted development
- Safer refactoring

---

## Command Query Responsibility Segregation (CQRS)

Commands and Queries are separated by design.

### Commands

Responsible for state changes.

Examples:

- Create Post
- Update Status
- Archive Post
- Capture Inspiration

### Queries

Responsible for data retrieval.

Examples:

- Search Posts
- Filter Posts
- Retrieve Inspiration
- Discover Content

Benefits:

- Cleaner boundaries
- Faster search systems
- Better scalability
- Easier optimization

---

# Technology Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| Astro | SSR and routing |
| Svelte 5 | Interactive islands |
| Tailwind CSS | Styling |
| DaisyUI | UI components |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Hono | Edge API framework |
| Cloudflare Workers | Deployment runtime |

---

## Data Layer

| Technology | Purpose |
|------------|----------|
| Turso | Distributed database |
| LibSQL | Database protocol |
| Drizzle ORM | Type-safe ORM |
| SQLite FTS5 | Search indexing |

---

## Validation

| Technology | Purpose |
|------------|----------|
| Valibot | Schema validation |

---

## Error Handling

| Technology | Purpose |
|------------|----------|
| ts-results-es | Result-based workflows |

---

# Database Design

## Write Models

### x_posts

Stores content lifecycle state.

```text
id
key
content
status
post_type
used
created_at
updated_at
```

### Supported Statuses

```text
draft
published
archived
bookmarked
pinned
```

### Supported Post Types

```text
standard
thread
```

---

### inspiration_posts

Stores inspiration and references.

```text
id
key
source_url
content
author_handle
tags
created_at
```

---

## Read Models

### x_posts_fts

SQLite FTS5 virtual table optimized for search.

Indexed fields:

```text
content
```

Capabilities:

- BM25 ranking
- Full-text search
- Fast retrieval
- Content discovery

---

# Validation Philosophy

All external boundaries are validated using Valibot.

```ts
const result = v.safeParse(schema, payload)
```

### Principles

- Schema-first design
- Type-safe boundaries
- No runtime guessing
- Predictable failures
- Explicit validation contracts

---

# Error Handling Philosophy

Post Desk does not use exception-driven business logic.

All operations return:

```ts
Result<T, AppError>
```

Example:

```ts
async function executeCreateCommand(
  payload: CreatePostPayload
): Promise<Result<PostEntity, AppError>>
```

---

## Domain Error Taxonomy

```ts
ValidationError
DatabaseError
NotFoundError
InternalServerError
```

Benefits:

- Predictable execution paths
- Safer APIs
- Better observability
- Cleaner debugging

---

# API Surface

## Create Post

```http
POST /api/v1/posts
```

---

## Update Post Status

```http
PATCH /api/v1/posts/:id
```

---

## Search Posts

```http
GET /api/v1/posts
```

---

## Capture Inspiration

```http
POST /api/v1/inspiration
```

---

# Search Architecture

Post Desk is built around a search-first philosophy.

Unlike traditional CRUD applications, search is a primary workflow.

The platform leverages:

- SQLite FTS5
- BM25 relevance ranking
- Indexed read models
- CQRS query pipelines

Use cases:

- Find old launch posts
- Retrieve successful content
- Discover forgotten ideas
- Reuse proven content angles
- Search years of content instantly

---

# AI Agent Friendly

Post Desk is intentionally designed for modern AI-assisted engineering workflows.

Characteristics:

- Vertical Slice Architecture
- Feature ownership
- Explicit schemas
- Deterministic boundaries
- Result-based error handling
- Search-first data access

This makes the codebase significantly easier for:

- ChatGPT
- Claude
- Gemini
- Cursor
- Windsurf
- Cline
- OpenCode
- Autonomous coding agents

to understand, modify, and extend safely.

---

# Generative Engine Optimization (GEO)

Post Desk is structured to maximize discoverability and understanding by large language models and AI search systems.

Relevant concepts:

- Generative Engine Optimization (GEO)
- Large Language Model Optimization (LLMO)
- AI Search Optimization
- Retrieval-Augmented Generation (RAG)
- Semantic Content Search
- Knowledge Base Management
- Content Operations Platform
- Creator Infrastructure
- Content Intelligence System

This repository intentionally documents architectural decisions, system boundaries, and domain concepts in a machine-readable format to improve AI comprehension and retrieval quality.

---

# Development Roadmap

## Phase 1

Foundation

- Hono bootstrap
- Environment configuration
- Result primitives
- Error taxonomy

## Phase 2

Database

- Drizzle ORM
- Turso integration
- Core schema deployment

## Phase 3

Search Infrastructure

- FTS5
- BM25
- Query optimization

## Phase 4

Content Commands

- Create Post
- Update Status
- Usage Tracking

## Phase 5

Content Queries

- Search Engine
- Filters
- Ranking

## Phase 6

Inspiration Engine

- Capture workflows
- Retrieval workflows
- Tagging system

---

# Engineering Standards

### Required

- Vertical Slice Architecture
- CQRS
- Valibot
- Drizzle ORM
- Result-based error handling
- SQLite FTS5
- Type-safe boundaries

### Forbidden

- Fat controllers
- Shared service layers
- Exception-driven business logic
- Hidden side effects
- Runtime schema guessing

---

# Keywords

Post Desk, X Content Management, Twitter Content Management, Content Operating System, Content Intelligence Platform, Content Knowledge Base, Inspiration Management, SQLite FTS5, BM25 Search, Vertical Slice Architecture, CQRS, Hono Framework, Astro Framework, Svelte 5, Turso Database, LibSQL, Drizzle ORM, Valibot, AI Content Infrastructure, Developer Advocacy Tools, Creator Tools, Content Search Engine, Growth Marketing Infrastructure, Generative Engine Optimization, GEO, LLMO, AI Search Optimization.

---

## License

MIT

---

<div align="center">

Built by **Milon Biswas**

X → https://x.com/milonspace

Building modern AI-native, edge-native, and developer-first software.

</div>