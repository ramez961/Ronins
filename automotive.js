const form = document.querySelector('[name="automotive-sample"]');
const status = form.querySelector('.form-status');
const button = form.querySelector('button[type="submit"]');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (button.disabled) return;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.className = 'form-status full-width';
  status.textContent = 'Sending your sample request…';
  try {
    const response = await fetch('/.netlify/functions/submit-automotive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send your request. Please try again.');
    form.reset();
    status.className = 'form-status full-width success';
    status.textContent = 'Thank you. Your sample request has been sent. We’ll follow up by email.';
  } catch (error) {
    status.textContent = error.message || 'Unable to send your request. Please try again.';
  } finally {
    button.disabled = false;
    form.removeAttribute('aria-busy');
  }
});
