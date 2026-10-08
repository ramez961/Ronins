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

const recipient = 'ramezazar.raa@gmail.com';

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const body = [
    'RONINS / PROJECT INQUIRY',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || 'Not provided'}`,
    `Industry: ${data.industry || 'Not provided'}`,
    `Project type: ${data.projectType}`,
    `Service: ${data.service}`,
    '',
    'Project details:',
    data.message
  ].join(String.fromCharCode(10));
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent('Ronins project inquiry')}&body=${encodeURIComponent(body)}`;

  if (mailto.length > 6000) {
    status.textContent = 'Please shorten the project details and try again. Email drafts have a size limit.';
    return;
  }

  status.textContent = 'Opening your email app with a draft. Review it and press Send to submit your inquiry.';
  window.location.href = mailto;
});
