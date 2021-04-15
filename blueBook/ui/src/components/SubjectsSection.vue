The SubjectSection component represents the display for a collection of Subject components,
 based on the subjectList prop.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="subjectsLoading" no-center class="overlay">
      <h1>Subjects</h1>
      <b-card-group columns>
        <b-card
          v-for="(item, i) in subjectNames"
          :key="i"
          @click="goToSubjectPage(item.code, item.name)"
          :title="getType(item.type)"
        >
          <b-card-text class="subjectName">
            {{ item.name }}
          </b-card-text>
        </b-card>
      </b-card-group>
    </b-overlay>
  </div>
</template>

<script>

import userState from '../userState';

export default {
    name: 'SubjectsSection',
    components: {},
    props: {
        subjectList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            subjectsLoading: false,
            subjectNames: [],
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

        getType(type) {
            if (!type || !['major', 'minor', 'certificate', 'other'].includes(type)) {
                return '';
            }
            if (type === 'other') {
                return 'Interested In';
            }
            return type.charAt(0).toUpperCase() + type.slice(1);
        },
    },
    async mounted() {
        this.subjectsLoading = true;
        await this.getSubjectNames();
        this.subjectsLoading = false;
    },
};
</script>
<style scoped>
.subjectName {
  font-size: 25pt;
}
</style>
