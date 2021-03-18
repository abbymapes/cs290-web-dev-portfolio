/*
 * JavaScript for Trello project using Vue.js
 *
 * @author Abby Mapes
 */

const app = new Vue({
    data() {
        return {
            trelloDataStore,
            pageData: trelloDataStore.pageData,
            selectedType: trelloDataStore.pageData.selectedType,
            pageBackground: trelloDataStore.pageData.pageBackground,
            lists: trelloDataStore.columns,
            listDragging: false,
            selectedDisplayName: "",
            currentList: "full"
        };
    },

    methods: {
        /*
         * Adds tag with tagName to the specified card in specified list
         */
        addTag(tagName, tagIndex, listIndex, cardIndex) {
            this.trelloDataStore.addExistingTag(tagName, listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Deletes tag with at tagIndex from the specified card in specified list
         */
        deleteTag(tagName, tagIndex, listIndex, cardIndex) {
            this.trelloDataStore.deleteTag(tagIndex, listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Adds a new tag, that the user hasn't defined yet to page settings,
         * so they can re-use it later
         */
        addTagToList(newTag) {
            this.trelloDataStore.addNewTag(newTag);
            this.pageData = trelloDataStore.pageData;
            this.refreshData();
        },

        /*
         * Adds a new tag, that the user hasn't defined yet to page settings,
         * so they can re-use it later, as well as adding the tag to the 
         * card the user added the tag to
         */
        addNewTag(newTag, listIndex, cardIndex) {
            this.addTagToList(newTag);
            this.trelloDataStore.addExistingTag(newTag.name, listIndex, cardIndex);
            this.pageData = trelloDataStore.pageData;
            this.refreshData();
        },

        /*
         * Adds new blank list to the project with newName as the list name
         * when  a user specifies a new list
         */
        addBlankList(newName) {
            this.trelloDataStore.addNewList({
                listName: newName,
                showInSearch: true,
                cards: []
            });
            this.refreshData();
        },

        /*
         * Adds comment to specified card in specified list when user enters a new one
         */
        enteredNewComment(newComment, listIndex, cardIndex) {
            this.trelloDataStore.addNewComment(newComment, listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Edits comment at specified index in specified card within specified list
         * to display new text stored newComment
         */
        editComment(newComment, listIndex, cardIndex, commentIndex) {
            this.trelloDataStore.editComment(newComment, listIndex, cardIndex, commentIndex);
            this.refreshData();
        },

        /*
         * Changes card color to specified color
         */
        changeCardColor(newColor, listIndex, cardIndex) {
            this.trelloDataStore.changeCardColor(newColor, listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Deletes comment at specified index from specified card
         * in specified list
         */
        deleteComment(listIndex, cardIndex, commentIndex) {
            this.trelloDataStore.deleteComment(listIndex, cardIndex, commentIndex);
            this.refreshData();
        },

        /*
         * Deletes list at specified index
         */
        deleteList(listIndex) {
            this.trelloDataStore.deleteList(listIndex);
            this.refreshData();
        },

        /*
         * Updates list in trello datastore
         */
        updateCardColumns(lists) {
            this.trelloDataStore.updateColumns(lists);
            this.refreshData();
        },

        /*
         * Duplicates card at specified index in specified list and
         * sets the new card name to newName 
         */
        duplicateCard(newName, listIndex, cardIndex) {
            this.trelloDataStore.duplicateCard(newName, listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Duplicates list at listIndex and replaces name with newName
         */
        duplicateList(newName, listIndex) {
            this.trelloDataStore.duplicateList(newName, listIndex);
            this.refreshData();
        },

        /*
         * Change background color of project page
         */
        changeBackgroundColor(color) {
            this.trelloDataStore.changeBackground(color);
            this.pageBackground = color;
        },

        /*
         * Update project title to projectName
         */
        editProjectName(projectName) {
            this.trelloDataStore.updateProjectName(projectName);
        },

        /*
         * Updates description of card at specified index in specified list 
         * to text 
         */
        editCardDescription(text, listIndex, cardIndex) {
            this.trelloDataStore.updateDescription(text, listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Updates deadline of card at specified index in specified list 
         * to deadline 
         */
        editCardDeadline(deadline, listIndex, cardIndex) {
            this.trelloDataStore.updateDeadline(deadline, listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Deletes card at specified index in specified list
         */
        deleteCard(listIndex, cardIndex) {
            this.trelloDataStore.deleteCard(listIndex, cardIndex);
            this.refreshData();
        },

        /*
         * Edits name of list, if nameType is 'List', or edits 
         * name of card otherwise
         */
        editName(nameType, inputtedName, listIndex, cardIndex) {
            if (nameType == "List") {
                this.trelloDataStore.updateListName(inputtedName, listIndex);
            } else {
                this.trelloDataStore.updateCardName(inputtedName, listIndex, cardIndex);
            }
            this.refreshData();
        },

        /*
         * Edits the order of specified orderType, which is either a 
         * List, Card, or Comment by switching item at oldIndex to newIndex
         */
        editOrder(orderType, listIndex, cardIndex, newIndex, oldIndex) {
            if (orderType == "List") {
                this.trelloDataStore.updateListOrder(newIndex, oldIndex);
            } else if (orderType == "Card") {
                this.trelloDataStore.updateCardOrder(listIndex, newIndex, oldIndex);
            } else {
                this.trelloDataStore.updateCommentOrder(listIndex, cardIndex, newIndex, oldIndex);
            }
            this.refreshData();
        },

        /*
         * Adds new card to the specified list
         */
        addNewCard(card, listIndex) {
            this.trelloDataStore.addNewCard(card, listIndex);
            this.refreshData();
        },

        /*
         * Stores the most recent date search information so that if a user
         * updates any content of a card being displayed in teh current filter, we can 
         * reload the updated cards with the current filter (i.e. they can update cards 
         * within the current filter and view changes accordingly based on filter)
         */
        storeRecentDateSearch(date, dateType, displayText) {
            this.trelloDataStore.storeDateSearch(date, dateType);
            this.selectedDisplayName = displayText;
            this.searchDate();
        },

        /*
         * Stores the most recent tag search information so that if a user
         * updates the content of a card while viewing filtered cards by tags, we can 
         * reload the data with the current filter (i.e. they can update cards 
         * within the current filter and view changes accordingly based on filter)
         */
        storeRecentTagSearch(tags, displayText) {
            this.trelloDataStore.storeTagsSearch(tags);
            this.selectedDisplayName = displayText;
            this.searchTags();
        },

        /*
         * Determines list and card indices that should be displayed in the current 
         * date search (which wasn't supported by the search component)
         */
        searchDate() {
            let localSearchTime = new Date(trelloDataStore.pageData.recentDateSearch);
            let searchTime = new Date(Date.UTC(localSearchTime.getUTCFullYear(), localSearchTime.getUTCMonth(), localSearchTime.getUTCDate()));
            searchTime.setHours(0, 0, 0, 0);
            let listsShown = [];
            let cardsShown = [];

            trelloDataStore.columns.forEach((list, i) => {
                let matchingCards = [];
                list.cards.forEach((card, cardIndex) => {
                    let localCardTime = new Date(card.deadline);
                    let cardTime = new Date(Date.UTC(localCardTime.getUTCFullYear(), localCardTime.getUTCMonth(), localCardTime.getUTCDate()));
                    cardTime.setHours(0, 0, 0, 0);

                    let dateType = trelloDataStore.pageData.recentDateSearchType;

                    if (dateType == "Before") {
                        if (cardTime < searchTime) {
                            matchingCards.push(cardIndex);
                        }
                    } else if (dateType == "On") {
                        if (+cardTime == +searchTime) {
                            matchingCards.push(cardIndex);
                        }
                    } else {
                        if (cardTime > searchTime) {
                            matchingCards.push(cardIndex);
                        }
                    }
                });
                if (matchingCards.length > 0) {
                    listsShown.push(i);
                }
                cardsShown[i] = matchingCards;
            });
            this.trelloDataStore.showCardSearchResults(listsShown, cardsShown);
            this.currentList = "date-filter";
        },

        /*
         * Determines list and card indices that should be displayed in current
         * tag search (which wasn't supported by the search component)
         */
        searchTags() {
            let searchTags = trelloDataStore.pageData.recentTagSearch;
            let listsShown = [];
            let cardsShown = [];
            trelloDataStore.columns.forEach((list, i) => {
                let matchingCards = [];
                list.cards.forEach((card, j) => {
                    let containsTag = false;
                    card.tags.forEach(tag => {
                        if (searchTags.includes(tag.name)) {
                            containsTag = true;
                            matchingCards.push(j);
                        }
                    });
                });
                if (matchingCards.length > 0) {
                    listsShown.push(i);
                }
                cardsShown[i] = matchingCards;
            });
            this.trelloDataStore.showCardSearchResults(listsShown, cardsShown);
            this.currentList = "tags-filter";
        },

        /*
         * Refreshes the data being to displayed on the screen based on 
         * the current list being shown. Current list types include :
         * 'full', 'date-filter', and 'tag-filter'
         * 
         * We don't need to refresh data for text searches, since the
         * Search component does so for us
         */
        refreshData() {
            this.lists = trelloDataStore.columns;
            if (this.currentList == "full") {
                this.clearFilter();
            } else if (this.currentList == 'date-filter') {
                this.searchDate();
            } else {
                this.searchTags();
            }
        },

        /*
         * Takes in results returned from searching through with the Vue 
         * Search component and determines the list and card indices that 
         * should be displayed 
         * 
         * Note, instead of displaying a new "filtered" list like URLlinks does, 
         * this Trello project edits the showInSearch boolean value in the data set
         * which allows us to edit cards while filters are being displayed
         */
        handleSearchResults(results, displayText) {
            this.selectedDisplayName = displayText;
            if (results.some(group => group.matches) || results.length != this.lists.length) {
                this.currentList = "text-filter";
                let listsShown = [];
                let cardsShown = [];

                results.forEach(result => {
                    let listIndex = result.refIndex;
                    listsShown.push(listIndex);

                    // If there are matches
                    if (result.matches) {
                        let matchingCards = [];
                        // If the current search is a sub-task search, current match indices will 
                        // return the index of the comment within a given card, so we have to parse through
                        // cards to find the appropriate ones to include
                        if (this.selectedType == 'sub-tasks') {
                            result.matches.forEach(match => {
                                let commentIndex = match.refIndex;
                                let matchingComment = match.value;
                                let list = this.lists[listIndex];
                                list.cards.forEach((card, cardIndex) => {
                                    if (card.comments[commentIndex] && card.comments[commentIndex].text == matchingComment) {
                                        matchingCards.push(cardIndex);
                                    }
                                });
                            });
                        } else {
                            // Otherwise, the current search matches return a refIndex that corresponds
                            // the the card index, so we can add these straight to the list of cards to 
                            // add for the current list at index listIndex
                            result.matches.forEach(match => {
                                let cardIndex = match.refIndex;
                                if (cardIndex != null) {
                                    matchingCards.push(cardIndex);
                                }
                            });
                        }
                        cardsShown[listIndex] = matchingCards;
                    }
                });

                if (this.selectedType == "list-name") {
                    // If we are filtering by list name, we will display all cards within that list
                    this.trelloDataStore.showListSearchResults(listsShown, cardsShown);
                } else {
                    // If we are not filtering by list name (meaning we are filtering by data within a card), 
                    // we will display only the cards that match the filter within each list
                    this.trelloDataStore.showCardSearchResults(listsShown, cardsShown);
                }
            } else {
                // No search took place
                this.trelloDataStore.clearFilter();
                this.currentList = "full";
            }
        },

        /*
         * Changes search type when user chooses a new filter 
         */
        changeSearchType(newFilter) {
            this.trelloDataStore.changeFilter(newFilter);
            this.selectedType = trelloDataStore.pageData.selectedType;
        },

        /*
         * Clears the filter and displays all results
         */
        clearFilter() {
            this.trelloDataStore.clearFilter();
            this.currentList = "full";
        }
    },
    computed: {
        /*
         * Boolean indicating whether the full list, or a filtered subset of the 
         * Trello items are being shown
         */
        fullList() {
            return (this.currentList == "full");
        }
    },
    watch: {
        /*
         * When changing filter type, clear the filter results
         */
        selectedType() {
            this.clearFilter();
        }
    },
    template:
        `
    <span>
        <top-bar
            :selected-type="selectedType"
            :page-data="pageData"
            :lists="lists"
            @change-background-color="changeBackgroundColor"
            @change-filter-type="changeSearchType"
            @search-date="storeRecentDateSearch"
            @search-tags="storeRecentTagSearch"
            @search-text="handleSearchResults"
            @clear-filter="clearFilter"
            @new-list="addBlankList"
        >

        </top-bar>

        <main :style="'background-color:' + pageBackground" class="center">
            <project-name
                :text="pageData.projectName"
                @done-editing="editProjectName"
            ></project-name>
            
            <div :class="{'filter': !fullList}">
                <h2 v-if="!fullList" class="filter-text">
                    Lists Filtered By: {{selectedDisplayName}}
                </h2>

                <draggable
                    :disabled="!fullList"
                    class="card-columns"
                    :list="lists"
                    group="lists"
                    @start="listDragging = true"
                    @end="listDragging = false"
                >
                    <span
                        v-for="(list, i) in lists"
                        :key="i"
                    >
                            <list
                                :tags="pageData.tags"
                                :list="list"
                                :lists="lists"
                                :list-index="i"
                                :disable-card-dragging="(listDragging || !fullList)"

                                @change-order="editOrder"
                                @delete-list="deleteList"
                                @duplicate-list="duplicateList"
                                
                                @delete-card="deleteCard"
                                @change-card-color="changeCardColor"
                                @add-new-card="addNewCard"
                                @duplicate-card="duplicateCard"

                                @delete-comment="deleteComment"
                                @entered-comment="enteredNewComment"

                                @done-editing-name="editName"
                                @done-editing-deadline="editCardDeadline"
                                @done-editing-description="editCardDescription"
                                @done-editing-comment="editComment"

                                @add-new-tag="addNewTag"
                                @add-new-tag-to-page="addTagToList"
                                @add-tag="addTag"
                                @delete-tag="deleteTag"

                                @update-columns="updateCardColumns"
                            >
                            </list>
                    </span>
                </draggable>
            </div>
        </main>
    </span>
    `
});

app.$mount('#app');