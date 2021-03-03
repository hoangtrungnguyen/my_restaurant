//TODO thêm các trường cỡ, thành phần, ảnh nhỏ
export  default function Food(title,price,description){
  this.id =  Date.now().toString()
  this.title = title
  this.price = price
  this.image_url = ''
  this.image_name = ''
  this.description = description
  this.ref = ''
  this.remains = 0
  this.sold_count = 0
}


function Topping(){
    this.id = ''
    this.name = ''
    this.price = 0
    this.remains = 0
    this.description=  ""
}

const status = [
  'WAITING',
  'COOKING',
  'SHIPPING',
  'COMPLETE',
  'CANCEL',
]

export{
  Topping,Food,status
}
