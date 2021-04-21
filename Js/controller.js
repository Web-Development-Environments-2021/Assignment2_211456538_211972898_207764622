function init(){
    document.getElementById("welcome").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("toRegister").onclick = function(){displayRegistrationForm();}
    document.getElementById("toLogin").onclick = function(){displayLogin();}
}

function displayRegistrationForm(){
    // TODO: add more validation rules according to the assignment
    document.getElementById("welcome").style.display = "none";
    document.getElementById("register").style.display = "block";  
    document.getElementById("submit").onclick = function(){handleRegistration();}
    $("#registrationForm").validate({
        rules: {
            username : {
            required: true
            },
            password: {
            required: true,
            minlength: 6
            },
            firstname : {
            required: true
            },
            lastname : {
            required: true
            },
            email: {
            required: true,
            email: true
            }
        },
    });
}

function displayLogin(){
    document.getElementById("welcome").style.display = "none";
    document.getElementById("login").style.display = "block"; 
    document.getElementById("attemptLogin").onclick = function(){handleLogin();}
}

function handleLogin(){
    var uname = document.getElementById("loginId").value;
    for(var key in users) {
        if (uname === key){
            var value = users[key];
            var upass = document.getElementById("loginPass").value;
            if (value === upass){
                // authorization completed
                // need to show only the game
                alert("successful login");
                document.getElementById("login").style.display = "none";
                document.getElementById("game_controller").style.display = "block"; 
            }
        }
      }
}

function handleRegistration(){
    let ron = $("#registrationForm").valid();
    if(ron===true){
        // save user details and back to main screen
        users[document.getElementById("username").value] = document.getElementById("password").value;
        alert("Your account have been registered successfully :) you can log in now!");
        document.getElementById("welcome").style.display = "block";
        document.getElementById("register").style.display = "none";
    }
    else {
        alert("Please fill correct details in all of the fields.");
    }
}