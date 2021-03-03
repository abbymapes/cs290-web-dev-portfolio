# Trello

## Name: 
Abby Mapes - acm103

### Timeline

Start Date: Feburary 28, 2021

Finish Date: Part 1: March 3

Hours Spent: ~10 hours


### Collaboration

People consulted:
- N/A

Resources used:
- Vue.js documentation (https://vuejs.org/v2/guide/)
- Javascript Date documentation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
- Copy object in JS (https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/)

Asset attributions:
- N/A

### Assignment Notes

Known Bugs:
- N/A

Extra credit:
- Implemented reactivity already 

### Javascript Data Format

My Javascript data structure is as follows. The data for my overall page is in the variable pageData with the following structure. pageData has a project name, with a title and boolean value to determine whether or not its being edited, a page background color, which is a string identifying the page background color (or an empty string if no such background is selected), a list of the tags for the page (which the user creates within different cards and can be reused anywhere in the site), and a search text string that identifies the current search query text. Below is an example of the pageData strucutre: \\

pageData = {\
     projectName: {\
         title: "My Monthly To-Do List",\
         isEditing: false },\
     pageBackground: "#fab8ff",\
     tags: [\
         {\
             name : "urgent",\
             color: "#ff7070"\
         }\
     ],\
     searchtext: ""\
 }\

\\

In order to fill my data page, I used the following structure. Note, columns is a list of "column" objects (which each represent a list). Each list has a non-empty name variable and a list of card objects. Each card object has name, description, deadline, tags, comments, and newComment properties. If there are no tags or comments, these will be set to empty lists for the card. The newComment property stores newly inputted comments to be added to the comment list, once the user enters one for that card. If any of these properties are empty, they will be initialized as shown below (besides tags and comments, which will be an empty list): \\

let columns = [\
     {\
        listName: {\
            title: "",\
            isEditing: false\
        },\
        cards: [\
            {\
                cardName: {\
                    title: "",\
                    isEditing: false\
                },\
                description : {\
                    title: "",\
                    isEditing: false \
                },\
                color: "",\
                deadline: {\
                    time: "",\
                    isEditing: false \
                },\
                tags: [\
                    {\
                        name: "tag"\
                    }\
                ],\
                comments: [ \
                    {\
                        text: "",\
                        isEditing: false\
                    }\
                ], \
                newComment: ""\
            }\
        ]\
    }\

### Impressions

I like this project. At first I was super overwhelmed, but moving slowly through examples was a great way to make a big problem seem more achievable. 