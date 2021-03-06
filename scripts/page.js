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

var arr = [];
var arr_c = [];
var arr_boolean = [];
var sounds={};
sounds.b = new Audio('./img/clap-q.wav');
sounds.c = new Audio('./img/corkpop-tenth.wav');

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
let oppInit = true;
let oppEnd = true;
let oppEndValue = 0;


// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready( function() {
  
  // TODO: Event handlers for the settings panel

  // TODO: Add a splash screen and delay starting the game
  $('game-window').hide();
  $('#pk1').hide();
  $('#pk2').hide();
  $('.splash').animate({ opacity: '0' }, 3000);
  // delay(200);
  setTimeout(()=>{
    sleep(3000);
  }, 10);
  
  const splash = document.querySelector('.splash');

  
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

  // toggle_visibility('#pk1');
  
  // Keypress event handler
  $(window).keydown(keydownRouter);
  
  // Periodically check for collisions with thrown items (instead of checking every position-update)
  collisionHandle = setInterval( function() {
    checkCollisions();
  }, 100);
  // Move the parade floats
  startParade();

  

  $(".r8").click( function(){
    $('#pk').hide();
    $('#pk1').show();
    $('#pk2').show();
  } );
  // buttons();
  $('#pk1').on('click', '#r9', function(){
    $('#pk').show();
    $('#pk1').hide();
    $('#pk2').hide();
    var xx = parseInt( $('#freq').val());
    if(isNaN(xx) || xx < 100){
      let str = "Frequency must be a number greater than or equal to 100";
      alert(str);
    }
    else{
      clearInterval(createThrowingItemIntervalHandle);
      currentThrowingFrequency = xx;
      createThrowingItemIntervalHandle = setInterval(createThrowingItem, currentThrowingFrequency);
    }

  });
  $('#pk1').on('click', '#r10', function(){
    $('#pk').show();
    $('#pk1').hide();
    $('#pk2').hide();
    $('#gameLimit').val('');
  });
  $('#pk1').on('click', '#r11', function(){
    if(oppInit){
      $('#pk2').show();
      oppInit = false;
      var opp = "<div id='opp1'" + "class='dog'><img src='img/dog.jpeg" + "'/></div>";
      gwhGame.append(opp);
      $('#r13').show();
      setInterval(oppMoves,1000);
    }
  });
  $('#pk1').on('click', '#r12', function(){
    oppInit = true;
    $('#gameLimit').val('');
    document.getElementById('oppScore').innerHTML = '0';
    $('#pk2').hide();
    $('#opp1').remove();
  });

  $('#pk2').on('click', '#r13', function(){
    oppEnd = false;
    oppEndValue = $('#gameLimit').val();
  });

  // Throw items onto the route at the specified frequency
  createThrowingItemIntervalHandle = setTimeout(()=>{ setInterval(createThrowingItem, currentThrowingFrequency);}, 10);
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
      //console.log("Invalid input!");
  }
}

