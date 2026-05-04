(function () {

    function updateOpenStatus() {
        const statusEl = document.getElementById("open-status");
        if (!statusEl) return;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const openTime = 10 * 60;  // 10:00 AM
        const closeTime = 22 * 60; // 10:00 PM

        if (currentMinutes >= openTime && currentMinutes < closeTime) {
            statusEl.innerHTML = "🟢 Open Now";
            statusEl.style.color = "green";
        } else {
            statusEl.innerHTML = "🔴 Closed";
            statusEl.style.color = "red";
        }
    }

    const page = window.location.pathname.split('/').pop() || 'index.html';

    function active(p) {
        return page === p ? 'active' : '';
    }

    // Auth state (Auth is loaded before this file)
    const user      = (typeof Auth !== 'undefined') ? Auth.get() : null;
    const isAdmin   = !!(user && user.role === 'admin'    && user.loggedIn);
    const isCust    = !!(user && user.role === 'customer' && user.loggedIn);
    const isLogged  = isAdmin || isCust;

    // Right-side auth nav items
    let authNav = '';
    if (isAdmin) {
        authNav = `
        <li class="nav-item">
          <a class="nav-link btn-login-nav ${active('admin.html')}" href="admin.html">⚙️ Admin Panel</a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-logout" href="#" onclick="Auth.logout(); return false;">Logout</a>
        </li>`;
    } else if (isCust) {
        authNav = `
        <li class="nav-item">
          <span class="nav-link nav-user-name">👤 ${user.name}</span>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-logout" href="#" onclick="Auth.logout(); return false;">Logout</a>
        </li>`;
    } else {
        authNav = `
        <li class="nav-item">
          <a class="nav-link btn-login-nav ${active('login.html')}" href="login.html">Login / Join</a>
        </li>`;
    }

    // Cart & Order Now only for non-admin
    const shopNav = !isAdmin ? `
        <li class="nav-item">
          <a class="nav-link cart-link ${active('cart.html')}" href="cart.html">
            🛒 Cart <span id="cart-count" class="cart-badge">0</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link btn-order" href="https://wa.me/919372897262?text=Hello%20I%20want%20to%20order" target="_blank">
            Order Now
          </a>
        </li>` : '';

    const navbar = `
<nav class="navbar navbar-expand-lg" id="mainNav">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
      <img src="assets/images/logo.png" alt="" class="nav-logo" onerror="this.style.display='none'">
      <span class="brand-text">Deshi Zaiqa</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
      data-bs-target="#navbarMain" aria-controls="navbarMain"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarMain">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-1">
        <li class="nav-item"><a class="nav-link ${active('index.html')}" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link ${active('menu.html')}" href="menu.html">Menu</a></li>
        ${shopNav}
        <li class="nav-item"><a class="nav-link ${active('contact.html')}" href="contact.html">Contact</a></li>
        ${authNav}
      </ul>
    </div>
  </div>
</nav>`;

    const footer = `
<footer class="site-footer">
  <div class="container">
    <div class="row g-4">
      <div class="col-lg-4 col-md-6">
        <h4 class="footer-logo-text">🍽 Deshi Zaiqa</h4>
        <p class="footer-tagline">Apna Desi Adda — Fresh, Tasty &amp; Affordable Street Food in Nari Village, Nalanda, Bihar.</p>
        <div class="footer-social">
          <a href="https://wa.me/919372897262" class="social-btn whatsapp" target="_blank">💬 WhatsApp</a>
          <a href="tel:919372897262" class="social-btn call">📞 Call Us</a>
        </div>
      </div>
      <div class="col-lg-2 col-md-6">
        <h6 class="footer-heading">Quick Links</h6>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="menu.html">Menu</a></li>
          <li><a href="cart.html">Cart</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="feedback.html">Feedback</a></li>
        </ul>
      </div>
      <div class="col-lg-3 col-md-6">
        <h6 class="footer-heading">Contact</h6>
        <ul class="footer-info">
          <li>📍 Nari Village, Nalanda District, Bihar Sharif – 803114</li>
          <li>📞 <a href="tel:919372897262">+91 9372897262</a></li>
          <li>📧 deshizaiqa@gmail.com</li>
        </ul>
      </div>
      <div class="col-lg-3 col-md-6">
        <h6 class="footer-heading">Opening Hours</h6>
        <ul class="footer-info">
          <li>Monday – Sunday</li>
          <li class="hours-highlight">10:00 AM – 10:00 PM</li>
          <li id="open-status" class="open-status"></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 Deshi Zaiqa. Made with ❤️ in Bihar.</p>
    </div>
  </div>
</footer>
<a href="tel:919372897262" class="float-btn call-btn" title="Call Us">📞</a>
<a href="https://wa.me/919372897262" class="float-btn whatsapp-btn" target="_blank" title="WhatsApp">💬</a>`;

    const navEl = document.getElementById('navbar-placeholder');
    const footEl = document.getElementById('footer-placeholder');
    if (navEl) navEl.innerHTML = navbar;
    if (footEl) footEl.innerHTML = footer;
     // ✅ Call AFTER rendering
    updateOpenStatus();

    // 🔥 Auto update every minute
    setInterval(updateOpenStatus, 60000);
})();


