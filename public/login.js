async function loginUser(event) {
  event.preventDefault(); // Prevent default form submission

  const phone = document.getElementById('loginPhone').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!phone || !password) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Login successful!");
      window.location.href = "index.html"; // Redirect to dashboard or homepage
    } else {
      alert(result.message || "Login failed.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("An error occurred during login.");
  }
}

// Handle "Create Account" redirection
document.addEventListener("DOMContentLoaded", () => {
  const createAccountBtn = document.getElementById("createAccount");
  if (createAccountBtn) {
    createAccountBtn.addEventListener("click", () => {
      window.location.href = "Registration.html";
    });
  }
});
