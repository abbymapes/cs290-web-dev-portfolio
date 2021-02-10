/*
 * JavaScript file for Clever Hangman game
 *
 * @author Abby Mapes
 */

let gameSection = document.getElementById('game-section');
var guessInput;
var guessList;
var errorMessage;
var currentTemplate;
var correctLetters;
var incorrectLetters;
var guessesLabel;
var debugOutput;

var alphabet = alphabetString.split('\n');
var possibleWords = wordsString.split('\n');
var template = "_____";

var guesses = [];
var userName;
var difficulty;
var debugging;
var guessCount = 20;

/*
 * Builds and displays the game when the user clicks Start Game
 */
function startGame() {
    userName = document.getElementById('name').value;
    difficulty = document.getElementById('difficulty').value;
    debugging = (document.getElementById('debug').value == "debug");
    gameSection.innerHTML = "";

    if (difficulty != "easy") {
        guessCount = 15;
    }
    
    var header = document.createElement("h2");
    header.innerText = "Guess the secret word " + userName;

    var templateDiv = document.createElement("div");
    templateDiv.className = "template";
    var template = document.createElement("h1");
    template.id = "secret-word-template";
    template.innerHTML = "_ &ensp; _ &ensp; _ &ensp; _ &ensp; _ &ensp; ";
    templateDiv.appendChild(template);

    var instructions = document.createElement("p");
    instructions.innerText = `
        I am thinking of a secret word. My word is 5 letters long. In the input box below, type a single letter from the letterboard that you think is in my secret word. You have ` + guessCount + 
        ` guesses. When you correctly guess a letter, it will appear in the template below. Good luck...`;
    gameSection.appendChild(header);
    gameSection.appendChild(instructions);
    gameSection.appendChild(templateDiv);

    var row = document.createElement("div");
    row.className = "row";

    var rigthSide = document.createElement("div");
    rigthSide.className = "column-right";
    var letterBoard = createLetterBoard();
    rigthSide.appendChild(letterBoard);
    var foundLetters = createFoundLetters();
    rigthSide.appendChild(foundLetters);
    var wrongLetters = createIncorrectLetters();
    rigthSide.appendChild(wrongLetters);
    row.appendChild(rigthSide);

    var leftSide = document.createElement("div");
    leftSide.className = "column-left";
    var guessedWords = createGuessWordSection();
    leftSide.appendChild(guessedWords);
    row.appendChild(leftSide);

    gameSection.appendChild(row);
    guessInput = document.getElementById('guess');
    guessList = document.getElementById('guessed-words');
    errorMessage = document.getElementById('bad-input');
    correctLetters = document.getElementById('correct-letters');
    incorrectLetters = document.getElementById('incorrect-letters');
    currentTemplate = document.getElementById('secret-word-template');

    if (debugging) {
        debugOutput = document.getElementById("debug-output");
    }
}

/*
 * Verifies the user's gueses is a valid letter before processing it
 * and clears input box afterwards
 */
function processUserGuess() {
    var guessedLetter = guessInput.value;
    if (guessedLetter.length != 1) {
        errorMessage.innerText = "Bad input: Guesses must be a single letter in the alphabet.";
    } else if (!alphabet.includes(guessedLetter)) {
        errorMessage.innerText = "Invalid character: Guesses must be a single letter in the alphabet.";
    } else if (guesses.includes(guessedLetter)) {
        errorMessage.innerText = "Repeat character: You've already guessed this!";
    } else {
        errorMessage.innerText = "";
        processGuessedLetter(guessedLetter.toLowerCase());
    }
    guessInput.value = "";
}

/*
 * Processes the users letter by marking it red or green in the letterboard,
 * adding it to the template (if it is correct), updating guess count, and 
 * checking whether the user has won or lost the game
 */
