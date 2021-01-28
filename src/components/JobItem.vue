<template>
    <div class="job--item">
        <a :href="link" target="_blank">
            <h4
                class="text-body-2 text--black font-weight-bold mb-3 job-title"
                v-html="job.title._cdata.slice(0, -8)"
            ></h4>
            <span class="d-block job-info mb-2">
                <span v-if="jobType.hasType">
                    <span class="font-weight-bold">{{ jobType.type }}</span>
                    <span>: {{ jobType.value }} - </span>
                </span>
                <span>
                    <span class="font-weight-bold">Posetd</span>
                    <span>: {{ postedDate.relative }}</span>
                </span>
                <span>
                    <span class="font-weight-bold">
                        - {{ this.category }}
                        <template v-if="this.country !== null">-</template>
                    </span>
                </span>
                <span v-if="this.country !== null">
                    <v-icon small class="d-inline">{{ icons.location }}</v-icon>
                    <span class="font-weight-bold"> {{ this.country }} </span>
                </span>
            </span>
            <span class="job-description d-block mb-2">
                <span
                    v-html="description.showMore ? description.original : description.truncate"
                ></span>
                <a
                    href="javascript:void(0)"
                    @click="toggleDescription"
                    class="toggel-text"
                    v-if="description.needTruncated"
                >
                    {{ !description.showMore ? 'more' : 'less' }}
                </a>
            </span>
            <span class="d-block job-info" v-if="skills.hasSkills">
                <span class="font-weight-bold"> Skills: </span>
                <span v-for="(skill, index) in skills.value" :key="index">
                    {{ skill }}
                    <template v-if="index != skills.value.length - 1">-</template>
                </span>
            </span>
        </a>
    </div>
</template>

<script>
import { format } from 'timeago.js';
import { mdiMapMarker } from '@mdi/js';

export default {
    name: 'JobItem',
    props: {
        job: Object,
    },
    data: () => ({
        icons: {
            location: mdiMapMarker,
        },
        jobData: null,
        description: {
            original: '',
            truncate: '',
            needTruncated: false,
            showMore: false,
        },
        jobType: {
            hasType: true,
            type: '',
            value: '',
        },
        postedDate: {
            absolute: null,
            relative: null,
        },
        category: null,
        skills: {
            hasSkills: true,
            value: [],
        },
        country: null,
        link: null,
    }),
    created: function() {
        this.cleanData();
        this.getDescription();
        this.getSalary();
        this.getPostedDate();
        this.autoUpdateDate();
        this.getCategory();
        this.getSkills();
        this.getCountry();
        this.getLink();
    },
    methods: {
        cleanData() {
            this.jobData = this.job.description._cdata
                .replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, '')
                .replace(/<\/b>/g, '')
                .replace(/\r?\n|\r/g, '')
                .split('<b>');
        },
        getDescription() {
            this.description.original = this.jobData[0];
            if (this.description.original.length > 225) {
                this.description.truncate = `${this.description.original.slice(0, 225)}... `;
                this.description.needTruncated = true;
            } else {
                this.description.needTruncated = false;
                this.description.truncate = this.description.original;
            }
        },
        toggleDescription() {
            this.description.showMore = !this.description.showMore;
        },
        getSalary() {
            if (this.jobData[1].includes('Budget')) {
                this.jobType.type = 'Fixed-price';
                this.jobType.value = this.jobData[1].split(': ')[1];
            } else if (this.jobData[1].includes('Hourly Range')) {
                this.jobType.type = 'Hourly';
                this.jobType.value = this.jobData[1].split(': ')[1];
            } else {
                this.jobType.hasType = false;
            }
        },
        getPostedDate() {
            this.postedDate.absolute = new Date(
                this.jobType.hasType
                    ? this.jobData[2].split(': ')[1]
                    : this.jobData[1].split(': ')[1]
            );
        },
        autoUpdateDate() {
            this.postedDate.relative = format(this.postedDate.absolute);
            setInterval(() => {
                this.postedDate.relative = format(this.postedDate.absolute);
            }, 60000);
        },
        getCategory() {
            this.category = this.jobType.hasType
                ? this.jobData[3].split(': ')[1]
                : this.jobData[2].split(': ')[1];
        },
        getSkills() {
            const skillsString = this.jobType.hasType
                ? this.jobData[4].split('<a href')[0]
                : this.jobData[3].split('<a href')[0];
            if (skillsString.includes('Skills')) {
                this.skills.value = skillsString.split(':')[1].split(',');
            } else {
                this.skills.hasSkills = false;
            }
        },
        getCountry() {
            if (this.jobData[this.jobData.length - 1].includes('Country')) {
                this.country = this.jobData[this.jobData.length - 1]
                    .split(': ')[1]
                    .split('<a href')[0];
            }
        },
        getLink() {
            const jobId = this.job.link._text.split('%7E')[1].split('?')[0];
            this.link = `https://www.upwork.com/jobs/~${jobId}`;
        },
    },
};
</script>

<style>
.job--item {
    padding: 20px 30px;
    border-top: 1px solid #e0e0e0;
    line-height: 1.35;
}
@media (max-width: 600px) {
    .job--item {
        padding: 20px;
    }
}

.job--item:hover {
    background-color: #f9f9f9;
}

.job--item > a {
    color: inherit !important;
    text-decoration: none;
}

.job--item:hover .job-title {
    color: #37a000;
}

.job-description {
    font-size: 13px;
    font-weight: 500;
}

.toggel-text {
    text-decoration: none;
}

.toggel-text:hover {
    text-decoration: underline;
}

.job-info {
    font-size: 12.5px;
    font-weight: 500;
}
</style>
