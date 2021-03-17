/*
 * This represents the display for new item input where the user specifies
 * only a name, i.e. when a user wants to create a list from scratch,
 * duplicate an existing list, or duplicate an existing card
 *
 * @author Abby Mapes
 */

Vue.component('new-item', {
    props: {
        itemType: {
            type: String,
            required: true
        },
        listIndex: {
            type: Number,
            required: false
        },
        cardIndex: {
            type: Number,
            required: false
        }
    },
    data() {
        return {
            newName: ""
        };
    },
    methods: {
        /*
         * Emits an event that signifies that the name for a new item has been specified, along with the 
         * parameters necessary to create each type of item and add it to our data store
         */
        submitItem() {
            if (this.itemType == "duplicate-card") {
                // need to pass new name, list index, and card index in order to duplicate card with new name and add it to list
                // Passes through components: card --> draggable (for card) --> list  --> project 
                this.$parent.$parent.$parent.$emit('duplicate-card', this.newName, this.listIndex, this.cardIndex);
            } else if (this.itemType == "duplicate-list") {
                // need to pass new name, list index, and card index in order to duplicate card with new name and add it to list
                // Passes through components: draggable (for card) --> list --> project 
                this.$parent.$parent.$emit('duplicate-list', this.newName, this.listIndex);
            } else {
                // Passes through components: top-bar --> project 
                this.$parent.$emit('new-list', this.newName);
            }
            this.newName = "";
        }
    },
    computed: {
        dropdownText() {
            return (this.itemType == "duplicate-card" ? "Duplicate Card"
                : (this.itemType == "duplicate-list" ? "Duplicate List" : "Add New List"));
        },

        labelText() {
            return (this.itemType == "duplicate-card" ? "New Card Name: "
                : "New List Name: ");
        },

        submitButton() {
            return (this.itemType == "duplicate-card" ? "Duplicate Card"
                : (this.itemType == "duplicate-list" ? "Duplicate List" : "Add New List"));
        },

        inputId() {
            return (this.itemType == "duplicate-card" ? 'duplicateCardName-list-' + this.listIndex + '-card-' + this.cardIndex
                : (this.itemType == "duplicate-list" ? 'duplicateListName-list-' + this.listIndex
                    : "newBlankList"));
        }
    },
    template: `
        <b-dropdown 
            size="sm" 
            boundary="window" 
            :text="dropdownText"
            variant="outline-dark"
        >
            <div class="dropdown" role="menuitem">
                <label :for="inputId">{{labelText}}</label>
                <input 
                    class="border text-left"
                    v-model="newName"
                    :id="inputId"
                >
                <br>
                <button
                    class="btn btn-success"
                    v-if="newName.length > 0"
                    @click="submitItem()"
                >
                    {{submitButton}}
                </button>
                <button
                    class="btn btn-outline-danger"
                    @click="newName = ''"
                >
                    Cancel
                </button>
            </div>
        </b-dropdown>
    `
});
