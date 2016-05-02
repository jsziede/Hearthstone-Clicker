//all variables are initialized to their default values
var cookiesEnabled = true;              //whether or not the user wants to save progress via cookies
var scoreCounter = 0;                   //the number used for the current score
var accumulator = 0.1;                  //the number that is added to the counter every second
var multiplier = 1;                     //the number that the accumulator is multiplied by every second
var level = 1;                          //the level of the player and the encountered enemy
var clickBonus = 0;                     //extra points added only when clicking
var pointsEarnedByClickPerSecond = accumulator + clickBonus;   //statistic to count how many points per second are being earned by clicking the card
var enemy = {
    name: "Wisp",   //name of the enemy
    health: 250,    //how many points to earn to kill the enemy
    accumBonus: 0   //additional points to the accumulator that the enemy provides
};

//stores the levels of each upgrade, to be used with the upgrade buttons in the GUI
var upgrade = {
    accum: 1,
    multi: 1,
    click: 1
};

var totalAccumulator = accumulator + enemy.accumBonus;   //the total automatic point accumulation, based on the regular accumulator and the bonus provided by the enemy

var getString = function(nameOfString) {
    if (nameOfString == "getStringCard") {
        
        return Math.round(scoreCounter * 10) / 10;
        
    } else if (nameOfString == "getStringCompare") {
        
        return "At your current rate of clicking, you are making " + (Math.round((pointsEarnedByClickPerSecond - accumMultProduct()) * 10) / 10) + " more " + pointGrammar(pointsEarnedByClickPerSecond - accumMultProduct()) + " per second than you would be without clicking.";
        
    } else if (nameOfString == "getStringEnemy") {
        
        return "You have encountered an enemy " + enemy.name + "! You need to earn " + Math.round(enemy.health * 10) / 10 + " more " + pointGrammar(enemy.health) + " to defeat it.";
        
    } else if (nameOfString == "getStringAccumInfo") {
        
        return "Your score is currently being increased by " + Math.round(totalAccumulator * 10) / 10 + " " + pointGrammar(totalAccumulator) + " each second, with a multiplier of " + multiplier + ", totalling " + Math.round(accumMultProduct() * 10) / 10 + " " + pointGrammar(accumMultProduct()) + " per second.";
        
    } else if (nameOfString == "getStringClickVal") {
        
        return "You may also click the card for " + Math.round(accumMultProduct() * 10) / 10 + " " + pointGrammar(accumMultProduct) + " per click.";
        
    } else if (nameOfString == "getStringAccumUpgradeIncrease") {
    
        return ("Accumulator +" + accumBoost(upgrade.accum) + " " + pointGrammar(accumBoost(upgrade.accum)));
        
    } else if (nameOfString == "getStringAccumUpgradeCost") {
        
        return ("Cost: " + accumCost(upgrade.accum) + " " + pointGrammar(accumCost(upgrade.accum)));
        
    }  else if (nameOfString == "getStringMultiUpgradeIncrease") {
    
        return ("Multiplier x" + (upgrade.multi + 1) + " " + pointGrammar(upgrade.multi + 1));
        
    } else if (nameOfString == "getStringMultiUpgradeCost") {
        
        return ("Cost: " + multiCost(upgrade.multi) + " " + pointGrammar(multiCost(upgrade.multi)));
        
    }
}

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
    totalAccumulator = accumulator + enemy.accumBonus;
    return (totalAccumulator * multiplier);
}

//determines the cost to purchase an upgrade for the accumulator
var accumCost = function(accumUpgradeLevel) {
    return Math.pow(2, accumUpgradeLevel) * 10;
}

//determines the increase to the accumulator for each upgrade
var accumBoost = function(accumUpgradeLevel) {
    return Math.pow(accumUpgradeLevel, 2) / 10;
}

//determines the cost to purchase an upgrade for the multiplier
var multiCost = function(multiUpgradeLevel) {
    var a = multiUpgradeLevel;
    var b = 0;
    var c = 0;
    
    for (var i = 0; i < multiUpgradeLevel; i++)
    {
        b = a - 1;
        c = c + (a + b);
        a++;
    }
    
    return c * 1000;
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
        enemy.health = parseFloat(getCookie("enemyHealth"));
    }
    if(getCookie("upgrade.accum") != "1") {
        upgrade.accum = parseFloat(getCookie("upgrade.accum"));
    }
    if(getCookie("upgrade.multi") != "1") {
        upgrade.multi = parseFloat(getCookie("upgrade.multi"));
    }
}

