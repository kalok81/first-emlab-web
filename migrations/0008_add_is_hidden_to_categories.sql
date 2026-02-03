-- Migration to add is_hidden column to categories table
ALTER TABLE categories ADD COLUMN is_hidden BOOLEAN DEFAULT 0;
