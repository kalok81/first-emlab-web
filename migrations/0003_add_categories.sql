CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert some initial categories if needed, but the user wants to manage them.
INSERT INTO categories (name, slug) VALUES ('Products', 'products'), ('Student Work', 'student'), ('Workshop', 'workshop'), ('Hero', 'hero');

-- We keep the works table as is for now, but we'll use the category string to match slugs in categories.
