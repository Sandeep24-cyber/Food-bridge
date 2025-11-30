// ===== REGISTER =====
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Registration successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server error. Try again.");
      console.error(err);
    }
  });
}

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");

        // Save JWT & user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server error. Try again.");
      console.error(err);
    }
  });
}
localStorage.setItem("user", JSON.stringify({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role  // ⬅️ important
}));
// ===== PROFILE PAGE =====
document.addEventListener("DOMContentLoaded", async () => {
  const profileForm = document.getElementById("profileForm");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileRole = document.getElementById("profileRole");
  const profileImage = document.getElementById("profileImage");
  const changeImageBtn = document.getElementById("changeImageBtn");
  const imageUpload = document.getElementById("imageUpload");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !profileForm) return; // only run on profile page

  try {
    const res = await fetch(`/api/users/${user.id}`);
    const data = await res.json();

    if (res.ok) {
      // Fill UI with user data
      profileName.textContent = data.name;
      profileEmail.textContent = data.email;
      profileRole.textContent = data.role;

      document.getElementById("name").value = data.name;
      document.getElementById("email").value = data.email;
      document.getElementById("phone").value = data.phone || "";
      document.getElementById("address").value = data.address || "";

      profileImage.src = data.profileImage || "../img/default-avatar.png";
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    alert("⚠ Server error fetching profile");
  }

  // Handle image change
  changeImageBtn.addEventListener("click", () => {
    imageUpload.click();
  });

  imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        profileImage.src = reader.result; // show preview
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle form submit
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const profileImg = profileImage.src; // keep updated image

    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, phone, address, profileImage: profileImg })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile updated successfully!");

        // Update localStorage and UI
        user.phone = phone;
        user.address = address;
        user.profileImage = profileImg;
        localStorage.setItem("user", JSON.stringify(user));

        document.getElementById("phone").value = phone;
        document.getElementById("address").value = address;
        profileImage.src = profileImg;
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Update Profile Error:", err);
      alert("⚠ Server error. Try again.");
    }
  });
});
