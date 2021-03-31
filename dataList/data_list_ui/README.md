# Data List

# data_list_ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Name: 
Abby Mapes - acm103

### Timeline

Start Date: March 25, 2021

Finish Date: March 30, 2021

Hours Spent: ~20 hours


### Collaboration

People consulted:
- N/A

Resources used:
- Duke's API Catalog (https://api-catalog.oit.duke.edu/apis/1)
- Parse through string to get digits (https://stackoverflow.com/questions/10003683/how-can-i-extract-a-number-from-a-string-in-javascript)
- Bootstrap Vue (https://bootstrap-vue.org/)

Asset attributions:
- N/A

### Assignment Notes

For this assignment, I didn't preload all classes because of the structure of Duke's API Catalog. To fetch classes, you must make a request for a subject code. When looping through all subject codes to do this, it took minutes to load all class information. So, I decided to have the user select the subjects they would like to see to minimize this wait time. Additionally, to get information about each class, like description, course attributes, and type, you have to make another call to a different endpoint of the API, specifying the courseId. At first, when implementing filtering, I tried to fetch information like course attributes and type for each class being displayed (for the selected subjects). However, to fetch this information for each class, even for a single subject, took a minute or so. So, I decided to filter and sort based on information returned from the initial fetch based on subjects. This includes course title and catalog number.

Known Bugs:
- N/A

Extra credit:

### Impressions
I enjoyed this assignment. It was a good way to get situated with Vue CLI. At first, I was super overwhelmed but I understand it better now.