async function loginUser(event) {
  event.preventDefault();

  const phone = document.getElementById('loginPhone').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ phone, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      window.location.href = '/index.html'; // <- redirect here manually
    } else {
      alert(data.message || 'Login failed.');
    }
  } catch (err) {
    alert('Login error: ' + err.message);
  }
}
