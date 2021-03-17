/*
 * This represents the display for the editble Trello project name
 *
 * @author Abby Mapes
 */

Vue.component('project-name', {
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            projectName: this.text,
            isEditing: false
        };
    },
    methods: {
        /*
         * Emits 'done-editing' when project name is double clicked or submitted
         */
        editProjectName(projectName) {
            this.isEditing = false;
            this.$emit('done-editing', projectName);
        }
    },
    template:
        `
    <span>
        <br>
        <br>
        <br>
        <h1 
            class="project-name"
            v-if="!isEditing"
            @dblclick="isEditing = true"
        >
            {{text}}
        </h1>
        <h1
            v-if="isEditing"
        >
            <input
                v-model="projectName"
                id="nameInput"
                class="project-name fit-width border"
                @keyup.enter="editProjectName($event.target.value)" 
            >
        </h1>
    </span>
    `
});

