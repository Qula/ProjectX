$(document).ready(function(){
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    var picJump;
    var gameState="play";

    var backgroundSpeed = 3;
    var backgroundHeight = 600;
    var backgroundWidth = 480;
    var background = new Image();
    background.src = "images/bgg.jpg";

    var cartHeight = 124;
    var cartWidth = 82;
    var cart = new Image();
    cart.src = "images/cart2.png";
    var cartX = 200;
    var cartY = 470;
    var cartSpeed = 6;

    var fuel = new Image();
    fuel.src = "images/fuel.png";
    var gold = new Image();
    gold.src = "images/gold.png";
    var silver = new Image();
    silver.src = "images/silver.png";
    var fuelSpeed = 3;

    var fuelHeight = 50;
    var fuelWidth = 40;
    var fuelList;
    var coinList;

    var enemyCar = new Image();
    enemyCar.src = "images/enemyCarT.png";
    var enemyCarHeight = 124;
    var enemyCarWidth = 82;
    var enemyCarSpeed = 4;
    var enemyList;

    var font = "17pt verdana";
    var textColor = "rgb(255,255,255)";

    var scoreTab;
    var score;

    var sek;
    var min;
    var playTime;
    var stringTime;

    var disableText = false;
    var output;
    var fuelLength;
    var smokeList;
    var fuelCollision;
    var needNewFuel;
    var needCoin;
    var coinCollision;
    var enemySmokeList;
    var respSilver;



    function setup(){
        backgroundSpeed = 3;
        fuelSpeed = 3;
        cartSpeed = 6;
        enemyCarSpeed = 4;

        picJump = 0;

        fuelCollision= false;
        coinCollision = false;

        fuelList = [];
        enemyList = [];
        smokeList = [];
        enemySmokeList = [];
        coinList = [];

        cartX=200;
        cartY=470;

        desktop=true;
        mobile=false;

        fuelLength = Math.round(65*0.5);

        ctx.drawImage(background, 0, 0, backgroundWidth, backgroundHeight);
        ctx.drawImage(cart, cartX, cartY);

        addSprite(fuelList, fuelHeight, fuelWidth);
        addSprite(enemyList, enemyCarHeight, enemyCarWidth);

        needNewFuel=false;
        needCoin = true;
        respSilver=false;

        scoreTab= [];
        score =0;
        min=0;
        sek=0;
        draw();

    } 

    function draw() {
        if(gameState == "play") {
            animateBackground();
    $("#tleft").click(function(){
        cartX -= 5;
    });
            if(sek%4===0 && needNewFuel){
                needNewFuel=false;
                addSprite(fuelList, fuelHeight, fuelWidth);

            }
            if(sek%5===0 && needCoin){
                if(sek%15===0){
                    respSilver=true;
                    addSprite(coinList, fuelHeight, fuelWidth);
                    needCoin=false;
                }
                else{
                    respSilver=false;
                    addSprite(coinList, fuelHeight, fuelWidth);
                    needCoin=false;
                }
            }

            animateGold();

            animateFuel();
            animateEnemyCar();

            animateCart();
            nearMiss();
            collisionCheck();
            enemyCollisionCheck();
            coinCollisionCheck();
            fuelCapacity();
            displayText();

            window.requestAnimationFrame(draw, canvas);
        }
    }

    function play() {
        if(gameState == "pause") {
            intervalId = window.requestAnimationFrame(draw, canvas);
            gameState = "play";
            setPlayTime();
        }
    }

    function pause() {
        if(gameState == "play") {
            gameState = "pause";
            clearInterval(playTime);
        }
    }

    function stop() {
        gameState = "pause";
        window.clearInterval(playTime);
    }

    function restartGame(){
        gameState = "pause";
        window.clearInterval(playTime);
        setup();
        setPlayTime();
        gameState = "play";
    }

    function gameOver() {
        keyState[37] = false;
        keyState[38] = false;
        keyState[39] = false;
        keyState[40] = false;
        disableText = true;
        displayText();
        stop();
        $("#theEnd").css("display","inherit");
        $("#time").text("Time: "+stringTime);
        $("#score").text("Score: "+score);
        output = moment().format("DD/MM/YYYY");

        $("#date").text("Date: "+output);
        ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
    }

    $("#save").on("click",function(){
        if($("#nick").val().length>0){
            addScoreTab();
            $(this).attr("disabled", true);
        }

    });

    $("#goToHighscores").on("click",function(){
        window.location = "highscores.html";
    });

    $("#replay").on("click",playAgain);

    var mobile;
    var desktop;
    $("#myCanvas").touchwipe({
        wipeLeft: function() {
            mobile = true;
            desktop = false;
            keyState[39] = false;
            keyState[38] = false;
            keyState[37] = true;
            keyState[40] = false;
        },
        wipeRight: function() {
            mobile = true;
            desktop = false;
            keyState[37] = false;
            keyState[39] = true;
            keyState[38] = false;
            keyState[40] = false;
        },
        wipeUp: function() {
            mobile = true;
            desktop = false;
            keyState[38] = false;
            keyState[40] = true;
            keyState[37] = false;
            keyState[39] = false;
        },
        wipeDown: function() {
            mobile = true;
            desktop = false;
            keyState[40] = false;
            keyState[38] = true;
            keyState[37] = false;
            keyState[39] = false;
        },
        min_move_x: 20,
        min_move_y: 20,
        preventDefaultEvents: true

    });

    function playAgain(){
        $("#save").attr("disabled", false);
        disableText = false;
        gameState="play";
        setup();
        $("#theEnd").css("display","none");
        setPlayTime();
    }

    function fuelCapacity(){
        if(!disableText){
            ctx.fillStyle = 'black';
            ctx.fillRect(cartX+8,cartY+93,67,29);
            ctx.fillStyle = "red";
            ctx.fillRect(cartX+10,cartY+95,20,25);
            ctx.fillStyle = 'green';
            ctx.fillRect(cartX+10,cartY+95,fuelLength,25);
        }
    }

    if(gameState=="play"){
        setPlayTime();
    }

    function setPlayTime(){
        playTime =  setInterval(function() {
            sek++;
            backgroundSpeed+=0.05;
            enemyCarSpeed+=0.05;
            fuelSpeed+=0.05;
            cartSpeed+=0.02;
        },1000);
    }

    function nearMiss(){
        for(var i=0; i<enemyList.length; i++) {
            if (cartX < (enemyList[i].x + enemyCarWidth) && (cartX + cartWidth) > enemyList[i].x &&
                cartY < (enemyList[i].y + enemyCarHeight*2) && (cartY + cartHeight) > enemyList[i].y ) {
                ctx.beginPath();
                ctx.moveTo(enemyList[i].x+15, enemyList[i].y+110);
                ctx.lineTo(enemyList[i].x+45, enemyList[i].y+240);
                ctx.lineTo(enemyList[i].x-20, enemyList[i].y+240);

                ctx.moveTo(enemyList[i].x+65, enemyList[i].y+110);
                ctx.lineTo(enemyList[i].x+100, enemyList[i].y+240);
                ctx.lineTo(enemyList[i].x+35, enemyList[i].y+240);
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fill();
                ctx.lineWidth = 0.05;
                ctx.stroke();
            }
        }
    }

    function displayText(){
        if(!disableText){
            ctx.font = font;
            ctx.fillStyle = textColor;
            if(sek>59){
                min++;
                sek=0;
            }
            if (sek >= 10) {
                if(min < 10){
                    stringTime = "0"+min+":"+sek;
                }
                else{
                    stringTime = ""+min+":"+sek;
                }
            } else {
                if(min < 10){
                    stringTime = "0"+min+":0"+sek;
                }
                else{
                    stringTime = ""+min+":0"+sek;
                }
            }

            ctx.fillText('Time: '+stringTime, 20, 22);
            ctx.fillText('Score: '+score, 20, 50);
        }
    }

    function animateSmoke(list, inverse) {
        if(list.length > 20){
            list.splice(0,5);
        }
        for(var i=0; i<list.length; i++) {
            list[i].y = list[i].y + backgroundSpeed+4;
            ctx.beginPath();

            if(inverse){
                ctx.arc(list[i].x, list[i].y, 20-i, 0, 2 * Math.PI, false);
                ctx.fillStyle = "rgba(255,0,0,0.3)";
            }
            else{
                ctx.arc(list[i].x, list[i].y-185, i, 0, 2 * Math.PI, false);
                ctx.fillStyle = "rgba(255,255,0,0.3)";
            }
            ctx.fill();
            ctx.lineWidth = 0.05;
            ctx.stroke();
        }
    }

    function addSmokePoint(x, y, list) {
        newSmoke = {};
        newSmoke.x = x + cartWidth/2;
        newSmoke.y = y + cartHeight;
        list.push(newSmoke);
    }
    var mobileSpawn = false;
    function animateCart() {
        if(mobile){
            mobileSpawn = true;
        }
        if ( (keyState[37] || keyState[65]) && cartX>15 ){
            if( mobile ){
                if(cartX>50){
                    cartX -= 50;
                    mobile=false;
                }
            }
            else if(desktop){
                cartX-=cartSpeed;
            }
        }
        if ( (keyState[39] || keyState[68]) && cartX<385 ){
            if( mobile ){
                if(cartX < 350){
                    cartX +=50;
                    mobile = false;
                }
            }
            else if(desktop){
                cartX+=cartSpeed;
            }
        }
        if ( (keyState[38] || keyState[87] ) && cartY>0 ){
            if( mobile ){
                if(cartY>85){
                    cartY -=75;
                    mobile=false;
                }
            }
            else if(desktop){
                cartY-=cartSpeed;
            }
        }
        if ( (keyState[40] || keyState[83] )&& cartY<470){
            if( mobile ){
                if(cartY<405){
                    cartY +=75;
                    mobile=false;
                }
            }
            else if(desktop){
                cartY+=cartSpeed;
            }
        }
        ctx.drawImage(cart, cartX, cartY);
        addSmokePoint(cartX, cartY, smokeList);
        animateSmoke(smokeList, true);
    }

    function animateBackground() {
        if(picJump >= canvas.height){
            picJump = 0;
        }
        picJump+=backgroundSpeed;
        if(fuelLength>0) {
            fuelLength-=0.05;
        }
        ctx.drawImage(background,  0, picJump, backgroundWidth, backgroundHeight);
        ctx.drawImage(background,  0, -canvas.height+picJump, backgroundWidth, backgroundHeight);
    }

    function animateGold() {
        var i = 0;
        if(!needCoin){
            if(  coinList[i].y > canvas.height || coinCollision ) {
                coinList.splice(i, coinList.length);
                needCoin=true;

                if(coinCollision){
                    coinCollision=false;
                }
            }
            else {
                coinList[i].y = coinList[i].y + fuelSpeed;
                if(respSilver){
                    ctx.drawImage(silver, coinList[i].x, coinList[i].y, fuelWidth, fuelHeight);
                }
                else{
                    ctx.drawImage(gold, coinList[i].x, coinList[i].y, fuelWidth, fuelHeight);
                }

            }
        }
    }

    function animateFuel() {
        var i = 0;
        if(!needNewFuel){
            if(  fuelList[i].y > canvas.height || fuelCollision ) {
                // fuelList.splice(i, 1);
                fuelList.splice(i, fuelList.length);
                needNewFuel=true;

                if(fuelCollision){
                    addSprite(fuelList,fuelHeight,fuelWidth);
                    fuelCollision=false;
                }
            }
            else if(!needNewFuel) {
                fuelList[i].y = fuelList[i].y + fuelSpeed;
                ctx.drawImage(fuel, fuelList[i].x, fuelList[i].y, fuelWidth, fuelHeight);
            }
        }
    }
    var items = Array(60,220,370);
    function animateEnemyCar() {

        for(var i=0; i<enemyList.length; i++) {
            if(enemyList[i].y > canvas.height) {
                if(mobileSpawn){

                    enemyList[i].x = items[Math.round(Math.random() * 2)];

                }
                else{
                    enemyList[i].x = Math.floor(Math.random() * (canvas.width-enemyCarWidth));
                }

                enemyList[i].y = 0-enemyCarHeight;
            }
            else {
                enemyList[i].y = enemyList[i].y + enemyCarSpeed;
                ctx.drawImage(enemyCar, enemyList[i].x, enemyList[i].y, enemyCarWidth, enemyCarHeight);
                addSmokePoint(enemyList[i].x, enemyList[i].y,enemySmokeList);
                animateSmoke(enemySmokeList,false);

            }
        }
    }

    function addSprite(spriteList, spriteHeight, spriteWidth){
        newSprite = {};
        if(mobileSpawn){
            newSprite.x = items[Math.round(Math.random() * 2)];
        }
        else{
            newSprite.x = Math.floor(Math.random() * (canvas.width-spriteWidth));
        }

        newSprite.y = 0-spriteHeight;
        spriteList.push(newSprite);
    }


    function addScoreTab(){
        var nick = $("#nick").val();
        var restored = JSON.parse(localStorage.getItem('klucz'));

        if(restored===null){
            scoreTab.push({czas: stringTime, wynik: score, term: output , imie: nick });
        }
        else{
            scoreTab=restored;
            scoreTab.push({czas: stringTime, wynik: score, term: output , imie: nick });
            scoreTab.sort(function(a, b){
                return b.wynik - a.wynik;
            });

            if(scoreTab.length>10){
                scoreTab.splice(10,1);
            }

        }

        var dataToStore = JSON.stringify(scoreTab);
        localStorage.setItem("klucz",dataToStore);

    }

    function collisionCheck() {
        for(var i=0; i<fuelList.length; i++) {
            if (cartX < (fuelList[i].x + fuelWidth) && (cartX + cartWidth) > fuelList[i].x &&
                cartY < (fuelList[i].y + fuelHeight) && (cartY + cartHeight) > fuelList[i].y ) {
                score=score+10;

                fuelCollision = true;

                if(fuelLength<=63){
                    if( fuelLength < 35 ){
                        fuelLength+=30;
                    }
                    else{
                        fuelLength=65;
                    }
                }
            }
        }
    }

    function enemyCollisionCheck() {
        for(var i=0; i<enemyList.length; i++) {
            if (cartX < (enemyList[i].x + enemyCarWidth) && (cartX + cartWidth) > enemyList[i].x &&
                cartY < (enemyList[i].y + enemyCarHeight) && (cartY + cartHeight) > enemyList[i].y ) {
                gameOver();
            }
        }
        if(fuelLength <= 0){
            gameOver();
        }
    }

    function coinCollisionCheck() {
        for(var i=0; i<coinList.length; i++) {
            if (cartX < (coinList[i].x + fuelWidth) && (cartX + cartWidth) > coinList[i].x &&
                cartY < (coinList[i].y + fuelHeight) && (cartY + cartHeight) > coinList[i].y ) {
                if(respSilver){
                    score+=500;
                }
                else{
                    score+=100;
                }

                coinCollision=true;
            }
        }
    }

    var keyState = {};
    window.addEventListener('keydown',function(e){
        keyState[e.keyCode || e.which] = true;
    },true);

    window.addEventListener('keyup',function(e){
        keyState[e.keyCode || e.which] = false;
    },true);

    $(document).keydown(function(e){
        var key = e.which;
        if(key == 80) {
            if(gameState == "pause") {
                play();
            } else {
                pause();
            }
        }
        if(key == "82" && gameState=="play"){
            restartGame();
        }
    });


    window.addEventListener("load", setup, true);

    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = ( function() {
            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
        } )();
    }
});