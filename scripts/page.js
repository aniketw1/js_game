// ===================== Winter 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Counters
let throwingItemIdx = 1;

// Size Constants
const FLOAT_1_WIDTH = 149;
const FLOAT_2_WIDTH = 101;
const FLOAT_SPEED = 2;
const PERSON_SPEED = 25;
const OBJECT_REFRESH_RATE = 50;  //ms
const SCORE_UNIT = 100;  // scoring is in 100-point units

// Size vars
let maxPersonPosX, maxPersonPosY;
let maxItemPosX;
let maxItemPosY;

// Global Window Handles (gwh__)
let gwhGame, gwhStatus, gwhScore;

// Global Object Handles
let player;
let paradeRoute;
let paradeFloat1;
let paradeFloat2;
let paradeTimer;

/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
};

let createThrowingItemIntervalHandle;
let currentThrowingFrequency = 2000;


// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready( function() {
  console.log("Ready!");
  
  // TODO: Event handlers for the settings panel

  // TODO: Add a splash screen and delay starting the game
  const splash = document.querySelector('.splash');
  
  // document.addEventListener('DOMContentLoaded', function(){
  //   setTimeout( () => {
  //     //splash.classList.add('.display-none');
  //     splash.remove();
  //   }, 30);
  // } )

  $('.splash').delay(200).animate({ opacity: '0' }, 1000);
  
  // setTimeout(function() {
  //     document.querySelector(".splash").style.display = "none";
  // }, 2000);

  // Set global handles (now that the page is loaded)
  // Allows us to quickly access parts of the DOM tree later
  gwhGame = $('#actualGame');
  gwhStatus = $('.status-window');
  gwhScore = $('#score-box');
  player = $('#player');  // set the global player handle
  paradeRoute = $("#paradeRoute");
  paradeFloat1 = $("#paradeFloat1");
  paradeFloat2 = $("#paradeFloat2");

  // Set global positions for thrown items
  maxItemPosX = $('.game-window').width() - 50;
  maxItemPosY = $('.game-window').height() - 40;

  // Set global positions for the player
  maxPersonPosX = $('.game-window').width() - player.width();
  maxPersonPosY = $('.game-window').height() - player.height();

  
  
  // Keypress event handler
  $(window).keydown(keydownRouter);
  
  // Periodically check for collisions with thrown items (instead of checking every position-update)
  setInterval( function() {
    checkCollisions();
  }, 100);

  // Move the parade floats
  startParade();

  // $(document).on('click', "#r8", function(){
  //   $("#r8").unbind().click(function(){
  //   $('.throwingItem_b').addClass('fade-in');
  //   $(window).alert("hello");
  //   var paras = document.getElementsByClassName('.throwingItem_b');
  //   var daras = document.getElementsByClassName('.throwingItem_c');
  //   while(paras[0]) {
  //       paras[0].parentNode.removeChild(paras[0]);
  //   }   
  //   while(daras[0]) {
  //       daras[0].parentNode.removeChild(daras[0]);
  //   }
  // } );

  // Throw items onto the route at the specified frequency
  createThrowingItemIntervalHandle = setInterval(createThrowingItem, currentThrowingFrequency);
});

// Key down event handler
// Check which key is pressed and call the associated function
function keydownRouter(e) {
  switch (e.which) {
    case KEYS.shift:
      break;
    case KEYS.spacebar:
      break;
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      movePerson(e.which);
      break;
    default:
      console.log("Invalid input!");
  }
}

// Handle player movement events
// TODO: Stop the player from moving into the parade float. Only update if
// there won't be a collision
function movePerson(arrow) {
  
  switch (arrow) {
    case KEYS.left: { // left arrow
      let newPos = parseInt(player.css('left'))-PERSON_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      player.css('left', newPos);
      break;
    }
    case KEYS.right: { // right arrow
      let newPos = parseInt(player.css('left'))+PERSON_SPEED;
      if (newPos > maxPersonPosX) {
        newPos = maxPersonPosX;
      }
      player.css('left', newPos);
      break;
    }
    case KEYS.up: { // up arrow
      let newPos = parseInt(player.css('top'))-PERSON_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      player.css('top', newPos);
      break;
    }
    case KEYS.down: { // down arrow
      let newPos = parseInt(player.css('top'))+PERSON_SPEED;
      if (newPos > maxPersonPosY) {
        newPos = maxPersonPosY;
      }
      player.css('top', newPos);
      break;
    }
  }
}

// Check for any collisions with thrown items
// If needed, score and remove the appropriate item
function checkCollisions() {
  // TODO
}

