<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" lg="7">
                <div class="feed-list-wrapper">
                    <h2 class="font-weight-bold text-h6 list-header">
                        {{ jobs.description._cdata }}
                    </h2>
                    <template v-if="jobsList.length">
                        <job-item
                            v-for="job in jobsList.slice(0, 50)"
                            :key="job.link"
                            :job="job"
                        ></job-item>
                    </template>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import JobItem from './JobItem.vue';
import { initJobs, getNewJobs } from '../services/mutate-data';
import {
    askPermission,
    getNotificationPermissionState,
    pushNotification,
} from '../services/notifications';

export default {
    name: 'JobsList',
    components: {
        JobItem,
    },
    props: {
        jobs: Object,
        isNewList: Boolean,
    },
    data: () => ({
        jobsList: [],
    }),
    created: function() {
        this.jobsList = initJobs(this.jobs.item);
        askPermission();
    },
    watch: {
        jobs: async function(newAllJobs) {
            const initNewJobs = initJobs(newAllJobs.item);
            const newJobs = this.isNewList ? initNewJobs : getNewJobs(initNewJobs, this.jobsList);

            if (newJobs.length) {
                this.removeOldJobs(newJobs.length);
                this.addNewJobs(newJobs);

                const permissionState = await getNotificationPermissionState();
                permissionState === 'granted' ? pushNotification(newJobs.length) : null;
            }

            this.$emit('AddedNewList');
        },
    },
    methods: {
        addNewJobs(newJobs) {
            this.jobsList.unshift(...newJobs);
        },
        removeOldJobs(length) {
            /**
             * this fixing the issue when the job deleted suddenly from the RSS feed then show again,
             * which will lead to bringing up back deleted job out of order.
             */
            if (this.jobsList.length >= 100) {
                this.isNewList
                    ? (this.jobsList = [])
                    : (this.jobsList = this.jobsList.slice(0, -length));
            }
        },
    },
};
</script>

<style>
.feed-list-wrapper {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-top: 155px;
}

.list-header {
    padding: 25px 30px;
}

@media (max-width: 600px) {
    .list-header {
        padding: 25px 15px;
    }
}
</style>
