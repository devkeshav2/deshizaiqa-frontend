function generateOrderId(){
    const now = new Date();
    const datePart =
        String(now.getDate()).padStart(2,'0') +
        String(now.getMonth()+1).padStart(2,'0') +
        String(now.getFullYear()).slice(-2);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `DZ-${datePart}-${randomPart}`;
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let menu = [];

function updateCartCount(){
    $("#cart-count").text(cart.length);
}

function renderMenu(data = menu){
    let html = "";
    data.forEach(item => {
        html += `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="card menu-card">
                <div class="menu-img-wrap">
                    <img src="assets/images/${item.itemImage}.jpg"
                         class="menu-img"
                         alt="${item.name} at Deshizaiqa Food Court in Nari Village Nalanda Bihar">
                    <div class="veg-indicator ${item.type === 'veg' ? 'veg' : 'nonveg'}"></div>
                </div>
                <div class="menu-card-body">
                    <div class="menu-card-name">${item.name}</div>
                    <div class="menu-card-price">₹${item.price}</div>
                    <div class="menu-card-actions">
                        <button class="btn-add" onclick="addToCart(${item.id})">Add to Cart</button>
                        <button class="btn-details" onclick="viewDetails(${item.id})">Details</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    $("#menu-list").html(html);
}

function viewDetails(id){
    window.location.href = "product.html?id=" + id;
}

function addToCart(id){
    let item = menu.find(x => x.id == id);
    let exist = cart.find(x => x.id == id);
    if(exist){
        exist.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${item.name} added 🛒`,
        showConfirmButton: false,
        timer: 1200
    });
}

function addToCartFromApi(id, name, price, type){
    let exist = cart.find(x => x.id == id);
    if(exist){
        exist.qty += 1;
    } else {
        cart.push({ id, name, price, type, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${name} added 🛒`,
        showConfirmButton: false,
        timer: 1200
    });
}

function loadCart(){
    let html = "";
    let total = 0;

    if(cart.length === 0){
        $("#empty-cart").removeClass("d-none");
        $("#cart-table").hide();
        return;
    }

    $("#empty-cart").addClass("d-none");
    $("#cart-table").show();

    cart.forEach(item => {
        let qty = item.qty || 1;
        let sub = item.price * qty;
        total += sub;
        html += `
        <tr>
            <td>${item.name}</td>
            <td>
                <button onclick="changeQty(${item.id},-1)">-</button>
                ${qty}
                <button onclick="changeQty(${item.id},1)">+</button>
            </td>
            <td>₹${item.price}</td>
            <td>₹${sub}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">X</button>
            </td>
        </tr>`;
    });

    $("#cart-items").html(html);
    $("#grand-total-amount").text("₹" + total);
    $("#cart-summary-bar").show();
}

function changeQty(id, delta){
    let item = cart.find(x => x.id == id);
    if(!item) return;
    item.qty = (item.qty || 1) + delta;
    if(item.qty <= 0){
        cart = cart.filter(x => x.id != id);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function removeItem(id){
    cart = cart.filter(x=>x.id != id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
    Swal.fire({ icon: 'warning', title: 'Item removed', showConfirmButton: false, timer: 1000 });
}

function clearCart(){
    $("#grand-total-amount").text("₹0");
    $("#cart-summary-bar").hide();
    if(cart.length === 0){
        Swal.fire({ icon: 'info', title: 'Cart already empty', timer: 1000, showConfirmButton: false });
        return;
    }
    Swal.fire({
        title: 'Clear cart?',
        text: "All items will be removed",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, clear it',
        confirmButtonColor: '#ff5722'
    }).then((result) => {
        if(result.isConfirmed){
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
            updateCartCount();
            Swal.fire({ icon: 'success', title: 'Cart cleared', timer: 1000, showConfirmButton: false });
        }
    });
}

function placeOrder(){
    if(cart.length === 0){
        Swal.fire({ icon: 'error', title: 'Cart is empty!', text: 'Please add items first' });
        return;
    }

    // Pre-fill from auth if customer is logged in
    const authUser = (typeof Auth !== 'undefined') ? Auth.get() : null;
    const prefillName  = (authUser && authUser.role === 'customer') ? authUser.name  : '';
    const prefillPhone = (authUser && authUser.role === 'customer') ? authUser.phone : '';

    let msg = "Deshizaiqa Order:%0A";
    cart.forEach(item => {
        msg += `${item.name} x${item.qty} = ₹${item.price * item.qty}%0A`;
    });
    let total = cart.reduce((sum,i) => sum+(i.price*i.qty), 0);
    msg += `Total: ₹${total}%0A%0A`;

    Swal.fire({
        title: 'Enter Delivery Details',
        html: `
            <input id="custName"    class="swal2-input"    placeholder="Your Name"    value="${prefillName}">
            <input id="custPhone"   class="swal2-input"    placeholder="Phone Number" value="${prefillPhone}">
            <textarea id="custAddress" class="swal2-textarea" placeholder="Full Address"></textarea>
        `,
        confirmButtonText: 'Proceed to WhatsApp',
        confirmButtonColor: '#ff5722',
        focusConfirm: false,
        preConfirm: () => {
            const name    = document.getElementById('custName').value.trim();
            const phone   = document.getElementById('custPhone').value.trim();
            const address = document.getElementById('custAddress').value.trim();
            if(!name || !phone || !address){
                Swal.showValidationMessage('Please fill all details');
                return false;
            }
            return { name, phone, address };
        }
    }).then((result) => {
        if(result.isConfirmed){
            let user = result.value;
            let orderId = generateOrderId();
            let finalMsg =
                `Order ID: ${orderId}%0A%0A` + msg +
                `Name: ${user.name}%0A` +
                `Phone: ${user.phone}%0A` +
                `Address: ${user.address}`;

            window.open(`https://wa.me/919372897262?text=${finalMsg}`);

            Swal.fire({
                icon: 'success',
                title: 'Order Sent 🎉',
                html: `<b>Order ID:</b> ${orderId}<br>Save this for reference`,
                confirmButtonColor: '#ff5722'
            }).then(() => {
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                $("#grand-total-amount").text("₹0");
                $("#cart-summary-bar").hide();
                loadCart();
                updateCartCount();
            });
        }
    });
}

$("#filter").change(function(){
    let val = $(this).val();
    let result = [...menu];
    if(val === "veg")         result = result.filter(x => x.type === "veg");
    else if(val === "nonveg") result = result.filter(x => x.type === "nonveg");
    else if(val === "low")    result.sort((a,b) => a.price - b.price);
    else if(val === "high")   result.sort((a,b) => b.price - a.price);
    else if(val === "special")result = result.filter(x => x.tag === "special");
    renderMenu(result);
});

function loadProduct(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if(!id){
        $("#product-details").html("<h3>Invalid product</h3>");
        return;
    }

    fetch(`https://deshizaiqa-backend.onrender.com/api/products/${id}`)
        .then(res => res.json())
        .then(item => {
            if(!item || !item.id){
                $("#product-details").html("<h3>Product not found</h3>");
                return;
            }
            let html = `
            <div class="row align-items-center g-4">
                <div class="col-md-5 text-center">
                    <img src="assets/images/${item.itemImage}.jpg"
                         alt="${item.name}"
                         style="border-radius:16px;width:100%;max-height:400px;object-fit:cover;box-shadow:0 10px 32px rgba(0,0,0,.12);">
                </div>
                <div class="col-md-7">
                    <div class="position-relative d-inline-block mb-2">
                        <span class="veg-indicator ${item.type === 'veg' ? 'veg' : 'nonveg'}" style="position:static;display:inline-flex;margin-right:8px;vertical-align:middle;"></span>
                        <small style="font-size:.78rem;font-weight:600;color:${item.type === 'veg' ? '#2e7d32' : '#c62828'};text-transform:uppercase;letter-spacing:1px;">${item.type === 'veg' ? 'Veg' : 'Non-Veg'}</small>
                    </div>
                    <h2 style="font-family:'Playfair Display',serif;font-weight:700;">${item.name}</h2>
                    <div class="product-price">₹${item.price}</div>
                    <p style="color:#666;line-height:1.7;margin-bottom:24px;">
                        Freshly prepared ${item.name} with authentic desi taste. Made with quality ingredients — served hot every time.
                    </p>
                    <button class="btn btn-warning px-4" onclick="addToCartFromApi(${item.id}, '${item.name}', ${item.price}, '${item.type}')">
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
            `;
            $("#product-details").html(html);
        })
        .catch(err => {
            console.error(err);
            $("#product-details").html("<h3>Error loading product</h3>");
        });
}

function submitFeedback(){
    // Use auth data if logged in, else read from optional form fields
    let username = '';
    let userphone = '';

    if(typeof Auth !== 'undefined' && Auth.isCustomer()){
        const u = Auth.get();
        username  = u.name  || '';
        userphone = u.phone || '';
    } else {
        try {
            const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
            username  = stored.name  || '';
            userphone = stored.phone || '';
        } catch {}
    }

    // Allow override from optional form fields
    const fbNameEl  = document.getElementById("fbName");
    const fbPhoneEl = document.getElementById("fbPhone");
    if(fbNameEl  && fbNameEl.value.trim())  username  = fbNameEl.value.trim();
    if(fbPhoneEl && fbPhoneEl.value.trim()) userphone = fbPhoneEl.value.trim();

    let rating     = document.getElementById("rating").value;
    let improve    = document.getElementById("improve").value;
    let suggestion = document.getElementById("suggestion").value;

    if(!suggestion){
        Swal.fire({ icon: 'warning', title: 'Please share your feedback 🙂' });
        return;
    }

    fetch("https://deshizaiqa-backend.onrender.com/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, improve, suggestion, username, userphone })
    })
    .then(res => res.json())
    .then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Thanks for your feedback ❤️',
            text: 'We will improve based on your input',
            confirmButtonColor: '#ff5722'
        });
        document.getElementById("rating").value = "";
        document.getElementById("improve").value = "";
        document.getElementById("suggestion").value = "";
    })
    .catch(() => {
        Swal.fire({ icon: 'error', title: 'Something went wrong', text: 'Please try again later' });
    });
}

