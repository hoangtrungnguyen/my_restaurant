const Food = require("./food");

function Order() {
    this.id = Date.now().toString()
    this.food = new Map()
    this.count = 0
    this.note = ""
    this.phone = "NaN"
    this.full_name = ""
    this.billCount = billCount

    function billCount() {
        return parseInt(this.food.price) * this.count
    }
}

module.exports = Order