export async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {},
    credentials: 'include'
  };

  if (body) {
    if (body instanceof FormData) {
      // Pas de Content-Type ici, le navigateur s'en charge
      options.body = body;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`http://localhost:8080/api${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }

    return data;
  } catch (err) {
    console.error('apiRequest error:', err.message);
    throw err;
  }
}
