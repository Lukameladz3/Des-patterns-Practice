# MySQL Database Setup Instructions

## Your Configuration ✅

Your `.env` file is correctly configured:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=adminPassword123
DB_NAME=test_automation
```

---

## Setup Steps

### Option 1: Using MySQL Workbench (Recommended)

1. **Open MySQL Workbench**
2. **Connect to your local MySQL server**

   - Host: localhost
   - Port: 3306
   - Username: root
   - Password: adminPassword123

3. **Run the setup script:**

   - Open `database/setup.sql` in MySQL Workbench
   - Click the lightning bolt icon (Execute) or press `Ctrl+Shift+Enter`
   - Verify you see "Database setup complete!" message

4. **Verify tables were created:**
   ```sql
   USE test_automation;
   SHOW TABLES;
   ```
   You should see: `users`, `products`, `test_data`

---

### Option 2: Using MySQL Command Line

If you have MySQL in your PATH:

```bash
# Navigate to project directory
cd "c:\Users\l.meladze\Desktop\Des patterns Practice"

# Run setup script
mysql -u root -p < database/setup.sql
# Enter password: adminPassword123
```

---

### Option 3: Manual Setup

If you prefer to run commands manually:

```sql
CREATE DATABASE IF NOT EXISTS test_automation;
USE test_automation;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10, 2),
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Verify Setup

After running the setup, verify everything is ready:

### 1. Check Database Exists

```sql
SHOW DATABASES LIKE 'test_automation';
```

### 2. Check Tables Exist

```sql
USE test_automation;
SHOW TABLES;
```

Expected output:

```
+---------------------------+
| Tables_in_test_automation |
+---------------------------+
| products                  |
| test_data                 |
| users                     |
+---------------------------+
```

### 3. Check Table Structures

```sql
DESCRIBE users;
DESCRIBE products;
DESCRIBE test_data;
```

---

## Run Your Tests

Once the database is set up, run your Playwright tests:

```bash
npm test
```

**Expected output:**

```
📦 DatabaseManager: Initializing MySQL singleton instance...
  ✓ MySQL pool created: localhost:3306/test_automation
✓ DatabaseManager: MySQL singleton instance created
  ✓ MySQL connection successful
  → Saved user to MySQL: user_xxx
  → Saved product to MySQL: Apple monitor 24
  → Retrieved user from MySQL: user_xxx
📊 MySQL DatabaseManager Statistics:
  → Users stored: 1
  → Products stored: 1
  → Test data entries: 2
```

---

## Troubleshooting

### Can't connect to MySQL

- Make sure MySQL server is running
- Check Windows Services for "MySQL80" or similar
- Verify credentials in `.env` file

### Tables not created

- Make sure you're connected to the right MySQL instance
- Check you have CREATE permissions
- Try running setup.sql again

### Tests still failing

- Verify `.env` file is in project root
- Check database name matches in `.env` and MySQL
- Look at the error message for specific issues

---

## Next Steps

1. ✅ Run `database/setup.sql` in MySQL Workbench
2. ✅ Verify tables exist with `SHOW TABLES;`
3. ✅ Run `npm test` to test the integration
4. ✅ Check MySQL to see data: `SELECT * FROM users;`

Let me know once you've run the setup script and I can help verify everything is working!