// Handle player movement events
// TODO: Stop the player from moving into the parade float. Only update if
// there won't be a collision
function movePerson(arrow) {
  
  switch (arrow) {
    case KEYS.left: { // left arrow
      let newPos = parseInt(player.css('left'))-PERSON_SPEED;
      if(newPos > 0 && Math.abs((player.offset().top+player.height()) - (paradeFloat2.offset().top)) < 6){
        player.css('left', newPos);
      }
      else if(tyler(player, paradeFloat2, 0, 0) && newPos > 0){
      }
      else if (newPos < 0) {
        newPos = 0;
      }
      else{
        player.css('left', newPos);
      }
      break;
    }
    case KEYS.right: { // right arrow
      let newPos = parseInt(player.css('left'))+PERSON_SPEED;
      if(Math.abs((player.offset().top+player.height()) - (paradeFloat2.offset().top)) < 6){
        player.css('left', newPos);
      }
      else if(tyler(player, paradeFloat1,PERSON_SPEED, 0)){
      }
      else if (newPos > maxPersonPosX) {
        newPos = maxPersonPosX;
      }
      else{
        player.css('left', newPos)
      }
      break;
    }
    case KEYS.up: { // up arrow
      let newPos = parseInt(player.css('top'))-PERSON_SPEED;
      if(Math.abs(player.offset().left - (paradeFloat2.offset().left+paradeFloat2.width())) < 5){
        player.css('top', newPos);
      }
      else if(tyler(player, paradeFloat2, 0, -PERSON_SPEED) == true|| tyler(player, paradeFloat1, 0, -PERSON_SPEED) == true){
        player.css('top', parseInt(player.css('top')));
      }
      else if (newPos < 0) {
        newPos = 0;
      }
      else{
        player.css('top', newPos);
      }
      break;
    }
    case KEYS.down: { // down arrow
      let newPos = parseInt(player.css('top'))+PERSON_SPEED;
      if(newPos < maxPersonPosY){
        if(Math.abs(player.offset().left - (paradeFloat2.offset().left+paradeFloat2.width())) < 5){
          player.css('top', newPos);
        }
        else if(tyler(player, paradeFloat2, 0, PERSON_SPEED-10) == true|| tyler(player, paradeFloat1, 0, PERSON_SPEED-5) == true){
          player.css('top', parseInt(player.css('top')));
        }
        else if (newPos < 0) {
          newPos = 0;
        }
        else{
          player.css('top', newPos);
        }
      }
      break;
    }
  }
}

// Check for any collisions with thrown items
// If needed, score and remove the appropriate item
function checkCollisions() {
  // TODO
  Array.from(document.getElementsByClassName('coll')).forEach(
    function(item){
      if(isOrWillCollide_bc(player, item, 0, 0) && !arr.includes(item.id)){
        arr.push(item.id);
        arr_boolean[item.id.replace( /^\D+/g, '')-1] = true; 
        item.style.borderRadius = "35px"
        item.style.background = 'yellow';
        if(item.classList.contains('throwingItem_b')){
          sounds['b'].play();
          $('#beadsCounter').html(parseInt($("#beadsCounter").text()) + 1);
        }
        else{
          sounds['c'].play();
          $('#candyCounter').html(parseInt($("#candyCounter").text()) + 1);
        }

        $('#score-box').html(parseInt($("#score-box").text()) + 100);
        item.animate({ opacity: '0' }, 1000, () => {
          Animation.id = 'cc';
        }); 
        setTimeout(()=>{item.remove();}, 998);
      }
      else if(!oppInit){
        if(isOrWillCollide_bc($('#opp1'), item, 0, 0) && !arr.includes(item.id)){
          $('#oppScore').html(parseInt($("#oppScore").text()) + 100);
          arr.push(item.id);
          arr_boolean[item.id.replace( /^\D+/g, '')-1] = true; 
          item.style.borderRadius = "35px"
          item.style.background = 'yellow';
          item.animate({ opacity: '0' }, 1000, () => {
            Animation.id = 'cc';
          }); 
          setTimeout(()=>{item.remove();}, 998);
          if(item.classList.contains('throwingItem_b')){
            sounds['b'].play();
            $('#beadsCounter').html(parseInt($("#beadsCounter").text()) + 1);
          }
          else{
            sounds['c'].play();
            $('#candyCounter').html(parseInt($("#candyCounter").text()) + 1);
          }
        }
      }
      if(!oppEnd){
        console.log('dik: ', parseInt($('#oppScore').text()));
        if(parseInt($('#oppScore').text()) >= oppEndValue){
          alert('Daschund Wins! You Lose');
          $('#gameLimit').val('');
          document.getElementById('oppScore').innerHTML = '0';
          $('#opp1').remove();
          $('#pk2').hide();
          oppInit = true;
          oppEnd = true;
          // clearInterval(collisionHandle);
        }
        else if(parseInt($('#score-box').text()) >= oppEndValue){
          alert('Congrats You Wins!');
          $('#gameLimit').val('');
          document.getElementById('oppScore').innerHTML = '0';
          $('#opp1').remove();
          $('#pk2').hide();
          oppInit = true;
          oppEnd = true;
          // clearInterval(collisionHandle);
        }
      }
    }
  )
}

