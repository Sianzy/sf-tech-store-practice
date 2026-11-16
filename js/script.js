// Application Constants & State Management
const STORAGE_KEY = 'bean_boutique_cart';

// Initial Load Event Execution Listener
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initializeWelcomeModal(); // Integrated with your jQuery discount popup logic
    initializeBookingForm();
});

//1. Shopping Cart
function getCart() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : [];
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, price) {
    let cart = getCart();
    // Check if item already exists in the persistent cart
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: parseFloat(price), quantity: 1 });
    }

    localStorage.setItem("last_added_product", name);

    saveCart(cart);

    showNavCartProduct(name);
}

// Show Added Product Name In Navigation
function showNavCartProduct(name) {
    const navProduct = document.getElementById("nav-cart-product");

    if (navProduct) {
        navProduct.textContent = name;

        setTimeout(() => {
            navProduct.textContent = "";
        }, 3000);
    }
}

function addSubscriptionToCart(tierName, price) {
    addToCart(tierName, price);
}

function removeCartItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateCartUI() {
    const cart = getCart();

    // Update global header badge counter references
    const counts = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    counts.forEach(el => el.textContent = totalItems);

    // Contextually verify if current operational page environment is cart.html
    const itemsContainer = document.getElementById('cart-items-container');
    if (itemsContainer) {
        itemsContainer.innerHTML = '';

        if (cart.length === 0) {
            itemsContainer.innerHTML = `<p style="padding: 2rem; text-align:center; color: #777;">Your shopping cart is currently empty.</p>`;
            document.getElementById('cart-subtotal').textContent = '$0.00';
            document.getElementById('cart-total').textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        cart.forEach((item, index) => {
            const rowTotal = item.price * item.quantity;
            subtotal += rowTotal;

            const itemRow = document.createElement('div');
            itemRow.className = 'cart-item-row';
            itemRow.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                    <strong>$${rowTotal.toFixed(2)}</strong>
                    <button class="btn-remove" onclick="removeCartItem(${index})" title="Remove item"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            itemsContainer.appendChild(itemRow);
        });

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
    }
}

function executeCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty! Add products before checking out.");
        return;
    }

    window.location.href = "checkout.html";
}

// 2. Integrated Discount Popup Logic (With Local Storage) 
function initializeWelcomeModal() {
    // 1. Check if the user already saw the popup during this active browser session
    var hasVisited = sessionStorage.getItem('bean_boutique_returning_visitor');

    // 2. If they HAVEN'T seen it during this run, show it!
    if (!hasVisited) {

        // Show the popup and apply the centering class
        $("#dis-popup").hide().fadeIn(500).addClass("active");

        // Your X close button logic + saving the session flag
        $("#dis-popup-close").click(function (e) {
            $("#dis-popup").fadeOut(400, function () {
                $(this).removeClass("active");
            });
            sessionStorage.setItem('bean_boutique_returning_visitor', 'true');
        });

        // Your form submission logic + saving the session flag
        $("#dis-form").submit(function (e) {
            e.preventDefault();
            $("#disMsg").text("Sending....").show();

            setTimeout(function () {
                $("#disMsg").text("Email sent! Redirecting.....");

                // Save session flag so clicking 'Home' right now won't trigger it again
                sessionStorage.setItem('bean_boutique_returning_visitor', 'true');

                setTimeout(function () {
                    $("#dis-popup").fadeOut(500, function () {
                        $(this).removeClass("active");
                    });
                }, 1500);
            }, 1000);
        });

    } else {
        // 3. If they are just clicking around links (like Home), keep it hidden
        $("#dis-popup").hide().removeClass("active");
    }
}

//3. Event Booking & Class Registrations Form Validation 
function initializeBookingForm() {
    const bookingForm = document.getElementById('event-booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value;
        const selectedOption = document.getElementById('event-select').options[document.getElementById('event-select').selectedIndex].text;

        const feedbackBlock = document.getElementById('booking-confirmation');
        feedbackBlock.className = "hidden-alert";
        feedbackBlock.style.display = "block";
        feedbackBlock.innerHTML = `<strong>Registration Complete!</strong><br>Thank you ${name}. A reservation confirmation voucher for the <em>${selectedOption}</em> has been sent to your email.`;

        bookingForm.reset();
    });
}
// Featured Product Slider
document.addEventListener("DOMContentLoaded", () => {
    const featuredSlides = document.querySelectorAll(".featured-slide")
    const nextButton = document.querySelector(".right-featured");
    const prevButton = document.querySelector(".left-featured");
    if (featuredSlides.length > 0) {

        let featuredIndex = 0;
        function changeFeaturedSlide(index) {
            featuredSlides.forEach(slide => {
                slide.classList.remove("active");
            });
            featuredSlides[index].classList.add("active");
        }
        nextButton.addEventListener("click", () => {
            featuredIndex =
                (featuredIndex + 1) % featuredSlides.length;
            changeFeaturedSlide(featuredIndex);
        });
        prevButton.addEventListener("click", () => {
            featuredIndex =
                (featuredIndex - 1 + featuredSlides.length)
                % featuredSlides.length;
            changeFeaturedSlide(featuredIndex);
        });
        setInterval(() => {
            featuredIndex =
                (featuredIndex + 1) % featuredSlides.length;
            changeFeaturedSlide(featuredIndex);
        }, 4000);
    }
});


//Event Register Button Selection 

document.addEventListener("DOMContentLoaded", () => {

    const registerButtons =
        document.querySelectorAll(".event-register-btn");

    const eventSelect =
        document.getElementById("event-select");

    const registrationPanel =
        document.querySelector(".registration-panel");


    registerButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedEvent =
                button.getAttribute("data-event");

            eventSelect.value = selectedEvent;

            registrationPanel.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    });

});

// Product Search Feature
function handleProductSearch() {
    const searchInput = document
        .getElementById("product-search")
        .value
        .toLowerCase();

    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        const productName = card
            .querySelector("h3")
            .textContent
            .toLowerCase();

        if (productName.includes(searchInput)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

