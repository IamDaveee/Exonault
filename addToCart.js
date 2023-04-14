if (document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
} else{
    ready()
}



function ready() {
    var removeCartItemButtons = document.getElementsByClassName("btn-danger")
    for (var i = 0; i < removeCartItemButtons.length; i++){
        var button = removeCartItemButtons[i]
        button.addEventListener("click", removeCartItem)
            
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity-input")
    for (var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i]
        input.addEventListener("change", quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName("shop-item-button")
    for (var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i];
        button.addEventListener("click", addToCartClicked)
    }

    document.getElementsByClassName("btn-purchase")[0].addEventListener("click", purchaseClicked)
}

function purchaseClicked(){

    const stripe = Stripe('pk_test_51MYCEYLmmPzbtI7RnmJAbJj1zxOcnybtusrLuPUd8NuhDA1agONGJrGuJYR1qPG1ManObVfyhVmlyIooAs6gby4j005h9sLd0m');

    const button = document.getElementById("purchase");
    button.addEventListener("click", () => {
        
        var cartItemContainer = document.getElementsByClassName("cart-items")[0];
        var cartRows = cartItemContainer.getElementsByClassName("cart-row");
        for (var a = 0; a < cartRows.length; a++) {
            var cartRow = cartRows[a];
            var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
            var quantity = quantityElement.value;

            if (a === 0) {
                var quantity1 = quantity;
            }

            if (a === 1) {
                var quantity2 = quantity;
            }
        }


        for (var b = 0; b < cartRows.length; b++) {
            var cartRow = cartRows[b];
            var titleFinder = cartRow.getElementsByClassName("cart-item-title")[0];
            var title = titleFinder.innerText;

            if (b === 0)  {
                if (title===("V1 Preset")) {
                    var id1=1;
                }
                else if (title===("V2 Preset")) {
                    var id1=2;
                }
            }
            if (b === 1) {
                if (title===("V1 Preset")) {
                    var id2=1;
                }
                else if (title===("V2 Preset")) {
                    var id2=2;
                }
            }
        }
        var cartRowsLength=cartRows.length
        if (cartRowsLength===1){
            fetch("https://iamdaveee.github.io/server/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${stripe.apiKey}`,
                },
                body: JSON.stringify({
                    items: [
                        { id: id1, quantity: quantity1 },
                    ],
                }),
            })
                .then(res => {
                    if (res.ok) return res.json()
                    return res.json().then(json => Promise.reject(json))
                })
                .then(({ url }) => {
                    console.log("Redirecting to Stripe checkout:", url);
                    window.location = url;
                })
            
                .catch(e => {
                console.error(e.error)
                alert("An error occurred while processing your request. Please try again later.");
                })
        }
        if (cartRowsLength===2){
            fetch("https://iamdaveee.github.io/server/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${stripe.apiKey}`,
                },
                body: JSON.stringify({
                    items: [
                        { id: id1, quantity: quantity1 },
                        { id: id2, quantity: quantity2 },
                    ],
                }),
            })
                .then(res => {
                    if (res.ok) return res.json()
                    return res.json().then(json => Promise.reject(json))
                })
                .then(({ url }) => {
                    console.log("Redirecting to Stripe checkout:", url);
                    window.location = url;
                })
            
                .catch(e => {
                console.error(e.error)
                alert("An error occurred while processing your request. Please try again later.");
                })
        }
    });

}

function removeCartItem(event){
    var buttonClicked = event.target
            buttonClicked.parentElement.parentElement.remove()
            updateCartTotal()
}

function quantityChanged(event){
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event){
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var textContainer = shopItem.getElementsByClassName("pv-right")[0]
    var p1 = textContainer.getElementsByClassName("p1")[0]
    var title = p1.getElementsByClassName("v-title")[0].innerText
    var price = p1.getElementsByClassName("shop-item-price")[0].innerText
    var imageScr = shopItem.getElementsByClassName("try")[0].innerText
    addItemToCart(title, price, imageScr)
    updateCartTotal()
}

function addItemToCart(title, price, imageScr){
    var cartRow = document.createElement("div")
    cartRow.classList.add("cart-row")
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName("cart-items")[0]
    var cartItemNames = cartItems.getElementsByClassName("cart-item-title")
    for (var i = 0 ; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert("This item is already added to the cart")
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageScr}">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
        cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem)
    cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener('change', quantityChanged)
}

function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName("cart-items")[0]
    var cartRows = cartItemContainer.getElementsByClassName("cart-row")
    var total = 0
    for (var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName("cart-price")[0]
        var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0]
        var price = parseFloat(priceElement.innerText.replace("$", ""))
        var quantity = quantityElement.value
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName("cart-total-price")[0].innerText = "$" + total
}