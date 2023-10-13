function login() {
    
    var username = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;

    if(username === null || username === undefined) {
        alert("Email is Empty: ");
    }

    if(password === null || password === undefined) {
        alert("Password is Empty: ");
    }

    if(username == "driver_10@gmail.com") {
        localStorage.setItem('username', 'John');
    } else if(username == "rider_10@gmail.com") {
        localStorage.setItem('username', 'Obama');
    }

    window.location.href = "http://127.0.0.1:5500/carpool/index.html";

}