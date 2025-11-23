---
description: create authentication
---

# Product Requirement Document — Passwordless Todo App

## 1. Overview
This document outlines the product requirements for implementing **passwordless authentication**, **user-scoped todo lists**, and **public sharing** using **Clerk** and **PocketBase**. The app will authenticate users without passwords and associate each user's todo list with their unique userId.

---

## 2. Goals & Objectives
- Provide simple, **passwordless login** using Clerk.
- Automatically route authenticated users to their **dynamic todo page**.
- Persist all todo items per user using **PocketBase**.
- Enable users to **share their todo list publicly** via userId.
- Allow unauthenticated users to either authenticate or visit a public todo list.

---

## 3. User Flow

### 3.1 Landing Page
- When the user visits the home page (`/`):
  - If **authenticated** → redirect to `/todo/:userId`
  - If **not authenticated** → show:
    - Passwordless authentication options (email, magic link)
    - Input field or link to view an existing user’s todo list by providing a `userId`

### 3.2 Authentication (Clerk Passwordless)
- Integrate Clerk’s passwordless features:
  - Magic link
  - Email verification code
- After successful authentication:
  - Retrieve authenticated `userId` from Clerk
  - Redirect user to `/todo/{userId}`

### 3.3 Todo App Page (`/todo/:userId`)
- Display all todo items associated with the given `userId`.
- Allow CRUD operations (create, update, delete) **only if**:
  - The authenticated `userId` matches the URL `userId`.

#### Authorization Rules

| Scenario | Permissions |
|---------|-------------|
| Authenticated user visiting their own `/todo/:userId` | Full CRUD |
| Authenticated user visiting someone else’s `/todo/:userId` | Read-only |
| Unauthenticated user visiting `/todo/:userId` | Read-only |

---

## 4. Sharing Feature
- A user can share their todo list publicly by sharing the URL:  
  `https://<app-domain>/todo/{userId}`
- Anyone (authenticated or not) can:
  - View the todo list
  - NOT edit unless authenticated as that exact user

---

## 5. Database Schema — PocketBase

### 5.1 Collections

#### Todos

| Field | Type | Description |
|-------|-------|-------------|
| id | string | Primary key |
| userId | string | Clerk userId (indexed) |
| title | string | Todo title |
| completed | boolean | Status |
| createdAt | date | Generated timestamp |
| updatedAt | date | Updated timestamp |

- The `userId` field acts as a **foreign key** for each user's todo list.
- All queries must be filtered by `userId`.

---

## 6. Unauthorized User Options

When an unauthorized user lands on the home page or a shared todo page:

### Option 1 — Create Their Own Todo List
- Click **“Create my own Todo List”**
- Authenticate via passwordless login
- Redirect to `/todo/{newUserId}`

### Option 2 — View an Existing Todo List
- Input a `userId` in a field:  
  **“View someone’s Todo List”**
- Redirect to `/todo/{enteredUserId}` (read-only mode)

---

## 7. Technical Requirements

### 7.1 Authentication
- Use **Clerk Next.js SDK**.
- Must support:
  - Magic links
  - Email/SMS codes

### 7.2 Routing
- Dynamic route: `/todo/[userId]`
- Server-side verification:
  - Compare Clerk's user identity to route param

### 7.3 Database
- Use **PocketBase SDK** for:
  - Fetching todos by `userId`
  - Inserting new todos
  - Updating/deleting todos (only if authorized)

### 7.4 Permissions
- Middleware layer to enforce:
  - Allow edit only if `userId === clerkUserId`
  - View access allowed for all

---

## 8. Non-Goals
- No password-based authentication
- No complex multi-user collaboration
- No role-based access control beyond owner vs. viewer

---

## 9. Success Metrics
- Successful login rate
- Time-to-create-first-todo
- Public share link usage
- Number of authenticated returning users