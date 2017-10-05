// var express = require('express');
// var cheerio = require('cheerio');
// var superagent = require('superagent');
//
// var app = express();
//
// app.get('/', function (req, res, next) {
//     superagent.get('https://cnodejs.org/')
//         .end(function (err, sres) {
//             if (err) {
//                 return next(err);
//             }
//             var $ = cheerio.load(sres.text);
//             var items = [];
//             $('#topic_list .topic_title').each(function (idx, element) {
//                 var $element = $(element);
//                 items.push({
//                     title: $element.attr('title'),
//                     href: $element.attr('href')
//                 });
//             });
//
//             res.send(items);
//         });
// });
//
//
// app.listen(3000, function () {
//     console.log('app is listening at port 3000');
// });

// var eventproxy = require('eventproxy');
// var superagent = require('superagent');
// var cheerio = require('cheerio');
// var url = require('url');
//
// var cnodeUrl = 'https://cnodejs.org/';
//
// superagent.get(cnodeUrl)
//     .end(function (err, res) {
//         if (err) {
//             return console.error(err);
//         }
//         var topicUrls = [];
//         var $ = cheerio.load(res.text);
//         $('#topic_list .topic_title').each(function (idx, element) {
//             var $element = $(element);
//             var href = url.resolve(cnodeUrl, $element.attr('href'));
//             topicUrls.push(href);
//         });
//
//         var ep = new eventproxy();
//
//         ep.after('topic_html', topicUrls.length, function (topics) {
//             topics = topics.map(function (topicPair) {
//                 var topicUrl = topicPair[0];
//                 var topicHtml = topicPair[1];
//                 var $ = cheerio.load(topicHtml);
//                 return ({
//                     title: $('.topic_full_title').text().trim(),
//                     href: topicUrl,
//                     comment1: $('.reply_content').eq(0).text().trim(),
//                 });
//             });
//
//             console.log('final:');
//             console.log(topics);
//         });
//
//         topicUrls.forEach(function (topicUrl) {
//             superagent.get(topicUrl)
//                 .end(function (err, res) {
//                     console.log('fetch ' + topicUrl + ' successful');
//                     ep.emit('topic_html', [topicUrl, res.text]);
//                 });
//         });
//     });
var fs        = require('fs');
var tesseract = require('node-tesseract');
var gm        = require('gm');

processImg('3.jpg', 'test_3.jpg')
    .then(recognizer)
    .then(text => {
    console.log(`识别结果:${text}`);
})
.catch((err)=> {
    console.error(`识别失败:${err}`);
});

/**
 * 处理图片为阈值图片
 * @param imgPath
 * @param newPath
 * @param [thresholdVal=55] 默认阈值
 * @returns {Promise}
 */
function processImg (imgPath, newPath, thresholdVal) {
    return new Promise((resolve, reject) => {
        gm(imgPath)
        // .threshold(thresholdVal || 55)
        .crop(43, 16, 1, 1)
        .write(newPath, (err)=> {
        if (err) return reject(err);

    resolve(newPath);
});
});
}

/**
 * 识别图片
 * @param imgPath
 * @param options tesseract options
 * @returns {Promise}
 */
function recognizer (imgPath, options) {
    options = Object.assign({psm: 7}, options);

    return new Promise((resolve, reject) => {
        tesseract
        .process(imgPath, options, (err, text) => {
        if (err) return reject(err);
    resolve(text.replace(/[\r\n\s]/gm, ''));
});
});
}
