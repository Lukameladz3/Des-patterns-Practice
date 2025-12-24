# MySQL Integration Quick Start Guide

## Prerequisites

1. **MySQL Server** - Install MySQL 8.0+ on your machine
2. **Node.js** - Already installed (for Playwright)

---

## Step 1: Install MySQL (if not already installed)

### Windows

Download from: https://dev.mysql.com/downloads/mysql/

Or use Chocolatey:

```powershell
choco install mysql
```

### Verify Installation

```bash
mysql --version
```

---

## Step 2: Create Database

### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql

# Or copy-paste the SQL commands
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open `database/schema.sql`
4. Execute the script

---

## Step 3: Install Node.js Dependencies

```bash
npm install mysql2 dotenv
npm install --save-dev @types/node
```

---

## Step 4: Create Environment File

Create `.env` in project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=test_automation

# Database Mode (memory or mysql)
DB_MODE=mysql
```

**Important:** Add `.env` to `.gitignore`:

```
.env
```

---

## Step 5: Choose Implementation Approach

### Recommended: Hybrid Approach

This allows switching between in-memory (fast) and MySQL (persistent):

**Benefits:**

- Fast unit tests with `DB_MODE=memory`
- Integration tests with `DB_MODE=mysql`
- No code changes needed to switch modes

**Usage:**

```typescript
// Automatically uses mode from .env
const db = DatabaseManager.getInstance();
await db.saveUser(user); // Works with both modes
```

---

## Step 6: Test Database Connection

Create a simple test:

```typescript
test("Database connection", async () => {
  const db = DatabaseManager.getInstance();
  const isConnected = await db.testConnection();
  expect(isConnected).toBe(true);
});
```

---

## Step 7: Verify Data in MySQL

```bash
mysql -u root -p test_automation

# Check tables
SHOW TABLES;

# View data
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM test_data;
```

---

## Troubleshooting

### Connection Error: "Access denied"

- Check username/password in `.env`
- Verify MySQL user has permissions

### Connection Error: "Unknown database"

- Run `schema.sql` to create database
- Check `DB_NAME` in `.env`

### Tests are slow

- Use `DB_MODE=memory` for faster tests
- Use MySQL only for integration tests

---

## Next Steps

Would you like me to implement:

1. **Full MySQL Integration** - All data goes to MySQL
2. **Hybrid Approach** (Recommended) - Switch between memory/MySQL via env variable
3. **Just show example code** - You implement it yourself

Let me know which approach you prefer!
