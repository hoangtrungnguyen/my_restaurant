function formatBill(bill) {
    return new Intl.NumberFormat('vi-VI', {maximumSignificantDigits: 3}).format(bill)
}

