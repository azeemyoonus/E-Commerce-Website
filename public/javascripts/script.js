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

goToCart = () => {  
    window.location.href = '/cartDetails';
}

cashOnDelivery = (data) => {
    if (confirm('Continue with cash On Delivery ?')) {
        $.ajax({
            url: '/confirm%20order',
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
        $.ajax({
            url:'/payment',
            method: 'post',
            success:(response)=>{
                if (response.status ==true){                    
                    console.log(response);
                    razorpay(response.data, response.user)

                }
            }
        })
        
    }

}

razorpay = (paymentData, userdata) => {
    var options = {
        "key": "rzp_test_kwnIaBUPumh7LR", // Enter the Key ID generated from the Dashboard
        "amount": parseInt(paymentData.amount + '00'), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Phone Gallery",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id":paymentData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPayment(response, paymentData.id);
        },
        "prefill": {
            "name": userdata.user_name,
            "email": "gaurav.kumar@example.com",
            "contact": "81658083322"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cf"
        },
        "retry":{
            "max_count":4,
        }
    };
    var rzp1 = new Razorpay(options);
        rzp1.open();
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
            if (response.response.payment==true) {
                alert("payment succefull");
                $.ajax({
                    url:'/afterPayment',
                    method:'get',
                    success:(response)=>{
                        if (response.status==true){
                            alert("hi i am here");
                            window.location.href=response.redirect;
                        }
                        
                    }

                })
            }
            else{
                alert("Payment unsuccessfull");
            }
        }

    })  
}


item=()=>{
    alert("Hello");
}

cancelFrmOders=(prodId)=>{
    alert(prodId);
    $.ajax({
        url:'cancel%20your%20order?prodId='+prodId,
        method:'put',
        success:(response)=>{
            if (response.success){
                alert("finally");
            }
        }
    })
}