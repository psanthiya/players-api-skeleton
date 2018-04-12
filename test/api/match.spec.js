const _ = require('lodash');
const server = require('../../src/server');
//const { User, Player, Match } = require('../../src/models');
const User = require('../../src/models/user');
const Player = require('../../src/models/player');
const Match = require('../../src/models/match');
const data = require('../util/data');
const mongoose = require('mongoose');

let token, user;

describe('Player API', () => {

  before(async () => {
    await User.remove({});
    await Player.remove({});


  const res = await chai.request(server)
      .post('/api/user')
      .send(data.user);
    token = res.body.token;
    user = res.body.user;
    data.match1.createdBy = user.id

    const playerRes = await chai.request(server)
          .post('/api/players')
          .send(data.player)
           .set('Authorization', `Bearer ${ token }`);

        var playerObj1 = playerRes.body.player;
        data.match1.firstPlayer = playerObj1.id;


    const playerRes1 = await chai.request(server)
          .post('/api/players')
          .send(data.player2)
          .set('Authorization', `Bearer ${ token }`);
       var playerObj2 = playerRes1.body.player;
        data.match1.secondPlayer = playerObj2.id
        data.match1.matchwinner = playerObj2.id;
  });

  describe('POST /api/match', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    it('should fail if token not provided', done => {
      chai.request(server)
        .post('/api/match')
        .send(data.match1)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    ['firstPlayer', 'secondPlayer', 'firstPlayerScore', 'secondPlayerScore', 'matchwinner'].forEach(field => {
      it(`should fail if ${ field } not present`, done => {
        chai.request(server)
          .post('/api/match')
          .send(_.omit(data.match1, field))
          .set('Authorization', `Bearer ${ token }`)
          .end(err => {
            expect(err).to.exist;
            expect(err.status).to.equal(409);
            done();
          });
      });
    });

    it('should deliver match if successful', done => {
      chai.request(server)
        .post('/api/match')
        .send(data.match1)
        .set('Authorization', `Bearer ${ token }`)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.success).to.be.true;
          expect(res.body.match).to.be.a('object');
          done();
        });
    });
  });

  describe('GET /api/matches', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    it('should fail if token not provided', done => {
      chai.request(server)
        .get('/api/matches')
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    it('should deliver an empty array if no matches', async () => {
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/matches')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.matches).to.be.a('array');
      expect(res.body.matches.length).to.equal(0);
    });

    it('should deliver all matches', async () => {
      await Match.create(data.match1);
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/matches')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.matches).to.be.a('array');
      expect(res.body.matches.length).to.equal(1);

      res.body.matches.forEach(match => expect(match.id).to.be.a('string'));
    });


  });

  describe('GET /api/matches/:playerId', () => {
    beforeEach(async () => {
      await Match.remove({});
    });
   var playerId = mongoose.Types.ObjectId();

    it('should fail if token not provided', done => {
      chai.request(server)
        .get('/api/matches/'+ playerId)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    it('should fail if player does not exist', async () => {
      let res, error;

      try {
        res = await chai.request(server)
          .get('/api/matches/'+playerId)
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(res).not.to.exist;
      expect(error.status).to.equal(404);
    });

    it('should list the player match details if successful', async () => {
      let match = await Match.create(data.match1);
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/matches/'+match.firstPlayer)
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);


    });
  });
});
