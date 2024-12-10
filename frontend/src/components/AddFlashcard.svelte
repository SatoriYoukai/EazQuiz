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

<script>
  import { updateCardNextReview } from '../api.js';
  export let card; // {id, question, answer, nextReviewDate}
  let showAnswer = false;
  let customDays = '';

  async function setReview(days) {
    await updateCardNextReview(card.id, days);
    // 通知父组件刷新列表或跳转下一题
    // 可通过派发事件让父组件操作
    const event = new CustomEvent('updated', {detail: card.id});
    dispatchEvent(event);
  }

  function handleCustomDays() {
    const days = parseInt(customDays, 10);
    if(!isNaN(days) && days > 0) {
      setReview(days);
      customDays = '';
    }
  }
</script>

<div class="flashcard">
  <div>
    <div><strong>题目:</strong> {card.question}</div>
    {#if showAnswer}
      <div><strong>答案:</strong> {card.answer}</div>
    {/if}
  </div>

  {#if !showAnswer}
    <button on:click={() => showAnswer = true}>显示答案</button>
  {:else}
    <button on:click={() => setReview(1)}>明天(1天后)</button>
    <button on:click={() => setReview(3)}>3天后</button>
    <button on:click={() => setReview(7)}>7天后</button>
    <button on:click={() => setReview(30)}>30天后</button>

    <div>
      <input type="number" bind:value={customDays} placeholder="自定义天数">
      <button on:click={handleCustomDays}>确认</button>
    </div>
  {/if}
</div>