function processGuessedLetter(guess) {
    getNewWordList(guess);

    var letterInAlphabet = document.getElementById("letter-" + guess);
    var letterElement = document.createElement("div");
    letterElement.className = "letter";
    guesses.push(guess);

    letterElement.innerHTML = guess.toUpperCase();
    
    if (template.includes(guess)) {
        letterInAlphabet.style.color = "green";
        letterInAlphabet.style.fontWeight = "bold";
        correctLetters.appendChild(letterElement);
    } else {
        letterInAlphabet.style.color = "red";
        incorrectLetters.appendChild(letterElement);
    }
    var newTemplate = Array.from(template);
    var displayTemplate = "";
    newTemplate.forEach(letter => {
        displayTemplate += letter.toUpperCase() + " &ensp; ";
    });
    currentTemplate.innerHTML = displayTemplate;
    guessCount -= 1;
    guessesLabel.innerText = "Guesses left: " + guessCount;
	
    var randIndex = Math.floor(Math.random() * possibleWords.length);
    if (!template.includes("_")) {
        guessInput.style.display = "none";
        document.getElementById("submit").style.display = "none";
        errorMessage.innerHTML = "You've won! The word was: " + possibleWords[randIndex]+ "<br>";
        errorMessage.style.color = "green";
        errorMessage.style.fontWeight = "bold";
        currentTemplate.style.color = "green";
    } else if (guessCount == 0) {
        guessInput.style.display = "none";
        document.getElementById("submit").style.display = "none";
        var chosenWord = possibleWords[randIndex];
        
        var finalDisplay = "";
        console.log(template);
        Array.from(chosenWord).forEach(letter => {
            if (!template.includes(letter)) {
                finalDisplay += "<div class = 'not-guessed'>" + letter.toUpperCase() + "</div> &ensp; ";
            } else {
                finalDisplay += letter.toUpperCase() + " &ensp; ";
            }
        });
        currentTemplate.innerHTML = finalDisplay;
        errorMessage.innerHTML = "You've lost. The word was: " + possibleWords[randIndex] + "<br>";
    }
}

/*
 * Determines the optimal template, that matches the largest number
 * of possible words, and updates the template and new word list with 
 * each letter guess to be optimal
 */
function getNewWordList(letter) {
    var dict = {};
    possibleWords.forEach(word => {
        var templateForWord = createTemplate(word, letter, template);
        if (templateForWord in dict) {
            dict[templateForWord].push(word);
        } else {
            dict[templateForWord] = [word];
        }
    });
    var optimalTemp;
    var newWords;
    var maxLength = 0;
    for (var temp in dict) {
        if (dict[temp].length > maxLength) {
            maxLength = dict[temp].length;
            optimalTemp = temp;
            newWords = dict[temp];
        } else if (dict[temp].length == maxLength) {
            var tempBlankCount = 0;
            var optTempBlankCount = 0;
            for (var i = 0; i < 5; ++i) {
                if (temp.charAt(i) == "_") {
                    tempBlankCount += 1;
                }
                if (optimalTemp.charAt(i) == "_") {
                    optTempBlankCount += 1;
                }
            }
            if (tempBlankCount > optTempBlankCount) {
                maxLength = dict[temp].length;
                optimalTemp = temp;
                newWords = dict[temp];
            }
        }
        if (debugging) {
            var dictionaryChoice = document.createElement("div");
            dictionaryChoice.innerHTML = temp + ": &ensp;" + dict[temp].length + " word(s)";
            debugOutput.insertBefore(dictionaryChoice, debugOutput.childNodes[0]);
        }
    }
    template = optimalTemp;
    possibleWords = newWords;

    if (debugging) {
        var winningChoice = document.createElement("div");
        winningChoice.className = "debug-winning";
        winningChoice.style.color = "green";
        winningChoice.innerHTML = "We chose: " + template + " because it has the most words(s): " + possibleWords.length + " words";
        debugOutput.insertBefore(winningChoice, debugOutput.childNodes[0]);
    }
    console.log(template);
    console.log(newWords);
}

/*
 * Creates template for parameter word given the current 
 * template and the guessed letter
 */
