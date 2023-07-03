const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const should = chai.should();

chai.use(chaiHttp);

describe('Chat API', () => {
  it('should return a completion on /api/chat/completion POST', (done) => {
    const category = 'movie-script';

    chai.request(server)
      .post('/api/chat/completion')
      .send({ category })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('completion');
        done();
      });
  });

  it('should return an error when no category is sent', (done) => {
    chai.request(server)
      .post('/api/chat/completion')
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
      .post('/api/chat/completion')
      .send({ category })
      .end((err, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      done();
    });
  });
});