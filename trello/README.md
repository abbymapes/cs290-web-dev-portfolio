# Trello

## Name: 
Abby Mapes - acm103

### Timeline

Start Date: Feburary 28, 2021

Finish Date: March 17, 2021

Hours Spent: Part 1 & 2: ~15 hours, Part 3: ~15 hours


### Collaboration

People consulted:
- N/A

Resources used:
- Vue.js documentation (https://vuejs.org/v2/guide/)
- Javascript Date documentation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
- Copy object in JS (https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/)
- Comparing Date objects JS (https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript)

Asset attributions:
- N/A

### Assignment Notes

Known Bugs:
- N/A

Extra credit:
- Comprehensive filtering process with all parts of data on each card that incorporates both Search component and custom searching for tags and dates

### Javascript Data Format

In order to create the layout of the overall Trello page, I've used the following Javascript data structure to store data for the page layout. For any new project, pageData will contain a project name, initialized with a string telling users how to edit it. pageData will have a pageBackground property that holds the hex string specifying the background color for the page, which is initialized to white for a blank project. pageData has a tags property that is initialized to an empty list, but is filled as shown below once users add tags. Each tag must have a unique name and a color for a user to add it to a card. When they do, it will be added to the tags list as shown below (with the "urgent" tag). pageData also includes current search information. For each project, selectedType will be initialized to "list-name" and dateType will be initialized to "Before". As a result, the filter dropdown menu will be initlaized to filter by list name, but selectedType will change when the user chooses a different filter. Likewise, when filtering based on deadline, the filter will be initialized to filter tasks by dateType, which is initially set to "before" the inputted date. However, the user can change this when filtering by deadline and dateType will change according to their selection. Finally, searchTags will fill with all tags selected by the user when filtering by tags. Below is the structure of pageData:

pageData = {\
&nbsp;&nbsp;&nbsp;&nbsp;projectName: "Double Click To Enter A Project Name",\
&nbsp;&nbsp;&nbsp;&nbsp;pageBackground: "#FFFFFF",\
&nbsp;&nbsp;&nbsp;&nbsp;tags: [
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: "urgent", \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color: "#ff7070\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}\
&nbsp;&nbsp;&nbsp;&nbsp;],\
&nbsp;&nbsp;&nbsp;&nbsp;selectedType: "list-name",\
&nbsp;&nbsp;&nbsp;&nbsp;recentDateSearch: "",\
&nbsp;&nbsp;&nbsp;&nbsp;recentDateSearchType: "Before",\
&nbsp;&nbsp;&nbsp;&nbsp;recentTagSearch: []\
}

Initally, the data structure holding all project information (such as lists, tasks, comments, etc.) will be empty, as the user has no lists. However, once creating new lists, cards and sub-tasks, the data structure will populate as shown below. Each list will have a listName property which holds the name of the list. Additionally, each list will have a boolean property showInSearch, which indicates if the list should be displayed based on the current search/filtering. Each list also has a cards property, which is a list of card objects. Each card object will have the following properties:


-  cardName property  (String)
-  description property (String)
- deadline property (String)
- color property (String) which is the hex string of the card color 
- showInSearch property (Boolean) which indicates whether the card should be displayed based on current search/filtering
- tags property (Array) which is a list of tag objects that contain a name property, specifying the name of the tag associated with the card
- comments property (Array) which is a list of comment objects that contain a text property holding the text of the comment


let columns = [\
&nbsp;&nbsp;&nbsp;&nbsp;{\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;listName: "",\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;showInSearch: true,\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cards: [\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cardName:  "",\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;description : "",\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color: "",\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;showInSearch: true,\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;deadline: "",\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tags: [\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: "tag"\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;comments: [ \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text: ""
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
}

### Impressions

This was a (very) rewarding project to finish. After parts 1 and 2, I felt like I had a good sense of Vue and its reactivity. I also felt more confident in making data structures. After doing part 3, I really understand components in a way I didn't before (even from the readings and lecture). I think it was helpful to reimagine something we already knew and designed and translate it into a Vue component project. I'm very happy with the way my project turned out.