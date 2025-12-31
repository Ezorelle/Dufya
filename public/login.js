const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const loginButton = loginForm.querySelector('button');
  loginButton.disabled = true; 

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      window.location.href = '/index.html'; 
    } else {
      alert(result.message); 
    }
  } catch (err) {
    console.error('Login failed', err);
    alert('An error occurred. Please try again.');
  } finally {
    loginButton.disabled = false; 
  }
});
