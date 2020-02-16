const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/isAuth');

describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', function(){
    const req = {
      get: function(headerName) {
        return null;
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not Authenticated');
  })
  
  it('should throw an error if authorization header only a string', function(){
    const req = {
      get: function(headerName) {
        return 'xyzsfsd';
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  })
  it('Should yield the userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer xyzkjsdhfksjhfjsd';
      }    
    }
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({userId: 'abc'});
    authMiddleware(req, {}, ()=>{});

    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  })
})
