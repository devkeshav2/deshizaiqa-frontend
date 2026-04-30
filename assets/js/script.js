let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount(){
$("#cart-count").text(cart.length);
}

function renderMenu(data = menu){

    let html = "";

    data.forEach(item => {

        html += `
        <div class="col-md-4 mb-4">
            <div class="card menu-card p-3 text-center">

                <img src="assets/images/${item.id}.jpg"
                     class="menu-img mb-2"
                     alt="${item.name} at Deshizaiqa Food Court in Nari Village Nalanda Bihar">

                <div class="veg-indicator ${item.type === 'veg' ? 'veg' : 'nonveg'}"></div>

                <h5>${item.name}</h5>

                <p class="text-muted">₹${item.price}</p>

                <div class="d-flex gap-2">
                    <button class="btn btn-warning w-50" onclick="addToCart(${item.id})">
                        Add
                    </button>

                    <button class="btn btn-outline-dark w-50" onclick="viewDetails(${item.id})">
                        Details
                    </button>
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
        cart.push({
            ...item,
            qty: 1   // ✅ THIS WAS MISSING
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function addToCartFromApi(id, name, price, type){

    let exist = cart.find(x => x.id == id);

    if(exist){
        exist.qty += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            type,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
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

        let qty = item.qty || 1;   // ✅ safe fallback
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
    $("#grand-total").text("Grand Total: ₹" + total);
}
function changeQty(id, delta){
    let item = cart.find(x => x.id == id);

    if(!item) return;

    item.qty = (item.qty || 1) + delta;

    // prevent qty going below 1
    if(item.qty <= 0){
        cart = cart.filter(x => x.id != id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();        // 🔥 re-render cart
    updateCartCount(); // 🔥 update badge
}
function removeItem(id){
cart = cart.filter(x=>x.id != id);
localStorage.setItem("cart", JSON.stringify(cart));
loadCart();
updateCartCount();
}

function clearCart(){
cart = [];
localStorage.setItem("cart", JSON.stringify(cart));
loadCart();
updateCartCount();
}

function placeOrder(){

if(cart.length === 0){
alert("Cart is empty!");
return;
}

let msg = "Deshizaiqa Order:%0A";

cart.forEach(item=>{
msg += `${item.name} x${item.qty} = ₹${item.price * item.qty}%0A`;
});

let total = cart.reduce((sum,i)=>sum+(i.price*i.qty),0);
msg += `Total: ₹${total}`;

window.open(`https://wa.me/919372897262?text=${msg}`);
}

$("#filter").change(function(){

    let val = $(this).val();
    let result = [...menu];

    if(val === "veg"){
        result = result.filter(x => x.type === "veg");
    }
    else if(val === "nonveg"){
        result = result.filter(x => x.type === "nonveg");
    }
    else if(val === "low"){
        result.sort((a,b) => a.price - b.price);
    }
    else if(val === "high"){
        result.sort((a,b) => b.price - a.price);
    }
    else if(val === "special"){
        result = result.filter(x => x.tag === "special");
    }

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
            <div class="row align-items-center">

                <div class="col-md-5 text-center">
                    <img src="assets/images/${item.id}.jpg" 
                         class="img-fluid rounded shadow"
                         style="max-height:300px;object-fit:cover;">
                </div>

                <div class="col-md-7">

                    <div class="position-relative">

                        <div class="veg-indicator ${item.type === 'veg' ? 'veg' : 'nonveg'}"></div>

                        <h2>${item.name}</h2>

                        <h4 class="text-muted">₹${item.price}</h4>

                        <p class="mt-3">
                            Freshly prepared ${item.name} with authentic taste.
                        </p>

                        <button class="btn btn-warning mt-3" onclick="addToCartFromApi(${item.id}, '${item.name}', ${item.price}, '${item.type}')">
                            Add to Cart
                        </button>

                    </div>

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

$(document).ready(function(){
updateCartCount();

if($("#menu-list").length){
fetch("https://deshizaiqa-backend.onrender.com/api/products")
  .then(res => res.json())
  .then(data => {
      menu = data;           // 🔥 store globally (important for cart)
      renderMenu(menu);      // 🔥 render dynamic menu
  })
  .catch(err => console.error(err));
}

if($("#cart-items").length){
loadCart();
}
});