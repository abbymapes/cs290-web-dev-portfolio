/*
 * JavaScript for Trello including pageData initialized with values for a blank project and 
 * columns initialized to an empty list (to be filled when user creates data)
 * 
 * Commentted out data structure used to develop code at the bottom
 *
 * @author Abby Mapes
 */


 let columns = [
];

let pageData = {
    projectName: {
        title: "Double Click To Enter A Project Name",
        isEditing: false },
    pageBackground: "#FFFFFF",
    tags: [],
    searchTypes : [ 
        {
           type: "list-name",
           displayText: "List Name"
        }, 
        {
           type: "task-name",
           displayText: "Task Name"
        }, 
        {
           type: "deadline",
           displayText: "Deadline"
        },
        {
           type: "description",
           displayText: "Description"
        }, 
        {
           type: "tags",
           displayText: "Tags"
        }, 
        {
           type: "sub-tasks",
           displayText: "Sub-Tasks"
        }
    ],
    searchtext: "",
    selectedType: "list-name",
    dateType: "Before",
    searchTags: []
};
 
/*
 let pageData = {
     projectName: {
         title: "My Monthly To-Do List",
         isEditing: false },
     pageBackground: "#fab8ff",
     tags: [
         {
             name : "urgent",
             color: "#ff7070"
         },
        {
            name: "school",
            color: "#fff08f"
        },
        {
            name : "fun",
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
     searchTypes : [ 
         {
            type: "list-name",
            displayText: "List Name"
         }, 
         {
            type: "task-name",
            displayText: "Task Name"
         }, 
         {
            type: "deadline",
            displayText: "Deadline"
         },
         {
            type: "description",
            displayText: "Description"
         }, 
         {
            type: "tags",
            displayText: "Tags"
         }, 
         {
            type: "sub-tasks",
            displayText: "Sub-Tasks"
         }
     ],
     searchtext: "",
     selectedType: "list-name",
     dateType: "Before",
     searchTags: []
 };

 let columns = [
     {
        listName: {
            title: "To Do",
            isEditing: false
        },
        editingOrder: false,
        showInSearch: true,
        cards: [
            {
                cardName: {
                    title: "Laundry",
                    isEditing: false
                },
                description : {
                    title: "Do all whites and darks",
                    isEditing: false 
                },
                color: "#b8ffbc",
                showInSearch: true,
                deadline: {
                    time: "2021-03-03T12:56:30",
                    isEditing: false 
                },
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
                        text: "Go to store to get detergent first.",
                        isEditing: false,
                        newComment: "Go to store to get detergent first.",
                        editingOrder: false
                    }, 
                    {
                        text: "Don't forget to use fabric softener.",
                        isEditing: false,
                        newComment: "Don't forget to use fabric softener.",
                        editingOrder: false
                    }
                ], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }
        ],
        newCard : {
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
        }
    }, 
    {
        listName: {
            title: "School Work",
            isEditing: false
        },
        editingOrder: false,
        showInSearch: true,
        cards: [
            {
                cardName: {
                    title: "Math HW",
                    isEditing: false
                },
                description : {
                    title: "Sections: 5, 6, 7, 8, and 9",
                    isEditing: false 
                },
                color: "#C4C2FB",
                showInSearch: true,
                deadline: {
                    time: "2021-03-20T10:20:30",
                    isEditing: false 
                },
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
                        text: "Check with friends to see if they have done first",
                        isEditing: false,
                        newComment: "Check with friends to see if they have done first",
                        editingOrder: false
                    }, 
                    {
                        text: "Call tutor if you can't figure it out",
                        isEditing: false,
                        newComment: "Call tutor if you can't figure it out",
                        editingOrder: false
                    }, 
                    {
                        text: "Make sure you check your work",
                        isEditing: false,
                        newComment: "Make sure you check your work",
                        editingOrder: false
                    }
                ], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }, 
            {
                cardName: {
                    title: "English Essay",
                    isEditing: false
                },
                description : {
                    title: "",
                    isEditing: false 
                },
                deadline: {
                    time: "2021-03-03T10:20:30",
                    isEditing: false 
                },
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
                        text: "Turn in before late submission timeline",
                        isEditing: false,
                        newComment: "Turn in before late submission timeline",
                        editingOrder: false
                    }
                ], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }, 
            {
                cardName: {
                    title: "Physics Problem Set",
                    isEditing: false
                },
                description : {
                    title: "Sets 7 and 8 to study for test",
                    isEditing: false 
                },
                deadline: {
                    time: "2021-03-09T10:20:30",
                    isEditing: false 
                },
                color: "#DDFBC2",
                showInSearch: true,
                tags: [
                    {
                        name: "school"
                    }
                ],
                comments: [
                    {
                        text: "Watch lecture videos",
                        isEditing: false,
                        newComment: "Watch lecture videos",
                        editingOrder: false
                    }, 
                    {
                        text: "Try to re-do past problem sets first",
                        isEditing: false,
                        newComment: "Try to re-do past problem sets first",
                        editingOrder: false
                    }
                ], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }
        ],
        newCard : {
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
        }
    }, 
    {
        listName: {
            title: "Fun",
            isEditing: false
        },
        editingOrder: false,
        showInSearch: true,
        cards: [
            {
                cardName: {
                    title: "Go for hike with mom",
                    isEditing: false
                },
                description : {
                    title: "",
                    isEditing: false 
                },
                deadline: {
                    time: "",
                    isEditing: false 
                },
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
                comments: [
                    {
                        text: "Watch lecture videos",
                        isEditing: false,
                        newComment: "Watch lecture videos",
                        editingOrder: false
                    }, 
                    {
                        text: "Try to re-do past problem sets first",
                        isEditing: false,
                        newComment: "Try to re-do past problem sets first",
                        editingOrder: false
                    }
                ], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }, 
            {
                cardName: {
                    title: "Watch Taylor Swift Documentary",
                    isEditing: false
                },
                description : {
                    title: "",
                    isEditing: false 
                },
                deadline: {
                    time: "",
                    isEditing: false 
                },
                color: "",
                showInSearch: true,
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
        ], 
        newCard : {
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
        }
    }, 
    {
        listName: {
            title: "Chores",
            isEditing: false
        },
        editingOrder: false,
        showInSearch: true,
        cards: [],
        newCard : {
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
        }
    }, 
    {
        listName: {
            title: "Work",
            isEditing: false
        },
        editingOrder: false,
        showInSearch: true,
        cards: [
            {
                cardName: {
                    title: "Email boss about meeting",
                    isEditing: false
                },
                description : {
                    title: "Ask him his thoughts on presentation",
                    isEditing: false 
                },
                deadline: {
                    time: "2021-03-15T10:20:30",
                    isEditing: false 
                },
                color: "#FFC57B",
                showInSearch: true,
                tags: [
                    {
                        name: "work"
                    }
                ],
                comments: [
                    {
                        text: "CC John in the email",
                        isEditing: false,
                        newComment: "CC John in the email",
                        editingOrder: false
                    }, 
                    {
                        text: "Send a draft to Katie",
                        isEditing: false,
                        newComment: "Send a draft to Katie",
                        editingOrder: false
                    }
                ], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }, 
            {
                cardName: {
                    title: "Finish report on BitCoin",
                    isEditing: false
                },
                description : {
                    title: "Bitcoin's earnings over past quarter",
                    isEditing: false 
                },
                deadline: {
                    time: "2021-03-10T10:20:30",
                    isEditing: false 
                },
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
                comments: [], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }
        ], 
        newCard : {
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
        }
    }, 
    {
        listName: {
            title: "Internships",
            isEditing: false
        },
        editingOrder: false,
        showInSearch: true,
        cards: [
            {
                cardName: {
                    title: "Apply to start up",
                    isEditing: false
                },
                description : {
                    title: "",
                    isEditing: false 
                },
                deadline: {
                    time: "2021-04-10T10:20:30",
                    isEditing: false 
                },
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
                        text: "Finish cover letter",
                        isEditing: false,
                        newComment: "Finish cover letter",
                        editingOrder: false
                    }, 
                    {
                        text: "Edit resume",
                        isEditing: false,
                        newComment: "Edit resume",
                        editingOrder: false
                    }
                ], 
                newComment: "",
                duplicateCardName: "", 
                newTag: {
                    name: "", 
                    color: ""
                },
                editingOrder: false
            }
        ], 
        newCard : {
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
        }
    },
    {
        listName: {
            title: "Fellowship Program",
            isEditing: false
        },
        editingOrder: false,
        showInSearch: true,
        cards: [], 
        newCard : {
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
        }
    }
];
*/