// Move the parade floats (Unless they are about to collide with the player)
function startParade(){
  console.log("Starting parade...");
  paradeTimer = setInterval( function() {
    
      // TODO: (Depending on current position) update left value for each 
      // parade float, check for collision with player, etc.

      var newPos = parseInt(paradeFloat2.css("left")) + 2; 
      paradeFloat2.css("left", newPos);

      newPos = parseInt(paradeFloat1.css("left")) + 2; 
      if(newPos > maxItemPosX + 50){
        paradeFloat2.css("left", '-130px');
        paradeFloat1.css("left", '-280px');
      }
      else{
        paradeFloat1.css("left", newPos); 
      }

  }, OBJECT_REFRESH_RATE);
}

// var itemIdx = 1;
var images = new Array();
images[0] = "beads.png";
images[1] = "candy.png";

var types = new Array();
images[0] = "bead";
images[1] = "candy";

var probabilities = new Array();
probabilities[1] = 0.667;
probabilities[0] = 0.333;


// Get random position to throw object to, create the item, begin throwing
function createThrowingItem(){
  // TODO
  var rand = Math.random();
  var probability_sum = 0;
  var finalObj = 0;
  console.log(rand);
  for(var i = 0; i < probabilities.length ; i++){
    probability_sum += probabilities[i];
    if(probability_sum >= rand){
      finalObj = i;
      // console.log("may be not", $('.game-window').left());
      if(parseInt(paradeFloat2.css('left')) < (maxItemPosX) - 10){
        var objectString = createItemDivString(throwingItemIdx, i, images[i]);
        gwhGame.append(objectString);
        break;
      }
    }
  }
  var curItem = $("#i-" + throwingItemIdx);


  curItem.css("top", parseInt(paradeFloat2.css('top'))+ parseInt(paradeRoute.css('top')) + parseInt(paradeRoute.height()/4));
  curItem.css("left", parseInt(paradeFloat2.css('left')) + paradeFloat2.width() -18 );
  
  var boundary_check = false;
  var z_rand, x_rand, y_rand, gh = 0;
  x_ini = parseInt(curItem.css('left'));
  y_ini = parseInt(curItem.css('top'));

    // while(!boundary_check){
      x_rand = Math.floor(Math.random() * 5);
      y_rand = Math.floor(Math.random() * 5);
      
      gg = Math.random();
      if(gg <= 0.5){
        gh = 1;
      }
      else{
        gh = -1;
      }
      console.log('max: ', maxItemPosX, '  ');
      xd = y_rand * (parseInt(curItem.css('left')) + x_rand);
      yd = y_rand * (parseInt(curItem.css('top')) + y_rand);
      
      console.log('abs: ', Math.abs(xd-x_ini));
      if(Math.abs(xd-x_ini) < 100 ){
        curItem.css('backgroundColor', 'blue');
      }
        console.log('item index: ', throwingItemIdx, " the ");
      //   boundary_check = true;
      //   break;
      // }
    // }

  updateThrownItemPosition(throwingItemIdx, x_rand, y_rand, 50, gh);
  // setTimeout(graduallyFadeAndRemoveElement(curRocket), 5000);
  throwingItemIdx++;
}

// Helper function for creating items
// throwingItemIdx - index of the item (a unique identifier)
// type - beads or candy
// imageString - beads.png or candy.png
function createItemDivString(throwingItemIdx, type, imageString){
  if(type == 1){
    return "<div id='i-" + throwingItemIdx + "' class='throwingItem_b" + "'><img src='img/beads.png" + "'/></div>";
  }
  else if(type == 0){
    return "<div id='i-" + throwingItemIdx + "' class='throwingItem_c" + "'> <img src='img/candy.png' /></div>";
  }
}

// Throw the item. Meant to be run recursively using setTimeout, decreasing the 
// number of iterationsLeft each time. You can also use your own implementation.
// If the item is at it's final postion, start removing it.
function updateThrownItemPosition(elementObj, xChange, yChange, iterationsLeft, gh){
  // TODO
  console.log("iterations left: ", iterationsLeft)
  curRocket = $('#i-' + elementObj);
  let counter = iterationsLeft;
  var changes = setInterval(() => {
    counter--;
    if(counter == 0){
      console.log('final x: ', curRocket.css("left"));
      clearInterval(changes);
    }
    curRocket.css("top", parseInt(curRocket.css("top")) + gh*xChange);
    curRocket.css("left", parseInt(curRocket.css("left")) + gh*yChange);
    if(curRocket.css("left") > maxItemPosX - 30 || curRocket.css("left") < 25){
      clearInterval(changes);
    }
  }, 50);
}

function graduallyFadeAndRemoveElement(elementObj){
  // Fade to 0 opacity over 2 seconds
  elementObj.fadeTo(2000, 0, function(){
    $(this).remove();
  });
}

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}