window.onload = function() {
    pointsEarnedByClickPerSecond = accumMultProduct();
    
    //call to display the proper enemy
    getEnemy();
    
    //display all upgrade info in the GUI buttons
    getButtonStrings();
    
    //the score is updated every second to show the constantly updating counter
    document.getElementById("cardHolder").innerHTML = getString("getStringCard");
    
    //string that determines how many points the user is earning each second by clicking
    //the card, and then compares that result to how many points the user earns with the
    //automatic accumulation. the final result of the comparison is returned to the user
    //in a string that reports how many more points per second the user earns by clicking
    document.getElementById("rateKeeper").innerHTML = getString("getStringCompare");
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
    if(enemy.health - accumMultProduct() <= 0) {
        enemy.health = 0;    //prevent string from printing a negative number
        level++;            //user gains one level
        levelUp();          //function to level up is called
    } else {
        //if not leveled up, enemy health is decreased normally
        enemy.health = enemy.health - accumMultProduct();
    }
    
    //the score is updated every second to show the constantly updating counter
    document.getElementById("cardHolder").innerHTML = getString("getStringCard");
    
    //stores cookies if they are enabled
    if(cookiesEnabled) {
        setCookie("cookiesEnabled", cookiesEnabled);
        setCookie("scoreCounter", scoreCounter);
        setCookie("accumulator", accumulator);
        setCookie("multiplier", multiplier);
        setCookie("level", level);
        setCookie("clickBonus", clickBonus);
        setCookie("enemyHealth", enemy.health);
        setCookie("totalAccumulator", totalAccumulator);
        setCookie("upgrade.accum", upgrade.accum);
        setCookie("upgrade.multi", upgrade.multi);
    }
    
    //string that determines how many points the user is earning each second by clicking
    //the card, and then compares that result to how many points the user earns with the
    //automatic accumulation. the final result of the comparison is returned to the user
    //in a string that reports how many more points per second the user earns by clicking
    document.getElementById("rateKeeper").innerHTML = getString("getStringCompare");
    
    //the accumulator for the above string is reset after being printed
    pointsEarnedByClickPerSecond = accumMultProduct();
}, 1000); //one second per interval

//every time the button that contains the counter is clicked
function cardClick()
{
    getEnemy();
    
    //counter is incremented by one at the beginning,
    //but takes into account the multiplier when obtained
    scoreCounter = scoreCounter + accumMultProduct() + clickBonus;
    if(enemy.health - (accumMultProduct() + clickBonus) <= 0) {
        enemy.health = 0;
        level++;
        levelUp();
    } else {
        enemy.health = enemy.health - (accumMultProduct() + clickBonus);
    }
    pointsEarnedByClickPerSecond = pointsEarnedByClickPerSecond + accumMultProduct() + clickBonus;
    
    //score is updated every time the button is clicked
    document.getElementById("cardHolder").innerHTML = getString("getStringCard");
}

//called whenever the enemy card is changed, aka when user levels up and gains mana
function levelUp()
{
    if(level == 1) {
        enemy.name = "Wisp";   //prints the enemy's name to the user
        enemy.accumBonus = 0;    //accumulator is increased based on enemy
        enemy.health = 250;      //enemy's health is assigned
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/147/697/273.png')";
    } else if(level == 2) {
        enemy.string = "Murloc Tinyfin";
        enemy.accumBonus = 1;
        enemy.health = 1000;
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/272/301/27225.png')";
    }
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = getString("getStringEnemy");
    
    //call to display scoring information
    getAccumAndMultString();
    
    //call to find the value of one card click
    getClickValue();
}

//see levelUp() for more details of this function
function getEnemy() {
    if(level == 1) {
        enemy.name = "Wisp";
        enemy.accumBonus = 0;
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/147/697/273.png')";
    } else if(level == 2) {
        enemy.name = "Murloc Tinyfin";
        enemy.accumBonus = 1;
        document.getElementById("cardHolder").style.background = "url('http://media-hearth.cursecdn.com/avatars/272/301/27225.png')";
    }
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = getString("getStringEnemy");
    
    //call to display scoring information
    getAccumAndMultString();
    
    //call to find the value of one card click
    getClickValue();
}

function getAccumAndMultString() {
    //string below counter button that tells user how much each addition to their score
    //is being multiplied by
    document.getElementById("multKeeper").innerHTML = getString("getStringAccumInfo")
}

//function to tell the user how many points they will earn each time they click the card
function getClickValue() {
    document.getElementById("clickScoreCounter").innerHTML = getString("getStringClickVal");
}

//simple function to reset all variables to their default values
function reset() {
    document.getElementById("cardHolder").innerHTML = "0";
    cookiesEnabled = true;
    scoreCounter = 0;
    accumulator = 0.1;
    multiplier = 1;
    level = 1;
    enemy.name = "Wisp";
    pointsEarnedByClickPerSecond = accumMultProduct();
    clickBonus = 0;
    upgrade.accum = 1;
    upgrade.multi = 1;
    
    //call to display the enemy's name and get the proper attributes of it
    levelUp();
    
    getButtonStrings();
}

//every time the user clicks the accumulator upgrade button in the GUI
function accumClick() {
    if (scoreCounter >= accumCost(upgrade.accum)) {
        scoreCounter = scoreCounter - accumCost(upgrade.accum);
        accumulator = accumulator + accumBoost(upgrade.accum);
        upgrade.accum++;
        getButtonStrings();
        document.getElementById("cardHolder").innerHTML = getString("getStringCard");
        getAccumAndMultString();
        getClickValue();
        pointsEarnedByClickPerSecond = accumMultProduct();
    }
}

//called whenever the user clicks a Multiplier Upgrade button
function multiClick()
{
    if (scoreCounter >= multiCost(upgrade.multi)) {
        scoreCounter = scoreCounter - multiCost(upgrade.multi);
        upgrade.multi++;
        getButtonStrings();
        document.getElementById("cardHolder").innerHTML = getString("getStringCard");
        getAccumAndMultString();
        getClickValue();
        pointsEarnedByClickPerSecond = accumMultProduct();
    }
}

//prints all of the cost and upgrade info in the upgrade buttons from the GUI
function getButtonStrings() {
    //prints info to the button in the GUI
    document.getElementById("accumUpgrade").innerHTML = getString("getStringAccumUpgradeIncrease") + "<br>" + getString("getStringAccumUpgradeCost");
    
    document.getElementById("multiUpgrade").innerHTML = getString("getStringMultiUpgradeIncrease") + "<br>" + getString("getStringMultiUpgradeCost");
}