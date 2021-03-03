/*
 * JavaScript for Trello project using Vue.js
 *
 * @author Abby Mapes
 */

const app = new Vue({
    data () {
        return {
            pageData: pageData,
            pageBackground: pageData.pageBackground,
            lists: columns,
            newTag: {
                name: "", 
                color: ""
            },
            newList: {
                listName: {
                    title: "", 
                    isEditing: false
                },
                cards: []
            },
            duplicateCardName: ""
        };
    },

    methods: {
        /*
         * Gets the color of a tag from the tag name
         */
        getTagColor(tagName) {
            let color = "";
            this.pageData.tags.forEach(tagObject  => {
                if (tagObject.name == tagName) {
                    color = tagObject.color;
                }
            });
            return color;
        }, 

        /*
         * Determines whether the current date is later than 
         * dateString 
         */
        deadlinePassed (dateString) {
            let currentDate = new Date();
            let deadlineDate = new Date(dateString);
            return currentDate > deadlineDate;
        }, 

        /*
         * Returns a String of date to display for card
         */
        displayDate (dateString) {
            let deadlineDate = new Date(dateString);
            return deadlineDate.toLocaleDateString() + ", " + deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }, 

        /*
         * Called when a user adds or removes a tag from a card
         */
        editTags(tagName, cardTags) {
            if (this.hasTag(tagName, cardTags)) {
                this.$delete(cardTags, this.getTagIndex(tagName, cardTags) );
            } else {
                this.$set(cardTags, cardTags.length, {name: tagName});
            }
            this.lists = columns;
        }, 

        /*
         * Adds a new tag, that the user hasn't defined yet to page settings,
         * so they can re-use it later, as well as adding the tag to the 
         * card the user added the tag to
         */
        addNewTag(cardTags) {
            this.$set(this.pageData.tags, this.pageData.tags.length, this.newTag);
            this.$set(cardTags, cardTags.length, {name: this.newTag.name});
            this.newTag= {
                name: "", 
                color: ""
            };
            this.pageData = pageData;
            this.lists = columns;
        }, 

        /*
         * Adds new list to the project when a user specifies a 
         * new list
         */
        submitList() {
            this.$set(columns, columns.length, this.newList);
            this.newList= {
                listName: {
                    title: "", 
                    isEditing: false
                },
                cards: []
            };
        }, 

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
         * Adds comment to card when user enters a new one
         */
        enteredNewComment(commentList, card) {
            this.$set(commentList, commentList.length, {text: card.newComment});
            card.newComment = "";
            this.lists = columns;
        }, 

        /*
         * Returns index of tag in tag list
         */
        getTagIndex (tagName, tagList) {
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
         * Deletes element at index specified from list parameeter
         */
        deleteItem(index, list) {
            this.$delete(list, index);
            this.lists = columns;
        }, 
        /*
         * Duplicates list with a new name
         */
        duplicateList(list) {
            let cards = JSON.parse(JSON.stringify(list.cards));
            this.newList.cards = cards;
            this.$set(columns, columns.length, this.newList);
            this.newList= {
                listName: {
                    title: "", 
                    isEditing: false
                },
                cards: []
            };
            this.lists = columns;
        }, 
        /*
         * TODO: Implement searching
         */
        searchData(list) {

        }
    },

    watch: {

    },

    mounted () {

    }
});

app.$mount('#app');