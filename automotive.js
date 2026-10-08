const form = document.querySelector('[name="automotive-sample"]');
const status = form.querySelector('.form-status');
const recipient = 'ramezazar.raa@gmail.com';

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const body = [
    'RONINS AUTOMOTIVE / FREE SAMPLE REQUEST',
    '',
    `Name: ${data.name}`,
    `Work email: ${data.email}`,
    `Dealership: ${data.dealership}`,
    `Phone: ${data.phone || 'Not provided'}`,
    `Dealership website/social: ${data.dealerUrl || 'Not provided'}`,
    `Vehicle: ${data.vehicle}`,
    `Vehicle photos: ${data.photoUrl}`,
    `Requested service: ${data.service}`,
    `Monthly inventory: ${data.inventory || 'Not provided'}`,
    `Photo permission confirmed: ${data.permission === 'yes' ? 'Yes' : 'No'}`,
    '',
    'Visual direction / notes:',
    data.message || 'Not provided'
  ].join(String.fromCharCode(10));
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent('Ronins automotive sample request')}&body=${encodeURIComponent(body)}`;

  if (mailto.length > 6000) {
    status.textContent = 'Please shorten the notes or photo links and try again. Email drafts have a size limit.';
    return;
  }

  status.textContent = 'Opening your email app with a draft. Review it and press Send to submit your request.';
  window.location.href = mailto;
});
