# API Overview

Base URL: `/api`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/verify-phone`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

## Catalog & commerce
- `GET /categories`
- `GET|POST|PUT|DELETE /products`
- `GET|POST /cart`, `POST /cart/items`
- `GET|POST /wishlist`
- `POST /orders/checkout`
- `POST /orders/:id/pay` (simulated payment)
- `GET /payments/methods`

## Services
- `GET /services/categories`, `GET /services/offerings`
- `POST /service-requests`, `GET /service-requests/mine`

## Admin
- `GET /admin/dashboard`
- `GET|POST|PUT /users`
- `GET|PUT /cms`
- `GET /reports/:type`, `GET /reports/:type/export`
- `GET /audit`
- `GET|POST /backups`, `POST /backups/:id/restore`

Payment, SMS, and email providers are **simulated** and persist `Notification` records.
