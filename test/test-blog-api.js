const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('BlogPosts', function() {

	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});


// test GET response
it('should create a blog post on GET', function() {
	return chai.request(app)
	.get('/blog-posts')
	.then(function(res) {
		expect(res).to.have.status(200);
		expect(res).to.be.json;
		expect(res).to.be.a('object');
		expect(res.body.length).to.be.at.least(1);

		const expectedKeys = ['id', 'title', 'content', 'author'];
		res.body.forEach(function(item) {
			expect(item).to.be.a('object');
			expect(item).to.include.keys(expectedKeys);
		});
	});
});

// test POST response
it('should add a blog post on POST', function() {
	const newPost = {
		title: 'This is a new post',
		content: 'Lorem ipsum new post',
		author: 'Jes',
		publishDate: '03/13/2018'
	};
	return chai.request(app)
	.post('/blog-posts')
	.send(newPost)

	.then(function(res) {
		expect(res).to.have.status(201);
		expect(res).to.be.json;
		expect(res.body).to.be.a('object');
		expect(res.body).to.include.keys('id', 'title', 'content', 'author');
		expect(res.body.id).to.not.equal(null);
		expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
	});
}); 

// test PUT response
it('should update a blog post on PUT', function() {
	const updatedPost = {
		title: 'This is an updated post',
		content: 'Lorem ipsum updated post',
		author: 'Jes',
		publishDate: '03/15/2018'		
	};

	return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			updatedPost.id = res.body[0].id;

			return chai.request(app)
			.put(`/blog-posts/${updatedPost.id}`)
			.send(updatedPost);
		})

	.then(function(res) {
		expect(res).to.have.status(204);
	});

});


// test DELETE response
it('should delete a blog post on DELETE', function() {
	return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			return chai.request(app)
				.delete(`/blog-posts/${res.body[0].id}`);
		})

	.then(function(res) {
		expect(res).to.have.status(204);
	});
});


});