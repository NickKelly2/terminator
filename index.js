const asciify = require('asciify-image');
const fs = require('fs');
const request = require('request');

const width = process.stdout.rows - 1;
const height = Math.max(process.stdout.columns - 1, 100);


const options = {
  fit:    'box',
  width,
  height,
}

const URL = `https://picsum.photos/${width}/${height}`;

const download = function(uri, filename) {
  return new Promise((resolve, reject) => {
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', () => setTimeout(() => resolve(filename), 2500));
  });
  });
}


const getAndWriteImage = async () => {
  try {
    await download(URL, 'temp.png');
    const ascii = await asciify('temp.png', options)
    console.log(ascii);
  } catch(e) {
    console.log('error:', e);
  }
}

// Wrap the cursor in an async iterable using `then()` to
// transform the result of `cursor.next()` into properly
// formatted async iterator output
const imageLoop = {
  [Symbol.asyncIterator]: () => ({
    next: () => getAndWriteImage().then(() => (
      {
        value: true,
        done: false // go forever
      }
    ))
  })
};

// Use for/await/of to loop through the async iterable
(async () => {
  for await (const z of imageLoop) {}
})();
