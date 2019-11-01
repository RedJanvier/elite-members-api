const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe('get all members list', () => {
  it('returns an array of all members', done => {
    chai
      .request(app)
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        if (err) console.log(err);
        done();
      });
  });

  it('returns all members', done => {
    chai
      .request(app)
      .get('/api')
      .end((err, res) => {
        res.body.forEach(member => {
          member.should.be.a('object');
          member.should.include.keys('id', 'email', 'shares');
        });
        if (err) console.log(err);
        done();
      });
  });
});
