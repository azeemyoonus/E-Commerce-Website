var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  let products = [
    {
      name: "iPhone 11",
      price: 51999,
      image:
        "data:image/jpeg;base64,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",
      description: 'This is iphone 11'
    },
    {
      name: "iPhone 11",
      price: 51999,
      image:
        "data:image/jpeg;base64,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",
      description: 'This is iphone 11'
    },
    {
      name: "iPhone 11",
      price: 51999,
      image:
        "data:image/jpeg;base64,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",
      description: 'This is iphone 11'
    },
    {
      name: "iPhone 11",
      price: 51999,
      image:
        "data:image/jpeg;base64,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",
      description: 'This is iphone 11'
    },
    {
      name: "iPhone 11",
      price: 51999,
      image:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDQ0NDQ8NDQ0NDw4PDQ8PDQ8ODw0NFREWFhURFRUYHSggGBolHRMVLTMhJykrLi4uFx8zODM4OCouLi4BCgoKDg0OFw8QFzAdHSUrLSs3ODgtKzgxKysrKy0rKy0rNy4rLTI0LSsrKy0rKy0rKzArKysrKysrKzcrKysrK//AABEIAQMAwgMBIgACEQEDEQH/xAAcAAEAAwADAQEAAAAAAAAAAAAAAgMHBAUGAQj/xABDEAACAQMABAcMBwcFAAAAAAAAAQIDBBEFBxIhBhMxQXF0sxUiJTM0UVJhgYKRkxQ1VLHB0dIkMkNykqGyI0Jjc+H/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAYEQEBAQEBAAAAAAAAAAAAAAAAAREhMf/aAAwDAQACEQMRAD8A3EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwdNaVo2dtVuriTjSpJN4WZSk2lGEVzybaSXnZlWk+HWkK0trjPoFKTzSoUVCdVwx/ElKLbf8uz+IGxgwxcI75tNXd28ZylKu028b3h834lq0/f8A2i8+N1+oGNuBikNOXzePpddS80qlxF/ByLFpa/8Atlb5tf8AWTTGzgxnurf/AGyt82v+sd1L/wC2Vvm1/wBY0bMDGe6l/wDbK3za/wCsd1L/AO2Vvm1/1jRswMft+EWlKLUqd1x2P4VwozpS9uNtP30jQ+CPCSGkaEp7DoXFGWxdW8ntOjU5mnu2oPfiWFyNNJppUd6AAAAAAAAAAAAAAAAAAM/1q1tqWj7d5cG7m6kuaUqPFwSfnWLiXtSMg4S6UnRpx2PG1WsyfM3FTb9ilFY9vqNZ1pr9q0e8tYtdIvdz9/arD+P9jH9NwhVc6NRyilxM6dSK2nTnxMFvjzxa8wV2nAzT9aUvol/N1qblHY29hzpU5S2XKnJb4uL345HnDR6vR6hG6VK4aUIVJ06j37O1FtfDKM24PUKdtdU7mtV+kcS9qlShGUITqJ5jxjeO8TSbiuXGOc9g9KqlTjNRp1rq4c57VaKqRp01Nx2lB97Kcpxnvkmkordvyrct4k569TwijbOrsUHGUGt7g8qMuZxfnOjoTbis8qypdKeGR0LpOdzVja3FOkqtRTdCtToU7eSqxi5KFSNNRjKMtnGcZTa34yiNvLdJ+epU/wA2Zszi7rlJn0rTJJkVMHzJ9AHdcCJunpalKLwrm1q0qq9KcHt05PoUJ4/nZ0p2/BBeFLN5e5Vljm30qu/p3f3YiVqgANIAAAAAAAAAAAAAAAAznWn5TYdV0j2lqY7pe4hRqTqVIcb4mMKe04KcuJg8ya346OjnybFrT8qsOq6Q7S0Me0/o6VeKcGlOOxna/dzGOxv8ycVHf51givmjNKUbutTtLq2t7SVeUaVC5to1afE1ZPEeNhKUlUg5YTe5re8nJqW86kIw2o0bm2lUpd/ni5Ym3KnKUU3FqW00+TvmnzM6rQ9lKN1Rub9qnRtpxq7CnCdW4lGW2qcEm+WXK3uSbZz7a9lOvVqTa2q9SdWWOTblJylj4mrkvEnZ13fByhO3qq4q1ac6sIzjQp0pSqJVJRceMnNpLEVJtRWW5bOcLOedbPdL/sqf5s662qtRUp79nlxne/MsnOtcqC2v3nlvpbyZt1ZMctMmmUxkTTIq5M+plSZNMCZ2/BNvunZY/wCTPrXFVzp0zt+COO6dlnG7jNnPNLia/wD6IlasADSAAAAAAAAAAAAAAAAM31pP9rs1zRtLzHvVbfP+KM5aTeedcjTw17TRNaXldr1S57aiZzkixKNNeeX9RZGHrl8StMsjIKsjBZTbcmuTak5Y6C+Mjjpk1IDkqRNSOOpE4yIOQmSUilMmpAWpnc8E34SsumXZ1jo0zu+B+/Sdnnzz5m9/E1/gIlayADSAAAAAAAAAAAAAAAAM01q+VWnrtLrG578VqGd/tRmyZpetnyix6rf9raGYZIsXJk1IpTJphV0ZFikcdMnFgchSLIyOPGRNSA5EZE0yhSJpgXqR3nA76ys+mXZVjz6keh4ExzpK09W2+n/RrkiVrYANIAAAAAAAAAAAAAAAAzXW14+x6rf9raGXZNR1t+Pseq3/AG1oZUmFi5MmmUpkkyKvTJplCZx5aQip7GG9+G87kwOxUixSOBGuk84bycqMgOQpE1IojImpAchSPS8BH4Stff7GueVTPUcAX4Stff7GsErXQAVAAAAAAAAAAAAAAAAGaa3PHWXVb/trQyjJq+t3x1l1W/7a0MkyFi5MmmUJk0wq+LPO1auzKSfKpNPpTO+TODfaMVWSmpbDe6Xe5UvXy8pBO2ucqMuXkz7OU7aE00muR8h1Nto1Q3Kbcc5w1v8AidlF8wHITJKRSpE0wL0z1Wr5+Erb3+xrHkEz12rx+Ebb3+xrBK2AAFQAAAAAAAAAAAAAAABmet/x1l1W/wC2tDIdo17XB42z6rf9taGO5CxemSTKUyaYVcmTTKUySYF6ZJMpTJpkFyZNMoTJpgXpnr9XP1jbe/2NY8ZFnstW78I23v8AY1glbGACoAAAAAAAAAAAAAAAAzLXD42z6rf9taGN5Nk1xeMs+q3/AG1oYxkLFqZNMpTJphVyZNMoTJpgXJk0ylMmmBcmTTKEyaZBcme11a/WFt7/AGNY8Ome21Z/WFt0z7GsErZgAVAAAAAAAAAAAAAAAAGY64/GWfVb/trMxfJtGuPxln1S/wC2szFMhYsTJJlSZJMKuTJJlKZNMC5MmmUJk0wL0ySZSpE0wLkz3OrHy+26Z9jWPBpnu9V/l9t0z7GsEraAAEAAAAAAAAAAAAAAAAZhrk8ZZ9Vv+2szFGbVrmklUsk+WVrfpet8baP7kzFQsCSZEBViZJMqTJJgWpk0ynJJMC5MmmUpkkwL0z3uq3y+26Z9jWM+TPf6q5ruhbLnfGNdCo1s/eglbYAAgAAAAAAAAAAAAAAADM9dFF7NlV/2und0OmpKVCql/TQqP2GJNbz9ScJ9BU9IWlS1qtw2sSpVEsyo1o74zS5/WudNrnMF09wGv7arJVKEsZezVpwq1aFRekpwi9jonsv7wseUB2XcK59GHzYL72O4Vz6MPnU/zA60+5Ox7hXPow+dT/MlDg/dS3Rpxl0VIP7mB1qZNM7CfB27jvlSUV66kF+JFaEufRh86n+YHCTJpnM7i3Pow+dT/M+dyLhNLYjvz/Eg17XncBxkzRdUlNy0hSSz3lKvVlu3JRiqaXt4/wDszyejuC17XnGNK3qVW/QhPY9tVpU4+2RtfADgn3NoTlWlGpeXGzx0oZcKcI52aMG97S2pNvdlyfIsJCvVgAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=",
      description: 'This is iphone 11'
    },
  ];


  res.render('admin/view-products', { admin: true, products });



});
router.get("/add-products", (req, res) => {
  res.render('admin/add-products');
  console.log('clicked add products');
});
router.post('/add-products', (req, res) => {
  console.log("just here");
  console.log(req.body);
  console.log(req.files.product_photo);
});

module.exports = router;
