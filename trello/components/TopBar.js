/*
 * This represents the display for the top bar, above our of Trello project
 *
 * Note, the top bar includes: background color picker, filtering, and creating a new empty list
 *
 * @author Abby Mapes
 */

Vue.component('top-bar', {
    props: {
        pageData: {
            type: Object,
            required: true
        },

        selectedType: {
            type: String,
            required: true
        },

        lists: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            pageBackground: this.pageData.pageBackground
        };
    },
    watch: {
        pageBackground() {
            this.$emit("change-background-color", this.pageBackground);
        }
    },
    template:
        `
    <div class="top-bar">
        <select-color
            input-id="background-color"
            label-text="Background Color"
            v-model="pageBackground"
        >
        </select-color>

        <trello-search
            :selected-type="selectedType"
            :page-data="pageData"
            :lists="lists"
        >
        </trello-search>
        <br>
        <new-item 
            item-type="new-list"
        ></new-item>
    </div> 
    `
});

