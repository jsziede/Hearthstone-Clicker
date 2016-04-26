//all variables are initialized to their default values
var cookiesEnabled = true;              //whether or not the user wants to save progress via cookies
var scoreCounter = 0;                   //the number used for the current score
var accumulator = 0.1;                  //the number that is added to the counter every second
var enemyAccumBonus = 0;                //the additional bonus to the accumulator the enemy provides
var totalAccumulator = accumulator + enemyAccumBonus;   //the total automatic point accumulation, based on the regular accumulator and the bonus provided by the enemy
var multiplier = 1;                     //the number that the accumulator is multiplied by every second
var level = 1;                          //the level of the player and the encountered enemy
var enemyString = "Wisp";               //the name of the current enemy card
var pointsEarnedByClickPerSecond = accumulator;   //statistic to count how many points per second are being earned by clicking the card
var clickBonus = 0;                     //extra points added only when clicking
var enemyHealth = 250;                  //the amount of health (points) an enemy has

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
    totalAccumulator = accumulator + enemyAccumBonus;
    return (totalAccumulator * multiplier);
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
    
    if(getCookie("clickBonus") != "0") {
        clickBonus = parseFloat(getCookie("clickBonus"));
    }
    
    if(getCookie("totalAccumulator") != "0.1") {
        totalAccumulator = parseFloat(getCookie("totalAccumulator"));
    }
    
    if(getCookie("enemyHealth") != "250") {
        enemyHealth = parseFloat(getCookie("enemyHealth"));
    }
}

window.onload = function() {
    //call to display the proper enemy
    getEnemy();
    
    //the score is updated every second to show the constantly updating counter
    document.getElementById("scoreKeeper").innerHTML = Math.round(scoreCounter * 100) / 100;
    
    //string that determines how many points the user is earning each second by clicking
    //the card, and then compares that result to how many points the user earns with the
    //automatic accumulation. the final result of the comparison is returned to the user
    //in a string that reports how many more points per second the user earns by clicking
    document.getElementById("rateKeeper").innerHTML = ("At your current rate of clicking, you are making " + (Math.round((pointsEarnedByClickPerSecond - accumMultProduct()) * 10) / 10) + " more " + pointGrammar(pointsEarnedByClickPerSecond - accumMultProduct()) + " per second than you would be without clicking.");
}

