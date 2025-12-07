# GW2STYLE Backend - API Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Common Response Formats](#common-response-formats)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Post Endpoints](#post-endpoints)
  - [Like Endpoints](#like-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Admin/Moderation Endpoints](#adminmoderation-endpoints)

---

## Overview

The GW2STYLE API is a RESTful API that provides endpoints for managing Guild Wars 2 fashion posts, user authentication, and content moderation.

**API Version**: v1  
**Content-Type**: `application/json`  
**Authentication**: JWT (JSON Web Tokens)

---

## Authentication

The API uses two authentication methods:

### 1. JWT Authentication (User Endpoints)
Protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Obtain a JWT token by calling the `/api/v1/login` endpoint with a valid GW2 API key.

### 2. Bot Authentication (Admin Endpoints)
Admin endpoints require a bot token in the `X-Bot-Token` header:

```
X-Bot-Token: <discord_bot_token>
```

---

## Base URL

```
http://localhost:YOUR_PORT/api/v1
```

In production, replace with your deployed backend URL.

---

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## Endpoints

### Authentication Endpoints

#### 1. Login with GW2 API Key

Authenticate a user using their Guild Wars 2 API key.

**Endpoint**: `POST /api/v1/login`  
**Authentication**: None  
**Rate Limit**: 10 requests/minute

**Request Body**:
```json
{
  "api_key": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| api_key | string | Yes | Valid GW2 API key with `account`, `characters`, `builds` scopes |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "12345678-1234-1234-1234-123456789012",
      "username": "PlayerName.1234"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid API key format
- `401 Unauthorized`: API key validation failed
- `500 Internal Server Error`: Database or external API error

**Example**:
```bash
curl -X POST http://localhost:YOUR_PORT/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_GW2_API_KEY"}'
```

---

#### 2. Logout

Clear user session (client-side token removal).

**Endpoint**: `POST /api/v1/logout`  
**Authentication**: None (client-side operation)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 3. Get Current User

Retrieve authenticated user information.

**Endpoint**: `GET /api/v1/user/me`  
**Authentication**: JWT Required

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "12345678-1234-1234-1234-123456789012",
    "username": "PlayerName.1234",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token

---

#### 4. Get User API Key

Retrieve the user's stored GW2 API key (masked).

**Endpoint**: `GET /api/v1/user/apikey`  
**Authentication**: JWT Required

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "api_key": "XXXXXXXX-****-****-****-************"
  }
}
```

---

### Post Endpoints

#### 5. Get All Posts (Feed)

Retrieve a paginated list of published posts.

**Endpoint**: `GET /api/v1/posts`  
**Authentication**: None

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 20 | Number of posts per page (max: 100) |
| offset | integer | No | 0 | Number of posts to skip |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "1",
        "title": "Elegant Sylvari Light Armor",
        "thumbnail": "https://example.com/image.jpg",
        "author_name": "PlayerName.1234",
        "likes_count": 42
      }
    ],
    "total": 150,
    "limit": 20,
    "offset": 0
  }
}
```

**Example**:
```bash
curl http://localhost:YOUR_PORT/api/v1/posts?limit=10&offset=0
```

---

#### 6. Search Posts

Search and filter posts by tags, query, or author.

**Endpoint**: `GET /api/v1/posts/search`  
**Authentication**: None

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | No | Search term for title/description |
| tags | string | No | Comma-separated tags (e.g., "light,sylvari") |
| author | string | No | Filter by author username |
| limit | integer | No | Number of results (default: 20) |
| offset | integer | No | Pagination offset (default: 0) |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "total": 25,
    "limit": 20,
    "offset": 0
  }
}
```

**Example**:
```bash
curl "http://localhost:YOUR_PORT/api/v1/posts/search?tags=light,sylvari&limit=10"
```

---

#### 7. Get Popular Posts (Leaderboard)

Retrieve most-liked posts within a timeframe.

