const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Chat API', () => {
  it('should return a completion on /api/chat/completion POST', (done) => {
    const category = 'movie-script';

    chai.request(server)
      .post('/api/generate_text')
      .send({ category })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('completion');
        done();
      });
  }).timeout(250000);

  it('should return an error when no category is sent', (done) => {
    chai.request(server)
      .post('/api/generate_text')
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return an error when invalid category is sent', (done) => {
    const category = 'invalid-category';

    chai.request(server)
      .post('/api/generate_text')
      .send({ category })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});

describe('Image API', () => {
  it('should return an image URL on /api/image/generate POST', (done) => {
    const payload = {
      prompt: 'sunset over the ocean',
      n: 1,
      size: '512x512'
    };

    chai.request(server)
      .post('/api/generate_image')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('imageUrl');
        done();
      });
  }).timeout(10000);

  it('should return an error when no data is sent', (done) => {
    chai.request(server)
      .post('/api/generate_image')
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return an error when incomplete data is sent', (done) => {
    const payload = {
      prompt: 'sunset over the ocean',
      n: 1
    };

    chai.request(server)
      .post('/api/generate_image')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return an error when non-positive integer is sent for "n" or "size"', (done) => {
    const payload = {
      prompt: 'sunset over the ocean',
      n: -1,
      size: 0
    };

    chai.request(server)
      .post('/api/generate_image')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  
  it('should return an error when non-positive integer is sent for "n" or invalid format is sent for "size"', (done) => {
    const payload = {
      prompt: 'sunset over the ocean',
      n: -1,
      size: 'invalid-size'
    };

    chai.request(server)
      .post('/api/generate_image')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});
