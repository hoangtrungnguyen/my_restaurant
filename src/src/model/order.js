import * as fs from 'firebase/firestore'
export function SubmitForm(full_name = '', phone ='', email='', address = ['','',''], note = '') {


  this.id = ''
  this.full_name = full_name
  this.phone = phone
  this.email = email
  this.shipping = 15000
  this.address = address // array [0, 1, 2]; [ Cau Giay, Mai Dich, 5 Le Duc Tho ]
  this.note = note
  this.status = 'WAITING'
  this.time_created = new Date()
  this.uid = ''
  this.orders = []//array of order object
}

export function totalBill(submitForm){
  let bill = submitForm.shipping
  for(let i=0; i <submitForm.orders.length; i++){
    const order = submitForm.orders[i]

    bill += (order.count * order.price)
    order.toppings.forEach( topping =>{
      bill += parseInt(topping.price) * order.count
    })
  }
  return bill
}

export function Order(food) {
  this.foodId = null
  this.count = 1
  this.note = ""
  this.orderId = null
  this.name = ""
  this.food = food // food object
  this.price = -1 //
  this.size = 1  // 1 - 2 - 3
  this.toppings = []
}

