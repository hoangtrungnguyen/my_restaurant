//TODO thêm các trường cỡ, thành phần, ảnh nhỏ
function Food(title,price,description){
  this.id =  Date.now().toString()
  this.title = title
  this.price = price
  this.image_url = ''
  this.image_name = ''
  this.description = description
  this.ref = ''
  this.is_remaining = true
  this.sold_count = 0
}

export default Food
