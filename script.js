//all variables are initialized to their default values
var cookiesEnabled = true;              //whether or not the user wants to save progress via cookies
var scoreCounter = 0;                   //the number used for the current score
var accumulator = 0.1;                  //the number that is added to the counter every second
var multiplier = 1;                     //the number that the accumulator is multiplied by every second
var level = 0;                          //the level of the player and the encountered enemy
var clickBonus = 0;                     //extra points added only when clicking
var pointsEarnedByClickPerSecond = accumulator + clickBonus;   //statistic to count how many points per second are being earned by clicking the card
var enemy = {
    name: "Target Dummy",   //name of the enemy
    health: 2000,    //how many points to earn to kill the enemy
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
        
        return "At your current rate of clicking, you are making " + (Math.round((pointsEarnedByClickPerSecond - accumMultProduct()) * 10) / 10) + " more " + pointGrammar(Math.round((pointsEarnedByClickPerSecond - accumMultProduct()) * 10) / 10) + " per second than you would be without clicking.";
        
    } else if (nameOfString == "getStringEnemy") {
        
        return "You have encountered an enemy " + enemy.name + "! You need to earn " + Math.round(enemy.health * 10) / 10 + " more " + pointGrammar(Math.round(enemy.health * 10) / 10) + " to defeat it.";
        
    } else if (nameOfString == "getStringAccumInfo") {
        
        return "Your score is currently being increased by " + Math.round(totalAccumulator * 10) / 10 + " " + pointGrammar(Math.round(totalAccumulator * 10) / 10) + " each second, with a multiplier of " + Math.round(multiplier * 10) /10 + ", totalling " + Math.round(accumMultProduct() * 10) / 10 + " " + pointGrammar(Math.round(accumMultProduct() * 10) / 10) + " per second.";
        
    } else if (nameOfString == "getStringClickVal") {
        
        return "You may also click the card for " + Math.round(accumMultProduct() * 10) / 10 + " " + pointGrammar(Math.round(accumMultProduct() * 10) / 10) + " per click.";
        
    } else if (nameOfString == "getStringAccumUpgradeIncrease") {
    
        return ("Accumulator +" + accumBoost(upgrade.accum) + " " + pointGrammar(accumBoost(upgrade.accum)));
        
    } else if (nameOfString == "getStringAccumUpgradeCost") {
        
        return ("Cost: " + Math.round(accumCost(upgrade.accum) * 10) / 10 + " " + pointGrammar(accumCost(upgrade.accum)));
        
    }  else if (nameOfString == "getStringMultiUpgradeIncrease") {
    
        return ("Multiplier +" + Math.round((0.1 * level) * 10) / 10 + " " + pointGrammar(upgrade.multi + 0.1));
        
    } else if (nameOfString == "getStringMultiUpgradeCost") {
        
        return ("Cost: " + Math.round(multiCost(upgrade.multi) * 10) /10 + " " + pointGrammar(multiCost(upgrade.multi)));
        
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
    return (Math.pow(accumUpgradeLevel, 2) * (level * accumUpgradeLevel)) + 10;
}

//determines the increase to the accumulator for each upgrade
var accumBoost = function(accumUpgradeLevel) {
    return (Math.pow(accumUpgradeLevel, 2) * 0.01);
}

//determines the cost to purchase an upgrade for the multiplier
var multiCost = function(multiUpgradeLevel) {
    return Math.pow(multiUpgradeLevel, 2) * (500 * multiUpgradeLevel);
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
    //call to display the proper enemy
    getEnemy();
    
    //display all upgrade info in the GUI buttons
    getButtonStrings();
    
    //the score is updated every second to show the constantly updating counter
    document.getElementById("score").innerHTML = getString("getStringCard");
    
    //string that determines how many points the user is earning each second by clicking
    //the card, and then compares that result to how many points the user earns with the
    //automatic accumulation. the final result of the comparison is returned to the user
    //in a string that reports how many more points per second the user earns by clicking
    document.getElementById("rateKeeper").innerHTML = getString("getStringCompare");
    
    pointsEarnedByClickPerSecond = accumMultProduct();
}

