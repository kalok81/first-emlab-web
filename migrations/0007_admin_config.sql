CREATE TABLE IF NOT EXISTS admin_config (
    key TEXT PRIMARY KEY,
    value TEXT
);
INSERT OR IGNORE INTO admin_config (key, value) VALUES ('password', 'admin');
