/* =========================================================
   ECA Admin - Sign in page

   DEMO MODE: there is no real account check yet. This file only
   validates the form and then opens the dashboard. Real sign-in
   will be done with Supabase Auth in a later step (see signIn()).
   Never put real passwords or an "admin password" in JavaScript:
   anyone can read front-end code in the browser.
   ========================================================= */

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const loginButton = document.getElementById("loginButton");
const loginError = document.getElementById("loginError");
const loginErrorText = document.getElementById("loginErrorText");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/* ---------- Show / hide password ---------- */
passwordToggle.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  passwordToggle.textContent = isHidden ? "Hide" : "Show";
  passwordToggle.setAttribute("aria-pressed", String(isHidden));
  passwordInput.focus();
});

/* ---------- Validation helpers ---------- */
function setFieldError(input, hasError) {
  const field = input.closest(".field");
  field.classList.toggle("field--error", hasError);
  input.setAttribute("aria-invalid", String(hasError));
}

function validateForm() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const emailOk = EMAIL_PATTERN.test(email);
  const passwordOk = password.length > 0;

  setFieldError(emailInput, !emailOk);
  setFieldError(passwordInput, !passwordOk);

  // Put the cursor on the first field that needs fixing
  if (!emailOk) emailInput.focus();
  else if (!passwordOk) passwordInput.focus();

  return emailOk && passwordOk;
}

// Clear a field's error as soon as the user starts fixing it
[emailInput, passwordInput].forEach((input) => {
  input.addEventListener("input", () => {
    setFieldError(input, false);
    loginError.hidden = true;
  });
});

/* ---------- Sign in ---------- */
// Replace the body of this function with Supabase Auth later, e.g.
// supabase.auth.signInWithPassword({ email, password })
async function signIn(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 600)); // pretend network delay

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, message: "Wrong email or password. Please try again." };
  }
  return { ok: true };
}

function setLoading(isLoading) {
  loginButton.disabled = isLoading;
  loginButton.textContent = isLoading ? "Signing in…" : "Sign in";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.hidden = true;

  if (!validateForm()) return;

  setLoading(true);
  try {
    const result = await signIn(emailInput.value.trim(), passwordInput.value);

    if (!result.ok) {
      loginErrorText.textContent = result.message;
      loginError.hidden = false;
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    // Demo only: remember that someone "signed in" so later pages can check it
    try { sessionStorage.setItem("ecaAdminDemo", emailInput.value.trim()); } catch (err) { /* storage blocked */ }
    window.location.href = "dashboard.html";
  } catch (err) {
    loginErrorText.textContent = "Couldn't sign in. Please check your internet connection and try again.";
    loginError.hidden = false;
  } finally {
    setLoading(false);
  }
});

/* ---------- Forgot password ---------- */
document.getElementById("forgotLink").addEventListener("click", (event) => {
  event.preventDefault();
  loginErrorText.textContent = "Password reset is not available yet. Please contact the website administrator.";
  loginError.hidden = false;
});
