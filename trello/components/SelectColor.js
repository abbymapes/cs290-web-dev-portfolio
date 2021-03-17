/*
 * This represents the display for a color input, i.e. when a user selects a color.
 *
 * @author Abby Mapes
 */

Vue.component('select-color', {
    props: {
        inputId: {
            type: String,
            required: true
        },
        labelText: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    methods: {
        /*
         * Emits a 'change-color' event with the specified color when the user changes
         * the selected color
         */
        changedColor(newColor) {
            this.$emit('change-color', newColor);
        }
    },
    template: `
        <div>
            <label :for="inputId">{{labelText}}: </label>
            <input 
                type="color" 
                :id="inputId"
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"
            >
        </div>
    `
});
