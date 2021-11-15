"use strict"
let roundCash = (n) => {
    return Math.round(n*100)/100
}
class GroceryItem {
    constructor(item, price, count, id) {
        this.item = item;
        this.price = price;
        this.count = count;
        this.id = id;
    }
    toHTML() {
        return `<div id="GroceryItem${this.id}" class="grocery-item">
        <div class="checkout-item">
            <button id=removeItem${this.id} class="btn btn-dark">−</button>
            <p>
             ${this.count} ${this.item}
            </p>
        </div>
        <div class="checkout-item-price">
            $${roundCash(this.count*this.price).toFixed(2)}
        </div>
    </div>`
    }
}
let form = document.getElementById('listForm');
let nextId = 0;
let items = [];
const refreshCheckout = () => {
    let subtotal = 0;
    let checkoutItemList = document.getElementById('checkoutItemList');
    let tipRadios = document.getElementsByName('tipamount');
    let tip = parseInt(Array.from(tipRadios).filter(e => e.checked)[0].value);
    tip = roundCash(tip / 100);
    checkoutItemList.innerHTML = '';
    items.forEach((e) => {
        subtotal += e.count*e.price;
        checkoutItemList.innerHTML += e.toHTML();
        let removeItem = document.getElementById(`removeItem${e.id}`);
        removeItem.addEventListener('click', event => {
            items = items.filter(i => i.id != e.id);
            refreshCheckout();
        });
    });
    tip = roundCash(tip*subtotal);
    let tax = roundCash(subtotal * 0.07);
    let checkoutTotal = document.getElementById('checkoutTotal');
    checkoutTotal.innerHTML = `<p class="subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
    <p class="tax">tax: $${tax.toFixed(2)}</p>
    <p class="tip">tip: $${tip.toFixed(2)}</p>
    <p class="total">total: $${(subtotal+tax+tip).toFixed(2)}</p>`
}
form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Fun fact. form.elements is type HTMLFormControlsCollection which inherits from HTMLCollection which contains the method "item"
    let item = form.elements['groceryItemForm'].value;
    let price = parseFloat(form.elements['price'].value);
    let count = parseInt(form.elements['count'].value);
    let error = document.getElementById('error');
    if (items.filter(e => e.item === item).length > 0) {
        error.innerText = 'Sorry, duplicate entries cannot be processed. First remove item from checkout.';
    } else {
        error.innerText = '';
        items.push(new GroceryItem(item, price, count, nextId));
        nextId++;
        refreshCheckout();
    }
});
