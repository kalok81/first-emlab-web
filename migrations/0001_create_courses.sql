CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  level TEXT,
  duration TEXT,
  price TEXT,
  description TEXT,
  image_url TEXT
);

INSERT INTO courses (title, level, duration, price, description, image_url) VALUES 
('基礎刺繡入門課', 'Level 1', '3小時', 'HK$480', '適合完全零基礎，學習8種基礎針法，完成一個精美杯墊。', 'https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=800'),
('寵物半身像工作坊', 'Level 2', '兩堂 (每堂3小時)', 'HK$1,200', '學習立體刺繡技巧，刻畫毛孩的神韻。', 'https://images.unsplash.com/photo-1621508651038-f14f923b3614?auto=format&fit=crop&q=80&w=800');
