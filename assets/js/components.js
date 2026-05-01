(function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    function active(p) {
        return page === p ? 'active' : '';
    }

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
        <li class="nav-item">
          <a class="nav-link cart-link ${active('cart.html')}" href="cart.html">
            🛒 Cart <span id="cart-count" class="cart-badge">0</span>
          </a>
        </li>
        <li class="nav-item"><a class="nav-link ${active('contact.html')}" href="contact.html">Contact</a></li>
        <li class="nav-item">
          <a class="nav-link btn-order" href="https://wa.me/919372897262?text=Hello%20I%20want%20to%20order" target="_blank">
            Order Now
          </a>
        </li>
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
          <li class="open-status">🟢 Open Now</li>
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
})();
