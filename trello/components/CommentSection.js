/*
 * This represents the display for the comment section (or sub-task section) of a 
 * Trello card.
 *
 * @author Abby Mapes
 */

Vue.component('comment-section', {
    props: {
        card: {
            type: Object,
            required: true
        },

        listIndex: {
            type: Number,
            required: true
        },

        cardIndex: {
            type: Number,
            required: true
        }
    },
    methods: {
        /*
         * Emits 'done-editing-comment' when detecting that an existing comment was edited
         */
        doneEditing(newComment, listIndex, cardIndex, commentIndex) {
            // Emits event from components: card -> draggable -> list -> project
            this.$parent.$parent.$parent.$emit('done-editing-comment', newComment, listIndex, cardIndex, commentIndex);
        },

        /*
         * Emits 'delete-comment' when detecting that an existing comment was deleted
         */
        deleteComment(listIndex, cardIndex, commentIndex) {
            // Emits event from components: card -> draggable -> list -> project
            this.$parent.$parent.$parent.$emit('delete-comment', listIndex, cardIndex, commentIndex);
        },

        /*
         * Emits 'enteered-comment' when detecting that a new comment was inputted
         */
        enteredComment(newComment, listIndex, cardIndex) {
            // Emits event from components: card -> draggable -> list -> project
            this.$parent.$parent.$parent.$emit('entered-comment', newComment, listIndex, cardIndex);
        }
    },
    template:
        `
    <div class="card">
        <div class="card-header">Sub-Tasks</div>
        <ul 
            class="comment-list list-group list-group-flush"
            v-if="card.comments.length > 0"
        >
            <li
                v-for="(comment, k) in card.comments"
                :key="k"
                class="comment-item list-group-item"
            >
                <comment
                    :text="comment.text"
                    :list-index="listIndex"
                    :card-index="cardIndex"
                    :comment-index="k"
                    @done-editing="doneEditing"
                    @delete-comment="deleteComment"
                >
                </comment>
                                            
                <editing-order
                    :object-to-order="comment"
                    :list-of-objects="card.comments"
                    order-type="Comment"
                    :list-index = "listIndex"
                    :card-index = "cardIndex"
                    :comment-index = "k"
                >
                </editing-order>
            </li>
        </ul>
        <br>
        <comment-input
            :list-index="listIndex"
            :card-index="cardIndex"
            @entered-comment="enteredComment"
        >
        </comment-input>
    </div>
    `
});