**Endpoint**: `GET /api/v1/posts/popular`  
**Authentication**: None

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| timeframe | string | No | all | Options: `day`, `week`, `month`, `all` |
| limit | integer | No | 10 | Number of posts to return |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "42",
        "title": "Legendary Armor Showcase",
        "thumbnail": "https://example.com/image.jpg",
        "author_name": "TopPlayer.5678",
        "likes_count": 256
      }
    ]
  }
}
```

**Example**:
```bash
curl "http://localhost:YOUR_PORT/api/v1/posts/popular?timeframe=week&limit=5"
```

---

#### 8. Get Post by ID

Retrieve detailed information for a specific post.

**Endpoint**: `GET /api/v1/posts/{id}`  
**Authentication**: None

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Post ID |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Elegant Sylvari Light Armor",
    "description": "A beautiful combination of...",
    "thumbnail": "https://example.com/thumb.jpg",
    "image1": "https://example.com/img1.jpg",
    "image2": "https://example.com/img2.jpg",
    "image3": null,
    "image4": null,
    "image5": null,
    "equipments": {
      "head": "Illustrious Mask",
      "shoulders": "Illustrious Pauldrons",
      "chest": "Illustrious Vestments",
      "gloves": "Illustrious Gloves",
      "legs": "Illustrious Leggings",
      "boots": "Illustrious Shoes",
      "weapon1": "Eternity",
      "weapon2": "The Bifrost"
    },
    "author_name": "PlayerName.1234",
    "tags": ["light", "sylvari", "elegant", "legendary"],
    "created_at": "2025-01-15T10:30:00Z",
    "likes_count": 42,
    "published": true
  }
}
```

**Error Responses**:
- `404 Not Found`: Post does not exist

**Example**:
```bash
curl http://localhost:YOUR_PORT/api/v1/posts/1
```

---

#### 9. Create Post

Create a new outfit post (requires authentication).

**Endpoint**: `POST /api/v1/posts/create`  
**Authentication**: JWT Required

**Request Body**:
```json
{
  "title": "My Awesome Outfit",
  "description": "A detailed description of the outfit",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "image1_url": "https://example.com/image1.jpg",
  "image2_url": "https://example.com/image2.jpg",
  "image3_url": null,
  "image4_url": null,
  "image5_url": null,
  "equipments": {
    "head": "Item Name",
    "shoulders": "Item Name",
    "chest": "Item Name",
    "gloves": "Item Name",
    "legs": "Item Name",
    "boots": "Item Name",
    "weapon1": "Weapon Name",
    "weapon2": "Weapon Name"
  },
  "tags": ["light", "human", "elegant"]
}
```

**Request Schema**:
| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| title | string | Yes | 250 | Post title |
| description | string | No | - | Detailed description |
| thumbnail_url | string | Yes | - | Main thumbnail image URL |
| image1_url | string | No | - | Additional image URL |
| image2_url | string | No | - | Additional image URL |
| image3_url | string | No | - | Additional image URL |
| image4_url | string | No | - | Additional image URL |
| image5_url | string | No | - | Additional image URL |
| equipments | object | No | - | Equipment details (JSON) |
| tags | array | No | - | Array of tag strings |

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "My Awesome Outfit",
    "published": false,
    "message": "Post created and sent for moderation"
  }
}
```

> **Note**: Posts start as `published: false` and require moderator approval via Discord.

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid JWT token

**Example**:
```bash
curl -X POST http://localhost:YOUR_PORT/api/v1/posts/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Outfit",
    "thumbnail_url": "https://example.com/img.jpg",
    "tags": ["light", "human"]
  }'
```

---

#### 10. Delete Post

Delete a post (only the author can delete their own posts).

**Endpoint**: `DELETE /api/v1/posts/{id}`  
**Authentication**: JWT Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Post ID to delete |

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the post author
- `404 Not Found`: Post does not exist

**Example**:
```bash
curl -X DELETE http://localhost:YOUR_PORT/api/v1/posts/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Like Endpoints

#### 11. Like a Post

Add a like to a post.

**Endpoint**: `POST /api/v1/posts/{id}/like`  
**Authentication**: JWT Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Post ID to like |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes_count": 43
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Post does not exist
- `409 Conflict`: Already liked

