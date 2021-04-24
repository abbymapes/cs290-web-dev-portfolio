The SubjectSection component represents the display for a collection of Subject components,
 based on the subjectList prop.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="subjectsLoading" no-center class="overlay">
      <h1 id='section-title'>Subjects</h1>
        <waterfall
            :options="options"
        >
            <waterfall-item
                v-for="(item, i) in subjectNames"
                class="waterfall-item"
                :order="i"
                :key="i"
            >
                <b-card
                    :title="getType(item.type, item.code)"
                    @click="goToSubjectPage(item.code, item.name)"
                >
                    <b-card-text class="subject-name">
                        {{ item.name }}
                    </b-card-text>
                </b-card>
            </waterfall-item>
        </waterfall>
    </b-overlay>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall';
import userState from '../userState';

export default {
    name: 'SubjectsSection',
    components: {
        Waterfall,
        WaterfallItem,
    },
    props: {
        subjectList: {
            type: Array,
            default: () => [],
        },
        hasSubjectNames: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    data() {
        return {
            subjectsLoading: false,
            subjectNames: [],
            options: {},
        };
    },
    methods: {
        goToSubjectPage(code, name) {
            this.$emit('subject-page', code, name);
        },

        async getSubjectNames() {
            const response = await fetch(
                `${userState.SERVER_URL}/bluebook/getSubjectNames`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.subjectList),
                },
            );
            const result = await response.json();
            if (response.ok) {
                this.subjectNames = result;
            } else {
                this.$emit('show-error', result.message);
            }
        },

        getType(type, code) {
            if (!type || !['major', 'minor', 'certificate', 'other'].includes(type)) {
                return code;
            }
            if (type === 'other') {
                return 'Interested In';
            }
            return type.charAt(0).toUpperCase() + type.slice(1);
        },
    },
    watch: {
        async subjectList() {
            this.subjectsLoading = true;
            if (this.hasSubjectNames) {
                this.subjectNames = this.subjectList;
            } else {
                await this.getSubjectNames();
            }
            this.subjectsLoading = false;
        },
    },
    async mounted() {
        this.subjectsLoading = true;
        if (this.hasSubjectNames) {
            this.subjectNames = this.subjectList;
        } else {
            await this.getSubjectNames();
        }
        this.subjectsLoading = false;
    },
};
</script>
<style scoped>
.subject-name {
  font-size: 25pt;
}
</style>
