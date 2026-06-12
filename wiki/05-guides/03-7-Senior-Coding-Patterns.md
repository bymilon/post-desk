# 03 - 7 Coding Patterns I Stole From Senior Engineers (Intern Walkthrough)

## Overview
As you ramp up in the PostDesk codebase, you will notice certain patterns repeated constantly. These aren't just subjective style choices—they are production-hardened patterns adopted by senior engineers to reduce cognitive load, prevent bugs, and make the codebase highly maintainable.

This walkthrough breaks down the **7 coding patterns** you should learn and consistently apply during your internship.

---

## 1. Early Returns & Guard Clauses (Bouncer Pattern)
**The Problem:** Deeply nested `if/else` statements (the "Arrow Anti-Pattern") make code hard to read and test.
**The Fix:** Check for failure or edge cases immediately at the top of your function and return early. Keep the "happy path" un-indented at the bottom.

```typescript
// ❌ BAD: Deeply nested happy path
function processPost(post) {
  if (post != null) {
    if (post.status === 'draft') {
      if (post.content.length > 0) {
        // ... do work
        return true;
      }
    }
  }
  return false;
}

// ✅ GOOD: Guard clauses handle failure early
function processPost(post) {
  if (!post) return false;
  if (post.status !== 'draft') return false;
  if (post.content.length === 0) return false;

  // ... do work (happy path)
  return true;
}
```

---

## 2. Options Object Pattern (Rethinking Parameters)
**The Problem:** Functions with multiple parameters (especially booleans) become unreadable at the call site. Handing in `true, false, null` tells the reader nothing.
**The Fix:** Pass a single configuration object instead of a long list of parameters. This also allows for optional parameters without breaking the signature.

```typescript
// ❌ BAD: What do these booleans mean?
generateCopilotDraft("Hello world", true, false, 5);

// ✅ GOOD: Self-documenting parameters
generateCopilotDraft({
  prompt: "Hello world",
  isThread: true,
  includeLinks: false,
  maxVariations: 5
});
```

---

## 3. "Parse, Don't Validate"
**The Problem:** Validating inputs via `if` statements leaves Typescript guessing if the shape is correct, forcing you to use `as SomeType` (type assertions).
**The Fix:** Use a schema library like **Valibot** to parse data at the boundary. If the data passes parsing, it is guaranteed to match the type signature.

```typescript
import * as v from 'valibot';

const PostSchema = v.object({
  title: v.string(),
  content: v.string()
});

// Once this parse passes, TS knows `data` has a `title` and `content`.
const parsedData = v.parse(PostSchema, incomingJSON);
```

---

## 4. Monadic Error Handling (`Result<T, Error>`)
**The Problem:** `throw new Error()` behaves like a hidden `goto`. It breaks control flow, doesn't enforce handling at compile time, and makes it impossible to know a function can fail just by reading its signature.
**The Fix:** Return explicit structures using `Ok` and `Err` outcomes. The caller is forced by the compiler to handle the failure path.

```typescript
// ❌ BAD: Throws an invisible error
function getPost(id: string): Post {
  if (!db.has(id)) throw new Error("Not found");
  return db.get(id);
}

// ✅ GOOD: Explicit failure boundary
function getPost(id: string): Result<Post, AppError> {
  if (!db.has(id)) return Err(new AppError("Not found"));
  return Ok(db.get(id));
}
```

---

## 5. Map Object > Switch Statements
**The Problem:** Switch statements are bulky, prone to fall-through bugs if you miss a `break`, and are generally imperative.
**The Fix:** Use a record/object map for simple keyed lookups or strategies.

```typescript
// ❌ BAD: Verbose switch statement
let themeColor;
switch(status) {
  case 'draft': themeColor = 'gray'; break;
  case 'published': themeColor = 'green'; break;
  default: themeColor = 'blue';
}

// ✅ GOOD: A crisp map lookup
const StatusColors = {
  draft: 'gray',
  published: 'green',
  archived: 'red'
} as const;

const themeColor = StatusColors[status] ?? 'blue';
```

---

## 6. Nullish Coalescing (`??`) and Optional Chaining (`?.`)
**The Problem:** Using logical `||` can cause bugs when `0` or `""` (empty string) are valid values because `||` checks for *falsiness*. 
**The Fix:** Use `??` to check strictly for `null` or `undefined`. Use `?.` to safely access nested properties that might not exist without throwing an error.

```typescript
// ❌ BAD: If points is 0, it incorrectly falls back to 10
const score = user.points || 10; 

// ✅ GOOD: Correctly respects 0, only falls back on null/undefined
const score = user.points ?? 10;

// ✅ GOOD: Safe navigation
const authorCity = post.author?.address?.city ?? "Unknown";
```

---

## 7. CQRS: Segregating Read vs. Write Interfaces
**The Problem:** Sharing the exact same database models for complex UI reads and simple backend writes leads to bloated models. A command (writing data) has different needs than a query (displaying data).
**The Fix:** Command Query Responsibility Segregation (CQRS). Within our Vertical Slices, separate your files and mental models strictly between `queries` (fast fetching) and `commands` (validating and mutating).

- **Commands:** Insert a row into `x_posts`.
- **Queries:** Fetch a row from `x_posts` joining `x_posts_fts` for blazing fast full-text search.

---
**Next Steps:**
Review these patterns in action directly within `/src/features/posts` to see how we apply them in the real world.
