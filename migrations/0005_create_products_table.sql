CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  price TEXT,
  description TEXT,
  image_url TEXT,
  buy_link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (title, price, description, image_url, buy_link) VALUES 
('刺繡材料包 - 森林系列 #01', 'HK$ 280', '包含完整針法說明與高品質繡線', '/images/works/products/01.jpg', 'https://example.com/buy/1'),
('臘腸狗刺繡材料包', 'HK$ 180', '適合新手的可愛動物扣針系列', '/images/works/products/02.jpg', 'https://example.com/buy/2'),
('Fing尾貓刺繡材料包', 'HK$ 180', '動態感十足的貓咪刺繡設計', '/images/works/products/03.jpg', 'https://example.com/buy/3'),
('煎餃刺繡材料包', 'HK$ 150', '趣味十足的微型刺繡小物', '/images/works/products/04.jpg', 'https://example.com/buy/4'),
('狐狸刺繡材料包', 'HK$ 180', '精緻的層次感針法練習', '/images/works/products/05.jpg', 'https://example.com/buy/5');
