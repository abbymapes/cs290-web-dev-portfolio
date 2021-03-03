/*
 * JavaScript for Trello example data
 *
 * @author Abby Mapes
 */

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
     searchtext: ""
 }
 let columns = [
     {
        listName: {
            title: "To Do",
            isEditing: false
        },
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
                deadline: {
                    time: "2021-03-03T12:56:30",
                    isEditing: false 
                },
                tags: [
                    {
                        name: "chores",
                        name: "next week"
                    }
                ],
                comments: [ 
                    {
                        text: "Go to store to get detergent first.",
                        isEditing: false
                    }, 
                    {
                        text: "Don't forget to use fabric softener.",
                        isEditing: false
                    }
                ], 
                newComment: ""
            }
        ]
    }, 
    {
        listName: {
            title: "School Work",
            isEditing: false
        },
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
                        isEditing: false
                    }, 
                    {
                        text: "Call tutor if you can't figure it out",
                        isEditing: false
                    }, 
                    {
                        text: "Make sure you check your work",
                        isEditing: false
                    }
                ], 
                newComment: ""
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
                        isEditing: false
                    }
                ], 
                newComment: ""
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
                tags: [
                    {
                        name: "school"
                    }
                ],
                comments: [
                    {
                        text: "Watch lecture videos",
                        isEditing: false
                    }, 
                    {
                        text: "Try to re-do past problem sets first",
                        isEditing: false
                    }
                ], 
                newComment: ""
            }
        ]
    }, 
    {
        listName: {
            title: "Fun",
            isEditing: false
        },
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
                        isEditing: false
                    }, 
                    {
                        text: "Try to re-do past problem sets first",
                        isEditing: false
                    }
                ], 
                newComment: ""
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
                tags: [],
                comments: [], 
                newComment: ""
            }
        ]
    }, 
    {
        listName: {
            title: "Chores",
            isEditing: false
        },
        cards: []
    }, 
    {
        listName: {
            title: "Work",
            isEditing: false
        },
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
                tags: [
                    {
                        name: "work"
                    }
                ],
                comments: [
                    {
                        text: "CC John in the email",
                        isEditing: false
                    }, 
                    {
                        text: "Send a draft to Katie",
                        isEditing: false
                    }
                ], 
                newComment: ""
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
                newComment: ""
            }
        ]
    }, 
    {
        listName: {
            title: "Internships",
            isEditing: false
        },
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
                        isEditing: false
                    }, 
                    {
                        text: "Edit resume",
                        isEditing: false
                    }
                ], 
                newComment: ""
            }
        ]
    },
    {
        listName: {
            title: "Fellowship Program",
            isEditing: false
        },
        cards: []
    }
];