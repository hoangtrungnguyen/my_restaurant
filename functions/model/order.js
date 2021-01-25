function Order(title,price,description){
    this.id =  Date.now().toString()
    this.title = title
    this.price = price
    this.image_url = ''
    this.description = description

    this.status = ''
}

module.exports = Order