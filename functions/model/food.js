function Food(title,price,description){
    this.id =  Date.now().toString()
    this.title = title
    this.price = price
    this.image_url = ''
    this.description = description
}

module.exports = Food