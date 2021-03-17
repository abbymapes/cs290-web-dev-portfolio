/*
 * This represents the display for a new card input template that appears 
 * when a user creates a new card to add to the list from scratch.
 *
 * @author Abby Mapes
 */

Vue.component('new-card', {
    props: {
        tags: {
            type: Array,
            required: true
        },

        listIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isEditing: false,
            newCard: {
                cardName: "",
                description: "",
                color: "",
                showInSearch: true,
                deadline: "",
                tags: [],
                comments: []
            }
        };
    },
    methods: {
        /*
         * Returns the color of the card, or the default color if the 
         * user doesn't specify a card color
         */
        getCardColor(color) {
            if (!color) {
                return "#EEEEEE";
            }
            return color;
        },


        /*
         * Emits 'add-new-tag' when the user creates a new tag with a valid name and 
         * color to add to the tag list and the tags for the current new card template
         */
        addNewTag(newTag, listIndex, cardIndex) {
            // Emits to add new tag to pageData via data store
            // Emits event through components: draggable -> list
            this.$parent.$emit('add-new-tag', newTag);
            // Adds new tag to current template after its been added to pageData
            this.$set(this.newCard.tags, this.newCard.tags.length, { name: newTag.name });
        },

        /*
         * Removes tag with tagName from new card
         */
        deleteTag(tagName, tagIndex, listIndex, cardIndex) {
            // Deletes existing tag from current template 
            this.$delete(this.newCard.tags, tagIndex);
        },


        /*
         * Adds tag with tagName to new card
         */
        addTag(tagName, tagIndex, listIndex, cardIndex) {
            // Adds existing tag from current template 
            this.$set(this.newCard.tags, this.newCard.tags.length, { name: tagName });
        },


        /*
         * Adds the new card (created and displayed in the template) to the
         * current list where the card was added to, then resets the card template
         * to be blank for this list
         */
        addNewCard() {
            this.isEditing = false;
            // Emits event through components: draggable -> list --> project
            this.$parent.$parent.$emit('add-new-card', this.newCard, this.listIndex);
            this.resetCard();
        },


        /*
         * Clears the card template to be blank for this list when cancelling a card before adding
         */
        clearNewCard() {
            this.isEditing = false;
            this.resetCard();
        },

        /*
         * Resets the card template to be blank 
         */
        resetCard() {
            this.newCard = {
                cardName: "",
                description: "",
                color: "",
                showInSearch: true,
                deadline: "",
                tags: [],
                comments: []
            };
        },

        /*
         * Returns the correct inputId based on the input type by appending the list 
         * index to the inputType string
         */
        inputId(inputType) {
            return inputType + this.listIndex;
        }
    },
    template:
        `
    <div class="center">
        <div v-if="isEditing" class = "card" :style= "'background-color:' + getCardColor(newCard.color)">
            <label :for="inputId('addNewCardName-list-')">Task Name: </label>
            <input 
                type="text" 
                :id="inputId('addNewCardName-list-')"
                v-model="newCard.cardName" 
            />
            <br>
            <label :for="inputId('addNewCardDescription-list-')">Description: </label>
            <input 
                type="text" 
                :id="inputId('addNewCardDescription-list-')"
                v-model="newCard.description" 
            />
            <br>
            <label :for="inputId('addNewCardDeadline-list-')">Deadline: </label>
            <input 
                class="fit-width"
                :id="inputId('addNewCardDeadline-list-')"
                type="datetime-local" 
                :name="inputId('addNewCardDeadline-list-')"
                v-model="newCard.deadline"    
            >
            <br>
            <select-color
                :input-id="inputId('addNewCardColor-list-')"
                label-text="Task Color"
                v-model="newCard.color"
            >
            </select-color> 
            <tag-section
                :card="newCard"
                :tags="tags"
                :card-color="getCardColor(newCard.color)"
                :list-index = "listIndex"
                :new-card = "true"
                :card-index="-1"
                @delete-tag="deleteTag"
                @add-new-tag="addNewTag"
                @add-tag="addTag"
            >
            </tag-section>
            <br>

            <div class="center">
                <button
                    class= "btn btn-success"
                    v-if="newCard.cardName.length > 0"
                    @click="addNewCard"
                >
                    Add Card
                </button>
                <br>
                <button
                    class= "btn btn-outline-danger"
                    @click="clearNewCard"
                >
                    Cancel
                </button>
            </div>
        </div>
        <b-icon v-else @click="isEditing = true" class="h1 mb-2" variant="success" icon="plus-square"></b-icon>
    </div> 
    `
});

