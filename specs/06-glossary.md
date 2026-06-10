# Glossary

- **VSA (Vertical Slice Architecture):** Organizing code by business feature rather than technical layer. A slice contains route entry, validation, execution, and DB logic in one directory.
- **CQRS (Command Query Responsibility Segregation):** The architectural separation of write operations (Commands) from read operations (Queries).
- **BM25:** A ranking function used by search engines to estimate the relevance of documents to a given search query. Implemented natively in SQLite via the FTS5 extension.
- **Valibot:** A lightweight, tree-shakeable validation library specifically selected over Zod.
- **Monad / Result Pattern:** A functional programming paradigm where functions return a container (`Result`) holding either a successful value (`Ok`) or a failure value (`Err`), rather than throwing untyped runtime exceptions.
- **SDD (Spec-Driven Development):** A workflow where explicit architectural and functional constraints guide code generation sequentially, preventing context loss.
