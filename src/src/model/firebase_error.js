function getFirebaseErrorMessage(err){
  switch (err.code){
    case "auth/email-already-in-use":return "Email đã được sử dụng, vui lòng chọn email khác hoặc liên hệ hỗ trợ"
    default: return err.message
  }
}

export {
  getFirebaseErrorMessage
}
