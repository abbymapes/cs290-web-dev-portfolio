/*
 * This represents the display for a Trello card.
 *
 * @author Abby Mapes
 */

Vue.component('card', {
    props: {
        tags: {
            type: Array,
            required: true
        },

        list: {
            type: Object,
            required: true
        },

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

    data() {
        return {
            cardColor: this.card.color
        };
    },
    methods: {
        /*
         * Returns the color of the card, or the default color if the user doesn't specify a card color
         */
        getCardColor(color) {
            if (!color) {
                return "#EEEEEE";
            }
            return color;
        }
    },
    watch: {
        /*
         * Watches the cardColor, which is binded the the select-color input. When 
         * user chooses a new color for the card, it emits an event that signals the new 
         * color for the card at the specified listIndex and cardIndex to update in data store
         */
        cardColor() {
            // Emits event through components: draggable -> list -> project
            this.$parent.$parent.$emit('change-card-color', this.cardColor, this.listIndex, this.cardIndex);
            this.cardColor = this.card.color;
        },
        /*
         * Refreshes the card color (v-model of input) when the card changes (i.e. moved positions)
         */
        card() {
            this.cardColor = this.card.color;
        }
    },
    template:
        `
    <div v-if="card.showInSearch" class="card" :style="'background-color:' + getCardColor(card.color)">
        <card-header
            :deadline="card.deadline"
            :list-index="listIndex"
            :card-index="cardIndex"
            :card-color = "getCardColor(card.color)"
        ></card-header>

        <editing-order
            :object-to-order="card"
            :list-of-objects="list.cards"
            order-type="Card"
            :list-index = "listIndex"
            :card-index = "cardIndex"
        >
        </editing-order>

        <name-input
            :text="card.cardName"
            name-type="Card"
            :list-index = "listIndex"
            :card-index = "cardIndex"
        ></name-input>

        <count
            :count="card.comments.length"
            count-type="sub-task"
        >
        </count>

        <description-input
            :text="card.description"
            :list-index = "listIndex"
            :card-index = "cardIndex"
        ></description-input>

        <tag-section
            :card="card"
            :tags="tags"
            :card-color="getCardColor(card.color)"
            :list-index = "listIndex"
            :card-index = "cardIndex"
            :new-card="false"
        >
        </tag-section>
        <comment-section
            :card="card"
            :list-index = "listIndex"
            :card-index = "cardIndex"
        >
        </comment-section>
        
        <br>

        <div class="card-footer">
            <select-color
                :input-id="'changeCardColor-list-' + listIndex + '-card-' + cardIndex"
                label-text="Change Color"
                v-model="cardColor"
            >
            </select-color> 
        </div>
        <br>
        <new-item 
            item-type="duplicate-card"
            :list-index="listIndex"
            :card-index="cardIndex"
        >
        </new-item>                    
    </div> 
    `
});
