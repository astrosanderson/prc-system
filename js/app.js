// Load Navbar
fetch("../components/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbarContainer").innerHTML = data;
    setupNavbar(); // after loading
  });

// Load Footer
fetch("../components/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footerContainer").innerHTML = data;
  });

  function setupNavbar() {
  const navLinks = document.getElementById("navLinks");

  // TEMP (later replace with Firebase user role)
  const userRole = localStorage.getItem("role"); // "admin" or "member"

  let links = document.getElementById("navLinks");

  if (userRole === "admin") {
    links = `
      <li class="nav-item"><a class="nav-link" href="admin-dashboard.html">Dashboard</a></li>
      <li class="nav-item"><a class="nav-link" href="player-registration.html">Add Player</a></li>
      <li class="nav-item"><a class="nav-link" href="academies.html">Academies</a></li>
      <li class="nav-item"><a class="nav-link" href="archives.html">Archives</a></li>
    `;
  } else {
    links = `
      <li class="nav-item"><a class="nav-link" href="member-dashboard.html">Dashboard</a></li>
      <li class="nav-item"><a class="nav-link" href="player-profile.html">Players</a></li>
      <li class="nav-item"><a class="nav-link" href="player-registration.html">Add Player</a></li>
    `;
  }
  }