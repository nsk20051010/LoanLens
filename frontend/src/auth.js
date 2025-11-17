// auth.js — handles simple login/register using localStorage

export function registerUser(username, password) {
  if (!username || !password) {
    return { success: false, message: "All fields are required" };
  }

  const existing = localStorage.getItem("user");
  if (existing) {
    return { success: false, message: "User already registered" };
  }

  const user = { username, password };
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("loggedIn", "true");

  return { success: true };
}

export function loginUser(username, password) {
  const saved = localStorage.getItem("user");
  if (!saved) {
    return { success: false, message: "No user registered" };
  }

  const user = JSON.parse(saved);
  if (user.username === username && user.password === password) {
    localStorage.setItem("loggedIn", "true");
    return { success: true };
  }

  return { success: false, message: "Invalid username or password" };
}

export function logoutUser() {
  localStorage.removeItem("loggedIn");
}

export function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}
