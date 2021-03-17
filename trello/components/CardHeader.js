/*
 * This represents the display the header of a Trello card, which includes a 
 * delete button and the deadline for the task.
 *
 * @author Abby Mapes
 */

Vue.component('card-header', {
    props: {
        deadline: {
            type: String,
            required: true
        },

        listIndex: {
            type: Number,
            required: true
        },

        cardIndex: {
            type: Number,
            required: true
        },

        cardColor: {
            type: String,
            required: true
        }
    },
    methods: {
        /*
         * Emits 'done-editing-deadline' when new project deadline is enetered that 
         * passes the date, and list and card index for the curreent card
         */
        addNewDeadline(date) {
            this.isEditing = false;
            // Emits event from components: card -> draggable -> list -> project
            this.$parent.$parent.$parent.$emit('done-editing-deadline', date, this.listIndex, this.cardIndex);
        },

        /*
         * Emits 'delete-card' when a card is deleted that passes the list index
         * and card index of specified card
         */
        deleteCard() {
            // Emits event from components: card -> draggable -> list -> project
            this.$parent.$parent.$parent.$emit('delete-card', this.listIndex, this.cardIndex);
        },

        /*
         * Determines whether the current date is later than dateString 
         */
        deadlinePassed(dateString) {
            let currentDate = new Date();
            let deadlineDate = new Date(dateString);
            return currentDate > deadlineDate;
        },

        /*
         * Returns a String of date to display for card
         */
        displayDate(dateString) {
            let deadlineDate = new Date(dateString);
            return deadlineDate.toLocaleDateString();
        },

        /*
         * Returns a String of date to display for card
         */
        displayTime(dateString) {
            let deadlineDate = new Date(dateString);
            return deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    },
    data() {
        return {
            selectedTime: this.deadline,
            isEditing: false
        };
    },
    template:
        `
        <span>
            <div 
                class="card-header overdue date" 
                v-if="deadline && deadlinePassed(deadline) && !isEditing"
                @dblclick="isEditing = true"
            >
                <div class="text-left">
                    <button type="button" class="btn btn-outline-danger list-delete" @click="deleteCard">X</button>
                </div>
                    {{displayDate(deadline)}}
                    {{displayTime(deadline)}}
            </div>
                                        
            <div 
                class="card-header date" 
                :style="'background-color:' + cardColor + '80'"
                v-else-if="deadline && !isEditing"
                @dblclick="isEditing = true"
            >
                <div class="text-left">
                    <button type="button" class="btn btn-outline-danger list-delete" @click="deleteCard">X</button>
                </div>

                {{displayDate(deadline)}}
                {{displayTime(deadline)}}
            </div>

            <div 
                class="card-header" 
                v-else-if="!isEditing"
            >
                <div class="text-left">
                    <button type="button" class="btn btn-outline-danger list-delete" @click="deleteCard">X</button>
                </div>

                <div class="text-right">
                    <button type="button" class="btn btn-outline-dark" @click="isEditing = true">Add Deadline</button>
                </div>
            </div>

            <div 
                class="card-header date"
                v-else-if="isEditing"
            >
                <div class="text-left">
                    <button type="button" class="btn btn-outline-danger list-delete" @click="deleteCard">X</button>
                </div>
                    <input 
                        class="fit-width"
                        :id="'deadline-list-' + listIndex + '-card-' + cardIndex" 
                        type="datetime-local" 
                        :name="'deadline-list-' + listIndex + '-card-' + cardIndex" 
                        v-model="selectedTime"
                    >
                <button type="button" class="btn btn-success btn-small" @click="addNewDeadline(selectedTime)">Set Deadline</button>
            </div>
            <br>
        </span>
    `
});