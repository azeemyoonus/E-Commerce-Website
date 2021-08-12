function removeItem(productId, userCartId, productName, status) {
    if (confirm('Are you sure you want to delete the product : ' + productName + '?')) {
        $.ajax({
            url: '/remove-cart-product/?productId=' + productId + '&userCartId=' + userCartId,
            method: 'get',
            success: (response) => {
                if (response.status) {
                    // checking if it is from order-summarry page 
                    if (status === 'orderSummary') {
                        // reloading summary section
                        $("#orders").load(location.href + " #orderSummary");
                        // reloading price details section
                        $("#cartPrice").load(location.href + " #cartPrice");
                        // reloading cart count in user header
                        $("#cartCount").load(location.href + " #cartCount");
                    }
                    // this is of cart page.
                    else {
                        $("#cart").load(location.href + " #cartDetails");
                        $("#cartPrice").load(location.href + " #cartPrice");
                        $("#cartCount").load(location.href + " #cartCount");
                    }
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
                // checking if it is from order-summarry page 
                if (status === "orderSummary") {
                    // reloading summary section
                    $("#orders").load(location.href + " #orderSummary");
                    // reloading price details section
                    $("#cartPrice").load(location.href + " #cartPrice");
                }
                // this is of cart page.
                else {
                    $("#cart").load(location.href + " #cartDetails");
                    //    $("#cart").load(location.href + " #cart");
                    // reloading price details section
                    $("#cartPrice").load(location.href + " #cartPrice");
                }
            }

        }
    })
}
addToCart = (productId) => {
    $.ajax({
        url: 'cart?productId=' + productId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                $("#viewProducts").load(location.href + " #products");
                $("#cartCount").load(location.href + " #cartCount");
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
        url: 'addDeliveryAddress',
        method: 'post',
        data: $("#deliveryAddress").serialize(),
        success: (response) => {
            if (response.status) {                
                location.href='/place-order';
            }
        }
    })
})

orderSummary = () => {
    $.ajax({
        url: 'orderSummary',
        method: 'post',
        success: (response) => {
            if (response.status == true) {                
                location.href='/place-order';
                
            }
        }
    })
}
$("#cashOnDelivery").click(function () {
    $("#confirmOnline").attr("hidden", true);
    $('input[id="cashOnDelivery"]').prop('checked', true);
    $("#confirmCash").removeAttr('hidden');
});

$("#onlinePayment").click(function () {
    $("#confirmCash").attr("hidden", true);
    $('input[id="onlinePayment"]').prop('checked', true);
    $("#confirmOnline").removeAttr('hidden');

});

cashOnDelivery = (data) => {
    if (confirm('Continue with cash On Delivery ?')) {
        $.ajax({
            url: '/confirm order',
            data: { type: "cash" },
            method: 'post',
            success: (response) => {
                if (response.status == true) {
                    alert("Order Placed ")
                    window.location.href = response.redirect;
                }
            }

        })
    }
}

onlinePayment = () => {
    if (confirm('Continue with Online Payment ?')) {
        alert("Ok");
    }

}

goToCart = () => {
    window.location.href = '/cartDetails';
}

// $('#paymentMethod').submit((e) => {
//     e.preventDefault();
//     $.ajax({
//         url: 'payment',
//         method: 'post',
//         data: $("#paymentMethod").serialize(),
//         success: (response) => {
//             if (response.onlinePayment) {

//                 razorpay(response.data);
//             }
//             else if (response.cod) {

//             }
//         }
//     })
// })

razorpay = (paymentData) => {

    var options = {
        "key": "rzp_test_kwnIaBUPumh7LR", // Enter the Key ID generated from the Dashboard
        "amount": parseInt(paymentData.amount + '00'), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "ForShopping",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": paymentData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPayment(response, paymentData.id);
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    document.getElementById('payButton').onclick = function (e) {
        rzp1.open();
        e.preventDefault();
    }

}
verifyPayment = (response, paymentOrderId) => {

    $.ajax({
        url: 'verifyPayment',
        method: 'post',
        data: {
            response,
            paymentOrderId
        },
        success: (response) => {
            if (response.payment) {
                alert("payment succefull");
                //location.href='yourOrders';
            }
        }

    })
    // alert(response.razorpay_payment_id);
    // alert(response.razorpay_order_id);
    // alert(response.razorpay_signature);



}