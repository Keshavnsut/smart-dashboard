# API Documentation

Base URL: `/api`

Authentication: JWT via `httpOnly` cookie. Frontend requests should include credentials (for axios: `withCredentials: true`).

## Authentication Routes

| Method | Endpoint | Description | Access | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user (first user becomes Admin, subsequent users become Sales). | Public | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/auth/login` | Login and set `httpOnly` JWT cookie. | Public | `{ "email": "...", "password": "..." }` |
| `POST` | `/auth/logout` | Clear auth cookie (safe to call even if already logged out). | Public | None |
| `GET` | `/auth/me` | Get current authenticated user profile and role. | Private | None |

## Leads Routes

All lead routes require authentication.

| Method | Endpoint | Description | Access | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/leads` | Get paginated leads with filters and search. | Private | **Query:** `page` (required), `sort` (required: `latest` or `oldest`), `status` (optional), `source` (optional), `search` (optional) |
| `POST` | `/leads` | Create a new lead. | Private | `{ "name": "...", "email": "...", "status": "...", "source": "..." }` |
| `GET` | `/leads/:id` | Get details of one lead. | Private | None |
| `PATCH` | `/leads/:id` | Update a lead (Sales can only update leads they created). | Private | `{ "name"?: "...", "email"?: "...", "status"?: "...", "source"?: "..." }` |
| `DELETE` | `/leads/:id` | Delete a lead. | Admin | None |
| `GET` | `/leads/export/csv` | Export leads as CSV. | Admin | Same query params as `GET /leads` |

## Data Enums

When creating/updating leads, use:

- **Status:** `New`, `Contacted`, `Qualified`, `Lost`
- **Source:** `Website`, `Instagram`, `Referral`

## Standard API Responses

### Success (200 / 201)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 24,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error (400 / 401 / 403 / 404 / 500)

```json
{
  "success": false,
  "message": "Error description",
  "details": {}
}
```
