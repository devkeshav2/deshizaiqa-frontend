const Auth = (function () {
    const KEY = 'dz_auth';
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'DeshiZaiqa@2024';

    function get() {
        try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
    }

    function _save(data) {
        localStorage.setItem(KEY, JSON.stringify(data));
    }

    function isLoggedIn() {
        const u = get();
        return !!(u && u.loggedIn);
    }

    function isAdmin() {
        const u = get();
        return !!(u && u.role === 'admin' && u.loggedIn);
    }

    function isCustomer() {
        const u = get();
        return !!(u && u.role === 'customer' && u.loggedIn);
    }

    function loginAdmin(username, password) {
        if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
            _save({ role: 'admin', name: 'Admin', loggedIn: true });
            return true;
        }
        return false;
    }

    function loginCustomer(name, phone) {
        const data = { role: 'customer', name: name.trim(), phone: phone.trim(), loggedIn: true };
        _save(data);
        localStorage.setItem('userInfo', JSON.stringify({ name: name.trim(), phone: phone.trim() }));
    }

    function logout() {
        localStorage.removeItem(KEY);
        localStorage.removeItem('userInfo');
        window.location.href = 'login.html';
    }

    function requireAdmin() {
        if (!isAdmin()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    return { get, isLoggedIn, isAdmin, isCustomer, loginAdmin, loginCustomer, logout, requireAdmin };
})();
