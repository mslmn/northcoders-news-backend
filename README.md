# Northcoders News API

🚀 **Live URL:** [https://northcoders-news-gida.onrender.com/api](https://northcoders-news-gida.onrender.com/api)

A RESTful API for articles, users, topics, and comments.

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mslmn/northcoders-news-BE.git
cd northcoders-news-BE
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Set Up Environment Variables

This project uses PostgreSQL and requires environment variables to connect to the correct databases. These environment variable files are **ignored by Git**, so they must be created manually after cloning.

**Create two files in the root directory:**

```
.env.development
.env.test
```

**Inside `.env.development`, add:**

```
PGDATABASE=nc_news
```

**Inside `.env.test`, add:**

```
PGDATABASE=nc_news_test
```

✅ These environment variables tell the app which database to connect to for development and testing environments.

---

### 4. Run the App

To run the application in development:

```bash
npm run dev
```

---

### 5. Run Tests

To run the test suite:

```bash
npm test
```

---

### 6. Database Setup

Make sure your local PostgreSQL databases `nc_news` and `nc_news_test` exist and are seeded.

Run:

```bash
npm run seed
```

---

## Additional Notes

- `.env.*` files are **not tracked** by Git to protect sensitive information. Each developer must create their own `.env` files.

---

Happy coding! 🚀