**Example**:
```bash
curl -X POST http://localhost:YOUR_PORT/api/v1/posts/1/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 12. Unlike a Post

Remove a like from a post.

**Endpoint**: `DELETE /api/v1/posts/{id}/like`  
**Authentication**: JWT Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Post ID to unlike |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "liked": false,
    "likes_count": 42
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Post or like does not exist

---

#### 13. Get User's Liked Posts

Retrieve all posts liked by the authenticated user.

**Endpoint**: `GET /api/v1/user/liked-posts`  
**Authentication**: JWT Required

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "liked_post_ids": [1, 5, 12, 42, 100]
  }
}
```

---

### User Endpoints

#### 14. Report a Post

Submit a report for inappropriate content.

**Endpoint**: `POST /api/v1/posts/{id}/report`  
**Authentication**: JWT Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Post ID to report |

**Request Body**:
```json
{
  "reason": "spam",
  "description": "This post is advertising external services"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| reason | string | Yes | Reason code: `spam`, `nsfw`, `offensive`, `off-topic`, `other` |
| description | string | No | Additional details |

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Report submitted successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid reason code
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Post does not exist

---

### Admin/Moderation Endpoints

> **Note**: These endpoints require Discord bot authentication via `X-Bot-Token` header.

#### 15. Publish Post

Approve and publish a post (bot-authenticated).

**Endpoint**: `POST /api/v1/admin/posts/{id}/publish`  
**Authentication**: Bot Token Required

**Headers**:
```
X-Bot-Token: <discord_bot_token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Post ID to publish |

**Request Body**:
```json
{
  "moderator_username": "ModeratorName#1234",
  "moderator_discord_id": "123456789012345678"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Post published successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid bot token
- `404 Not Found`: Post does not exist

---

#### 16. Reject Post

Reject a post submission (bot-authenticated).

**Endpoint**: `POST /api/v1/admin/posts/{id}/reject`  
**Authentication**: Bot Token Required

**Request Body**:
```json
{
  "moderator_username": "ModeratorName#1234",
  "moderator_discord_id": "123456789012345678",
  "reason": "Does not meet quality standards"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Post rejected successfully"
}
```

---

## Rate Limiting

> **Note**: Rate limiting is planned but not yet implemented.

Planned limits:
- Login: 10 requests/minute per IP
- Post creation: 5 posts/hour per user
- Reports: 10 reports/hour per user

---

## Pagination

Endpoints that return lists support pagination via query parameters:

- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

**Example**:
```
GET /api/v1/posts?limit=20&offset=40
```

This retrieves items 41-60 (page 3).

---

## Filtering and Search

### Tag Filtering
Use comma-separated tags in the `tags` query parameter:

```
GET /api/v1/posts/search?tags=light,sylvari,elegant
```

### Text Search
Use the `query` parameter to search in titles and descriptions:

```
GET /api/v1/posts/search?query=legendary
```

### Combined Filters
Combine multiple filters:

```
GET /api/v1/posts/search?query=armor&tags=heavy&author=PlayerName.1234
```

---

## Webhook Integration

The backend sends webhooks to Discord for moderation events. These are configured via environment variables:

- `DISCORD_WEBHOOK_URL`: Moderation channel webhook
- `DISCORD_PUBLIC_WEBHOOK_URL`: Public announcement webhook

---

## Best Practices

1. **Always validate JWT tokens** on protected endpoints
2. **Use HTTPS in production** to protect JWT tokens
3. **Handle errors gracefully** and check `success` field in responses
4. **Implement retry logic** for network failures
5. **Cache responses** where appropriate (e.g., popular posts)
6. **Respect rate limits** (when implemented)

---

## Changelog

### v0.2.0
- Added Discord moderation endpoints
- Added report submission
- Added like/unlike functionality
- Added search and filtering

### v0.1.0
- Initial API release
- Authentication with GW2 API keys
- Basic CRUD for posts
- Pagination support

---

**Last Updated**: December 2025  
**API Version**: v1
