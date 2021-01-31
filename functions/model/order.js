// {
//      id: 67890,
//      food: [
//          {
//                  count: 1,
//                  food_id: 161111,
//                  food_price: 1000,
//                  food_name : "name"
//                  note: "text",
//                  toppings: [ id1, id2, id3 ]
//           },
//              ...
//      ],
//      count: 12,
//      note: "Text",
//      phone: 092345678,
//      full_name: "Name",
//
// }
function Order() {
    this.id = Date.now().toString()
    this.foods = []
    this.count = 0
    this.note = ""
    this.phone = "NaN"
    this.full_name = ""
    this.time_created = null;
    this.billCount = billCount

    function billCount() {
        let bill = 0
        console.log(this.foods)
        for(const index in this.foods){
            const food = this.foods[index]
            bill += parseInt(food.food_price) * food.count
        }
        return bill
    }
}

module.exports = Order