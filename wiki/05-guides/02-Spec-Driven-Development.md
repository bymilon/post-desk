# 02 Spec-Driven Development (SDD) Guide

## Overview
This document explains how **Spec-Driven Development (SDD)** acts as the foundational workflow for our Developer Experience (DX) and project velocity. By separating the "what" and "how" into explicit, living specifications, we eliminate ambiguity for both human developers and AI coding agents.

## 1. What is Spec-Driven Development (SDD)?
Spec-Driven Development is the practice of writing strict, plain-text specifications before a single line of code is written. These specifications serve as the undeniable source of truth for the project. For AI agents like those building PostDesk, the spec acts as the prime context window guardrail.

In PostDesk, we maintain our specs in the `/specs/` directory.

### 1.1 Types of Specs
- **Product Spec (`/specs/10-postdesk-product-spec.md`)**: Defines the target audience, core features, use cases, and Non-Goals. This protects against scope creep and "AI slop" or unsolicited features.
- **Technical Spec (`/specs/11-postdesk-tech-spec.md`)**: Defines the architecture bounds. For example, dictating Vertical Slice Architecture (VSA), CQRS mappings, SQLite integration, and our "Parse, Don't Validate" principles.

## 2. SDD in Our Daily Dev Workflow

### 2.1 The Execution Pipeline
1. **Ideation & Spec Writing**: Whenever a new major feature is conceptualized, it is first written out in the `/specs/` folder.
2. **Context Loading (AI Agents)**: When an AI coding session begins, the agent is instructed to read the specific `[number]-tech-spec.md` and `[number]-product-spec.md` before proceeding.
3. **Task Generation**: Broad specs are broken down into discrete, actionable steps and saved into our local task tracker at `/wiki/04-tasks/`.
4. **Execution**: The AI agent or human Developer executes the code strictly within the bounds dictated by the spec. 
5. **Spec Evolution**: If an implementation constraint forces a change, we do NOT just update the code. We modify the spec to record *why* the architectural pivot happened, keeping the documentation synchronous with the codebase.

## 3. How SDD Enhances Developer Experience (DX)

### 3.1 Cognitive Offloading
Developers do not need to keep the entire system architecture in their head. The technical specs provide a clear, linear map of how data flows (e.g., from Valibot parsing to Monadic Error Returns).

### 3.2 Eradicating AI Hallucinations
Generative AI agents tend to guess directory structures, use generic design patterns, or rewrite code using global controllers if not explicitly guided.
By enforcing SDD:
- The AI knows to use `/src/features/` instead of `/src/controllers/`.
- The AI adheres to the existing stack tools (Hono + React 19) without accidentally substituting different frameworks.
- The AI understands exactly what NOT to build (Non-Goals).

## 4. Workflow Rules for SDD
- **Never code in the dark:** If you are asked to build a large feature and it does not exist in the product spec, request or generate a spec update first.
- **No rogue dependencies:** If a new library is required to achieve a task, evaluate if it fits the Tech Spec. If it requires an architectural shift, the Tech Spec must be updated.
- **Symmetry with the Wiki:** While `/specs/` dictate the destination and blueprints, the `/wiki/` acts as the map and active memory bank of *how* we are currently traversing the codebase to reach that destination.