//simple function to store cookies
function setCookie(property, value) {
    document.cookie = property + "=" + value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

//function that increments the counter each second
setInterval(function() {
    
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
    document.getElementById("score").innerHTML = getString("getStringCard");
    
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
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = getString("getStringEnemy");
    
    //the accumulator for the above string is reset after being printed
    pointsEarnedByClickPerSecond = accumMultProduct();
}, 1000); //one second per interval

//every time the button that contains the counter is clicked
function cardClick()
{
    scoreCounter = scoreCounter + accumMultProduct() + clickBonus;
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = getString("getStringEnemy");

    if(enemy.health - (accumMultProduct() + clickBonus) <= 0) {
        enemy.health = 0;
        level++;
        levelUp();
    } else {
        enemy.health = enemy.health - (accumMultProduct() + clickBonus);
    }
    pointsEarnedByClickPerSecond = pointsEarnedByClickPerSecond + accumMultProduct() + clickBonus;
    
    //score is updated every time the button is clicked
    document.getElementById("score").innerHTML = getString("getStringCard");
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
    document.getElementById("score").innerHTML = "0";
    cookiesEnabled = true;
    scoreCounter = 0;
    accumulator = 0.1;
    multiplier = 1;
    level = 1;
    enemy.name = "Target Dummy";
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
        scoreCounter -= accumCost(upgrade.accum);
        accumulator += accumBoost(upgrade.accum);
        upgrade.accum++;
        totalAccumulator = accumulator + enemy.accumBonus;
        getButtonStrings();
        getAccumAndMultString();
        getClickValue();
        document.getElementById("score").innerHTML = getString("getStringCard");
        pointsEarnedByClickPerSecond = accumMultProduct();
    }
}

