const orderDiv = document.getElementById("order-list");
const finalDiv = document.getElementById("final-price");

function displayOrderList() {

    const cart = getCart();

    let total = 0;

    orderDiv.innerHTML = cart.map(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        return `
            <div class="checkout-order-item">

                <span>
                    ${item.name} (x${item.quantity})
                </span>

                <span>
                    $${itemTotal.toFixed(2)}
                </span>

            </div>
        `;

    }).join('');

    finalDiv.innerText = total.toFixed(2);

    document.getElementById("success-area").style.display = "none";
}

displayOrderList();


const myValidate = new JustValidate('#custForm');

myValidate

.addField('#cust-name', [

    {
        rule: 'required',
        errorMessage: 'Customer Name is required'
    },

    {
        rule: 'minLength',
        value: 8,
        errorMessage: 'Customer Name must be at least 8 characters'
    }

])

.addField('#cust-phone', [

    {
        rule: 'required',
        errorMessage: 'Customer Phone is required'
    }

])

.addField('#cust-email', [

    {
        rule: 'required',
        errorMessage: 'Customer Email is required'
    },

    {
        rule: 'email',
        errorMessage: 'Customer Email has an invalid format'
    }

])

.onSuccess((event) => {

    event.preventDefault();

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById('form-card').style.display = 'none';

    document.getElementById('order-list').style.display = 'none';

    document.querySelector('.checkout-total-row').style.display = 'none';

    document.getElementById('success-area').style.display = 'block';

    updateCartUI();

});