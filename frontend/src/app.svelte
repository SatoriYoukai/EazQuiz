<script>
  import { onMount } from 'svelte';
  import { getTodayCards } from './api.js';
  import Flashcard from './components/Flashcard.svelte';
  import AddFlashcard from './components/AddFlashcard.svelte';

  let cards = [];
  let currentIndex = 0;
  let currentCard = null;

  onMount(async () => {
    const data = await getTodayCards();
    cards = data;
    currentCard = cards[0] || null;
  });

  function handleCardUpdated() {
    // 切换到下一题
    currentIndex++;
    if(currentIndex < cards.length) {
      currentCard = cards[currentIndex];
    } else {
      currentCard = null;
      alert("今日复习完成！");
    }
  }
</script>

<main>
  <h1>今日需复习闪卡数：{cards.length - currentIndex}</h1>

  {#if currentCard}
    <Flashcard {currentCard} on:updated={handleCardUpdated}></Flashcard>
  {:else}
    <p>今日复习已全部完成！</p>
  {/if}

  <h2>添加新闪卡</h2>
  <AddFlashcard/>
</main>
