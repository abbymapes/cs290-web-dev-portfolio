/*
 * This represents the display for the filtering part of Trello, which includes
 * the Vue Fuse Search component and custom search displays to search by selecting 
 * a tag, or by a inputting a date via a date input
 *
 * @author Abby Mapes
 */

Vue.component('trello-search', {
    props: {
        // String representing the seleected filter type
        selectedType: {
            type: String,
            required: true
        },

        pageData: {
            type: Object,
            required: true
        },

        lists: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            filterType: this.selectedType,
            dateType: this.pageData.recentDateSearchType,
            dateToSearch: this.pageData.recentDateSearch,
            tagsToSearch: this.pageData.recentTagSearch,
            searchTerms: "",
            clearedFilter: false,
            searchTypes: [
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
            ]
        };
    },
    methods: {
        /*
         * Returns the name to display for the selected filter type 
         */
        getSearchName(selectedType) {
            let name = "";
            this.searchTypes.forEach(category => {
                if (category.type == selectedType) {
                    name = category.displayText;
                }
            });
            return name;
        },

        /*
         * Emits a search-date event that passes the selected date, type of date filter 
         * (i.e. before, after, or on) and the name to display for the filtered results
         */
        searchDate() {
            this.$parent.$emit('search-date', this.dateToSearch, this.dateType, this.getSearchName(this.filterType));
        },

        /*
         * Emits a clear-filter event and resets all filter information
         */
        clearFilter() {
            this.$parent.$emit('clear-filter');
            this.dateType = this.pageData.recentDateSearchType;
            this.dateToSearch = this.pageData.recentDateSearch;
            this.clearedFilter = true;
            this.tagsToSearch = this.pageData.recentTagSearch;
        },

        /*
         * Emits a search-tags event that passes the selected tags to filter for, 
         * and the name to display for the filtered results
         */
        searchTags() {
            this.$parent.$emit('search-tags', this.tagsToSearch, this.getSearchName(this.filterType));
        },

        /*
         * Emits a search-text event that passes the results returned from the Search
         * Vue Fuse component and the name to display for the filtered results
         */
        searchText(results) {
            this.$parent.$emit('search-text', results, this.getSearchName(this.filterType));
        }
    },
    computed: {
        /*
         * Computes the keys to search for in the Vue Fuse component based on the 
         * type of search the user is doing
         */
        searchOptions() {
            let options = {
                keys: [],
                includeMatches: true,
                threshold: 0.3
            };
            options.keys = (this.selectedType == "list-name" ? ["listName"]
                : (this.selectedType == "task-name" ? ["cards.cardName"]
                    : (this.selectedType == "deadline" ? ["cards.deadline"]
                        : (this.selectedType == "description" ? ["cards.description"]
                            : (this.selectedType == "sub-tasks" ? ["cards.comments.text"]
                                : ["cards.tags.name"])))));
            return options;
        }
    },
    watch: {
        /*
         * Emits a change-filter-type event that passes the selected filter type
         * as a parameter, which allows us to update the current pageData state
         */
        filterType() {
            this.$parent.$emit('change-filter-type', this.filterType);
        },

        /*
         * When the selected tags to search change, if it isn't due to the clear
         * filter button (setting it to the empty list), then it either searches
         * for the newly selected tags, or it clears the filter (if no tags are selected,
         * then we want the filter to be "empty")
         */
        tagsToSearch() {
            // clearedFilter guards against an infinite loop, since when clearing the 
            // filteer we change tagsToSearch to an empty list
            if (!this.clearedFilter) {
                if (this.tagsToSearch.length > 0) {
                    this.searchTags();
                } else {
                    this.clearFilter();
                }
            } else {
                this.clearedFilter = false;
            }
        },

        /*
         * When we select a different filter type, we want to clear the filter so that 
         * the selected tags and time are initialized to empty values 
         */
        selectedType() {
            this.clearFilter();
        }
    },
    template:
        `
    <span class="search">
        <label for="searchField">Filter By:</label>
        <b-dropdown 
            size="sm" 
            boundary="window" 
            :text="getSearchName(filterType)"
            variant="outline-dark"
        >
            <ul class="dropdown" role="menuitem">
                <li
                    v-for="category in searchTypes"
                >
                    <input 
                        type="radio" 
                        :id="'search-' + category.type" 
                        name="search" 
                        :value="category.type"
                        v-model="filterType"
                    >
                    <label :for="'search-' + category.type" >{{category.displayText}}</label>
                </li>
            </ul>
        </b-dropdown>
    
        <span v-if="selectedType == 'deadline'">
            <b-dropdown 
                :text="dateType" 
                size="sm" 
                boundary="window" 
                variant="outline-dark"
            >
                <div class="dropdown" role="menuitem">
                    <input type="radio" id="time-before" name="time-search" value="Before" v-model="dateType">
                    <label for="time-before">Before</label>
                    <br>
                    <input type="radio" id="time-on" name="time-search" value="On" v-model="dateType">
                    <label for="time-on">On</label>
                    <br>
                    <input type="radio" id="time-after" name="time-search" value="After" v-model="dateType">
                    <label for="time-after">After</label>
                </div>    
            </b-dropdown>

            <input 
                id="searchField"
                type="date" 
                name="searchDate" 
                v-model="dateToSearch"
            >
            <button type="button" class="btn btn-primary btn-small search-button" @click="searchDate">Search Date</button>
            <button type="button" class="btn btn-outline-danger btn-small list-delete" @click="clearFilter">Clear Filter</button>
        </span>

        <span v-else-if="selectedType == 'tags'">
            <ul>
                <li
                    class="tags"
                    v-for="(tag, l) in pageData.tags"
                    :key="l"
                >
                    <input 
                        type="checkbox" 
                        :id="'search-tag-' + tag.name" 
                        name="search-tag" 
                        :value="tag.name" 
                        v-model="tagsToSearch"
                    >
                    <label :for="'search-tag-' + tag.name"  class="tags" :style="'background-color:' + tag.color"><b>{{tag.name}}</b></label>
                    <br>
                </li>
            </ul>
            <div class = "text-right">
                <button type="button" class="btn btn-primary btn-small search-button" @click="searchTags">Search Tags</button>
                <button type="button" class="btn btn-outline-danger btn-small list-delete" @click="clearFilter">Clear Filter</button>
            </div>
        </span>
        
        <vue-fuse
            v-else
            placeholder="Search ..."
            :list="lists"
            :search="searchTerms"
            :fuse-opts="searchOptions"
            @fuse-results="searchText"
        />
    </span>
    `
});

