document.addEventListener("DOMContentLoaded", () => {

  /* ===== LOGIN ===== */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginButton = loginForm.querySelector("button");
      loginButton.disabled = true;

      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData);

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          credentials: "include", // important for sessions
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          window.location.href = "/index.html"; // redirect client-side
        } else {
          alert(result.message || "Invalid login details");
        }
      } catch (err) {
        console.error("Login failed", err);
        alert("An error occurred. Please try again.");
      } finally {
        loginButton.disabled = false;
      }
    });
  }

  /* ===== REGISTER ===== */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const registerButton = registerForm.querySelector("button");
      registerButton.disabled = true;

      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData);

      // Password match check
      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match");
        registerButton.disabled = false;
        return;
      }

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          window.location.href = "/Login.html";
        } else {
          alert(result.message || "Registration failed");
        }
      } catch (err) {
        console.error("Registration error", err);
        alert("An error occurred. Please try again.");
      } finally {
        registerButton.disabled = false;
      }
    });
  }

});
document.addEventListener("DOMContentLoaded", () => {
  
  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      logoutBtn.disabled = true;
      try {
        const res = await fetch("/api/logout", {
          method: "POST",
          credentials: "include", // important to send session cookie
        });
        const data = await res.json();

        if (res.ok && data.success) {
          window.location.href = "/Login.html"; // redirect to login
        } else {
          alert(data.message || "Logout failed");
        }
      } catch (err) {
        console.error("Logout error:", err);
        alert("An error occurred while logging out");
      } finally {
        logoutBtn.disabled = false;
      }
    });
  }

});
