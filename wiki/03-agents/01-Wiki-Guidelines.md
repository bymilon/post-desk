# 01 AI Agent Wiki Guidelines

This document provides strict operational instructions for AI Coding Agents on how to interact with the `/wiki` directory. The Wiki serves as the collective "second brain" and Memory Bank for all human and AI collaborators.

## 1. Ingestion (How to Read the Wiki)
- **Starting Point:** ALWAYS begin a new session or complex architectural task by reading `/wiki/00-Index.md`.
- **Task Verification:** Before writing code, use the `view_file` tool on `/wiki/04-tasks/` to locate the active task tracker (e.g., `YYYY-MM-DD-...-TASKS.md`). Review the `Active Tasks` to understand pending priorities.
- **Context Gathering:** Use `view_file` to read specific concept files (`01-architecture/01-Architecture-Concepts.md`, `02-standards/03-Coding-Conventions.md`) relevant to the user request. DO NOT assume project structure; rely on the Wiki instead.

## 2. Searching
- Use the `list_dir` tool on `/wiki` to view all available knowledge modules.
- Use `grep` via the `shell_exec` tool (e.g., `grep -rI "Valibot" ./wiki`) if you need to quickly locate references to a specific architectural pattern or library constraint.
- For deep understanding, always read the entire target markdown file rather than relying on search snippets.

## 3. Updating (How to Write to the Wiki)
- **Synchronous Updates:** When you (the AI Agent) implement a new library, change a core foundational pattern, or restructure folders, you MUST update the respective Wiki file (`02-standards/01-Tool-Stack.md`, `02-standards/02-Folder-Structure.md`) in the same turn.
- **Task Tracking:** You are responsible for keeping the Linear-style task tracker updated.
  - If you start a task: Update the `Status:` to `In Progress` using the `edit_file` tool.
  - If you finish a task: Move the task to the `## Done` section and mark it with `[x]`.
- **New Decisions:** If a novel pattern is established during coding, append it to `02-standards/03-Coding-Conventions.md`.

## 4. Linting and Maintenance
- **Formatting:** Keep markdown structured and dense. Use clear headings (`##`, `###`), bullet points, and code blocks. Avoid conversational fluff or "AI slop" in the Wiki.
- **Link Integrity:** Ensure any file you reference (e.g., `[[01-architecture/01-Architecture-Concepts]]`) exists in the directory. Update `00-Index.md` if you create a new root document.
- **Task Pruning:** Keep the `TASKS.md` files organized. If a list gets too long, propose archiving completed tasks to a dedicated done-log.
