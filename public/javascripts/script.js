function removeItem(productId, userCartId, productName) {
    if (confirm('Are you sure you want to delete the product : ' + productName + '?')) {
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

function incrementPoduct(value, productId, userCartId, currentValue) {
    $.ajax({
        url: '/incrementProduct/?productId=' + productId + '&value=' + value + '&userCartID=' + userCartId + '&currentValue=' + currentValue,
        method: 'get',
        success: (response) => {
            if (response.status) {
                $("#cart").load(location.href + " #cartDetails");
            }

        }
    })
}
addToCart = (userId) => {
    $.ajax({
        url: 'cart?productId=' + userId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                $("#viewProducts").load(location.href + " #products");
            }
        }
    })
}