# Mission & Vision

## Product Vision
To build an internal, high-performance X Growth Content Engine specifically designed as a desktop-class drafting workspace. It empowers a solo developer (personal use) to seamlessly ideate, draft, manage, and categorize raw X posts with rapid semantic retrieval.

## Business Objectives
1. **Reduce friction in content creation:** Provide an uncluttered, responsive writing environment with a direct point-and-click GUI.
2. **Accelerate retrieval:** Implement industry-leading semantic relevance searching (FTS5 + BM25) to instantly surface past drafts, threads, or inspiration references.
3. **Isolate states reliably:** Decouple post creation models from read indices, ensuring state (used vs unused) is accurately preserved.

## Target Audience
- A single user (the creator).
- No multi-tenant complexity; auth is simple and key-based.

## Success Metrics
- Zero unhandled exceptions during runtime.
- Near-instant search latency using BM25 ranking on local/edge Turso databases.
- 100% adherence to VSA and Monadic error handling boundaries.
