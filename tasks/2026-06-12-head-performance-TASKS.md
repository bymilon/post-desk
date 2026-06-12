# 📋 High-Performance HTML Head Alignment (2026-06-12)

This document tracks execution phases, owner assignments, and sprint milestones for optimizing our HTML head structure to minimize visual layout shifts (CLS), accelerate initial style painting, and establish standard prefetching models.

---

## 🚀 Active Sprint Board

| Task ID | Component / Area | Task Description | Priority | Owner | Status | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HP-201** | `wiki` | Ingest performance lessons from core specifications into the PostDesk Knowledge Base under `/wiki/05-guides/05-Performance-Header-Patterns.md`. | High 🔥 | Core Engineer | Completed | None |
| **HP-202** | `index.html` | Optimize existing production `<head>` tags to establish robust preconnection, dns-prefetch, and optimal stylesheet loading priorities. | Medium ⚡ | Core Engineer | Completed | HP-201 |
| **HP-203** | `wiki/00-Index.md` | Index the newly added performance guidelines to ensure all human workers and AI agents can seamlessly pull down standards during future file operations. | Low 💤 | Core Engineer | Completed | HP-201 |

---

## 🪵 Task Detail Breakdowns

### HP-201: Ingest performance header lesson to wiki
- **Goal**: Write a zero-slop, dense technical architectural guide summarizing the `<head>` pattern depicted in our core specifications.
- **Action**: Document connections warming (`preconnect` / `dns-prefetch`), asset preloading (`preload`), compiled styles ordering, and prospective routing preloading (`prefetch`).

### HP-202: Implement optimized head assets
- **Goal**: Apply the performance lessons to `/index.html` directly.
- **Action**: Ensure standard preconnecting, dns-prefetches, and structured font-loading hints are added.

### HP-203: Register guide in Wiki Index
- **Goal**: Link the new guide inside `/wiki/00-Index.md` mapping file.
- **Action**: Add an elegant entry referencing `[[05-guides/05-Performance-Header-Patterns]]`.
