const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 若未初始化表结构，可在此执行init.sql
const initSql = fs.readFileSync(path.join(__dirname, 'migrations/init.sql'), 'utf8');
db.exec(initSql, (err) => {
  if(err) console.error("Failed to initialize DB:", err);
});

// 获取今天日期字符串函数
function getTodayDateStr() {
  const d = new Date();
  return d.toISOString().split('T')[0]; // 只取YYYY-MM-DD
}

// 根据天数增加日期
function addDaysToDate(baseDateStr, days) {
  const baseDate = new Date(baseDateStr);
  baseDate.setDate(baseDate.getDate() + days);
  return baseDate.toISOString().split('T')[0];
}

// 获取今日需复习闪卡
app.get('/api/today', (req, res) => {
  const today = getTodayDateStr();
  db.all('SELECT * FROM flashcards WHERE nextReviewDate <= ?', [today], (err, rows) => {
    if (err) {
      return res.status(500).json({error: 'Database error'});
    }
    res.json(rows);
  });
});

// 添加新闪卡（默认nextReviewDate为今日或指定时间）
app.post('/api/cards', (req, res) => {
  const { question, answer, nextReviewDate } = req.body;
  const dateToUse = nextReviewDate || getTodayDateStr();
  db.run('INSERT INTO flashcards (question, answer, nextReviewDate) VALUES (?,?,?)',
  [question, answer, dateToUse], function(err) {
    if (err) return res.status(500).json({error: 'Failed to add card'});
    res.json({id: this.lastID, question, answer, nextReviewDate: dateToUse});
  });
});

// 更新闪卡下次复习日期，如指定天数后复习
app.put('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  const { daysLater } = req.body; // daysLater为数字，如1,3,7,30或自定义
  if (daysLater === undefined) return res.status(400).json({error: 'daysLater required'});

  const today = getTodayDateStr();
  const newDate = addDaysToDate(today, daysLater);

  db.run('UPDATE flashcards SET nextReviewDate=? WHERE id=?', [newDate, id], function(err) {
    if (err) return res.status(500).json({error: 'Failed to update card'});
    if (this.changes === 0) return res.status(404).json({error: 'Card not found'});
    res.json({id: Number(id), nextReviewDate: newDate});
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
