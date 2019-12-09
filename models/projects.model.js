const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectsSchema = new Schema({
    projectname: String,
    versions: [{
        version: String,
        title: String,
        description: String,
        filesize: Number,
        appfilename: String,
        appiconfilename: String,
        plistname: String,
        date: { type: Date, default: Date.now }
    }]
});

const Projects = mongoose.model('Projects', projectsSchema);

Projects.findProjectByObjectId = function(stringId, callback) {
    // let _id = new mongoose.Types.ObjectId(stringId);
    // Projects.findOne({_id: _id}, callback);

    Projects.findById(stringId), (err, doc) => {
        console.log(doc);
    }
}

module.exports = Projects;