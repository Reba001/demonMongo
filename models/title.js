const mongoose = require('mongoose');
const { Schema } = mongoose;

const episodeSchema = new Schema({
    season: Number,
    episode: Number
});


const titleSchema = new Schema({
    primaryTitle:String,
    originalTitle: String,
    isAdult: Boolean,
    startYear: Number,
    endYear: Number,
    runtime: Number,
    genders:[
        String
    ],
    titleType:String,
    directors:[
        String
    ],
    episodes:[episodeSchema]

});

module.exports = mongoose.model('title', titleSchema);