/*
 * This represents the input display that allows a user to reorder lists, comments, and cards
 * in their Trello project.
 *
 * @author Abby Mapes
 */

Vue.component('editing-order', {
    props: {
        objectToOrder: {
            type: Object,
            required: true
        },

        listOfObjects: {
            type: Array,
            required: true
        },

        orderType: {
            type: String,
            required: true
        },

        listIndex: {
            type: Number,
            required: true
        },

        cardIndex: {
            type: Number,
            required: false
        },

        commentIndex: {
            type: Number,
            required: false
        }
    },
    data() {
        return {
            editingOrder: false
        };
    },
    methods: {
        /*
         * Emits 'change-order' when the user selects a new order for the specified item
         */
        changeOrderOfObjects(listOfObjects, newIndex, oldIndex) {
            this.editingOrder = false;
            if (this.orderType == "Comment") {
                // If the current item is a comment, then we must emit event 'change-order' from:
                // comment-section -> card -> draggable -> list -> project
                this.$parent.$parent.$parent.$parent.$emit('change-order', this.orderType, this.listIndex, this.cardIndex, newIndex, oldIndex);
            } else if (this.orderType == "Card") {
                // If we are reordering a card, then we must emit event 'change-order' from:
                // card -> draggable -> list -> project
                this.$parent.$parent.$parent.$emit('change-order', this.orderType, this.listIndex, this.cardIndex, newIndex, oldIndex);
            } else {
                // If we are reordering a list, then we must emit event 'change-order' from:
                // list -> project
                this.$parent.$emit('change-order', this.orderType, this.listIndex, this.cardIndex, newIndex, oldIndex);
            }
        }
    },
    watch: {
        // When the list order changes, set editingOrder for all such objects to false
        listOfObjects() {
            this.editingOrder = false;
        }
    },
    computed: {
        currentId() {
            return (this.orderType == "Comment" ? 'editCommentOrder-list' + this.listIndex + '-card-' + this.cardIndex + '-comment-' + this.commentIndex + '-currentIndex-'
                : (this.orderType == "Card" ? 'cardOrder-list-' + this.listIndex + '-card-' + this.cardIndex + '-currentIndex-'
                    : 'listOrder-list-' + this.listIndex + '-currentIndex-'));
        },

        currentIndex() {
            return (this.orderType == "Comment" ? this.commentIndex
                : (this.orderType == "Card" ? this.cardIndex
                    : this.listIndex));
        },

        currentName() {
            return (this.orderType == "Comment" ? 'editCommentOrder-list' + this.listIndex + '-card-' + this.cardIndex + '-comment-' + this.commentIndex
                : (this.orderType == "Card" ? 'cardOrder-list-' + this.listIndex + '-card-' + this.cardIndex
                    : 'listOrder-list-' + this.listIndex));
        }

    },
    template:
        `
    <div class="text-right">
        <b-icon v-if="!editingOrder" @click="editingOrder = true" class="bi bi-arrow-down-up" variant="primary" icon="arrow-down-up"></b-icon>
            <ul v-else class="center">
            <span class="small card-subtitle mb-2"> {{orderType}} Number:</span>
            <br>
            <li
                class="tags"
                v-for="(list, iteratingIndex) in listOfObjects"
                :key="iteratingIndex"
            >
                <input
                    type="radio"
                    :id="currentId + iteratingIndex"
                    :name="currentName"
                    :value="iteratingIndex"
                    :checked="(currentIndex == iteratingIndex)"
                    @click="changeOrderOfObjects(listOfObjects, iteratingIndex, currentIndex)"
                >
                <label :for="currentId + iteratingIndex" class="tags"><b>{{iteratingIndex + 1}}</b></label>
                <br>
            </li>
        </ul>
    </div>
    `
});

