export default class Offer {
    constructor({
        _id, title, publishDate, publishEndDate, company, location, jobStartDate, jobMinDuration,
        jobMaxDuration, description, contacts, fields, technologies,
    }) {
        this.id = _id;
        this.title = title;
        this.publishDate = publishDate;
        this.publishEndDate = publishEndDate;
        this.company = company;
        this.location = location;
        this.jobStartDate = jobStartDate;
        this.jobMinDuration = jobMinDuration;
        this.jobMaxDuration = jobMaxDuration;
        this.description = description;
        this.contacts = contacts;
        this.fields = fields;
        this.technologies = technologies;
    }
}
