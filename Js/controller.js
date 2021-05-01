function init(){
    document.getElementById("welcome").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("game_settings").style.display = "none";
    var modal = document.getElementById("about");
    modal.style.display = "none";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {modal.style.display = "none";}
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";}
    }
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            if (modal.style.display === "block") {
                modal.style.display = "none";}
        }
    };
    document.getElementById("toRegister").onclick = function(){displayRegistrationForm();}
    document.getElementById("toRegis").onclick = function(){displayRegistrationForm();}
    document.getElementById("toLogin").onclick = function(){displayLogin();}
    document.getElementById("toLog").onclick = function(){displayLogin();}
    document.getElementById("toWelcome").onclick = function(){displayWelcome();}
    document.getElementById("toAbout").onclick = function(){displayAbout();}
    document.getElementById("startGame").onclick = function(){handleStartGame()}
    document.getElementById("leftMove").onclick = function(){takeKeysFromUser("left");}
    document.getElementById("rightMove").onclick = function(){takeKeysFromUser("right");}
    document.getElementById("upMove").onclick = function(){takeKeysFromUser("up");}
    document.getElementById("downMove").onclick = function(){takeKeysFromUser("down");}
}

function handleStartGame(){
    document.getElementById("game_settings").style.display = "block";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("submitSettingsForm").onclick = function(){handleSettingsForm();}
    $("#gameSettingsForm").validate({
        rules: {
            numOfBalls : {
            required: true,
            range: [50,90]
            },
            colorOfBig: {
            required: true
            },
            colorOfMed: {
            required: true
            },
            colorOfSmall : {
            required: true
            },
            gameTime: {
            required: true,
            min: 60
            },
            numOfMonsters: {
            required: true,
            range: [1,4]
            }
        },
    });
}

function handleGame(){
    let monster_num = document.getElementById("numOfMonsters").value;
    let timeOfGame = document.getElementById("gameTime").value;
    let numOfPoints = document.getElementById("numOfBalls").value;
    game = new Game(wall_matrix,monster_num,timeOfGame,numOfPoints);
    Start();
    game.start();
    finish_building_game = true;
    drawGame();
    startGame();
}

function handleSettingsForm(){
    let ron = $("#gameSettingsForm").valid();
    medColor = $("#colorOfMed").val();
    bigColor = $("#colorOfBig").val();
    smallColor = $("#colorOfSmall").val();
    // if(medColor === bigColor || medColor===smallColor || smallColor===bigColor){
    //     ron = false;
    // }
    if(Object.keys(keys).length!=4){
        ron = false;
    }
    if(ron===true){
        // update game details and bring back the game screen
        document.getElementById("game_controller").style.display = "block";
        document.getElementById("game_settings").style.display = "none";
        color_mapper[5] = smallColor;
        color_mapper[15] = medColor;
        color_mapper[25] = bigColor;
        alert("your game settings have been saved succesfully! you may start the game :)");
        handleGame();
    }
    else {
        alert("Please fill valid details for all of the fields.");
    }
}

function takeKeysFromUser(direction){
    let count = 0;
    document.onkeydown = function(evt) {
        if (count>0){
            return;
        }
        evt = evt || window.event;
        for (var key in keys){
            if (key === direction){
                continue;
            }
            if (keys[key] === evt.code){
                alert("This key has been chosen already for another direction.\n Please choose another key.");
                return;
            }
        }
        keys[direction] = evt.code
        keysCodes[direction] = evt.keyCode;
        count++;
        myFunction();
    };
    return;
}

function myFunction() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
  return;
}

function displayWelcome(){
    document.getElementById("welcome").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("game_settings").style.display = "none";
}

function displayAbout(){
    document.getElementById("about").style.display = "block";
}



function displayRegistrationForm(){
    // TODO: add more validation rules according to the assignment
    document.getElementById("login").style.display = "none";
    document.getElementById("game_settings").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
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
            },
            date: {
                required: true
            }
        },
    });
}

function displayLogin(){
    document.getElementById("game_settings").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("welcome").style.display = "none";
    document.getElementById("login").style.display = "block"; 
    document.getElementById("attemptLogin").onclick = function(){handleLogin();}
}

function handleLogin(){
    var uname = document.getElementById("loginId").value;
    users['123']='123';
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