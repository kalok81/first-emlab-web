-- Migration: CMS 3.0
-- Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT,
    duration TEXT,
    image_url TEXT,
    form_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial content if not exists
INSERT OR IGNORE INTO site_content (key, value) VALUES ('hero_title', 'Empowering Your Future with AI');
INSERT OR IGNORE INTO site_content (key, value) VALUES ('about_bio', 'We are a team of AI enthusiasts dedicated to providing the best learning experience.');
INSERT OR IGNORE INTO site_content (key, value) VALUES ('footer_text', '© 2024 EM Lab. All rights reserved.');
