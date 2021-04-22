The UserSection component represents the display for a collection of Users,
 based on the userList prop.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="loading" no-center class="overlay">
      <h1>Users</h1>
        <waterfall
            :options="options"
        >
            <waterfall-item
                v-for="(item, i) in userList"
                class="waterfall-item"
                :order="i"
                :key="i"
            >
                <user
                    class="user"
                    :user="item"
                    @selected="goToUserPage"
                >
                </user>
            </waterfall-item>
        </waterfall>
    </b-overlay>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall';
import User from './User.vue';

export default {
    name: 'UserSection',
    components: {
        User,
        Waterfall,
        WaterfallItem,
    },
    props: {
        userList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            loading: false,
            options: {},
        };
    },
    methods: {
        goToUserPage(userId) {
            this.$emit('user-page', userId);
        },
    },
};
</script>
<style scoped>
.attribute-name {
  font-size: 25pt;
}
</style>
