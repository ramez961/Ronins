const form = document.querySelector('.project-form');
const status = document.querySelector('.form-status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = 'Sending your inquiry...';
  status.className = 'form-status full-width';

  try {
    const response = await fetch('/.netlify/functions/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send your inquiry.');
    form.reset();
    status.textContent = 'Thank you. Your inquiry has been sent.';
    status.className = 'form-status full-width success';
  } catch (error) {
    status.textContent = error.message;
  }
});
