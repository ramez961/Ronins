const form = document.querySelector('.project-form');
const status = document.querySelector('.form-status');
const requestedService = new URLSearchParams(window.location.search).get('service');
const serviceSelect = form.elements.namedItem('service');
const requestedIndustry = new URLSearchParams(window.location.search).get('industry');
const industrySelect = form.elements.namedItem('industry');
if ([...industrySelect.options].some(option => option.value === requestedIndustry)) {
  industrySelect.value = requestedIndustry;
}
if ([...serviceSelect.options].some(option => option.value === requestedService)) {
  serviceSelect.value = requestedService;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = 'Sending your inquiry...';
  status.className = 'form-status full-width';

  try {
    const response = await fetch('/.netlify/functions/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify((() => {
        const data = Object.fromEntries(new FormData(form));
        if (data.industry) data.message = 'Industry: ' + data.industry + '\n\n' + data.message;
        return data;
      })())
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
