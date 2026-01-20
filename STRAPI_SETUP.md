# Strapi Setup Guide for Leftorium

If you are seeing **empty tables**, **missing products**, or **registration errors** (like "Forbidden"), follow these steps in your Strapi Admin Panel.

## 1. Fix Missing Products (Visibility)

**Problem:** You created products in Strapi, but the app shows "No products found" or console shows 403 Errors.

### A. Publish Your Content
By default, Strapi creates content in **Draft** mode. The API (by default) only returns **Published** content.
1. Go to **Content Manager** > **Leftorium Product**.
2. Click on a product to edit it.
3. Click the **Publish** button (top right).
4. Repeat for all products you want to see.

### B. Enable Public Read Permissions
If you want users to see products *without* logging in:
1. Go to **Settings** > **Users & Permissions Plugin** > **Roles**.
2. Click **Public**.
3. Scroll down to **Leftorium-product** (or `leftorium-product`).
4. Check **find** and **findOne**.
5. Click **Save** (top right).

### C. Enable Authenticated Read Permissions
If you want *logged-in* users to see products:
1. Go back to **Roles**.
2. Click **Authenticated**.
3. Scroll to **Leftorium-product**.
4. Check **find** and **findOne**.
5. Click **Save**.

---

## 2. Fix Empty User Profiles (Registration)

**Problem:** You register a user, they appear in the `User` table, but the `Leftorium User` table is empty.

**Reason:** The app tries to create a linked profile *immediately* after registration. If the "Authenticated" role doesn't have permission to *create* a `Leftorium User`, this step fails silently or throws a 403.

### Enable Create Permission for Authenticated Users
1. Go to **Settings** > **Users & Permissions Plugin** > **Roles**.
2. Click **Authenticated**.
3. Scroll to **Leftorium-user**.
4. Check **create**.
    - *Note: Also check `find`, `findOne`, and `update` if you want them to view/edit their own profile.*
5. Scroll to **Upload** (System).
    - Check **upload** (if you want them to upload avatars).
6. Click **Save**.

---

## 3. Verify Relations (For Developers)

Ensure your Content Types are correctly related:
- **Leftorium User** should have a relation to **User** (from `users-permissions`).
    - Field name: `user` (one-to-one or one-to-many depending on setup, usually one-to-one).
- **Leftorium Comment** should have a relation to **Leftorium User**.
    - Field name: `leftorium_user`.
