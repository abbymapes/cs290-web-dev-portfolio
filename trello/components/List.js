/*
 * This represents the display for a Trello List.
 *
 * @author Abby Mapes
 */

Vue.component('list', {
    props: {
        tags: {
            type: Array,
            required: true
        },

        list: {
            type: Object,
            required: true
        },

        lists: {
            type: Array,
            required: true
        },

        listIndex: {
            type: Number,
            required: true
        },

        disableCardDragging: {
            type: Boolean,
            required: true
        }
    },

    data() {
        return {
            cardDragging: false,
            newCards: this.list.cards,
            newIndex: -1
        };
    },
    methods: {
        /*
         * Emits a 'delete-list' event that passes listIndex to delete 
         */
        deleteList() {
            this.$emit("delete-list", this.listIndex);
        },

        /*
         * Emits a 'add-new-tag-to-page' event that passes the new tag to add 
         * to the tag list for the Trello project (when a new tag is added from 
         * a blank card, rather than from an existing card)
         */
        addTagToList(newTag) {
            this.$emit("add-new-tag-to-page", newTag);
        }
    },
    watch: {
        /*
         * Emits a 'update-columns' event by passing updated list order
         */
        cardDragging() {
            if (!this.cardDragging) {
                this.$emit("update-columns", this.lists);
            }
        }
    },
    template:
        `
    <div v-if="list.showInSearch" class="card card-list">
        <div class="text-left">
            <button type="button" class="btn btn-outline-danger list-delete" @click="deleteList">X</button>
            <editing-order
                :object-to-order="list"
                :list-of-objects="lists"
                order-type="List"
                :list-index = "listIndex"
            ></editing-order>
        </div>

        <name-input
            :text="list.listName"
            name-type="List"
            :list-index = "listIndex"
        ></name-input>

        <count
            :count="list.cards.length"
            count-type="task"
        >
        </count>

        <draggable
            class="category"
            :list="list.cards"
            :disabled="disableCardDragging"
            group="cards"
            @start="cardDragging = true"
            @end="cardDragging = false"
        >
            <div
                v-for="(card, j) in list.cards"
                :key="j"
            >
                <card
                    :tags="tags"
                    :list="list"
                    :card="card"
                    :list-index="listIndex"
                    :card-index="j"
                >
                </card>
            </div>  
            <br>  

            <new-card
                @add-new-tag="addTagToList"
                :list-index="listIndex"
                :tags="tags"
            >
            </new-card>
            <br>
            <div>
                <new-item 
                    item-type="duplicate-list"
                    :list-index="listIndex"
                >
                </new-item>
                <br>
                <br>
                <br>
                <br>
            </div>
        </draggable>
    </div>
    `
});

