import { menuItems } from "./data.js"
const menuSection = document.getElementById("section-menu")
const orderSection = document.getElementById("section-order")
const thanksSection = document.getElementById("section-thanks")
const paymentModal = document.getElementById("modal-payment")
let orderList = []
let evalIcons = []

// Listen for click events

document.addEventListener("click", handleClicks)

// Add custom listener to the pay button 

document.querySelector("form").addEventListener("submit", function(e) {

    // block the default behaviour of sending the form data off to some magical place    
    e.preventDefault()

    processPayment()
})

// Forward click events on the main page

function handleClicks(e) {
    // close the modal when it's open and the user clicks outside of it
    if(!paymentModal.classList.contains("hidden") && !paymentModal.contains(e.target)) {
        paymentModal.classList.add("hidden")
    }

    // detect and direct various clicks
    if(e.target.id === "button-Pizza") {
        addItemToOrder("Pizza")
    } else if (e.target.id === "button-Burger") {
        addItemToOrder("Burger")
    } else if (e.target.id === "button-Beer") {
        addItemToOrder("Beer")
    } else if (e.target.id === "button-Soda") {
        addItemToOrder("Soda")
    } else if (e.target.id === "button-remove-Pizza") {
        removeItemFromOrder("Pizza")
    } else if (e.target.id === "button-remove-Burger") {
        removeItemFromOrder("Burger")
    } else if (e.target.id === "button-remove-Beer") {
        removeItemFromOrder("Beer")
    } else if (e.target.id === "button-remove-Soda") {
        removeItemFromOrder("Soda")
    } else if (e.target.id === "button-complete-order") {
        completeOrder()
    }
}

// Add and remove items from the order list

function addItemToOrder(item) {
    menuItems.filter(menuItem => {return menuItem.name === item})[0].amount++
    renderOrder()
}

function removeItemFromOrder(item) {
    if(menuItems.filter(menuItem => {return menuItem.name === item})[0].amount > 0) {
        menuItems.filter(menuItem => {return menuItem.name === item})[0].amount--
        renderOrder()
    }         
}

// Unhide payment modal

function completeOrder() {
    paymentModal.classList.remove("hidden")
}

// Hide modal and order list, show gratitude instead

function processPayment() {
    paymentModal.classList.add("hidden")
    orderSection.innerHTML = ""
    document.removeEventListener("click", handleClicks)
    renderThanks()
}

// Make the eval icons light up on hover

function toggleHighlight(icon) {
    
    // light up the hovered icon as well as all prior icons and un-light them once the hover ends
    
    for (let i=0;i<evalIcons.length;i++) {
        if(icon.target === evalIcons[i]) {
            for (let j=0;j<i+1;j++) {
                evalIcons[j].classList.toggle("highlighted")
            }
            break;
        }
    }
}

// Leave a rating by clicking on an eval icon

function leaveRating(icon) {

    // replace evaluation section and give the customer feedback
    for (let i=0;i<evalIcons.length;i++) {
        if(icon.target === evalIcons[i]) {
            if(i<3) {
                thanksSection.innerHTML = `<p>Booh!</p>`
            } else {
                thanksSection.innerHTML = `<p>Yay!</p>`
            }
            break;
        }
    }
}

// Render thanks

function renderThanks() {

    thanksSection.innerHTML = `<p>Thank you for your order! Care to leave a rating?</p>
                <div id="eval">
                    <i class="fa-solid fa-burger" id="eval1"></i>
                    <i class="fa-solid fa-burger" id="eval2"></i>
                    <i class="fa-solid fa-burger" id="eval3"></i>
                    <i class="fa-solid fa-burger" id="eval4"></i>
                    <i class="fa-solid fa-burger" id="eval5"></i>
                </div>`  
                        
    // Add custom listeners to eval icons    
    evalIcons = [   document.getElementById("eval1"),
                    document.getElementById("eval2"),
                    document.getElementById("eval3"),
                    document.getElementById("eval4"),
                    document.getElementById("eval5")    ]

    for (let i=0;i<evalIcons.length;i++) {
        evalIcons[i].addEventListener("mouseenter", toggleHighlight)
        evalIcons[i].addEventListener("mouseleave", toggleHighlight)
        evalIcons[i].addEventListener("click", leaveRating)
    }
}

// Render order list (unless empty or last item removed)

function renderOrder() {
    let html = `<p id="title-order">Your order</p>
                    <ul>`
    let totalPrice = 0
    let itemsOrdered = false;

    menuItems.forEach(function(order) {
        if(order.amount > 0) {
            let price = order.amount * order.price
            html += `<li>
                        <p class="heading-order-item">${order.amount}x ${order.name}</p>
                        <button class="button-remove-item" id="button-remove-${order.name}">(remove)</button>
                        <p class="price-order-item">$${price}</p>
                    </li>`
            totalPrice += price
            itemsOrdered = true;
        }
    })    

    html += `</ul>
            <div id="div-price">
                <p id="heading-price">Total price:</p>
                <p id="label-price">$${totalPrice}</p>
            </div>
            <button id="button-complete-order" class="button-green">Complete order</button>`

    if(itemsOrdered) {
        orderSection.innerHTML = html;
        // smoothly scroll down to the bottom of the page
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } else {
        orderSection.innerHTML = ""
    }
}

// Render menu

function renderMenu() {
    let html = ""

    menuItems.forEach(function(menuItem) {
        let ingredients = ""
        const length = menuItem.ingredients.length

        for (let i=0; i<length; i++) {
            ingredients += menuItem.ingredients[i]
            if(i < length - 1) ingredients += ", "
        }

        html += `<div class="div-menu-item">
                    <img src=${menuItem.image} alt="a ${menuItem.name}" class="image-menu">
                    <div class="div-menu-text">
                        <p class="heading-menu-item">${menuItem.name}</p>
                        <p class="subheading-ingredients">${ingredients}</p>
                    </div>                        
                    <p class="price">$${menuItem.price}</p>
                    <button class="icon-plus" id="button-${menuItem.name}">+</button>
                </div>`
    })

    menuSection.innerHTML += html;
}

// render the menu on load
renderMenu()