/*
 * This represents the display for the tag selection in Trello Cards, which includes the 
 * exisiting tags that can checked to add to or delete from the current card. 
 *
 * @author Abby Mapes
 */

Vue.component('add-tag-input', {
    props: {
        card: {
            type: Object,
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
            required: false
        },

        newCard: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        /*
         * Emits the appropriate emitType when the user edits existing tags that 
         * are added to / deleted from the current card
         */
        editTags(emitType, tagName, tagIndex) {
            this.$emit(emitType, tagName, tagIndex, this.listIndex, this.cardIndex);
        },

        /*
         * Returns true if the tag list contains the tag name
         */
        hasTag(tagName, tagList) {
            let isChecked = false;
            tagList.forEach(tag => {
                if (tag.name == tagName) {
                    isChecked = true;
                }
            });
            return isChecked;
        },

        /*
         * Returns index of tag with tagName in tagList
         */
        getTagIndex(tagName, tagList) {
            let index = -1;
            let i = 0;
            tagList.forEach(item => {
                if (item.name == tagName) {
                    index = i;
                }
                i += 1;
            });
            return index;
        },

        /*
         * Returns 'delete-tag' if the card has the tag that was deselected
         * or 'add-tag' if the card doesn't already have the tag that was selected
         */
        emitType(tagName, cardTags) {
            if (this.hasTag(tagName, cardTags)) {
                return "delete-tag";
            } else {
                return "add-tag";
            }
        }
    },
    computed: {
        tagId() {
            return ((this.newCard) ? 'editTags-list-' + this.listIndex + '-card-newCard-tag-'
                : 'editTags-list-' + this.listIndex + '-card-' + this.cardIndex + '-tag-');
        }
    },
    template:
        `
    <ul>
        <li
            class="tags"
            v-for="(t, tagIndex) in tags"
            :key="tagIndex"
        >
            <input 
                type="checkbox" 
                :id="tagId + tagIndex"
                :name="'tag-' + tagIndex" 
                :value="t.name" 
                :checked="hasTag(t.name, card.tags)"
                @click="editTags(emitType(t.name, card.tags), t.name, getTagIndex(t.name, card.tags))"
            >
            <label :for="tagId + tagIndex" class="tags" :style="'background-color:' + t.color"><b>{{t.name}}</b></label>
            <br>
        </li>
    </ul>
    `
});
