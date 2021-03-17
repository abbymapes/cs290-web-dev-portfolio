/*
 * This represents the reactive data for our Trello page.
 *
 * It contains no interaction logic, just information about the state of the user's
 * Trello project.
 *
 * @author Abby Mapes
 */

const trelloDataStore = {
    pageData: {
        projectName: "My Monthly To-Do List",
        pageBackground: "#fab8ff",
        tags: [
            {
                name: "urgent",
                color: "#ff7070"
            },
            {
                name: "school",
                color: "#fff08f"
            },
            {
                name: "fun",
                color: "#FFA358"
            },
            {
                name: "work",
                color: "#FF8FF6"
            },
            {
                name: "chores",
                color: "#8FFFF1"
            },
            {
                name: "next week",
                color: "#9679FD"
            },
            {
                name: "friends",
                color: "#7DFFBA"
            }
        ],
        selectedType: "list-name",
        recentDateSearch: "",
        recentDateSearchType: "Before",
        recentTagSearch: []
    },
    columns: [
        {
            listName: "To Do",
            showInSearch: true,
            cards: [
                {
                    cardName: "Laundry",
                    description: "Do all whites and darks",
                    color: "#b8ffbc",
                    showInSearch: true,
                    deadline: "2021-03-03T12:56:30",
                    tags: [
                        {
                            name: "chores"
                        },
                        {
                            name: "next week"
                        }
                    ],
                    comments: [
                        {
                            text: "Go to store to get detergent first."
                        },
                        {
                            text: "Don't forget to use fabric softener."
                        }
                    ]
                }
            ]
        },
        {
            listName: "School Work",
            showInSearch: true,
            cards: [
                {
                    cardName: "Math HW",
                    description: "Sections: 5, 6, 7, 8, and 9",
                    color: "#C4C2FB",
                    showInSearch: true,
                    deadline: "2021-03-20T10:20:30",
                    tags: [
                        {
                            name: "school"
                        },
                        {
                            name: "friends"
                        },
                        {
                            name: "next week"
                        },
                        {
                            name: "urgent"
                        },
                        {
                            name: "work"
                        }
                    ],
                    comments: [
                        {
                            text: "Check with friends to see if they have done first"
                        },
                        {
                            text: "Call tutor if you can't figure it out"
                        },
                        {
                            text: "Make sure you check your work"
                        }
                    ]
                },
                {
                    cardName: "English Essay",
                    description: "",
                    deadline: "2021-03-03T10:20:30",
                    color: "#b8fffe",
                    showInSearch: true,
                    tags: [
                        {
                            name: "school"
                        },
                        {
                            name: "urgent"
                        }
                    ],
                    comments: [
                        {
                            text: "Turn in before late submission timeline"
                        }
                    ]
                },
                {
                    cardName: "Physics Problem Set",
                    description: "Sets 7 and 8 to study for test",
                    deadline: "2021-03-09T10:20:30",
                    color: "#DDFBC2",
                    showInSearch: true,
                    tags: [
                        {
                            name: "school"
                        }
                    ],
                    comments: [
                        {
                            text: "Try and rewatch lecture videos"
                        },
                        {
                            text: "Try to redo problem set"
                        }
                    ]
                }
            ]
        },
        {
            listName: "Fun",
            showInSearch: true,
            cards: [
                {
                    cardName: "Go for hike with mom",
                    description: "",
                    deadline: "",
                    color: "#FCFFCA",
                    showInSearch: true,
                    tags: [
                        {
                            name: "friends"
                        },
                        {
                            name: "next week"
                        },
                        {
                            name: "fun"
                        }
                    ],
                    comments: []
                },
                {
                    cardName: "Watch Taylor Swift Documentary",
                    description: "",
                    deadline: "",
                    color: "",
                    showInSearch: true,
                    tags: [],
                    comments: []
                }
            ]
        },
        {
            listName: "Chores",
            showInSearch: true,
            cards: []
        },
        {
            listName: "Work",
            showInSearch: true,
            cards: [
                {
                    cardName: "Email boss about meeting",
                    description: "Ask him his thoughts on presentation",
                    deadline: "2021-03-15T10:20:30",
                    color: "#FFC57B",
                    showInSearch: true,
                    tags: [
                        {
                            name: "work"
                        }
                    ],
                    comments: [
                        {
                            text: "CC John in email"
                        },
                        {
                            text: "Send a draft to Katie first"
                        }
                    ]
                },
                {
                    cardName: "Finish report on BitCoin",
                    description: "Bitcoin's earnings over past quarter",
                    deadline: "2021-03-10T10:20:30",
                    color: "#FFDDDD",
                    showInSearch: true,
                    tags: [
                        {
                            name: "work"
                        },
                        {
                            name: "urgent"
                        },
                        {
                            name: "next week"
                        }
                    ],
                    comments: []
                }
            ]
        },
        {
            listName: "Internships",
            showInSearch: true,
            cards: [
                {
                    cardName: "Apply to start up",
                    description: "",
                    deadline: "2021-04-10T10:20:30",
                    color: "#C9FFD1",
                    showInSearch: true,
                    tags: [
                        {
                            name: "work"
                        },
                        {
                            name: "urgent"
                        },
                        {
                            name: "next week"
                        },
                        {
                            name: "fun"
                        }
                    ],
                    comments: [
                        {
                            text: "Finish cover letter"
                        },
                        {
                            text: "Edit resume"
                        }
                    ]
                }
            ]
        },
        {
            listName: "Fellowship Program",
            showInSearch: true,
            cards: []
        }
    ],
    /*
     * Returns reference to list at parameter index
     */
    list(listIndex) {
        return this.columns[listIndex];
    },

    /*
     * Returns reference to the card at cardIndex within the list at parameter listIndex
     */
    card(listIndex, cardIndex) {
        return this.columns[listIndex].cards[cardIndex];
    },

    /*
     * Returns reference to the commeent at commentIndex within the card 
     * at cardIndex within the list at parameter listIndex
     */
    comment(listIndex, cardIndex, commentIndex) {
        return this.columns[listIndex].cards[cardIndex].comments[commentIndex];
    },

    /*
     * Adds the list parameter to the Trello Project (columns)
     */
    addNewList(listToAdd) {
        this.columns.push(listToAdd);
    },

    /*
     * Deletes the list at specified index from the Trello Project (columns)
     */
    deleteList(listIndex) {
        this.columns.splice(listIndex, 1);
    },

    /*
     * Changes background color of project page by editing Trello Project's
     * pageData 
     */
    changeBackground(color) {
        this.pageData.pageBackground = color;
    },

    /*
     * Updates project title to the current title parameter
     */
    updateProjectName(currentTitle) {
        if (currentTitle.trim().length > 0) {
            this.pageData.projectName = currentTitle;
        } else {
            // Preserves space for users to double click to edit name if they enter a blank one
            this.pageData.projectName = "_____________";
        }
    },

    /*
     * Changes the name of the list at the specified index to the currentTitle
     * parameter
     */
    updateListName(currentTitle, listIndex) {
        let list = this.list(listIndex);
        if (currentTitle.trim().length > 0) {
            list.listName = currentTitle;
        } else {
            // Preserves space for users to double click to edit name
            list.listName = "_____________";
        }
    },

    /*
     * Changes the name of the card at the specified cardIndex within 
     * the list at the specified listIndex to the currentTitle
     * parameter
     */
    updateCardName(currentTitle, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        if (currentTitle.trim().length > 0) {
            card.cardName = currentTitle;
        } else {
            // Preserves space for users to double click to edit name
            card.cardName = "_____________";
        }
    },

    /*
     * Updates list order by moving the list at oldIndex to the newIndex
     * and shifting all other lists accordingly
     */
    updateListOrder(newIndex, oldIndex) {
        this.changeOrder(this.columns, newIndex, oldIndex);
    },

    /*
     * Updates card order within the specified list index by moving the card 
     * at oldIndex to the newIndex and shifting all other cards accordingly
     */
    updateCardOrder(listIndex, newIndex, oldIndex) {
        this.changeOrder(this.list(listIndex).cards, newIndex, oldIndex);
    },

    /*
     * Updates comment order within the specified card within thee specified list 
     * by moving the comment at oldIndex to the newIndex and shifting all other comments accordingly
     */
    updateCommentOrder(listIndex, cardIndex, newIndex, oldIndex) {
        this.changeOrder(this.card(listIndex, cardIndex).comments, newIndex, oldIndex);
    },

    /*
     * Updates list parameter by moving list[old] to list[newIndex] and 
     * updating all following indices accordingly
     */
    changeOrder(list, newIndex, old) {
        let oldItem = list[old];
        list.splice(old, 1);
        list.splice(newIndex, 0, oldItem);
    },

    /*
     * Deletes card at cardIndex from list at listIndex
     */
    deleteCard(listIndex, cardIndex) {
        this.list(listIndex).cards.splice(cardIndex, 1);
    },

    /*
     * Updates deadline of card at cardIndex within the list at listIndex
     * to the currentDeadline
     */
    updateDeadline(currentDeadline, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        card.deadline = currentDeadline;
    },

    /*
     * Updates description of card at cardIndex within the list at listIndex
     * to the text parameter
     */
    updateDescription(text, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        card.description = text;
    },

    /*
     * Adds newTag to the tag list for the Trello project
     */
    addNewTag(newTag) {
        this.pageData.tags.push(newTag);
    },

    /*
     * Adds existing tag with tagName to the card at cardIndex within
     * the list at listIndex
     */
    addExistingTag(tagName, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        card.tags.push({ name: tagName });
    },

    /*
     * Deletes existing tag with tagName from the card at cardIndex within
     * the list at listIndex
     */
    deleteTag(tagIndex, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        card.tags.splice(tagIndex, 1);
    },

    /*
     * Deletes comment at commentIndex from the card at cardIndex within
     * the list at listIndex
     */
    deleteComment(listIndex, cardIndex, commentIndex) {
        let card = this.card(listIndex, cardIndex);
        card.comments.splice(commentIndex, 1);
    },

    /*
     * Deletes a new comment with text newComment to the card at cardIndex 
     * within the list at listIndex
     */
    addNewComment(newComment, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        card.comments.push({ text: newComment });
    },

    /*
     * Edits the existing comment at commentIndex from the card at cardIndex within 
     * the list at listIndex by replacing its text with the newComment parameter
     */
    editComment(newComment, listIndex, cardIndex, commentIndex) {
        if (newComment.trim().length == 0) {
            this.deleteComment(listIndex, cardIndex, commentIndex);
        } else {
            let card = this.card(listIndex, cardIndex);
            card.comments.splice(commentIndex, 1, { text: newComment });
        }
    },

    /*
     * Duplicates card at cardIndex within the list at listIndex and gives it a 
     * new title: newName and adds the new card to list at listIndex 
     */
    duplicateCard(newName, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        let list = this.list(listIndex);
        let cardCopy = JSON.parse(JSON.stringify(card));
        cardCopy.cardName = newName;
        list.cards.push(cardCopy);
    },

    /*
     * Duplicates the list at listIndex and gives it a new title: newName
     */
    duplicateList(newName, listIndex) {
        let list = this.list(listIndex);
        let listCopy = JSON.parse(JSON.stringify(list));
        let cards = JSON.parse(JSON.stringify(list.cards));
        listCopy.listName = newName;
        listCopy.cards = cards;
        this.addNewList(listCopy);
    },

    /*
     * Changes the card color of the card at cardIndex within the list 
     * at listIndex to newColor
     */
    changeCardColor(newColor, listIndex, cardIndex) {
        let card = this.card(listIndex, cardIndex);
        card.color = newColor;
    },

    /*
     * Adds the card parameter to the list at listIndex
     */
    addNewCard(card, listIndex) {
        let list = this.list(listIndex);
        list.cards.push(card);
    },

    /*
     * Updates columns to the lists parameter
     */
    updateColumns(lists) {
        this.columns = lists;
    },

    /*
     * Sets showInSearch property to true for all lists w indices in listsShown
     * and all cards in cardsShown s.t. cardsShown[i] = list of indices of 
     * cards that should be displayed within list i
     * 
     * If a listIndex is not in listsShown, showInSearch is set to false
     * If a cardIndex is not in cardsShown[i], then showInSearch for lists[i].cards[cardIndex] 
     * is set to false as well
     */
    showCardSearchResults(listsShown, cardsShown) {
        this.columns.forEach((list, i) => {
            list.showInSearch = listsShown.includes(i);
            list.cards.forEach((card, j) => {
                if (cardsShown[i]) {
                    card.showInSearch = cardsShown[i].includes(j);
                }
            });
        });
    },

    /*
     * Sets showInSearch property to true for all lists w indices in listsShown 
     * AND for all cards within those specified lists 
     * 
     * Used when we search by list name, meaning we want to see all cards in list
     */
    showListSearchResults(listsShown) {
        this.columns.forEach((list, i) => {
            list.showInSearch = listsShown.includes(i);
            list.cards.forEach((card, j) => {
                card.showInSearch = true;
            });
        });
    },

    /*
     * Clears filter by setting showInSearch to true for all lists and cards,
     * so that all data will be displayed 
     * 
     * Additionally, resets any recent search data
     */
    clearFilter() {
        this.pageData.recentDateSearch = "";
        this.pageData.recentTagSearch = [];
        this.pageData.recentDateSearchType = "Before";

        this.columns.forEach(list => {
            list.showInSearch = true;
            list.cards.forEach(card => {
                card.showInSearch = true;
            });
        });
    },

    /*
     * Changes selectedType of filter in pageData to newFilter
     */
    changeFilter(newFilter) {
        this.pageData.selectedType = newFilter;
    },

    /*
     * Changes recentTagSearch list of tags chosen for the tag filter to
     * the parameter tags 
     */
    storeTagsSearch(tags) {
        this.pageData.recentTagSearch = tags;
    },

    /*
     * Changes recent date search information to the specified date
     * and dateType 
     */
    storeDateSearch(date, dateType) {
        this.pageData.recentDateSearch = date;
        this.pageData.recentDateSearchType = dateType;
    }
};