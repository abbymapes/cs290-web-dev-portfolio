/*
 * This represents the display for the count for a list or card
 * depending on countType
 *
 * @author Abby Mapes
 */

Vue.component('count', {
    props: {
        count: {
            type: Number,
            required: true
        },
        countType: {
            type: String,
            required: true
        }
    },
    computed: {
        /*
         * If count is 1, then singularizes countType. Otherwise, pluralizes countType
         */
        pluralize() {
            return (this.count == 1 ? this.countType : this.countType + "s");
        }
    },
    template: `
        <span>
            <span class="card-subtitle mb-2 task-count">{{count}} {{pluralize}}</span>
            <br>
        </span>
    `
});
