//all variables are initialized to their default values
var cookiesEnabled = true;  //whether or not the user wants to save progress via cookies
var scoreCounter = 0;       //the number used for the current score
var accumulator = 0.1;      //the number that is added to the counter every second
var multiplier = 1;         //the number that the accumulator is multiplied by every second
var level = 1;              //the level of the player and the encountered enemy
var enemyString = "Wisp";   //the name of the current enemy card
var pointsEarnedByClickPerSecond = 0; //statistic to count how many points per second are being earned by clicking the card

//function to determine if "point" or "points" should be printed
var pointGrammar = function(numberToCompare) {
    if (numberToCompare == 1) {
        return "point";
    } else {
        return "points";
    }
}

//to determine the product of the accumulator and multiplier at any given time
var accumMultProduct = function() {
    return (accumulator * multiplier);
}

//code retrieved from W3C's website to fetch cookies
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

//if the user has cookies enabled, then the script will fetch them
if(getCookie("cookiesEnabled") == "true") {
    loadCookies();
}

function loadCookies() {
    //series of if statements to check cookies.
    //works just like a save in a memory card.
    //all of these checks will only run if cookies/saving is enabled
    if(getCookie("scoreCounter") != "0")
    {
        scoreCounter = parseFloat(getCookie("scoreCounter"));
    }
    
    if(getCookie("accumulator") != "0")
    {
        accumulator = parseFloat(getCookie("accumulator"));
    }
    
    if(getCookie("multiplier") != "0")
    {
        multiplier = parseFloat(getCookie("multiplier"));
    }
    
    if(getCookie("level") != "1")
    {
        level = parseFloat(getCookie("level"));
    }
}

window.onload = function() {
    //call to display the proper enemy
    getEnemy();
    
    //call to display scoring information
    getAccumAndMultString();
    
    //call to find the value of one card click
    getClickValue();
    
    //the score is updated every second to show the constantly updating counter
    document.getElementById("scoreKeeper").innerHTML = Math.round(scoreCounter * 100) / 100;
    
    //string that determines how many points the user is earning each second by clicking
    //the card, and then compares that result to how many points the user earns with the
    //automatic accumulation. the final result of the comparison is returned to the user
    //in a string that reports how many more points per second the user earns by clicking
    document.getElementById("rateKeeper").innerHTML = ("At your current rate of clicking, you are making " + Math.round(pointsEarnedByClickPerSecond / accumMultProduct()) + " more " + pointGrammar(pointsEarnedByClickPerSecond / accumMultProduct()) + " per second than you would be without clicking.");
}

//simple function to store cookies
function setCookie(property, value) {
    document.cookie = property + "=" + value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

//function that increments the counter each second
setInterval(function() {
    
    //counter accumulates with itself along with the time-based accumulator
    scoreCounter = scoreCounter + accumMultProduct();
    
    //the score is updated every second to show the constantly updating counter
    document.getElementById("scoreKeeper").innerHTML = Math.round(scoreCounter * 100) / 100;
    
    //stores cookies if they are enabled
    if(cookiesEnabled) {
        setCookie("cookiesEnabled", "true");
        setCookie("scoreCounter", scoreCounter);
        setCookie("accumulator", accumulator);
        setCookie("multiplier", multiplier);
        setCookie("level", level);
    }
    
    //string that determines how many points the user is earning each second by clicking
    //the card, and then compares that result to how many points the user earns with the
    //automatic accumulation. the final result of the comparison is returned to the user
    //in a string that reports how many more points per second the user earns by clicking
    document.getElementById("rateKeeper").innerHTML = ("At your current rate of clicking, you are making " + Math.round(pointsEarnedByClickPerSecond / accumMultProduct()) + " more " + pointGrammar(pointsEarnedByClickPerSecond / accumMultProduct()) + " per second than you would be without clicking.");
    
    //the accumulator for the above string is reset after being printed
    pointsEarnedByClickPerSecond = 0;
}, 1000); //one second per interval

//every time the button that contains the counter is clicked
function cardClick()
{
    //counter is incremented by one at the beginning,
    //but takes into account the multiplier when obtained
    scoreCounter = scoreCounter + accumMultProduct();
    pointsEarnedByClickPerSecond = pointsEarnedByClickPerSecond + accumMultProduct();
    
    //score is updated every time the button is clicked
    document.getElementById("scoreKeeper").innerHTML = Math.round(scoreCounter * 100) / 100;
}

//called whenever the user clicks a Multiplier Upgrade button
function multiUpgrade()
{
    multiplier = 1.5;
    setCookie("multiplier", multiplier);
    
    //call to display scoring information to the user
    getAccumAndMultString();
    
    //call to find the value of one card click due to the change of the multiplier
    getClickValue();
}

//called whenever the enemy card is changed, aka when user levels up and gains mana
function getEnemy()
{
    if(level == 1) {
        enemyString = "Wisp";
        //accumulator is increased based on enemy
        accumulator = 1;
    }
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = ("You have encountered an enemy " + enemyString + "!");
    
    //call to display scoring information
    getAccumAndMultString();
    
    //call to find the value of one card click
    getClickValue();
}

function getAccumAndMultString() {
    //string below counter button that tells user how much each addition to their score
    //is being multiplied by
    document.getElementById("multKeeper").innerHTML = ("Your score is currently being increased by " + accumulator + " " + pointGrammar(accumulator) + " each second, with a multiplier of " + multiplier + ", totalling " + accumMultProduct() + " " + pointGrammar(accumMultProduct()) + " per second.");
}

//function to tell the user how many points they will earn each time they click the card
function getClickValue() {
    document.getElementById("clickScoreCounter").innerHTML = ("You may also click the card for " + (accumMultProduct()) + " " + pointGrammar(accumMultProduct) + " per click.");
}