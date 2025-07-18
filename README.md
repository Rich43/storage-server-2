# Storage Server 2

Storage Server 2 is a Node.js/Express service that exposes a GraphQL API for
managing media metadata. It is inspired by video‑sharing sites but supports a
variety of file types including documents and other binary formats. The service
stores metadata only; an upcoming S3 proxy will handle the actual file storage
while sharing the same MySQL database.

## Getting Started

```bash
npm install
# Run in development mode
npm run start:dev
# Or run the compiled server
npm start
```

### Tests and Linting

```bash
npm test     # run unit tests
npm run lint # run ESLint
```

To run the integration tests without Docker, set `USE_TESTCONTAINERS=false` when
invoking the test script:

```bash
USE_TESTCONTAINERS=false npm test
```

Docker is still required when `USE_TESTCONTAINERS=true` (the default).

The server listens on `http://localhost:4000/graphql` by default. You can query
the GraphQL endpoint using any standard GraphQL client.

## Protocol

The complete GraphQL schema is provided below. It defines all available queries
and mutations for interacting with the storage system.

```graphql
schema {
    query: Query
    mutation: Mutation
}

enum Category {
    IMAGE
    VIDEO
    AUDIO
    DOCUMENT
    OTHER
}

type User {
    id: ID!
    username: String!
    email: String!
    avatar: Media
    created: String!
    updated: String
    activated: Boolean!
    banned: Boolean!
    likedMedia: [LikeDislike!]!
    dislikedMedia: [LikeDislike!]!
}

input EditUserInput {
    id: ID!
    username: String
    email: String
    password: String
}

input RegisterUserInput {
    username: String!
    email: String!
    password: String!
}

type MimeType {
    id: ID!
    type: String!
    category: Category!
    extensions: [String]
    preferred_extension: String!
}

input MimeTypeFilter {
    type: String
    category: Category
    extension: String
    preferred_extension: String
}

type Session {
    userId: ID!
    sessionId: ID!
    user: User!
    avatarPicture: String
    sessionToken: String!
    sessionExpireDateTime: String!
    admin: Boolean!
    created: String!
    updated: String
}

enum LikeDislikeAction {
    LIKE
    DISLIKE
}

type Media {
    id: ID!
    title: String!
    description: String
    url: String!
    mimetype: String!
    thumbnail: Media
    userId: ID!
    adminOnly: Boolean!
    uploaded: Boolean!
    uploadedDate: String
    created: String!
    updated: String
    fileSize: Int!
    view_count: Int!
    likes: Int!
    dislikes: Int!
}

type MediaComment {
    id: ID!
    mediaId: ID!
    userId: ID!
    comment: String!
    created: String!
    updated: String!
}

type LikeDislike {
    id: ID!
    userId: ID!
    mediaId: ID!
    action: LikeDislikeAction!
    createdAt: String!
    updatedAt: String!
}

input CreateLikeDislikeInput {
    mediaId: ID!
    action: LikeDislikeAction!
}

input UpdateLikeDislikeInput {
    id: ID!
    action: LikeDislikeAction!
}

type Album {
    id: ID!
    title: String!
    media: [Media]
    userId: ID!
    created: String!
    updated: String
}

input MediaFilter {
    title: String
    mimetype: String
    userId: Int
}

input Pagination {
    page: Int!
    limit: Int!
}

input Sorting {
    field: String!
    order: String!
}

input CreateMediaInput {
    title: String!
    url: String!
    mimetype: String!
    thumbnail: String
    adminOnly: Boolean
}

input EditMediaInput {
    id: ID!
    title: String
    description: String
    url: String
    mimetype: String
    thumbnail: String
    adminOnly: Boolean
}

input CreateMediaCommentInput {
    mediaId: ID!
    comment: String!
}

input EditMediaCommentInput {
    id: ID!
    comment: String!
}

type Query {
    lists: ListQueries
    gets: GetQueries
}

type ListQueries {
    listAlbums(
        albumTitleFilter: String
        pagination: Pagination
        sorting: Sorting
    ): [Album]
    listDocuments(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listMedia(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listMediaComments(mediaId: ID!): [MediaComment]
    listMimeTypes(
        filter: MimeTypeFilter
        pagination: Pagination
        sorting: Sorting
    ): [MimeType]
    listMusic(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listOtherFiles(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listPictures(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listRelatedMedia(id: ID!): [Media]
    listVideos(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
}

type GetQueries {
    getDislikesByUser(userId: ID!): [LikeDislike!]!
    getLikesByUser(userId: ID!): [LikeDislike!]!
    getMediaById(id: ID!): Media
}

type Mutation {
    media: MediaMutations
    auth: AuthMutations
    likes: LikeMutations
}

type MediaMutations {
    createMedia(input: CreateMediaInput!): Media!
    editMedia(input: EditMediaInput!): Media!
    deleteMedia(id: ID!): Boolean!
    createMediaComment(input: CreateMediaCommentInput!): MediaComment!
    editMediaComment(input: EditMediaCommentInput!): MediaComment!
    deleteMediaComment(id: ID!): Boolean!
}

type AuthMutations {
    loginUser(username: String!, password: String!): Session
    logoutUser: Boolean!
    refreshSession: Session
    registerUser(input: RegisterUserInput!): User!
    activateUser(activationCode: String!): Boolean!
    editUser(input: EditUserInput!): User!
    setAvatar(mediaId: ID!): User!
}

type LikeMutations {
    createLikeDislike(input: CreateLikeDislikeInput!): LikeDislike!
    updateLikeDislike(input: UpdateLikeDislikeInput!): LikeDislike!
    deleteLikeDislike(id: ID!): Boolean!
}
```

