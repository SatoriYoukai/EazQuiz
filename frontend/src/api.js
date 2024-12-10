export async function getTodayCards() {
  const res = await fetch('/api/today');
  return res.json();
}

export async function addCard(question, answer, nextReviewDate) {
  const res = await fetch('/api/cards', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({question, answer, nextReviewDate})
  });
  return res.json();
}

export async function updateCardNextReview(id, daysLater) {
  const res = await fetch(`/api/cards/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({daysLater})
  });
  return res.json();
}
