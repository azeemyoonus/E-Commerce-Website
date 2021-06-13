function removeItem(productId, userCartId,productName) {
    if (confirm('Are you sure you want to delete the product : '+productName+'?')) { 
    $.ajax({
        url: '/remove-cart-product/?productId=' + productId + '&userCartId=' + userCartId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                $("#cartDetails").load(location.href + " #cartDetails");
            }
        }
    })
}
}
// removeItem('{{this.products.item}}','{{this.userCart_id}}')