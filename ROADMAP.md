# Storage Project Roadmap

Storage Server 2 forms part of a broader storage project which also includes:

- **storage-file-server-2** – Node/Express HTTP API for uploading raw media files to an S3 compatible service. It handles user management and validates session tokens before storing files.
- **storage-client-2** – React/Next.js front end that communicates with the GraphQL server to authenticate users, browse media and upload files.

This document lists completed functionality of **storage-server-2** and describes future plans across the suite.

## Completed Features

### storage-server-2
- GraphQL API built with Node.js and Express for managing media metadata. Currently stores metadata only; actual files are handled by the file server.
- Queries for listing albums, pictures, documents, music, videos, other files, media comments and related media, all with filtering, pagination and sorting.
- Mutations for creating, editing and deleting media and comments. Includes user registration, activation, login, logout, session refresh, avatar management and profile edits. Likes/dislikes are supported.
- Media metrics tracking views, likes and dislikes.
- Session management using tokens with middleware for cleanup and validation.
- MIME type management with dedicated table and query support.
- Unit and integration tests plus ESLint/Prettier for code quality.

### storage-file-server-2
- Express HTTP API with endpoints for listing and creating users.
- Session-token validated `/media/upload` endpoint that uploads files to S3 (tested with MinIO).
- Shares the same MySQL database as the GraphQL server.

### storage-client-2
- React/Next.js front end that consumes the GraphQL API.
- Supports authentication flows, browsing media, and uploading new files.

## Future Plans
- Integrate the file server more closely with storage-server-2, exposing upload and download operations through new GraphQL mutations.
- Unify authentication so both servers share the same session tokens and refresh logic.
- Add download and delete endpoints for files stored in S3.
- Expand keyword extraction utilities and implement full-text search.
- Provide Docker Compose setups for the server, client and file server.
- Improve test infrastructure so integration tests using Testcontainers run consistently.
- Additional GraphQL queries and mutations as new requirements arise.
