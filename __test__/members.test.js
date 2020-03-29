// import server from '../server';
// import chai from 'chai';
// import chaiHttp from 'chai-http';

// const app = server;

// chai.use(chaiHttp);
// chai.should();

// describe('[ GET /api/v2/members ] get all members and count', () => {
//     it('returns an array of all members', done => {
//         chai.request(app)
//             .get('/api/v2/members')
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.users.should.be.a('array');
//                 if (err) console.log(err);
//                 done();
//             });
//     });

//     it('returns all members and count members', done => {
//         chai.request(app)
//             .get('/api/v2/members')
//             .end((err, res) => {
//                 res.body.count.should.be.a('number');
//                 res.body.count.should.be.gte(0);
//                 res.body.users.forEach(member => {
//                     member.should.be.a('object');
//                     member.should.include.keys(
//                         'id',
//                         'email',
//                         'shares',
//                         'created_at',
//                         'location',
//                         'name',
//                         'img'
//                     );
//                 });
//                 if (err) console.log(err);
//                 done();
//             });
//     });
// });

// describe('[ GET /api/v2/members/:id ] get a single member', () => {
//     it('returns an object of the member', done => {
//         chai.request(app)
//             .get('/api/v2/members/1')
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.user.should.be.a('object');
//                 if (err) console.log(err);
//                 done();
//             });
//     });

//     it('returns all details for the  member', done => {
//         chai.request(app)
//             .get('/api/v2/members/1')
//             .end((err, res) => {
//                 res.body.user.should.include.keys(
//                     'id',
//                     'email',
//                     'shares',
//                     'created_at',
//                     'location',
//                     'name',
//                     'img'
//                 );
//                 if (err) console.log(err);
//                 done();
//             });
//     });
// });

// describe('[ POST /api/v2/members/signin ] signin member', () => {
//     it('returns an object of with a token', done => {
//         chai.request(app)
//             .post('/api/v2/members/signin')
//             .set('Content-Type', 'application/json; charset=utf-8')
//             .send({ email: 'alainyern@gmail.com', password: 'electrotech' })
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.include.keys('success', 'token');
//                 res.body.success.should.be.true;
//                 if (err) console.log(err);
//                 done();
//             });
//     });
// });

// describe('[ POST /api/v2/members/create ] create a member', () => {
//     it('returns an object of with a message', done => {
//         chai.request(app)
//             .post('/api/v2/members/create')
//             .set('Content-Type', 'application/json; charset=utf-8')
//             .send({
//                 email: 'janvierntwali@gmail.com',
//                 name: 'Janvier HABIYAREMYE',
//                 shares: 5,
//                 location: 'ETE Year 3'
//             })
//             .end((err, res) => {
//                 res.should.have.status(201);
//                 res.body.should.be.a('object');
//                 res.body.should.include.keys('success', 'message');
//                 res.body.success.should.be.true;
//                 res.body.message.should.be.a('string');
//                 res.body.message.should.eql('Member created successfully');
//                 if (err) console.log(err);
//                 done();
//             });
//     });
// });
