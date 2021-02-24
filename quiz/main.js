/*
 * JavaScript for Quiz project using Vue.js
 *
 * @author Abby Mapes
 */

const app = new Vue({
    data () {
        return {
            QUIZZES: ["data/math.json", "data/capital.json", "data/duke.json", "data/theoffice.json"],
            quizNames: ["Math Quiz", "Capital Quiz", "Duke Quiz", "The Office Quiz"],
            classNames: ["math", "capital", "duke", "office"],
            ANSWERS: new Map([]),
            pickedQuiz: "",
            data: {},
            messages: {},
            submitDisplay: 'inherit',
            nextDisplay: 'none',
            selections: [],
            resultText: "",
            showAnswers: false,
            showQuiz: false
        };
    },

    methods: {
        /* 
         * Fetches questions from local JSON file picked by the user to initialize data and messages variables
         */
        fetchQuestions (fileName) {
            this.ANSWERS = new Map([]);
            this.selections = [];
            this.showAnswers = false;
            this.resultText = "";
            try {
                fetch(this.QUIZZES[this.pickedQuiz % this.QUIZZES.length]).then(response => response.json()).then( result => {
                    this.data = result.questions;
                    this.messages = result.messages;

                    this.data.forEach((q, i) => {
                        this.ANSWERS.set("answer"+i,  q.answer);
                    });

                });
            } catch (error) {
                console.error(error);
            }
        }, 

        /* 
         * Once user submissions of their answers
         */
        processAnswers () {
            let numCorrect = this.countCorrectAnswers();

            if (numCorrect < 0) {
                window.alert('You must answer all questions first.');
                return;
            } else {
                this.submitDisplay = "none";
                this.nextDisplay = "inherit";
                this.reportResults(numCorrect, this.data.length);
            }
        }, 

        /* 
         * Counts the number of correct answers that the user selects, or 
         * returns -1 if thee user hasn't answered all questions
         */
        countCorrectAnswers () {
            let numCorrect = 0;
            let numChosen = 0;
            this.selections.forEach((choice, i) => {
                let name = "answer" + i;
                if (!choice) {
                    return -1;
                } else {
                    let correctAnswer = this.getCorrectAnswer(name);
                    if (correctAnswer === choice) {
                        numCorrect += 1;
                    }
                }
                numChosen += 1;
            });

            if (numChosen < this.data.length) {
                return -1;
            } else {
                this.showAnswers = true;
            }
            return numCorrect;
        }, 

        /* 
         * Calculates percent user gets on the quiz and sets result 
         * output text based on the messages for each quiz and the 
         * user's score
         */
        reportResults (numCorrect, total) {
            let percent = Math.round(numCorrect * 100 / total);
            let message = "";
            if (percent < 60) {
                message = this.messages['60'];
            } else if (percent < 70) {
                message = this.messages['70'];
            } else if (percent < 80) {
                message = this.messages['80'];
            } else if (percent < 90) {
                message = this.messages['90'];
            } else {
                message = this.messages['100'];
            }
            this.resultText =  `You got ${percent}% correct! ` + message;
        },

        /* 
         * Returns the correct answer for the parameter question name
         */
        getCorrectAnswer (name) {
            return this.ANSWERS.get(name);
        }, 

        /* 
         * Returns the class to highlight each option. If the user selects
         * the option and it is wrong, it sets the class to incorrect, which makes
         * the cell red. If the user selects the correct option, then it 
         * sets the class to correct which colors the cell green. Otherwise, it 
         * doesn't set the class name, meaning it doesn't highlight the option.
         */
        highlight (answerNumber, value) {
            if (this.showAnswers) {
                let correctAnswer = this.getCorrectAnswer("answer"+  answerNumber);

                if (this.selections[answerNumber] == value) {
                    return (value === correctAnswer ? 'correct' : 'incorrect');
                }
            }
            return "";
        },

        /* 
         * Resets the quizzes picked value, which hides the quiz and 
         * shows the seleciton of quizzes to select 
         */
        reset () {
            this.pickedQuiz = "";
            this.submitDisplay = "inherit";
            this.nextDisplay = "none";
        }
    },

    watch: {
        /* 
         * When pickedQuiz changes, the value of showQuiz toggles from true 
         * and false. If showQuiz is true, we fetch the questions for the quiz 
         * to show
         */
        pickedQuiz () {
            this.showQuiz = !this.showQuiz;
            if (this.showQuiz) {
                this.fetchQuestions();
            }
        }
    },

    mounted () {
    }
});

app.$mount('#app');