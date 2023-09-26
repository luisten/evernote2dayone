const fs = require('fs');
const TurndownService = require('turndown');
const {JSDOM} = require('jsdom');
const { execSync } = require('child_process');

const noteFolder = './My\ Notes/';
const turndownService = new TurndownService();

// ensures title doesn't stick to first paragraph
turndownService.addRule('title', {
  filter: 'title',
  replacement: function(content) {
    return content + ' \n';
  }
})

// dayone2 will insert photos into each `[{photo}]` by order found in --photos
turndownService.addRule('img', {
  filter: 'img',
  replacement: function(content) {
    return '[{photo}]';
  }
})

fs.readdirSync(noteFolder).forEach(fileName => {
  // Skip directories which don't end in `.html` & `Evernote_index.html` listing
  if (fileName.indexOf('.html') !== fileName.length - 5 || fileName === 'Evernote_index.html') {
    return;
  }

  console.log("Importing " + fileName);

  var contents = fs.readFileSync(noteFolder + fileName, 'utf8');
  var dom = new JSDOM(contents);

  let createdDate = '';
  const metaTags = dom.window.document.getElementsByTagName('meta');
  for (let i = 0; i < metaTags.length; i++) {
    if (metaTags[i].getAttribute('itemprop') === 'created') {
      createdDate = metaTags[i].content;
      break;
    }
  }

  let imgUrls = [];
  const imgTags = dom.window.document.getElementsByTagName('img');
  for (let i = 0; i < imgTags.length; i++) {
    imgUrls.push('"' + noteFolder + decodeURIComponent(imgTags[i].src) + '"');
  }

  // Only takes into account the body of the Evernote export and prevents importing useless CSS
  const markdown = turndownService.turndown(dom.window.document.body.innerHTML).replace(/"/g, '\\"');
  const urls = imgUrls.join(' ');
  
  // Evernote already exports the date in ISO format but without the dashes and colons.
  const isoDate = createdDate.slice(0,4) + '-' + 
                  createdDate.slice(4,6) + '-' + 
                  createdDate.slice(6,11) + ':' +
                  createdDate.slice(11,13) + ':' +
                  createdDate.slice(13);

  let execCommand = `dayone2 new "${markdown}"`;
  if (urls.length > 0) {
    execCommand += ` --photos ${urls}`;
  }
  execCommand += ` --isoDate "${isoDate}" --tags "EvernoteImport"`;
  
  // Uncomment the following if you want to save your imported entries in an existing journal
  // const destination_journal = 'Evernote Imports';
  // execCommand += ` --journal "${destination_journal}"`;
  
  execSync(execCommand, console.log);
});