//simple function to store cookies
function setCookie(property, value) {
    document.cookie = property + "=" + value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

//function that increments the counter each second
setInterval(function() {
    
    //function to retrieve the name of enemy and update other string accordingly
    getEnemy();
    
    //counter accumulates with itself along with the time-based accumulator
    scoreCounter = scoreCounter + accumMultProduct();
    
    //check if leveled up.
    //leveling is based on lowering the enemy's health to 0, so one
    //enemy death is equal to one level up
    if(enemyHealth - accumMultProduct() <= 0) {
        enemyHealth = 0;    //prevent string from printing a negative number
        level++;            //user gains one level
        levelUp();          //function to level up is called
    } else {
        //if not leveled up, enemy health is decreased normally
        enemyHealth = enemyHealth - accumMultProduct();
    }
    
    //the score is updated every second to show the constantly updating counter
    document.getElementById("cardHolder").innerHTML = Math.round(scoreCounter * 100) / 100;
    
    //stores cookies if they are enabled
    if(cookiesEnabled) {
        setCookie("cookiesEnabled", cookiesEnabled);
        setCookie("scoreCounter", scoreCounter);
        setCookie("accumulator", accumulator);
        setCookie("multiplier", multiplier);
        setCookie("level", level);
        setCookie("clickBonus", clickBonus);
        setCookie("enemyHealth", enemyHealth);
        setCookie("totalAccumulator", totalAccumulator);
    }
    
    //string that determines how many points the user is earning each second by clicking
    //the card, and then compares that result to how many points the user earns with the
    //automatic accumulation. the final result of the comparison is returned to the user
    //in a string that reports how many more points per second the user earns by clicking
    document.getElementById("rateKeeper").innerHTML = ("At your current rate of clicking, you are making " + (Math.round((pointsEarnedByClickPerSecond - accumMultProduct()) * 10) / 10) + " more " + pointGrammar(pointsEarnedByClickPerSecond - accumMultProduct()) + " per second than you would be without clicking.");
    
    //the accumulator for the above string is reset after being printed
    pointsEarnedByClickPerSecond = totalAccumulator;
}, 1000); //one second per interval

//every time the button that contains the counter is clicked
function cardClick()
{
    getEnemy();
    
    //counter is incremented by one at the beginning,
    //but takes into account the multiplier when obtained
    scoreCounter = scoreCounter + accumMultProduct() + clickBonus;
    if(enemyHealth - (accumMultProduct() + clickBonus) <= 0) {
        enemyHealth = 0;
        level++;
        levelUp();
    } else {
        enemyHealth = enemyHealth - (accumMultProduct() + clickBonus);
    }
    pointsEarnedByClickPerSecond = pointsEarnedByClickPerSecond + accumMultProduct() + clickBonus;
    
    //score is updated every time the button is clicked
    document.getElementById("cardHolder").innerHTML = Math.round(scoreCounter * 100) / 100;
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
function levelUp()
{
    if(level == 1) {
        enemyString = "Wisp";   //prints the enemy's name to the user
        enemyAccumBonus = 0;    //accumulator is increased based on enemy
        enemyHealth = 250;      //enemy's health is assigned
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/147/697/273.png')";
    } else if(level == 2) {
        enemyString = "Murloc Tinyfin";
        enemyAccumBonus = 1;
        enemyHealth = 1000;
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/272/301/27225.png')";
    }
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = ("You have encountered an enemy " + enemyString + "! You need to earn " + Math.round(enemyHealth * 10) / 10 + " more " + pointGrammar(enemyHealth) + " to defeat it.");
    
    //call to display scoring information
    getAccumAndMultString();
    
    //call to find the value of one card click
    getClickValue();
}

//see levelUp() for more details of this function
function getEnemy() {
    if(level == 1) {
        enemyString = "Wisp";
        enemyAccumBonus = 0;
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/147/697/273.png')";
    } else if(level == 2) {
        enemyString = "Murloc Tinyfin";
        enemyAccumBonus = 1;
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/272/301/27225.png')";
    }
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = ("You have encountered an enemy " + enemyString + "! You need to earn " + Math.round(enemyHealth * 10) / 10 + " more " + pointGrammar(enemyHealth) + " to defeat it.");
    
    //call to display scoring information
    getAccumAndMultString();
    
    //call to find the value of one card click
    getClickValue();
}

function getAccumAndMultString() {
    //string below counter button that tells user how much each addition to their score
    //is being multiplied by
    document.getElementById("multKeeper").innerHTML = ("Your score is currently being increased by " + totalAccumulator + " " + pointGrammar(totalAccumulator) + " each second, with a multiplier of " + multiplier + ", totalling " + accumMultProduct() + " " + pointGrammar(accumMultProduct()) + " per second.");
}

//function to tell the user how many points they will earn each time they click the card
function getClickValue() {
    document.getElementById("clickScoreCounter").innerHTML = ("You may also click the card for " + (accumMultProduct()) + " " + pointGrammar(accumMultProduct) + " per click.");
}

//simple function to reset all variables to their default values
function reset() {
    document.getElementById("cardHolder").innerHTML = "0";
    cookiesEnabled = true;
    scoreCounter = 0;
    accumulator = 0.1;
    multiplier = 1;
    level = 1;
    enemyString = "Wisp";
    pointsEarnedByClickPerSecond = totalAccumulator;
    clickBonus = 0;
    
    //call to display the enemy's name and get the proper attributes of it
    levelUp();
}