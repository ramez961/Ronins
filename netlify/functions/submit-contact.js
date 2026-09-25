const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid form submission.' });
  }

  if (data.website) return json(400, { error: 'Invalid form submission.' });
  const required = ['name', 'email', 'projectType', 'service', 'message'];
  if (required.some((field) => typeof data[field] !== 'string' || !data[field].trim())) {
    return json(400, { error: 'Please complete all required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return json(400, { error: 'Please enter a valid email address.' });
  }

  const submission = {
    name: data.name.trim(),
    email: data.email.trim(),
    company: (data.company || '').trim(),
    project_type: data.projectType.trim(),
    service: data.service.trim(),
    message: data.message.trim()
  };
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || 'ramezazar.raa@gmail.com';
  if (!supabaseUrl || !supabaseKey || !resendKey) {
    return json(500, { error: 'The contact form is not configured yet.' });
  }

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/project_inquiries`, {
    method: 'POST',
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(submission)
  });
  if (!insertResponse.ok) return json(502, { error: 'We could not save your inquiry. Please try again.' });

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Ronins <onboarding@resend.dev>',
      to: [contactEmail],
      subject: `New Ronins inquiry from ${submission.name}`,
      reply_to: submission.email,
      text: `Name: ${submission.name}\nEmail: ${submission.email}\nCompany: ${submission.company || 'Not provided'}\nProject type: ${submission.project_type}\nService: ${submission.service}\n\n${submission.message}`
    })
  });
  if (!emailResponse.ok) return json(502, { error: 'Your inquiry was saved, but the email notification failed.' });
  return json(200, { ok: true });
};
