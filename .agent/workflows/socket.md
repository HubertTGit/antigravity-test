---
description: add notification via socket
---

# Feature Requirement Description: Real-Time To-Do Notifications

**Project:** Next.js To-Do App (Neon DB Integration)  
**Date:** November 26, 2025  
**Priority:** High  
**Status:** Draft

---

## 1. Executive Summary

The objective is to enhance the existing To-Do application by adding real-time collaboration features. We will integrate a **Socket.IO** server to push immediate notifications to users when To-Do items are created, edited, or deleted.

**Key Constraint:** Notifications must be broadcasted only to _other_ connected clients, ensuring the user who performed the action does not receive a redundant notification.

---

## 2. Technical Architecture

### 2.1 Backend (Next.js + Custom Server)

- **Server Setup:** Migration from standard Next.js serverless handling to a custom Node.js server (using `server.js`) to support the persistent WebSocket connection required by Socket.IO.
- **Database Flow:** The application will continue to write to Neon DB first. The WebSocket event is emitted only _after_ the Neon DB transaction is confirmed successful.

### 2.2 Frontend (Client)

- **Connection:** A persistent socket connection is established when the application/component mounts.
- **Event Listening:** The client listens for specific event strings to trigger UI feedback (Toast/Snackbar).

---

## 3. Functional Requirements

### REQ-01: Socket Server Initialization

- **Goal:** Establish the communication channel.
- **Detail:** Initialize `socket.io` on the same HTTP server instance used by Next.js.
- **Config:** Ensure CORS is configured to allow requests from the app's origin.

### REQ-02: Notification Logic (The "Broadcast" Rule)

- **Goal:** Prevent notification noise for the active user.
- **Logic:** Use the `socket.broadcast.emit` method.
  - **Sender (User A):** Triggers the action -> Gets API response -> UI updates locally.
  - **Receivers (User B, C):** Server broadcasts event -> Client receives event -> UI shows notification.

### REQ-03: Event Triggers

#### A. Create Item

- **Trigger:** Successful `INSERT` into Neon DB.
- **Event Name:** `notification:todo_created`
- **Payload:**
  ```json
  {
    "action": "CREATE",
    "todoId": "123-abc",
    "title": "Review PRs",
    "user": "Alice",
    "timestamp": "2023-10-27T10:00:00Z"
  }
  ```

#### B. Edit Item

- **Trigger:** Successful `UPDATE` in Neon DB.
- **Event Name:** `notification:todo_updated`
- **Payload:**
  ```json
  {
    "action": "UPDATE",
    "todoId": "123-abc",
    "updatedFields": ["completed"],
    "user": "Alice"
  }
  ```

#### C. Delete Item

- **Trigger:** Successful `DELETE` in Neon DB.
- **Event Name:** `notification:todo_deleted`
- **Payload:**
  ```json
  {
    "action": "DELETE",
    "todoId": "123-abc",
    "user": "Alice"
  }
  ```

---

## 4. UI/UX Requirements

1.  **Notification Component:** Use a "Toast" or "Snackbar" component that appears for 3-5 seconds.
2.  **Message Formatting:**
    - _Create:_ "{User} added a new task: {Task Title}"
    - _Edit:_ "{User} updated task: {Task Title}"
    - _Delete:_ "{User} deleted a task"

---

## 5. Acceptance Criteria

| ID       | Scenario                                      | Expected Result                                                                             |
| :------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------ |
| **AC-1** | User A creates a task.                        | **User B** sees "User A added a task". **User A** sees nothing (no duplicate notification). |
| **AC-2** | User B modifies a task (e.g., checks "Done"). | **User A** sees "User B updated task".                                                      |
| **AC-3** | Database failure (Neon DB returns error).     | No socket event is emitted. No notifications are sent.                                      |
| **AC-4** | User refreshes the page.                      | Socket reconnects automatically with a new ID.                                              |

---

## 6. Implementation Notes for Developer

- **Dependency:** `npm install socket.io socket.io-client`
- **Entry Point:** You must modify `package.json` to run `node server.js` instead of `next start`.
- **API Routes:** In your Next.js API routes (`pages/api/...` or Route Handlers), you will need to attach the `io` instance to the request or import it to emit events.
