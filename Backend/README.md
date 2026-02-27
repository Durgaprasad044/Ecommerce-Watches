
---

# ✅ BACKEND README.md

```md
# 🔧 WatchVault Backend API

## 📌 Project Overview

WatchVault Backend is a RESTful API built to support a luxury watch e-commerce platform.

It handles:
- Authentication validation
- Product management
- Image uploads to Supabase
- Orders management
- Wishlist functionality
- Secure vendor routes

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Supabase (Database + Storage)
- JWT Authentication
- Firebase Admin (for token verification)
- Multer (for image upload)
- dotenv

---

## 📡 API Documentation

### 🔐 Auth
POST /api/v1/auth/firebase-login  
Exchange Firebase token for backend JWT.

---

### ⌚ Watches

GET /api/v1/watches  
Get all watches

GET /api/v1/watches/:id  
Get single watch

POST /api/v1/watches  
Add new watch (Vendor only)

PUT /api/v1/watches/:id  
Update watch (Vendor only)

DELETE /api/v1/watches/:id  
Delete watch (Vendor only)

---

### ❤️ Wishlist

GET /api/v1/wishlist  
Add item to wishlist

DELETE /api/v1/wishlist/:id  
Remove item

---

### 📦 Orders

GET /api/v1/orders  
Get vendor orders

POST /api/v1/orders  
Create new order

---

## 🗄 Database Schema Explanation

### Watches Table
- id (UUID)
- name (text)
- brand (text)
- price (numeric)
- description (text)
- image_url (text)
- vendor_id (UUID)
- created_at (timestamp)

### Orders Table
- id (UUID)
- customer_id (UUID)
- total_amount (numeric)
- status (text)
- created_at (timestamp)

### Wishlist Table
- id (UUID)
- user_id (UUID)
- watch_id (UUID)

---

## ⚙️ Installation Steps

```bash
git clone <backend-repo-link>
cd backend
npm install
npm run dev