$(document).ready(function(){
    updateCartCount();

    if($("#menu-list").length){
        fetch("https://deshizaiqa-backend.onrender.com/api/products")
            .then(res => res.json())
            .then(data => {
                // Filter out disabled products for customers
                menu = data.filter(item => item.enabled !== false);
                renderMenu(menu);
            })
            .catch(err => console.error(err));
    }

    if($("#cart-items").length){
        loadCart();
    }

    const feedbackTypeEl = document.getElementById("feedbackType");
    if(feedbackTypeEl) feedbackTypeEl.addEventListener("change", function(){
        let type = this.value;
        let improve = document.getElementById("improve");
        if(type === "food"){
            improve.innerHTML = `
                <option value="">Skip</option>
                <option>Taste</option>
                <option>Quantity</option>
                <option>Freshness</option>
            `;
        } else if(type === "service"){
            improve.innerHTML = `
                <option value="">Skip</option>
                <option>Delivery Time</option>
                <option>Behavior</option>
                <option>Packaging</option>
            `;
        } else {
            improve.innerHTML = `
                <option value="">Skip</option>
                <option>App Experience</option>
                <option>Price</option>
                <option>Menu Variety</option>
            `;
        }
    });

    // Auto-fill feedback form if logged-in customer
    if(typeof Auth !== 'undefined' && Auth.isCustomer()){
        const u = Auth.get();
        const fbNameEl  = document.getElementById("fbName");
        const fbPhoneEl = document.getElementById("fbPhone");
        if(fbNameEl)  { fbNameEl.value  = u.name;  fbNameEl.setAttribute('readonly', true); }
        if(fbPhoneEl) { fbPhoneEl.value = u.phone; fbPhoneEl.setAttribute('readonly', true); }
    }
});
