The NavBar component represents a navigation bar that is used in various parts of the app and
displays given titles.

@author Abby Mapes

<template>
  <div class="nav-bar">
    <a
      v-for="(section, i) in sections"
      :key="i"
      :class="isCurrentPage(section.value) + ' ' + isCenterClass"
      @click="changedPage = true; selectedPage = section.value"
    >
        {{section.name}}
    </a>
  </div>
</template>

<script>

export default {
    name: 'NavBar',
    props: {
        sections: {
            type: Array,
            default: () => [],
        },
        currentPage: String,
        isCentered: Boolean,
    },
    data() {
        return {
            selectedPage: this.currentPage,
            changedPage: true,
        };
    },
    methods: {
        isCurrentPage(name) {
            return name === this.currentPage ? 'home' : '';
        },
    },
    computed: {
        isCenterClass() {
            return this.isCentered ? 'centered' : '';
        },
    },
    watch: {
        selectedPage() {
            if (this.changedPage) {
                this.$emit('change-page', this.selectedPage);
                this.changedPage = false;
            }
        },
        currentPage() {
            this.selectedPage = this.currentPage;
        },
    },
};
</script>

<style scoped>
.nav-bar {
  margin: 10px;
  width: 100%;
}

.nav-bar a.centered {
    font-size: 14pt;
    padding: 20px;
    float: none;
    display: inline-block;
}

.nav-bar a.home a.centered {
  font-size: 14pt;
  float: none;
  display: inline-block;
}

@media screen and (min-width: 900px) {
    .nav-bar {
        margin: 20px;
    }
    .nav-bar a.centered {
        font-size: 18pt;
        padding: 30px;
    }
    .nav-bar a.home a.centered {
        font-size: 18pt;
    }
}

@media screen and (min-width: 1000px) {
    .log-in {
        padding: 30px;
    }
}
</style>
