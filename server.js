const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();
app.use(morgan('common'));

BlogPosts.create('This is my first blog post', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet iaculis dui. Quisque dapibus est at magna sodales convallis eget volutpat nibh. Vivamus sed nisl lacinia, hendrerit massa a, commodo nibh.', 'Jes', '02/25/2018');
BlogPosts.create('This is my second blog post', 'Nullam rhoncus aliquet nibh vel sollicitudin. Phasellus dictum scelerisque tempor. Nullam pellentesque erat in leo varius porta. Maecenas quam augue, vehicula vitae fringilla non, sodales vel ipsum.', 'Jes', '03/05/2018');

app.get('/blog-posts', (req, res) => {
	res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	requiredFields.forEach((field) => {
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	});

	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(post);
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	requiredFields.forEach((field) => {
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	});
	if (req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id})must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post \`${req.params.id}\``);
	BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});

app.delete('/blog-posts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.id}\``);
	res.status(204).end();
});




let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    })
    .on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};


module.exports = {app, runServer, closeServer};