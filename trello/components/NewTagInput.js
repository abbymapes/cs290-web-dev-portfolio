/*
 * This represents the display for the new tag input, which is when the 
 * user specifies a new name and color to create a new tag for their project. 
 *
 * @author Abby Mapes
 */

Vue.component('new-tag-input', {
    props: {
        tags: {
            type: Array,
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

        newCard: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            newTag: {
                name: "",
                color: ""
            }
        };
    },
    methods: {
        /*
         * Emits 'add-tag' when the user sumbits a valid tag with a color and unique name)
         */
        addNewTag() {
            this.$emit('add-tag', this.newTag, this.listIndex, this.cardIndex);
            this.newTag = {
                name: "",
                color: ""
            };
        },

        /*
         * Returns true if the parameter is a valid tag name, meaning that it is unique
         */
        isValidTagName(newName) {
            let isValid = true;
            this.tags.forEach(tag => {
                if (tag.name == newName) {
                    isValid = false;
                }
            });
            return isValid;
        }
    },
    computed: {
        tagNameId() {
            return ((this.newCard) ? 'editTags-newTagName-list-' + this.listIndex + '-card-newCard'
                : 'editTags-newTagName-list-' + this.listIndex + '-card-' + this.cardIndex);
        },

        tagColorId() {
            return ((this.newCard) ? 'editTags-newTagColor-list-' + this.listIndex + '-card-newCard'
                : 'editTags-newTagColor-list-' + this.listIndex + '-card-' + this.cardIndex);
        }

    },
    template:
        `
    <span>
        <label :for="tagNameId">New Tag:</label>
            <input 
                class="border text-left"
                v-model="newTag.name" 
                :id="tagNameId"
            >
            <br>
                                  
            <select-color
                :input-id="tagColorId"
                label-text="Tag Color"
                v-model="newTag.color"
            >
            </select-color>     
                                                    
            <br>
            <button
                class="btn btn-success"
                v-if="newTag.color.length > 0 && newTag.name.length > 0 && isValidTagName(newTag.name)"
                @click="addNewTag()"
            >
                Add Tag
            </button>

            <span v-else>
                Please enter a unique tag name and pick a color.
            </span>
    </span>
    `
});

