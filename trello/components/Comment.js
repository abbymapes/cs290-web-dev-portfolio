/*
 * This represents the display for a comment (or sub-task) in a Trello card.
 *
 * @author Abby Mapes
 */

Vue.component('comment', {
    props: {
        text: {
            type: String,
            required: true
        },

        listIndex: {
            type: Number,
            required: true
        },

        cardIndex: {
            type: Number,
            required: true
        },

        commentIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            newComment: this.text,
            comment: this.text,
            isEditing: false
        };
    },
    methods: {
        /*
         * Emits 'done-editing' when comment is submitted, which passes the new comment
         * and specified listIndex, cardIndex, and commentIndex of the old comment
         */
        editedComment() {
            this.isEditing = false;
            this.$emit('done-editing', this.newComment, this.listIndex, this.cardIndex, this.commentIndex);
        },

        /*
         * Resets newComment and sets isEditing to false when user cancels their comment
         */
        cancelledCommentEdit() {
            this.isEditing = false;
            this.newComment = this.text;
        },

        /*
         * Emits 'delete-comment' when comment is deleted (via delete button) that passes
         * the specified listIndex, cardIndex, and commentIndex of the comment
         */
        deleteComment() {
            this.$emit('delete-comment', this.listIndex, this.cardIndex, this.commentIndex);
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
        <div class="comment" v-if="!isEditing">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteComment()">X</button>
            <span 
                v-if="!isEditing"
                @dblclick="isEditing = true"
            >
                {{ text }} 
            </span>
        </div>
        <div class="comment" v-else>
            <textarea
                class="border text-left"
                @keyup.enter="editedComment()"
                v-model="newComment"
            >
                {{ newComment }}
            </textarea>
            <br>
            <button type="button" class="btn btn-outline-danger btn-sm" @click="cancelledCommentEdit()">Cancel</button>
            <button type="button" class="btn btn-success btn-sm" @click="editedComment()">Submit</button>
        </div>
    </span>
    `
});
