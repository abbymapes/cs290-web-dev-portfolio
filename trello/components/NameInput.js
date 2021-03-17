/*
 * This represents the display for the editible name of a card or list in Trello.
 *
 * @author Abby Mapes
 */

Vue.component('name-input', {
    props: {
        text: {
            type: String,
            required: true
        },

        nameType: {
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
        }
    },
    data() {
        return {
            newTitle: this.text,
            isEditing: false
        };
    },
    methods: {
        /*
         * Emits 'done-editing-name' when the name input is submitted, which triggers
         * data store to replace name with user inputted value
         */
        finishedEditing(newName) {
            this.isEditing = false;
            if (this.nameType == "Card") {
                // If the input is for a card, needs to emit from components:
                // card -> draggable -> list -> project
                this.$parent.$parent.$parent.$emit('done-editing-name', this.nameType, newName, this.listIndex, this.cardIndex);
            } else {
                // If the input is for a list, it needs to emit from components:
                // list -> project
                this.$parent.$emit('done-editing-name', this.nameType, newName, this.listIndex, this.cardIndex);
            }

        }
    },
    computed: {
        currentId() {
            return (this.nameType == "Card" ? 'nameInput-list-' + this.listIndex + '-card-' + this.cardIndex + '-' + this.text
                : 'nameInput-list-' + this.listIndex + "-" + this.text);
        }
    },
    watch: {
        text() {
            this.newTitle = this.text;
        }
    },
    template:
        `
    <span>
        <h2
            class="card-title"
            v-if="!isEditing"
            @dblclick="isEditing = true"
        > 
            {{text}} 
        </h2>
        <h2
            class="card-title"
            v-if="isEditing"
        >
            <textarea
                @keyup.enter="finishedEditing($event.target.value)"
                v-model="newTitle"
                :id="currentId"
                class="list-name card-title"
            >
            </textarea>
        </h2>
    </span>
    `
});
