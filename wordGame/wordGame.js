/*
 * JavaScript file for Jotto word game
 *
 * @author Abby Mapes
 */

let gameSection = document.getElementById('game-section');
var guessInput;
var guessList;
var errorMessage;

var allWords;
var secretWord;
var secretChars;

var guesses = [];
var correctChars = [];
var incorrectChars = [];

let userName = null;
let difficulty = null;

function startGame() {
    userName = document.getElementById('name').value;
    difficulty = document.getElementById('difficulty').value;
    gameSection.innerHTML = "";
    
    var header = document.createElement("h2");
    header.innerText = "Guess the secret word, " + userName;
    gameSection.appendChild(header);

    var instructions = document.createElement("p");
    instructions.innerText = "Write instructions here.";
    gameSection.appendChild(header);
    gameSection.appendChild(instructions);


    var row = document.createElement("div");
    row.className = "row";

    var leftSide = document.createElement("div");
    leftSide.className = "column-left";
    var letterBoard = createLetterBoard();
    leftSide.appendChild(letterBoard);
    var foundLetters = createFoundLetters();
    leftSide.appendChild(foundLetters);
    row.appendChild(leftSide);

    var rightSide = document.createElement("div");
    rightSide.className = "column-right";
    var guessedWords = createGuessWordSection();
    rightSide.appendChild(guessedWords);
    row.appendChild(rightSide);

    gameSection.appendChild(row);
    guessInput = document.getElementById('guess');
    guessList = document.getElementById('guessed-words');
    errorMessage = document.getElementById('bad-input');
    chooseWord();
}

function chooseWord() {
    allWords = wordsString.split('\n');
    let numWords = allWords.length;
    console.log(numWords);
    var uniqueChars = false;
    var chars = [];
    var word = "";
    while (!uniqueChars) {
        var randIndex = Math.floor(Math.random() * numWords);
        word = allWords[randIndex];
        chars = [];
        for (var i = 0; i < 5; ++i) {
            var c = word.charAt(i);
            if (!chars.includes(c)) {
                chars.push(c);
            }
        }
        if (chars.length == 5) {
            uniqueChars = true
        }
    }
    secretChars = chars;
    secretWord = word;
    console.log(secretChars);
    console.log(secretWord);
}

function guessWord() {
    var guessedWord = guessInput.value;
    if (guessedWord.length != 5) {
        errorMessage.innerText = "Bad input: Please guess a word with 5 letters.";
    } else if (hasDuplicates(guessedWord)) {
        errorMessage.innerText = "Bad input: Guesses cannot have duplicate letters.";
    } else if (!allWords.includes(guessedWord)) {
        errorMessage.innerText = "Unfamiliar word: Guesses must be in my dictionary.";
    } else if (guesses.includes(guessedWord)) {
        errorMessage.innerText = "Repeat word: You've already guessed this!";
    } else {
        guesses.push(guessedWord);
        errorMessage.innerText = "";
        processGuessedWord(guess);
        placeGuessedWord(guessedWord, guessList);
        var lineBreak = document.createElement("br");
        guessList.appendChild(lineBreak);

        /*
        for (var i = 0; i < secretChars.length; ++i) {
            var elements = document.getElementsByClassName("letter-" + secretChars[i]);
            for (var j = 0; j < elements.length; ++j) {
                elements[j].style.color = "green";
            }
        }*/
    }
    guessInput.value = "";
}

function processGuessedWord(guess) {

}

function placeGuessedWord(guess, guessList) {
    for (var i = 0; i < 5; ++i) {
        var letterElement = document.createElement("div");
        var letter = guess.charAt(i);
        letterElement.className = "letter-" + letter;
        letterElement.innerText = letter;
        if (correctChars.includes(letter)) {
            letterElement.style.color = "green";
        } else if (incorrectChars.includes(letter)) {
            letterElement.style.color = "red";
        }
        guessList.appendChild(letterElement);
    }
    var countElement = document.createElement("div");
    countElement.className = "letter-count";
    var charsInCommon = getCommonCharacters(guess);
    countElement.innerText = " " + charsInCommon;
    guessList.appendChild(countElement);
}

function getCommonCharacters(guess) {
    var commonChars = [];
    for (var i = 0; i < 5; ++i) {
        var c = guess.charAt(i);
        if (secretChars.includes(c)) {
            commonChars.push(c);
        }
    }
    return commonChars.length;
}

function hasDuplicates(word) {
    var chars = [];
    for (var i = 0; i < 5; ++i) {
        var c = word.charAt(i);
        if (!chars.includes(c)) {
            chars.push(c);
        }
    }
    return (chars.length != 5)
}

function createGuessWordSection() {
    var guessesSection = document.createElement("div");
    var guessesLabel = document.createElement("h3");
    guessesLabel.innerText = "Guesses: ";

    var guessesInput = document.createElement("input");
    guessesInput.type = "guess";
    guessesInput.id = "guess";
    guessesInput.name = "guess";

    var submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "submit";
    submitButton.addEventListener("click", guessWord);

    var errorMessage = document.createElement("div");
    errorMessage.id = "bad-input";
    var lnBreak = document.createElement("br");

    guessesSection.appendChild(guessesLabel);
    guessesSection.appendChild(errorMessage);
    guessesSection.appendChild(lnBreak);
    guessesSection.appendChild(guessesInput);
    guessesSection.appendChild(submitButton);

    var guessesList = document.createElement("div");
    guessesList.id = "guessed-words";
    guessesList.className = "guesses";
    var lineBreak = document.createElement("br");
    guessesSection.appendChild(guessesList);
    guessesSection.appendChild(lineBreak);
    return guessesSection;
}

function createFoundLetters() {
    var foundLetters = document.createElement("div");
    foundLetters.className = "foundLetters";
    var header = document.createElement("h3");
    header.innerText = "Found Letters:";
    foundLetters.appendChild(header);

    var foundLetterList = document.createElement("div");
    foundLetterList.id = "found-letters";
    foundLetterList.className = "foundLetters"
    var lineBreak = document.createElement("br");
    foundLetterList.appendChild(lineBreak);
    return foundLetters;
}

function createLetterBoard() {
    var letterBoardLetters = document.createElement("div");
    letterBoardLetters.className = "letterboard";

    var letterboardHeader = document.createElement("h3");
    letterboardHeader.innerText = "Letterboard:";
    letterBoardLetters.appendChild(letterboardHeader);

    let letters = alphabet.split('\n');
    for (var i = 0; i < letters.length; i++) {
        var letterElement = document.createElement("div");
        var letter = letters[i].trim()
        letterElement.className = "letter-" + letter;
        letterElement.innerText = letter.toUpperCase() + " ";
        letterBoardLetters.appendChild(letterElement);
    }
    var lineBreak = document.createElement("br");
    letterBoardLetters.appendChild(lineBreak);
    return letterBoardLetters;
}
