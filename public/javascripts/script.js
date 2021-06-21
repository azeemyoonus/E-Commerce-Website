function removeItem(productId, userCartId, productName, status) {
    if (confirm('Are you sure you want to delete the product : ' + productName + '?')) {
        $.ajax({
            url: '/remove-cart-product/?productId=' + productId + '&userCartId=' + userCartId,
            method: 'get',
            success: (response) => {
                if (response.status) {
                    if (status === 'orderSummary') {
                        $("#orders").load(location.href + " #orderSummary");
                    }
                    $("#cartDetails").load(location.href + " #cartDetails");
                }
            }
        })
    }
}

function incrementPoduct(value, productId, userCartId, currentValue, status) {
    $.ajax({
        url: '/incrementProduct/?productId=' + productId + '&value=' + value + '&userCartID=' + userCartId + '&currentValue=' + currentValue,
        method: 'get',
        success: (response) => {
            if (response.status) {
                if (status === "orderSummary") {
                    $("#orders").load(location.href + " #orderSummary");
                    $("#cartDetails").load(location.href + " #cartDetails");
                }
                else {
                    $("#cart").load(location.href + " #cartDetails");
                }
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

districtSelect = (value) => {
    $.ajax({
        url: 'getdistrict?statevalue=' + value,
        method: 'get',
        success: (response) => {
            if (response.status == true) {
                $("#districtDiv").load(location.href + " #district");

            }
        }
    })
}
$("#deliveryAddress").submit((e) => {
    e.preventDefault();
    $.ajax({
        url: 'deliveryAddress',
        method: 'post',
        data: $("#deliveryAddress").serialize(),
        success: (response) => {
            if (response.status) {
                alert("hi");
            }
        }
    })
})

orderSummary = (userId) => {
    alert(userId)
}
