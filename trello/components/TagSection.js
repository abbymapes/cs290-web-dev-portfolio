/*
 * This represents the display for the tag section in Trello Cards,
 * which includes the tags and the edit tag input display.
 *
 * @author Abby Mapes
 */

Vue.component('tag-section', {
    props: {
        card: {
            type: Object,
            required: true
        },

        cardColor: {
            type: String,
            required: true
        },

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
            required: true
        },

        // Boolean indicating if tag section is for a new card input (rather than an existing card)
        newCard: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        /*
         * Emits 'add-new-tag' when the user creates a new tag with a valid name and 
         * color to add to the tag list, as well as the current card
         */
        addNewTag(newTag, listIndex, cardIndex) {
            // If this is a new card, then we want to add the tag to the page's tag list,
            //   as well as adding the tag to the new card template (since card isn't in data store yet, 
            //   as it hasn't been added)
            if (this.newCard) {
                // Passes to newCard parent component, where it is added to the newCard display being created (before its added)
                this.$emit('add-new-tag', newTag, listIndex, cardIndex);
                // Passes through newCard parent component to list component, where it emits a signal to 
                // store new tag in the page data
                this.$parent.$emit('add-new-tag', newTag, listIndex, cardIndex);
            } else {
                // Otherwise, we want to add the tag to add the tag to the page's tag list as well 
                //   as to the card at the specified listIndex and cardIndex in our data store 

                // Passes through components: card --> draggable (for card) --> list  --> project 
                // where new tag is added to the specified existing card in data store and added to tag list
                this.$parent.$parent.$parent.$emit('add-new-tag', newTag, listIndex, cardIndex);
            }
        },
        /*
         * Emits 'delete-tag' when the user deselects a tag for the card
         */
        deleteTag(tagName, tagIndex, listIndex, cardIndex) {
            // If this is a new card, then signal is emitted to newCard parent component,
            //  which will remove the specified tag from the new card template 
            if (this.newCard) {
                this.$emit('delete-tag', tagName, tagIndex, listIndex, cardIndex);
            } else {
                // Passes through components: card --> draggable (for card) --> list  --> project 
                // where tag is removed from the specified existing card in data store 
                this.$parent.$parent.$parent.$emit("delete-tag", tagName, tagIndex, listIndex, cardIndex);
            }
        },

        addTag(tagName, tagIndex, listIndex, cardIndex) {
            // If this is a new card, then signal is emitted to newCard parent component,
            //  which will add the specified tag to the new card template 
            if (this.newCard) {
                this.$emit('add-tag', tagName, tagIndex, listIndex, cardIndex);
            } else {
                // Otherwise, will pass through components: card --> draggable (for card) --> list  --> project 
                // in order to add specified tag to existing card in data base
                this.$parent.$parent.$parent.$emit("add-tag", tagName, tagIndex, listIndex, cardIndex);
            }
        },

        /*
         * Returns the color of the inputted tag name, based on the user's project tags
         */
        getTagColor(tagName) {
            let color = "";
            this.tags.forEach(tagObject => {
                if (tagObject.name == tagName) {
                    color = tagObject.color;
                }
            });
            return color;
        }
    },
    template:
        `
    <div class="tag-section">
        <div class="card tag-card" :style = "'background-color:' + cardColor">
            <div class="card-header">
                Tags
            </div>

            <li
                v-for="(tag, i) in card.tags"
                :key="i"
                class="tags"
                :style="'background-color:' + getTagColor(tag.name)"
            >
                <b>{{tag.name}}</b>
            </li>

            <br>

            <div class="card-footer tag-footer">
                <b-dropdown variant="outline" class="add-tag" size="sm" boundary="window" text="Edit Tags">
                    <div class = "dropdown" role="menuitem">
                        <add-tag-input
                            :card="card"
                            :tags="tags"
                            :list-index="listIndex"
                            :card-index="cardIndex"
                            :new-card="newCard"
                            @delete-tag="deleteTag"
                            @add-tag="addTag"
                        >
                        </add-tag-input>

                        <new-tag-input
                            :tags="tags"
                            :list-index="listIndex"
                            :card-index="cardIndex"
                            :new-card="newCard"
                            @add-tag="addNewTag"
                        >
                        </new-tag-input>
                    </div>
                </b-dropdown>
            </div> 
        </div> 
        <br>              
    </div>
    `
});