// Move the parade floats (Unless they are about to collide with the player)
function startParade(){
  paradeTimer = setInterval( function() {

      // TODO: (Depending on current position) update left value for each 
      // parade float, check for collision with player, etc.
      if(isCollidinga(player, paradeFloat2)){
        console.log('colliding');
      }
      else{
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
      }
  }, OBJECT_REFRESH_RATE);

}

var images = new Array();
images[0] = "beads.png";
images[1] = "candy.png";

var types = new Array();
images[0] = "bead";
images[1] = "candy";

var probabilities = new Array();
probabilities[1] = 0.667;
probabilities[0] = 0.333;

function oppMoves(){

  var x_rand, y_rand = 0;

  x_rand = getRandomNumber(0, 450);

  gg = Math.random();
  if(gg <= 0.5){
    y_rand = getRandomNumber(0, 160);
  }
  else{
    y_rand = getRandomNumber(300, 560);
  }
  let opps = $('#opp1');
  function animatePlane() {
    $('#opp1').animate({
      left: x_rand,
      top: y_rand
    },1000);
  }
  animatePlane();
}

// Get random position to throw object to, create the item, begin throwing
function createThrowingItem(){
  // TOD0
  arr_boolean.push(false);
  var rand = Math.random();
  var probability_sum = 0;
  for(var i = 0; i < probabilities.length ; i++){
    probability_sum += probabilities[i];
    if(probability_sum >= rand){
      finalObj = i;
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
  
  var x_rand, y_rand = 0;

  x_rand = getRandomNumber(0, 450);

  gg = Math.random();
  if(gg <= 0.5){
    y_rand = getRandomNumber(0, 160);
  }
  else{
    y_rand = getRandomNumber(300, 560);
  }

  updateThrownItemPosition(throwingItemIdx, x_rand, y_rand, 10);
    curItem.delay(5000).fadeTo(2000, 0, function(){
      $(this).remove();
    });
  throwingItemIdx++;
}

// Helper function for creating items
// throwingItemIdx - index of the item (a unique identifier)
// type - beads or candy
// imageString - beads.png or candy.png
function createItemDivString(throwingItemIdx, type, imageString){
  if(type == 1){
    return "<div id='i-" + throwingItemIdx + "' class='throwingItem_b coll" + "'><img src='img/beads.png" + "'/></div>";
  }
  else if(type == 0){
    return "<div id='i-" + throwingItemIdx + "' class='throwingItem_c coll" + "'> <img src='img/candy.png' /></div>";
  }
}

// Throw the item. Meant to be run recursively using setTimeout, decreasing the 
// number of iterationsLeft each time. You can also use your own implementation.
// If the item is at it's final postion, start removing it.
function updateThrownItemPosition(elementObj, xChange, yChange, iterationsLeft){
  // TODO
  
  curRocket = $('#i-' + elementObj);
  curRocket.animate({
    left: xChange,
    top: yChange
  },1000);
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

function isCollidinga(o1, o2) {
  o1_xChange = 0;
  o1_yChange = 0;
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top+10,
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
        'right': o1.offset().left + o1.width() + o1_xChange - 5,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left ,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top+5,
        'bottom': o2.offset().top + o2.height() -5
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
function tyler(o1, o2, o1_xChange, o1_yChange){
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

function isOrWillCollide_bc(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': parseInt(o2.style.left)+5,
        'right': parseInt(o2.style.left) + 35,
        'top': parseInt(o2.style.top) +5,
        'bottom': parseInt(o2.style.top) + 35
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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function toggle_visibility(id) {
  var e = document.getElementById(id);
  if(e.style.display == 'block')
     e.style.display = 'none';
  else
     e.style.display = 'block';
}