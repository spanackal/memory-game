
let deck = document.querySelector('.deck');
let cardsToShuffle = document.querySelectorAll('li[class*="card"]');
let starElement = document.querySelectorAll('.stars li i');
let gameOverPopUp = document.querySelector('.game-over');
let gameOverCloseIcon = document.querySelector('.game-over-close');
let gameOverPlayAgainButton = document.querySelector('.play-again-button');
let numberOfStars = 0;
let restartElement = document.querySelector('.restart');
let cards = [];
let moves = 0;
let time = 0;
let clockOff = true;
let clockId, flickerId, gameTime;
let shuffledCards = [];
let flippedCardInDeck;
let matchedPairs = 0;
const cardsMaxLength = 2;
const minMovesToWin = 7;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let shuffleDeck = function(){
    let cardArray = Array.from(cardsToShuffle);
    shuffledCards = shuffle(cardArray);
    for (let card of shuffledCards){
        if (card.classList.contains("show")){
            card.classList.add("flipped");
        }

        if(card.classList.contains("match")){
            card.classList.add("initMatched");
        }
        deck.appendChild(card);
}

}

shuffleDeck();

let calculateStarRating = function(){
    if(moves  == (minMovesToWin+1) || moves ==14){
        removeStarRating();
    }
}


let removeStarRating = function() {
    for (let star of starElement) {
        if (!(star.classList.contains("hide"))) {
                let count = 0;
                flickerId = setInterval(() => {
                    star.classList.toggle("flicker");
                    count++;
                    if(count == 6){
                        clearInterval(flickerId);
                        star.classList.toggle("hide");
                    }
                }, 500);
                break;
        }
    }
}

let getStarRating =function(){
    for (let star of starElement){
        if(!(star.classList.contains("hide"))){
            numberOfStars++;
        }
    }
    return numberOfStars;
}


let resetStars = function(){
    numberOfStars = 0;
    for (let star of starElement){
        if((star.classList.contains("hide"))){
            star.classList.remove("hide");
        }
    }
}


let addMoves = function(){
    moves++;
    showMoves(moves);

}

let showMoves = function(moves){
    let movesElement = document.querySelector('.moves');
    let singleMoveText = "Move";
    let multipleMovesText = "Moves";
    movesElement.innerHTML = `${moves} ${((moves == 1) ? singleMoveText: multipleMovesText)}`;
}

let resetMoves = function(){
    moves = 0;
    showMoves(moves);
}

let startTimer = function(){
        clockId = setInterval(()=>{
        time++;
        showTime();
    },1000);
}

let stopTimerAndResetClock = function(){
    clearInterval(clockId);
    time =0;
    clockOff = true;
    showTime();
}

let stopTimer = function(){
    clearInterval(clockId);
    clockOff = true;
    showTime();
}


let showTime = function(){
    let clock = document.querySelector('.clock');
    let minutes = Math.floor(time / 60) >0 ? Math.floor(time / 60): 0;
    let seconds = Math.floor(time % 60);
    gameTime = `${minutes}m:${seconds}s`;
    clock.innerHTML = gameTime;
}

const showCard = function(card){
        card.classList.toggle("open");
        card.classList.toggle("show");
}


const checkForAlreadyFlippedCards = function(){
    for (let card of shuffledCards){
        if(card.classList.contains("flipped")){
            flippedCardInDeck = card;
            return cards.indexOf(card);
        }
    }
    return false;
}

const checkForGameCompletion = function(){
    if(matchedPairs == minMovesToWin ){
        matchedPairs = 0;
        stopTimer();
        getGameStats();
        toggleGameStatsPopUp();
    }
}

const toggleGameStatsPopUp = function(){
    gameOverPopUp.classList.toggle("hide");
};


const resetCards = function(){
    for (let card of shuffledCards){
        if(!(card.classList.contains("flipped")) && !(card.classList.contains("initMatched"))){
            card.className = "card";
        }

        if(card.classList.contains("flipped")){
            card.classList.remove("match");
        }
    }
}


const resetGame = function(){
    resetMoves();
    stopTimerAndResetClock();
    resetStars();
    resetCards();
    shuffleDeck();

}

const getGameStats= function(){
    let gameStatTimeElement = document.querySelector('.game-time');
    gameStatTimeElement.innerHTML = `Time taken : ${gameTime}`;
    let gameStatStarRatingElement = document.querySelector('.game-stars');
    if(moves == (minMovesToWin+1)){
        gameStatStarRatingElement.innerHTML = `Your Rating : 2`;
    }
    else if(moves == 14){
        gameStatStarRatingElement.innerHTML = `Your Rating : 1`;
    }
    else{
        gameStatStarRatingElement.innerHTML = `Your Rating : ${getStarRating()}`;
    }
    let gameStatNumberOfMovesElement = document.querySelector('.game-moves');
    gameStatNumberOfMovesElement.innerHTML = `Moves taken : ${moves}`;
}

toggleResetIcon = function(){
    restartElement.classList.toggle("blink");
}

restartElement.addEventListener('click', ()=>{
    if(restartElement.classList.contains("blink")){
        restartElement.classList.toggle("blink");
    }
    resetGame();
});

gameOverCloseIcon.addEventListener('click', ()=>{
    toggleGameStatsPopUp();
    toggleResetIcon();
});


gameOverPlayAgainButton.addEventListener('click', ()=>{
    toggleGameStatsPopUp();
    resetGame();
});


deck.addEventListener('click', (event) =>{
    let card = event.target;
    let isElementCardType = card.classList.contains("card");
    let isMatchedCard = card.classList.contains("match");
    let isCardAlreadyAddedToCardArray = cards.includes(card);
    if(isElementCardType && !isMatchedCard && !isCardAlreadyAddedToCardArray && !card.classList.contains("flipped") && cards.length < cardsMaxLength){
        if(clockOff){
            startTimer();
            clockOff = false;
        }
            cards.push(card);
            showCard(card);
            checkCards();
        }
})

    const checkCards = function(){
        let cardsLength = cards.length;
        checkForAlreadyFlippedCards();
        if(cardsLength == 1 && cards[0].firstElementChild.className === flippedCardInDeck.firstElementChild.className){
             cards[0].classList.toggle("match");
             flippedCardInDeck.classList.toggle("match");
             addMoves();
             calculateStarRating();
             matchedPairs++;
             checkForGameCompletion();
             cards = [];
        }
        if(cardsLength == cardsMaxLength){
            addMoves();
            calculateStarRating();
            let isMatchedCardsCondition = cards[0].firstElementChild.className === cards[1].firstElementChild.className;
            if(isMatchedCardsCondition) {
                cards[0].classList.toggle("match");
                cards[1].classList.toggle("match");
                matchedPairs++;
                checkForGameCompletion();
                cards = [];
            }
            else{
                setTimeout(() => {
                    let firstCard = cards[0];
                    let secondCard = cards[1];
                    if (checkForAlreadyFlippedCards() >=0){
                        if(checkForAlreadyFlippedCards() == 0){
                            showCard(secondCard);
                        }
                        else if (checkForAlreadyFlippedCards() == 1){
                            showCard(firstCard);
                        }
                        cards = [];
                    }
                    else{
                        showCard(firstCard);
                        showCard(secondCard);
                        cards = [];
                    }

                },1000);

            }
        }
    }