// tính toán giá trị của một order từ "cart" trong session
function get_order_bill(cart, order_id) {
    console.log(cart, order_id)
    if (!cart) return 0
    let order_bill = 0
    for (let i = 0; i < cart[order_id].toppings.length; i++) {
        order_bill += parseInt(cart[order_id].toppings[i].topping_price) * parseInt(cart[order_id].count)
    }
    order_bill += parseInt(cart[order_id].price) * parseInt(cart[order_id].count)

    return order_bill
}

function count_item_in_cart(cart){
    let cart_count = 0
    for (const property in cart) {
        if (cart.hasOwnProperty(property)) {
            cart_count += cart[property].count
        }
    }
    return cart_count
}

module.exports = {
    get_order_bill,
    count_item_in_cart
}