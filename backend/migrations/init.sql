CREATE TABLE IF NOT EXISTS flashcards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  nextReviewDate TEXT NOT NULL
);

-- nextReviewDate存储类似'2024-12-09'的ISO日期字符串
