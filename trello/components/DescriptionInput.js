/*
 * This represents the editible description for a card in the Trello project.
 *
 * @author Abby Mapes
 */

Vue.component('description-input', {
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
        }
    },
    data() {
        return {
            description: this.text,
            isEditing: false
        };
    },
    methods: {
        /*
         * Emits 'done-editing-description' when description is submitted, which triggers
         * data store to replace name with user inputted value
         */
        enteredDescription(newText) {
            this.isEditing = false;
            // If the input is for a card, needs to emit from components:
            // card -> draggable -> list -> project
            this.$parent.$parent.$parent.$emit('done-editing-description', newText, this.listIndex, this.cardIndex);
        }
    },
    template:
        `
    <span>
        <br>
        <p
            class="card-text"
            v-if="text.trim().length == 0 && !isEditing"
        >
            <button
                class="btn btn-outline-dark"
                @click="isEditing = true"
            >
                Add Description
            </button>
        </p>

        <p 
            v-else-if="!isEditing"
            @dblclick="isEditing = true"
            class="card-text"
        >
            {{text}}
        </p> 
        
        <p
            class="card-text"
            v-else
        >
            <textarea
                @keyup.enter="enteredDescription($event.target.value)"
                v-model="description"
                :id="'nameInput-' + listIndex + '-' + cardIndex + '-' + text"
            >
                {{text}}
            </textarea>
        </p>
    </span>
    `
});

