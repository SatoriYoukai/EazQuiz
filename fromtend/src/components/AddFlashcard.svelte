<script>
  import { addCard } from '../api.js';
  let question = '';
  let answer = '';
  let nextReviewDate = '';

  async function handleSubmit(e) {
    e.preventDefault();
    await addCard(question, answer, nextReviewDate);
    question = '';
    answer = '';
    nextReviewDate = '';
    alert('闪卡已添加！');
  }
</script>

<form on:submit={handleSubmit}>
  <label>题目: <input bind:value={question} required></label>
  <label>答案: <input bind:value={answer} required></label>
  <label>下次复习日期(可空): <input bind:value={nextReviewDate} type="date"></label>
  <button type="submit">添加闪卡</button>
</form>