//called whenever the user clicks a Multiplier Upgrade button
function multiClick()
{
    if (scoreCounter >= multiCost(upgrade.multi)) {
        scoreCounter -= multiCost(upgrade.multi);
        upgrade.multi += (0.1 * level);
        multiplier = upgrade.multi;
        getButtonStrings();
        document.getElementById("score").innerHTML = getString("getStringCard");
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

function getEnemy() {
    if(level == 0) {
        level = 1;
    }
    
    if(level == 1) {
        enemy.name = "Target Dummy";
        enemy.accumBonus = 0;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/kfCDZgc.png')";
        document.getElementById("container").style.background = "url('http://img04.deviantart.net/b00a/i/2013/009/b/6/morning_in_the_town_by_puyoakira-d5qxx2h.jpg')";
        document.getElementById("artLink").innerHTML = "puyoakira";
        document.getElementById("artLink").href = "http://puyoakira.deviantart.com/art/Morning-in-the-Town-347583401";
    } else if(level == 2) {
        enemy.name = "Angry Chicken";
        enemy.accumBonus = 1;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/hzPhGO2.png')";
        document.getElementById("container").style.background = "url('http://img04.deviantart.net/b00a/i/2013/009/b/6/morning_in_the_town_by_puyoakira-d5qxx2h.jpg')";
        document.getElementById("artLink").innerHTML = "puyoakira";
        document.getElementById("artLink").href = "http://puyoakira.deviantart.com/art/Morning-in-the-Town-347583401";
    } else if(level == 3) {
        enemy.name = "Lowly Squire";
        enemy.accumBonus = 5;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/whYbFdT.png')";
        document.getElementById("container").style.background = "url('http://img08.deviantart.net/f247/i/2014/224/f/6/castle_gate_by_jonathandufresne-d7uxbmw.jpg')";
        document.getElementById("artLink").innerHTML = "JonathanDufresne";
        document.getElementById("artLink").href = "http://jonathandufresne.deviantart.com/art/Castle-Gate-475206440";
    } else if(level == 4) {
        enemy.name = "Abusive Sergeant";
        enemy.accumBonus = 10;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/mOZ268Q.png')";
        document.getElementById("container").style.background = "url('http://img08.deviantart.net/f247/i/2014/224/f/6/castle_gate_by_jonathandufresne-d7uxbmw.jpg')";
        document.getElementById("artLink").innerHTML = "JonathanDufresne";
        document.getElementById("artLink").href = "http://jonathandufresne.deviantart.com/art/Castle-Gate-475206440";
    } else if(level == 5) {
        enemy.name = "Explosive Sheep";
        enemy.accumBonus = 25;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/u7HcYcC.png')";
        document.getElementById("container").style.background = "url('http://img00.deviantart.net/8d83/i/2013/006/9/9/fantasy_river_by_lac_tic-d5qnsls.jpg')";
        document.getElementById("artLink").innerHTML = "Lac-Tic";
        document.getElementById("artLink").href = "http://lac-tic.deviantart.com/art/Fantasy-River-347111056";
    } else if(level == 6) {
        enemy.name = "River Crocolisk";
        enemy.accumBonus = 45;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/h9NOsOE.png')";
        document.getElementById("container").style.background = "url('http://img00.deviantart.net/8d83/i/2013/006/9/9/fantasy_river_by_lac_tic-d5qnsls.jpg')";
        document.getElementById("artLink").innerHTML = "Lac-Tic";
        document.getElementById("artLink").href = "http://lac-tic.deviantart.com/art/Fantasy-River-347111056";
    } else if(level == 7) {
        enemy.name = "Silithid Swarmer";
        enemy.accumBonus = 100;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/7NqhYfd.png')";
        document.getElementById("container").style.background = "url('http://orig05.deviantart.net/a8e9/f/2015/071/b/b/forrest_concept_picture_003_by_kevsanlevsan-d8lftun.jpg')";
        document.getElementById("artLink").innerHTML = "KevsanLevsan";
        document.getElementById("artLink").href = "http://kevsanlevsan.deviantart.com/art/Fantasy-Forest-519739871";
    } else if(level == 8) {
        enemy.name = "Grove Tender";
        enemy.accumBonus = 230;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/mKJxRR6.png')";
        document.getElementById("container").style.background = "url('http://orig05.deviantart.net/a8e9/f/2015/071/b/b/forrest_concept_picture_003_by_kevsanlevsan-d8lftun.jpg')";
        document.getElementById("artLink").innerHTML = "KevsanLevsan";
        document.getElementById("artLink").href = "http://kevsanlevsan.deviantart.com/art/Fantasy-Forest-519739871";
    } else if(level == 9) {
        enemy.name = "Armored Warhorse";
        enemy.accumBonus = 440;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/x0sNrsY.png')";
        document.getElementById("container").style.background = "url('http://orig12.deviantart.net/64a7/f/2012/320/9/f/9f1c3fca54f8764c87596fa8d11d1c00-d5l7g72.jpg')";
        document.getElementById("artLink").innerHTML = "Balaskas";
        document.getElementById("artLink").href = "http://balaskas.deviantart.com/art/Twisted-Mountain-Valley-337950398";
    } else if(level == 10) {
        enemy.name = "Dragonkin Sorcerer";
        enemy.accumBonus = 750;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/oGq9vrV.png')";
        document.getElementById("container").style.background = "url('http://orig12.deviantart.net/64a7/f/2012/320/9/f/9f1c3fca54f8764c87596fa8d11d1c00-d5l7g72.jpg')";
        document.getElementById("artLink").innerHTML = "Balaskas";
        document.getElementById("artLink").href = "http://balaskas.deviantart.com/art/Twisted-Mountain-Valley-337950398";
    } else if(level == 11) {
        enemy.name = "Kvaldir Raider";
        enemy.accumBonus = 1120;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/85Q6iTw.png')";
        document.getElementById("container").style.background = "url('http://orig11.deviantart.net/3885/f/2012/279/c/e/mountain_view_by_meisl-d5gsvno.jpg')";
        document.getElementById("artLink").innerHTML = "digital-fantasy";
        document.getElementById("artLink").href = "http://digital-fantasy.deviantart.com/art/mountain-view-330552132";
    } else if(level == 12) {
        enemy.name = "Thunder Bluff Valiant";
        enemy.accumBonus = 3300;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/cis9irX.png')";
        document.getElementById("container").style.background = "url('http://orig11.deviantart.net/3885/f/2012/279/c/e/mountain_view_by_meisl-d5gsvno.jpg')";
        document.getElementById("artLink").innerHTML = "digital-fantasy";
        document.getElementById("artLink").href = "http://digital-fantasy.deviantart.com/art/mountain-view-330552132";
    } else if(level == 13) {
        enemy.name = "Frost Elemental";
        enemy.accumBonus = 6000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/17LakvD.png')";
        document.getElementById("container").style.background = "url('http://orig14.deviantart.net/e0af/f/2012/068/4/1/dark_mountain___game_background_4_by_ranivius-d4s9v22.jpg')";
        document.getElementById("artLink").innerHTML = "Ranivius";
        document.getElementById("artLink").href = "http://ranivius.deviantart.com/art/Dark-mountain-game-background-4-289354106";
    } else if(level == 14) {
        enemy.name = "Coldarra Drake";
        enemy.accumBonus = 10500;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/4R7CDfR.png')";
        document.getElementById("container").style.background = "url('http://orig14.deviantart.net/e0af/f/2012/068/4/1/dark_mountain___game_background_4_by_ranivius-d4s9v22.jpg')";
        document.getElementById("artLink").innerHTML = "Ranivius";
        document.getElementById("artLink").href = "http://ranivius.deviantart.com/art/Dark-mountain-game-background-4-289354106";
    } else if(level == 15) {
        enemy.name = "Obsidian Destroyer";
        enemy.accumBonus = 15450;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/OdrvRLu.png')";
        document.getElementById("container").style.background = "url('http://img09.deviantart.net/6f43/i/2010/141/0/2/landscape_by_ourlak.jpg')";
        document.getElementById("artLink").innerHTML = "ourlak";
        document.getElementById("artLink").href = "http://artozi.deviantart.com/art/landscape-164793264";
    } else if(level == 16) {
        enemy.name = "War Golem";
        enemy.accumBonus = 17500;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/RXkH2CJ.png')";
        document.getElementById("container").style.background = "url('http://img09.deviantart.net/6f43/i/2010/141/0/2/landscape_by_ourlak.jpg')";
        document.getElementById("artLink").innerHTML = "ourlak";
        document.getElementById("artLink").href = "http://artozi.deviantart.com/art/landscape-164793264";
    } else if(level == 17) {
        enemy.name = "Eldritch Horror";
        enemy.accumBonus = 23500;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/wILr8X2.png')";
        document.getElementById("container").style.background = "url('http://pre07.deviantart.net/9ffe/th/pre/f/2012/082/0/d/bhel_sea_by_korbox-d4rdkn4.jpg')";
        document.getElementById("artLink").innerHTML = "korbox";
        document.getElementById("artLink").href = "http://matchack.deviantart.com/art/Bhel-Sea-287847616";
    } else if(level == 18) {
        enemy.name = "Giant Sand Worm";
        enemy.accumBonus = 31000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/pJrKdcn.png')";
        document.getElementById("container").style.background = "url('http://pre07.deviantart.net/9ffe/th/pre/f/2012/082/0/d/bhel_sea_by_korbox-d4rdkn4.jpg')";
        document.getElementById("artLink").innerHTML = "korbox";
        document.getElementById("artLink").href = "http://matchack.deviantart.com/art/Bhel-Sea-287847616";
    } else if(level == 19) {
        enemy.name = "Sea Giant";
        enemy.accumBonus = 45000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/m9pctAL.png')";
        document.getElementById("container").style.background = "url('http://pre05.deviantart.net/05b9/th/pre/f/2010/281/b/6/storm_by_blinck-d30bli2.jpg')";
        document.getElementById("artLink").innerHTML = "JJcanvas";
        document.getElementById("artLink").href = "http://www.deviantart.com/art/Storm-181939610";
    } else if(level == 20) {
        enemy.name = "Soggoth the Slitherer";
        enemy.accumBonus = 75000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/Hkyxvb7.png')";
        document.getElementById("container").style.background = "url('http://pre05.deviantart.net/05b9/th/pre/f/2010/281/b/6/storm_by_blinck-d30bli2.jpg')";
        document.getElementById("artLink").innerHTML = "JJcanvas";
        document.getElementById("artLink").href = "http://www.deviantart.com/art/Storm-181939610";
    } else if(level == 21) {
        enemy.name = "North Sea Kraken";
        enemy.accumBonus = 90000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/E27iuAU.png')";
        document.getElementById("container").style.background = "url('http://pre10.deviantart.net/54cf/th/pre/i/2012/138/b/7/the_maelstrom_by_silentillusion-d50ac1n.jpg')";
        document.getElementById("artLink").innerHTML = "silentillusion";
        document.getElementById("artLink").href = "http://silentillusion.deviantart.com/art/The-Maelstrom-302813051";
    } else if(level == 22) {
        enemy.name = "N'Zoth, the Corruptor";
        enemy.accumBonus = 115000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/3NgD1wN.png')";
        document.getElementById("container").style.background = "url('http://orig14.deviantart.net/71dc/f/2011/090/2/6/dead_sea_cave_by_lion794-d3ctdab.png')";
        document.getElementById("artLink").innerHTML = "lion794";
        document.getElementById("artLink").href = "http://www.deviantart.com/art/Dead-Sea-Cave-202924163";
    } else if(level == 23) {
        enemy.name = "Molten Giant";
        enemy.accumBonus = 140000;
        
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/I15B6YC.png')";
        document.getElementById("container").style.background = "url('http://orig07.deviantart.net/2b9f/f/2012/219/6/8/lava_by_zhangc-d5a5d5h.jpg')";
        document.getElementById("artLink").innerHTML = "zhangc";
        document.getElementById("artLink").href = "http://martanael.deviantart.com/art/lava-319377365";
    } else if(level == 24) {
        enemy.name = "Deathwing, Dragonlord";
        enemy.accumBonus = 185000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/yV9OcGq.png')";
        document.getElementById("container").style.background = "url('http://pre05.deviantart.net/a3ed/th/pre/f/2014/008/b/0/volcano_eruption_by_fel_x-d71cqt4.jpg')";
        document.getElementById("artLink").innerHTML = "Fel-X";
        document.getElementById("artLink").href = "http://fel-x.deviantart.com/art/Volcano-Eruption-425537464";
    } else if(level == 25) {
        enemy.name = "Yogg-Saron, Hope's End";
        enemy.accumBonus = 250000;
        document.getElementById("cardHolder").style.background = "url('http://i.imgur.com/FqzpmH0.png')";
        document.getElementById("container").style.background = "url('http://pre10.deviantart.net/f8d0/th/pre/i/2014/287/b/2/lucid_dreams_by_gypsyh-d82sx6e.jpg')";
        document.getElementById("artLink").innerHTML = "GypsyH";
        document.getElementById("artLink").href = "http://gypsyh.deviantart.com/art/Lucid-Dreams-488438006";
    } else {
        level = 25;
    }
    
    totalAccumulator = accumulator + enemy.accumBonus;
    
    //clarify CSS properties here because changing the background using JS will cause the background-size and background-cover properties from the CSS file to be ignored
    document.getElementById("artLink").style.textDecoration = "none";
    document.getElementById("artLink").style.color = "#1166AA";
    
    //the name of the enemy is printed to the user
    document.getElementById("encounterText").innerHTML = getString("getStringEnemy");
    
    //call to display scoring information
    getAccumAndMultString();
    
    //call to find the value of one card click
    getClickValue();
}

//called whenever the enemy card is changed, aka when user levels up
function levelUp()
{
    if (level == 1) {
        enemy.health = 2000;      //enemy's health is assigned
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/GVG_093_TargetDummy_EnterPlay.mp3');                    //audio is played; this is the sound that you hear in Hearthstone when this card is played
        audio.play();
    } else if (level == 2) {
        enemy.health = 15000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/SFX_EX1_009_EnterPlay.mp3');
        audio.play();
    } else if (level == 3) {
        enemy.health = 80000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_AT_082_PLAY_01.mp3');
        audio.play();
    } else if (level == 4) {
        enemy.health = 500000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_CS2_188_Play_01.mp3');
        audio.play();
    } else if (level == 5) {
        enemy.health = 1250000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/SFX_GVG_076_EnterPlay.mp3');
        audio.play();
    } else if (level == 6) {
        enemy.health = 4000000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/SFX_CS2_120_EnterPlay.mp3');
        audio.play();
    } else if (level == 7) {
        enemy.health = 13500000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/OG_034_SilithidSwarmer_Play.mp3');
        audio.play();
    } else if (level == 8) {
        enemy.health = 25650500;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_GVG_032_Play_01.mp3');
        audio.play();
    } else if (level == 9) {
        enemy.health = 67245000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/SFX_AT_108_Play_01.mp3');
        audio.play();
    } else if (level == 10) {
        enemy.health = 195850250;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_BRM_020_Play_01.mp3');
        audio.play();
    } else if (level == 11) {
        enemy.health = 300455000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_AT_119_PLAY_01.mp3');
        audio.play();
    } else if (level == 12) {
        enemy.health = 999999999;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_AT_049_PLAY_01.mp3');
        audio.play();
    } else if (level == 13) {
        enemy.health = 1250000000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/SFX_EX1_283_EnterPlay.mp3');
        audio.play();
    } else if (level == 14) {
        enemy.health = 3450985500;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/AT_008_ColdarraDrake_Play_1.mp3');
        audio.play();
    } else if (level == 15) {
        enemy.health = 7000000000;
        //var audio = new Audio(''); //need sound for obsidian destroyer
        //audio.play();
    } else if (level == 16) {
        enemy.health = 10000000000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/CS2_186_War_Golem_EnterPlay1.mp3');
        audio.play();
    } else if (level == 17) {
        enemy.health = 14590000000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_OG_142_Male_Faceless_Play_01.mp3');
        audio.play();
    } else if (level == 18) {
        enemy.health = 20100450500;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/OG_308_GiantSandWorm_Play.mp3');
        audio.play();
    } else if (level == 19) {
        enemy.health = 30123456700;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/SFX_EX1_586_EnterPlay.mp3');
        audio.play();
    } else if (level == 20) {
        enemy.health = 50697685000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_OG_340_Male_Faceless_Play_01.mp3');
        audio.play();
    } else if (level == 21) {
        enemy.health = 78940500750;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/SFX_AT_103_Play.mp3');
        audio.play();
    } else if (level == 22) {
        enemy.health = 99999999999;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_OG_042_Male_OldGod_Play_01.mp3');
        audio.play();
    } else if (level == 23) {
        enemy.health = 150000000000;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/EX1_620_Molten_Giant_EnterPlay2.mp3');
        audio.play();
    } else if (level == 24) {
        enemy.health = 423456934500;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_OG_317_Male_Dragon_Play_01.mp3');
        audio.play();
    } else if (level == 25) {
        enemy.health = 999999999999;
        var audio = new Audio('http://wow.zamimg.com/hearthhead/sounds/VO_OG_134_Male_OldGod_Play_01.mp3');
        audio.play();
    } else {
        enemy.health = 0;
    }
    
    getButtonStrings();
    getEnemy();
}

function levelUpButton() {
    level++;
    levelUp();
}