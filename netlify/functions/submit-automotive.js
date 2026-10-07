const { handler: submitContact } = require('./submit-contact');
const json = (statusCode, error) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error }) });
const limits = { name:150, email:254, dealership:200, phone:50, dealerUrl:1000, vehicle:200, photoUrl:1000, service:100, inventory:100, message:4000 };
const services = ['Listing visuals', 'Social content', 'Campaign creative', 'Not sure yet'];
const inventories = ['', '1–10 vehicles', '11–30 vehicles', '31–100 vehicles', '100+ vehicles'];
const validUrl = value => { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };
exports.handler = async event => {
  if (event.httpMethod !== 'POST') return json(405, 'Method not allowed.');
  if ((event.body || '').length > 15000) return json(413, 'Your request is too large.');
  let data;
  try { data = JSON.parse(event.body || '{}'); } catch { return json(400, 'Invalid form submission.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data) || data.website) return json(400, 'Invalid form submission.');
  for (const [field, max] of Object.entries(limits)) {
    if (data[field] !== undefined && (typeof data[field] !== 'string' || data[field].length > max)) return json(400, 'Please check your form fields.');
  }
  if (['name','email','dealership','vehicle','photoUrl','service'].some(field => !data[field]?.trim())) return json(400, 'Please complete all required fields.');
  if (data.permission !== 'yes') return json(400, 'Please confirm you have permission to share the photos.');
  if (!validUrl(data.photoUrl) || (data.dealerUrl && !validUrl(data.dealerUrl))) return json(400, 'Please provide valid http or https links.');
  if (!services.includes(data.service) || !inventories.includes(data.inventory || '')) return json(400, 'Please choose a valid option.');
  // Reuse the existing storage and notification configuration without changing film inquiries.
  return submitContact({ ...event, body: JSON.stringify({
    name: data.name, email: data.email, company: data.dealership,
    projectType: 'Automotive — Free sample', service: data.service,
    message: [
      'RONINS AUTOMOTIVE / FREE SAMPLE REQUEST',
      'Vehicle: ' + data.vehicle.trim(),
      'Photos: ' + data.photoUrl.trim(),
      'Dealership website/social: ' + (data.dealerUrl?.trim() || 'Not provided'),
      'Phone: ' + (data.phone?.trim() || 'Not provided'),
      'Monthly inventory: ' + (data.inventory || 'Not provided'),
      'Photo permission and inquiry contact: confirmed',
      '', 'Visual direction / notes:', data.message?.trim() || 'Not provided'
    ].join('\n')
  }) });
};
