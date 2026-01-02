async function registerUser(event) {
  event.preventDefault();

  const fullName = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const birthDate = document.getElementById('regBirthdate').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const gender = document.querySelector('input[name="gender"]:checked')?.nextElementSibling.innerText;
  const address = document.getElementById('regAddress').value.trim();
  const country = document.getElementById('regCountry').value;
  const city = document.getElementById('regCity').value.trim();

  // Required fields check
  if (!fullName || !email || !phone || !birthDate || !password || !confirmPassword) {
    alert("Please fill in all required fields.");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Password match check
  if (password !== confirmPassword) {
   alert("Passwords do not match.");
    return;
  }

 // Password strength check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
    return;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        birthDate,
        password,
        gender,
        address,
        country,
        city
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registration successful! Redirecting to login...");
      window.location.href = 'Login.html';
    } else {
      alert(result.message || "Registration failed.");
    }

  } catch (error) {
    alert("An error occurred. Please try again.");
    console.error("Registration error:", error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          window.location.href = '/Login.html';
        } else {
          alert('Logout failed.');
        }
      } catch (err) {
        alert('Error logging out: ' + err.message);
      }
    });
  }
});
