/*
 * JavaScript for Trello project using Vue.js
 *
 * @author Abby Mapes
 */

 
const app = new Vue({
    data () {
        return {
            pageData: pageData,
            selectedType: pageData.selectedType,
            pageBackground: pageData.pageBackground,
            lists: columns,
            currentList: "full",
            newList: {
                listName: {
                    title: "", 
                    isEditing: false,
                },
                editingOrder: false,
                showInSearch: true,
                cards: [],
                newCard: {}
            },
            duplicateCardName: "",
            globalEdit: {
                dragState: null,
            }
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
            return deadlineDate.toLocaleDateString();
        }, 

        /*
         * Returns a String of date to display for card
         */
        displayTime (dateString) {
            let deadlineDate = new Date(dateString);
            return deadlineDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
            this.refreshData();
        }, 

        /*
         * Adds a new tag, that the user hasn't defined yet to page settings,
         * so they can re-use it later, as well as adding the tag to the 
         * card the user added the tag to
         */
        addNewTag(card) {
            this.$set(this.pageData.tags, this.pageData.tags.length, card.newTag);
            this.$set(card.tags, card.tags.length, {name: card.newTag.name});
            card.newTag= {
                name: "", 
                color: ""
            };
            this.pageData = pageData;
            this.refreshData();
        }, 

        /*
         * Adds new list to the project when a user specifies a 
         * new list
         */
        submitList() {
            this.newList.newCard = this.getEmptyNewCardList();
            this.$set(columns, columns.length, this.newList);
            this.newList= {
                listName: {
                    title: "", 
                    isEditing: false,
                },
                editingOrder: false,
                showInSearch: true,
                cards: [], 
                newCard: {}
            };
        }, 

        /*
         * Returns initial empty new card proprety for a list
         */
        getEmptyNewCardList() {
            return {
                isEditing: false,
                card: {
                    cardName: {
                        title: "",
                        isEditing: false
                    },
                    description : {
                        title: "",
                        isEditing: false 
                    },
                    color: "",
                    showInSearch: true,
                    deadline: {
                        time: "",
                        isEditing: false 
                    },
                    tags: [],
                    comments: [], 
                    newComment: "",
                    duplicateCardName: "",
                    newTag: {
                        name: "", 
                        color: ""
                    },
                    editingOrder: false
                }
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
            this.$set(commentList, commentList.length, {text: card.newComment, 
                                                        isEditing: false,
                                                        newComment: card.newComment,
                                                        editingOrder: false});
            card.newComment = "";
            this.refreshData();
        }, 

        /*
         * Edits comment to display new text
         */
        editedComment(comment) {
            comment.text = comment.newComment;
            comment.isEditing = false;
        },

        /*
         * Cancels edited comment and displays original comment
         */
        cancelledCommentEdit(comment) {
            comment.newComment = comment.text;
            comment.isEditing = false;
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
         * Returns true if the tag is a valid name, meaning 
         * it is unique
         */
        isValidTagName(newName) {
            let isValid = true;
            pageData.tags.forEach(tag => {
                if (tag.name == newName) {
                    isValid = false;
                } 
            });
            return isValid;
        }, 

        /*
         * Deletes element at index specified from list parameeter
         */
        deleteItem(list, index) {
            this.$delete(list, index);
            this.refreshData();
        }, 

        /*
         * Duplicates list with a new name
         */
        duplicateList(list) {
            let cards = JSON.parse(JSON.stringify(list.cards));
            this.newList.cards = cards;
            this.newList.newCard = this.getEmptyNewCardList();
            this.$set(columns, columns.length, this.newList);
            this.newList= {
                listName: {
                    title: "", 
                    isEditing: false,
                },
                editingOrder: false,
                showInSearch: true,
                cards: [], 
                newCard: {}
            };
            this.refreshData();
        }, 

        /*
         * Duplicates card with a new name
         */
        duplicateCard(card, cardList) {
            let cardCopy = JSON.parse(JSON.stringify(card));
            cardCopy.cardName.title = card.duplicateCardName;
            cardCopy.duplicateCardName = "";
            this.$set(cardList, cardList.length, cardCopy);
            card.duplicateCardName = "";
            this.refreshData();
        }, 

        /*
         * Adds new card for the specified list
         */
        addNewCard(list, card) {
            this.$set(list.cards, list.cards.length, card);
            list.newCard = this.getEmptyNewCardList();
            this.refreshData();
        }, 

        /*
         * Clears new card property for list parameter
         */
        clearNewCard(list) {
            list.newCard = this.getEmptyNewCardList();
            this.refreshData();
        },

        /*
         * Remember starting point of drag so item can be removed 
         * after it is successfully dropped
         */
        startDrag (group, item, index) {
            this.globalEdit.dragState = { group: group, item: item, index: index };
        },

        /*
         * Add card to given group by dropping it
         */
        onDrop (group) {
            this.deleteItem(this.globalEdit.dragState.group, this.globalEdit.dragState.index);
            //this.removeLink(this.globalEdit.dragState.group, this.globalEdit.dragState.item);
            this.addNewCard(group, this.globalEdit.dragState.item);
            this.globalEdit.dragState = null;
        },

        /*
         * Puts list[old] in list[newIndex] and shifts all other indexes accordingly
         */
        changeOrder(list, newIndex, old) {
            let oldItem = list[old];
            oldItem.editingOrder = false;

            this.deleteItem(list, old);
            let listCopy = JSON.parse(JSON.stringify(list));
            listCopy.forEach((element, i) => {
                listCopy[i].editingOrder = false;
                if (i < newIndex) {
                    this.$set(list, i, listCopy[i]);
                } else if (i == newIndex) {
                    this.$set(list, i, oldItem);
                } else if (i > newIndex) {
                    this.$set(list, i, listCopy[i-1]);
                }
            });
            if (newIndex == list.length) {
                this.$set(list, list.length, oldItem);
            } else {
                this.$set(list, list.length, listCopy[listCopy.length-1]);
            }
            this.refreshData();
        },

        /*
         * Gets display text for the filter selected
         */
        getSearchName(selectedType) {
            let name = "";
            this.pageData.searchTypes.forEach(category  => {
                if (category.type == selectedType) {
                    name = category.displayText;
                }
            });
            return name;
        }, 
        /*
         * Filter data to match inputted date and dateType
         */
        searchDate() {
            let localSearchTime = new Date(pageData.searchText);
            let searchTime = new Date(Date.UTC(localSearchTime.getUTCFullYear(), localSearchTime.getUTCMonth(), localSearchTime.getUTCDate()));
            searchTime.setHours(0,0,0,0);
            columns.forEach((list, i) => {
                let matchingCards = 0;
                list.cards.forEach(card => {
                    let localCardTime = new Date(card.deadline.time);
                    let cardTime = new Date(Date.UTC(localCardTime.getUTCFullYear(), localCardTime.getUTCMonth(), localCardTime.getUTCDate()));
                    cardTime.setHours(0,0,0,0);

                    if (this.pageData.dateType == "Before") {
                        card.showInSearch = (cardTime < searchTime);
                        if (card.showInSearch) {
                            matchingCards += 1;
                        } 
                    } else if (this.pageData.dateType == "On") {
                        card.showInSearch = (+cardTime == +searchTime);
                        if (card.showInSearch) {
                            matchingCards += 1;
                        } 
                    } else {
                        card.showInSearch = (cardTime > searchTime);
                        if (card.showInSearch) {
                            matchingCards += 1;
                        } 
                    }
                });
                list.showInSearch = (matchingCards > 0);
            });
            this.currentList = "date-filter";
        },

        /*
         * Sets display for each list results based on type of search
         */
        searchText() {
            let searchResults = [];
            if (this.selectedType == "list-name") {
                searchResults = this.searchListName();
            } else if (this.selectedType == "task-name") {
                searchResults = this.searchCard("title");
            } else if (this.selectedType == "description") {
                searchResults = this.searchCard("description");
            } else if (this.selectedType == "sub-tasks") {
                searchResults = this.searchCard("subtask");
            }
            this.currentList = "text-filter";
        },

        /*
         * Sets showInSearch to true for all lists that match filter and 
         * false for all lists that don't
         */
        searchListName() {
            let searchText = this.pageData.searchText.toLowerCase();
            columns.forEach((list, i) => {
                list.showInSearch = (list.listName.title.toLowerCase().includes(searchText));
            });
        },

        /*
         * Sets showInSearch for all lists that include the search text in the specified property
         * parameter, which is either 'title', 'description' or 'subtask', and for all according
         * cards within that list
         */
        searchCard(property) {
            let searchText = this.pageData.searchText.toLowerCase();
            columns.forEach((list, i) => {
                let matchingCards = 0;
                list.cards.forEach(card => {
                    if (property == "title") {
                        card.showInSearch = (card.cardName.title.toLowerCase().includes(searchText));
                        if (card.showInSearch) {
                            matchingCards += 1;
                        } 
                    } else if (property == "description") {
                        card.showInSearch = (card.description.title.toLowerCase().includes(searchText));
                        if (card.showInSearch) {
                            matchingCards += 1;
                        } 
                    } else {
                        let subtaskContainsText = false;
                        card.comments.forEach(comment => {
                            if (comment.text.toLowerCase().includes(searchText)) {
                                subtaskContainsText = true;
                            }
                        });
                        card.showInSearch = subtaskContainsText;
                        if (subtaskContainsText) {
                            matchingCards += 1;
                        }
                    }
                });
                list.showInSearch = (matchingCards > 0);
            });
        },

        /*
         * Sets showInSearch to true for all lists that include cards that are tagged with the selected
         * search tags (and all such cards), and false for all lists that don't
         */
        searchTags() {
            let searchTags = this.pageData.searchTags;
            columns.forEach((list, i) => {
                let matchingCards = 0;
                list.cards.forEach(card => {
                    let containsTag = false;
                    card.tags.forEach(tag => {
                        if (searchTags.includes(tag.name)) {
                            containsTag = true;
                        }
                    });
                    card.showInSearch = containsTag;
                    if (containsTag) {
                        matchingCards += 1;
                    }
                });
                list.showInSearch = (matchingCards > 0);
            });
            this.currentList = "tag-filter";
        },

        /*
         * Refreshes data once deadlines of tasks have been changed
         * Necessary for when user edits deadline of task while filtering 
         * for certain deadlines. Ensures only tasks matching those deadlines
         * show up
         */
        setDeadline(card) {
            card.deadline.isEditing = false;
            this.refreshData();
        },

        /*
         * Clear filter and display all data
         */
        clearFilter() {
            this.pageData.searchText = "";
            this.pageData.searchTags = [];
            this.pageData.dateType = "Before";
            this.currentList = "full";
            columns.forEach(list => {
                list.showInSearch = true;
                list.cards.forEach(card => {
                    card.showInSearch = true;
                });
            });
        },

        /*
         * Refreshes list of data to display on the screen, based on 
         * the current list being shown. Current list types include :
         * 'full', 'date-filter', 'text-filter' and 'tag-filter'
         */
        refreshData() {
            this.lists = columns;
            if (this.currentList == "full") {
                this.clearFilter();
            } else if (this.currentList == 'date-filter') {
                this.searchDate();
            } else if (this.currentList == 'text-filter') {
                this.searchText();
            } else {
                this.searchTags();
            }
        }
    },

    watch: {
        selectedType() {
            this.clearFilter();
        }
    },

    mounted () {

    }
});

app.$mount('#app');