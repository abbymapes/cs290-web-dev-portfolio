/*
 * This represents the display for the input for a new comment input to add 
 * a comment or subtask to card in the Trello project.
 *
 * @author Abby Mapes
 */

Vue.component('comment-input', {
    props: {
        listIndex: {
            type: Number,
            required: true
        },

        cardIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            newComment: ""
        };
    },
    methods: {
        /*
         * Emits 'entered-comment' when comment is double clicked or submitted
         */
        enteredNewComment() {
            this.$emit('entered-comment', this.newComment, this.listIndex, this.cardIndex);
            this.newComment = "";
        }
    },

    computed: {
        inputId() {
            return 'commentInput-list-' + this.listIndex + '-card-' + this.cardIndex;
        }
    },

    watch: {
        text() {
            this.newComment = this.text;
        }
    },
    template:
        `
    <span>
        <label :for="inputId">Add Sub-Task:</label>
        <input 
            v-model="newComment"
            :id="inputId"
            class="comment-input border text-left"
            v-on:keyup.enter="enteredNewComment()" 
        >
    </span>
    `
});

