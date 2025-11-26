---
description: user db
---

# Feature: Auto-Create User Record on First Login

## Overview

When a user logs into the system for the first time, the application must automatically create a corresponding entry in the `users` table.

## Requirements

### 1. Database Fields

The `users` table must include the following fields:

- **`userId`**
  - Type: String/UUID (or as defined by authentication provider)
  - Constraints: Primary Key, Required
  - Value: Provided by the authentication system at login

- **`userTodoId`**
  - Type: String (6-digit numeric code)
  - Constraints:
    - Must be exactly 6 digits
    - Must be randomly generated
    - Must be unique across all records
    - Required

### 2. Behavior on First Login

When a user authenticates for the first time:

1. The system checks if a record already exists in the `users` table for the given `userId`.
2. If no record exists:
   - Generate a 6-digit random numeric `userTodoId`.
   - Verify the generated value is unique. If not, regenerate until unique.
   - Insert a new record into the `users` table with:
     - `userId` = authenticated user’s ID
     - `userTodoId` = generated unique 6-digit number

### 3. Error Handling

- If a unique `userTodoId` cannot be generated after multiple attempts (e.g., 5 retries), log the failure and return an appropriate error.
- Database insertion failures must be logged and surfaced to monitoring systems.

### 4. Performance Considerations

- Uniqueness checks must be efficient; collisions are expected to be extremely rare.
- Generation and validation should occur within the login request flow without noticeable delay.

### 5. Security Considerations

- `userTodoId` must not follow predictable patterns.
- No sequential or guessable generation strategies allowed.
