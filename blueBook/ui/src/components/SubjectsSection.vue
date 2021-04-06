The SubjectSection component represents the display for a collection of Subject components,
 based on the subjectList prop.

@author Abby Mapes
<template>
    <div>
        <b-overlay :show="subjectsLoading" no-center class="overlay">
            <h1>Subjects</h1>
            <b-card-group columns>
                <b-card
                    v-for="(item, i) in displaySubjects"
                    :key="i"
                    @click="goToSubjectPage(item.code)"
                    class=""
                    :title="getType(item.type)"
                >
                    <b-card-text class="subjectName">
                        {{item.name}}
                    </b-card-text>
                </b-card>
            </b-card-group>
        </b-overlay>
    </div>
</template>

<script>
/* eslint-disable */
import { subjects } from "../../database/subjects";

export default {
  name: "SubjectsSection",
  components: {
  },
  props: {
    subjectList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
        subjectsLoading: false,
        displaySubjects: []
    }
  },
  methods: {
      goToSubjectPage(subject) {
          console.log(subject);
      },

      getDisplaySubjects() {
          // TODO: fetch subject names from Database for each subject code instead of parsing
          let fullSubjectList = []
          this.subjectList.forEach(item => {
              let newItem = item;
              subjects.forEach(subjectString => {
                  let code = subjectString.split(' - ')[0];
                  let name = subjectString.split(' - ')[1];
                  if (item.code == code) {
                      newItem.name = name;
                      fullSubjectList.push(newItem);
                  }
              });
          });
          return fullSubjectList;
      },

      getType (type) {
          return (!type ? "" : 
                (type == 'major' ? "Major" :
                (type == "minor" ? "Minor": 
                (type == "certificate" ? "Certificate": 
                (type == "other" ? "Interested In": "")))))
      }

  },
  computed: {

  }, 
  watch : {

  },
  async mounted () {
    this.subjectsLoading = true;
    this.displaySubjects = this.getDisplaySubjects();
    this.subjectsLoading = false;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .subjectName {
        font-size: 25pt;
    }
</style>
