export default {
  methods: {
    addToCart: function (food, count, toppings,size) {
      const foodId = food.id
      size = parseInt(size)

      if(!size) size = 1

      count = parseInt(count)

      let order_session_id = `${foodId}`
      for (let i = 0; i < toppings.length; i++) {
        order_session_id += "_" + toppings[i].id.substring(0, 3)
      }
      //price
      let price = parseInt(food.price)

      for (let i = 0; i < toppings.length; i++) {
        price += parseInt(toppings[i].price)
      }

      // adding id to session
      if (this.$session.get('cart')) {
        let cart = this.$session.get('cart')
        if (cart[order_session_id]) {
          cart[order_session_id].count += count
        } else {
          cart[order_session_id] = {
            orderId: order_session_id,
            foodId: foodId,
            food:food,
            count: count,
            note: "",
            name: food.title,
            price: price,
            size: size,
            toppings: toppings
          }
        }
        this.$session.set('cart', cart)

      } else {
        let cart = {}
        cart[order_session_id] = {
          orderId: order_session_id,
          count: count,
          foodId: foodId,
          food:food,
          note: "",
          name: food.title,
          price: price,
          size: size,
          toppings: toppings,
        }
        this.$session.set('cart', cart)
      }
      if(this.updateCount())
        this.updateCount()
    },
  }
}