function createTemplate(word, letter, currentTemplate) {
    var templateArray = Array.from(currentTemplate);
    for (var i = 0; i < word.length; ++i) {
        if (word.charAt(i) == letter) {
            templateArray[i] = letter;
        }
    }
    return templateArray.join("");
}

/*
 * Returns the guess word section to be appended onto the document,
 * which includes the input box, debugging area, and submit button
 */
function createGuessWordSection() {
    var guessesSection = document.createElement("div");
    guessesLabel = document.createElement("h3");
    guessesLabel.id = "guess-count";
    guessesLabel.innerText = "Guesses left: " + guessCount;

    var guessesInput = document.createElement("input");
    guessesInput.type = "guess";
    guessesInput.id = "guess";
    guessesInput.name = "guess";

    var submitButton = document.createElement("input");
    submitButton.id = "submit";
    submitButton.type = "submit";
    submitButton.value = "submit";
    submitButton.addEventListener("click", processUserGuess);

    guessesInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            submitButton.click();
        }
    });

    var errorMessage = document.createElement("div");
    errorMessage.id = "bad-input";
    var lnBreak = document.createElement("br");

    guessesSection.appendChild(guessesLabel);
    guessesSection.appendChild(errorMessage);
    guessesSection.appendChild(lnBreak);
    guessesSection.appendChild(guessesInput);
    guessesSection.appendChild(submitButton);

    if (debugging) {
        var debugSection = document.createElement("div");
        debugSection.id = "debug-output";
        var lineBreak = document.createElement("br");
        debugSection.appendChild(lineBreak);
        guessesSection.appendChild(debugSection);
    }
    return guessesSection;
}

/*
 * Returns the found letters section that displays the 
 * letters that the user has correctly guessed
 */
function createFoundLetters() {
    var foundLetters = document.createElement("div");
    foundLetters.className = "foundLetters";
    foundLetters.id = "correct-letters";
    var header = document.createElement("h3");
    header.innerText = "Correct Letters:";
    foundLetters.appendChild(header);

    var foundLetterList = document.createElement("div");
    foundLetterList.id = "found-letters";
    foundLetterList.className = "foundLetters";
    var lineBreak = document.createElement("br");
    foundLetterList.appendChild(lineBreak);
    return foundLetters;
}

/*
 * Returns the incorrect letters section that displays the 
 * letters that the user has incorrectly guessed
 */
function createIncorrectLetters() {
    var wrongLetters = document.createElement("div");
    wrongLetters.className = "incorrect-Letters";
    wrongLetters.id = "incorrect-letters";
    var header = document.createElement("h3");
    header.innerText = "Incorrect Letters:";
    wrongLetters.appendChild(header);

    var incorrectLetterList = document.createElement("div");
    incorrectLetterList.id = "incorrect-letters";
    incorrectLetterList.className = "incorrectLetters";
    var lineBreak = document.createElement("br");
    incorrectLetterList.appendChild(lineBreak);
    return wrongLetters;
}

/*
 * Returns the letterboard section that displays the alphabet
 * of letters that are colored greeen if they have been correctly
 * guessed, reed if they have been incorrectly guessed, or
 * black if they have yet to be guessed
 */
function createLetterBoard() {
    var letterBoardLetters = document.createElement("div");
    letterBoardLetters.className = "letterboard";

    var letterboardHeader = document.createElement("h3");
    letterboardHeader.innerText = "Letterboard:";
    letterBoardLetters.appendChild(letterboardHeader);

    for (var i = 0; i < alphabet.length; i++) {
        var letterElement = document.createElement("div");
        var letter = alphabet[i].trim();
        letterElement.id = "letter-" + letter;
        letterElement.innerHTML = letter.toUpperCase() + "&ensp;";
        letterBoardLetters.appendChild(letterElement);
    }
    var lineBreak = document.createElement("br");
    letterBoardLetters.appendChild(lineBreak);
    return letterBoardLetters;
}
