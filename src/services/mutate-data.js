import { format } from 'timeago.js';

export const initJobs = (jobs) => {
    const jobsList = [];

    jobs.map((job) => {
        const jobItem = retrieveData(job);
        jobsList.push(jobItem);
    });

    return jobsList;
};

const retrieveData = (jobData) => {
    const jobItem = {};

    const cleanedData = cleanData(jobData.description._cdata);

    jobItem.title = jobData.title._cdata.slice(0, -8);
    jobItem.description = getDescription(cleanedData);
    jobItem.jobType = getJobType(cleanedData);
    jobItem.postedDate = getPostedDate(cleanedData, jobItem.jobType.hasType);
    jobItem.category = getCategory(cleanedData, jobItem.jobType.hasType);
    jobItem.country = getCountry(cleanedData);
    jobItem.skills = getSkills(cleanedData, jobItem.jobType.hasType);
    jobItem.link = getLink(jobData.link._text);

    return jobItem;
};

const cleanData = (jobData) => {
    const cleanedData = jobData
        .replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, '')
        .replace(/<\/b>/g, '')
        .replace(/\r?\n|\r/g, '')
        .split('<b>');

    return cleanedData;
};

const getDescription = (data) => {
    const description = {
        original: '',
        truncate: '',
        needTruncated: false,
        showMore: false,
    };

    description.original = data[0];
    if (description.original.length > 225) {
        description.truncate = `${description.original.slice(0, 225)}... `;
        description.needTruncated = true;
    } else {
        description.needTruncated = false;
        description.truncate = description.original;
    }

    return description;
};

const getJobType = (data) => {
    const jobType = {
        hasType: true,
        type: '',
        value: '',
    };

    if (data[1].includes('Budget')) {
        jobType.type = 'Fixed-price';
        jobType.value = data[1].split(': ')[1];
    } else if (data[1].includes('Hourly Range')) {
        jobType.type = 'Hourly';
        jobType.value = data[1].split(': ')[1];
    } else {
        jobType.hasType = false;
    }

    return jobType;
};

const getPostedDate = (data, jobHasType) => {
    const postedDate = {
        absolute: null,
        relative: null,
    };

    postedDate.absolute = new Date(jobHasType ? data[2].split(': ')[1] : data[1].split(': ')[1]);
    postedDate.relative = format(postedDate.absolute);

    return postedDate;
};

const getCategory = (data, jobHasType) => {
    const category = jobHasType ? data[3].split(': ')[1] : data[2].split(': ')[1];

    return category.split('<a href')[0];
};

const getSkills = (data, jobHasType, country) => {
    const skills = {
        hasSkills: true,
        value: [],
    };

    const skillsString =
        jobHasType && country != null ? data[4].split('<a href')[0] : data[3].split('<a href')[0];

    if (skillsString.includes('Skills')) {
        skills.value = skillsString.split(':')[1].split(',');
    } else {
        skills.hasSkills = false;
    }

    return skills;
};

const getCountry = (data) => {
    return data[data.length - 1].includes('Country')
        ? data[data.length - 1].split(': ')[1].split('<a href')[0]
        : null;
};

const getLink = (data) => {
    const jobId = data.split('%7E')[1].split('?')[0];
    return `https://www.upwork.com/jobs/~${jobId}`;
};

export const getNewJobs = (allJobs, oldJobs) => {
    return allJobs.filter((newJob) => !oldJobs.map((oldJob) => oldJob.link).includes(newJob.link));
};
