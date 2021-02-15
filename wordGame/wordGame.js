/*
 * JavaScript file for Clever Hangman game
 *
 * @author Abby Mapes
 */

let gameSection = document.getElementById('game-section');
let guessInput;
let guessList;
let errorMessage;
let currentTemplate;
let correctLetters;
let incorrectLetters;
let guessesLabel;
let debugOutput;

let alphabet = alphabetString.split('\n');
let possibleWords = wordsString.split('\n');
let template = "_____";

let guesses = [];
let userName;
let difficulty;
let debugging;
let guessCount = 20;

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
    
    let header = document.createElement("h2");
    header.innerText = "Guess the secret word " + userName;

    let templateDiv = document.createElement("div");
    templateDiv.className = "template";
    let template = document.createElement("h1");
    template.id = "secret-word-template";
    template.innerHTML = "_ &ensp; _ &ensp; _ &ensp; _ &ensp; _ &ensp; ";
    templateDiv.appendChild(template);

    let instructions = document.createElement("p");
    instructions.innerText = `
        I am thinking of a secret word. My word is 5 letters long. In the input box below, type a single letter from the letterboard that you think is in my secret word. You have ` + guessCount + 
        ` guesses. When you correctly guess a letter, it will appear in the template below. Good luck...`;
    gameSection.appendChild(header);
    gameSection.appendChild(instructions);
    gameSection.appendChild(templateDiv);

    let row = document.createElement("div");
    row.className = "row";

    let rigthSide = document.createElement("div");
    rigthSide.className = "column-right";
    let letterBoard = createLetterBoard();
    rigthSide.appendChild(letterBoard);
    let foundLetters = createFoundLetters();
    rigthSide.appendChild(foundLetters);
    let wrongLetters = createIncorrectLetters();
    rigthSide.appendChild(wrongLetters);
    row.appendChild(rigthSide);

    let leftSide = document.createElement("div");
    leftSide.className = "column-left";
    let guessedWords = createGuessWordSection();
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
    let guessedLetter = guessInput.value.trim();
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

    let letterInAlphabet = document.getElementById("letter-" + guess);
    let letterElement = document.createElement("div");
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
    let newTemplate = Array.from(template);
    let displayTemplate = "";
    newTemplate.forEach(letter => {
        displayTemplate += letter.toUpperCase() + " &ensp; ";
    });
    currentTemplate.innerHTML = displayTemplate;
    guessCount -= 1;
    guessesLabel.innerText = "Guesses left: " + guessCount;
	
    let randIndex = Math.floor(Math.random() * possibleWords.length);
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
        let chosenWord = possibleWords[randIndex];
        
        let finalDisplay = "";
        console.log(template);
        [...chosenWord].forEach(letter => {
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
    let dict = {};
    possibleWords.forEach(word => {
        let templateForWord = createTemplate(word, letter, template);
        if (templateForWord in dict) {
            dict[templateForWord].push(word);
        } else {
            dict[templateForWord] = [word];
        }
    });
    let optimalTemp;
    let newWords;
    let maxLength = 0;
    Object.keys(dict).forEach(temp => {
        if (dict[temp].length > maxLength) {
            maxLength = dict[temp].length;
            optimalTemp = temp;
            newWords = dict[temp];
        } else if (dict[temp].length == maxLength) {
            let tempBlankCount = 0;
            let optTempBlankCount = 0;
            [...temp].forEach(letter => {
                if (letter == "_") {
                    tempBlankCount += 1;
                }
            });
            [...optimalTemp].forEach(letter => {
                if (letter == "_") {
                    optTempBlankCount += 1;
                }
            });
            if (tempBlankCount > optTempBlankCount) {
                maxLength = dict[temp].length;
                optimalTemp = temp;
                newWords = dict[temp];
            }
        }
        if (debugging) {
            let dictionaryChoice = document.createElement("div");
            dictionaryChoice.innerHTML = temp + ": &ensp;" + dict[temp].length + " word(s)";
            debugOutput.insertBefore(dictionaryChoice, debugOutput.childNodes[0]);
        }
    });
    template = optimalTemp;
    possibleWords = newWords;

    if (debugging) {
        let winningChoice = document.createElement("div");
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
    let templateArray = Array.from(currentTemplate);
    let i = 0;
    [...word].forEach(c => {
        if (c == letter) {
            templateArray[i] = letter;
        }
        i += 1;
    });
    return templateArray.join("");
}

/*
 * Returns the guess word section to be appended onto the document,
 * which includes the input box, debugging area, and submit button
 */
function createGuessWordSection() {
    let guessesSection = document.createElement("div");
    guessesLabel = document.createElement("h3");
    guessesLabel.id = "guess-count";
    guessesLabel.innerText = "Guesses left: " + guessCount;

    let guessesInput = document.createElement("input");
    guessesInput.type = "guess";
    guessesInput.id = "guess";
    guessesInput.name = "guess";

    let submitButton = document.createElement("input");
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

    let errorMessage = document.createElement("div");
    errorMessage.id = "bad-input";
    let lnBreak = document.createElement("br");

    guessesSection.appendChild(guessesLabel);
    guessesSection.appendChild(errorMessage);
    guessesSection.appendChild(lnBreak);
    guessesSection.appendChild(guessesInput);
    guessesSection.appendChild(submitButton);

    if (debugging) {
        let debugSection = document.createElement("div");
        debugSection.id = "debug-output";
        let lineBreak = document.createElement("br");
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
    let foundLetters = document.createElement("div");
    foundLetters.className = "foundLetters";
    foundLetters.id = "correct-letters";
    let header = document.createElement("h3");
    header.innerText = "Correct Letters:";
    foundLetters.appendChild(header);

    let foundLetterList = document.createElement("div");
    foundLetterList.id = "found-letters";
    foundLetterList.className = "foundLetters";
    let lineBreak = document.createElement("br");
    foundLetterList.appendChild(lineBreak);
    return foundLetters;
}

/*
 * Returns the incorrect letters section that displays the 
 * letters that the user has incorrectly guessed
 */
function createIncorrectLetters() {
    let wrongLetters = document.createElement("div");
    wrongLetters.className = "incorrect-Letters";
    wrongLetters.id = "incorrect-letters";
    let header = document.createElement("h3");
    header.innerText = "Incorrect Letters:";
    wrongLetters.appendChild(header);

    let incorrectLetterList = document.createElement("div");
    incorrectLetterList.id = "incorrect-letters";
    incorrectLetterList.className = "incorrectLetters";
    let lineBreak = document.createElement("br");
    incorrectLetterList.appendChild(lineBreak);
    return wrongLetters;
}

/*
 * Returns the letterboard section that displays the alphabet
 * of letters that are colored green if they have been correctly
 * guessed, reed if they have been incorrectly guessed, or
 * black if they have yet to be guessed
 */
function createLetterBoard() {
    let letterBoardLetters = document.createElement("div");
    letterBoardLetters.className = "letterboard";

    let letterboardHeader = document.createElement("h3");
    letterboardHeader.innerText = "Letterboard:";
    letterBoardLetters.appendChild(letterboardHeader);
    alphabet.forEach(c => {
        let letterElement = document.createElement("div");
        let letter = c.trim();
        letterElement.id = "letter-" + letter;
        letterElement.innerHTML = letter.toUpperCase() + "&ensp;";
        letterBoardLetters.appendChild(letterElement);
    });
    let lineBreak = document.createElement("br");
    letterBoardLetters.appendChild(lineBreak);
    return letterBoardLetters;
}
