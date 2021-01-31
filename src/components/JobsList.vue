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
                            v-for="(job, index) in jobsList"
                            :key="index"
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
import { NotificationPermission } from '../services/notifications';

export default {
    name: 'JobsList',
    components: {
        JobItem,
    },
    props: {
        jobs: Object,
    },
    data: () => ({
        jobsList: [],
    }),
    created: function() {
        this.jobsList = initJobs(this.jobs.item);
        console.log(1);
        this.showNotification();
    },
    watch: {
        jobs: function(newAllJobs, oldJobs) {
            const newJobs = getNewJobs(newAllJobs.item, oldJobs.item);

            if (newJobs.length) {
                const initNewJobs = initJobs(newJobs);
                this.addNewJobs(initNewJobs);
                this.removeOldJobs(initNewJobs.length);

                console.log(NotificationPermission());
            }
        },
    },
    methods: {
        addNewJobs(newJobs) {
            this.jobsList.unshift(...newJobs);
        },
        removeOldJobs(length) {
            this.jobsList = this.jobsList.slice(0, -length);
        },
        showNotification() {
            Notification.requestPermission(function(result) {
                console.log(result);
                if (result === 'granted') {
                    navigator.serviceWorker.ready.then(function(registration) {
                        registration.showNotification('Vibration Sample', {
                            body: 'Buzz! Buzz!',
                            icon: '../images/touch/chrome-touch-icon-192x192.png',
                            vibrate: [200, 100, 200, 100, 200, 100, 200],
                            tag: 'vibration-sample',
                        });
                    });
                }
            });
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
