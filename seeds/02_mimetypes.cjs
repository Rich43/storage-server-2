const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const documents = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-word.document.macroEnabled.12",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/xml",
    "application/json",
    "application/rtf",
    "application/epub+zip",
    "application/vnd.apple.keynote",
    "application/vnd.apple.pages",
    "application/vnd.apple.numbers",
    "application/vnd.google-apps.document",
    "application/vnd.google-apps.presentation",
    "application/vnd.google-apps.spreadsheet",
    "application/postscript",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.presentation",
    "application/vnd.oasis.opendocument.graphics",
    "application/vnd.oasis.opendocument.chart",
    "application/vnd.oasis.opendocument.formula",
    "application/vnd.oasis.opendocument.image",
    "application/vnd.oasis.opendocument.text-master",
    "application/vnd.oasis.opendocument.presentation-template",
    "application/vnd.oasis.opendocument.spreadsheet-template",
    "application/vnd.oasis.opendocument.text-web",
    "application/vnd.oasis.opendocument.chart-template",
    "application/vnd.oasis.opendocument.formula-template",
    "application/vnd.oasis.opendocument.image-template",
    "application/vnd.oasis.opendocument.text-master-template"
]

const videoPath = path.join(__dirname, 'types', 'video.yaml');
const imagePath = path.join(__dirname, 'types', 'image.yaml');
const audioPath = path.join(__dirname, 'types', 'audio.yaml');
const otherPath = path.join(__dirname, 'types', 'application.yaml');
const documentPath = path.join(__dirname, 'types', 'text.yaml');

const data = {};

function filterAndMap(what) {
    let filteredWhat = 'filtered' + what.substring(0, 1).toUpperCase() + what.substring(1);
    data[filteredWhat] = data[what].filter((item) => item.extensions !== undefined);
    data[`${what}Map`] = data[filteredWhat].reduce((acc, item) => {
        if (item.extensions.length > 0) {
            acc[item['content-type']] = item.extensions.join(',');
        }
        return acc;
    }, {});
}

try {
    data.video = yaml.load(fs.readFileSync(videoPath, 'utf8'));
    data.image = yaml.load(fs.readFileSync(imagePath, 'utf8'));
    data.audio = yaml.load(fs.readFileSync(audioPath, 'utf8'));
    data.other = yaml.load(fs.readFileSync(otherPath, 'utf8'));
    data.document = yaml.load(fs.readFileSync(documentPath, 'utf8'));
    filterAndMap('video');
    filterAndMap('image');
    filterAndMap('audio');
    filterAndMap('other');
    filterAndMap('document');
    data.documentAndApplication = {...data.documentMap};
    for (const doc of documents) {
        if (data.otherMap[doc]) {
            data.documentAndApplication[doc] = data.otherMap[doc];
        }
    }
} catch (error) {
    console.error(error);
}

function getInsertArray(data, category) {
    return Object.entries(data).map(([key, value]) => {
        return {type: key, preferred_extension: value.split(',')[0], extension: value, category};
    });
}

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Mimetype').del()
        .then(function () {
            return Promise.all([
                knex('Mimetype').insert(getInsertArray(data.imageMap, 'IMAGE')),
                knex('Mimetype').insert(getInsertArray(data.videoMap, 'VIDEO')),
                knex('Mimetype').insert(getInsertArray(data.audioMap, 'AUDIO')),
                knex('Mimetype').insert(getInsertArray(data.documentAndApplication, 'DOCUMENT')),
                knex('Mimetype').insert(getInsertArray(data.otherMap, 'OTHER'))
            ]);
        });
};
