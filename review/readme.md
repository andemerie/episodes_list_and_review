## Code Analysis

##### What  do  you  think  is  wrong  with  the  code,  if  anything?
When we search for shop by its id, it's incorrect to send 500 status, because this response code indicates that there is internal server error. In this case we should send 400 (if error is not empty) or 404 (if shop is not found) status code.
If-condition, in which we search for invitation by its id using indexOf() method is incorrect, because this method returns the first index at which a given element can be found in the array, or -1 if it is not present. It's better to use includes() method.
It's incorrect to push the whole createdUser object into shop.users array. We should push only its id.
##### Can  you  see  any  potential  problems  that  could  lead  to  unexpected  behaviour?
There are some errors in source code that are left unhandled, it's fixed in the refactored code below.
##### How  might  you  refactor  this  code  to:
* Make  it  easier  to  read
* Increase  code  reuse
* Improve  the  testability
* Minimize  unhandled  exceptions
*Refactored code:*
```javascript
const superagent = require('superagent');

const handleError = (err, object) => {
  if (!err && object) {
    return false;
  }
  const status = (err && err.status) || object ? 400 : 404;
  const message = object ? 'something went wrong' : 'not found'
  return ({ error: true, status, message });
}

exports.inviteUser = (req, res) => {
  const invitationBody = req.body;
  const shopId = req.params.shopId;
  const authUrl = 'https://url.to.auth.system.com/invitation';

  superagent
    .post(authUrl)
    .send(invitationBody)
    .end((err, invitationResponse) => {
      let error = handleError(err, invitationResponse);
      if (error) {
        return res.status(error.status).send(error);
      }

      if (invitationResponse.status === 201) {
        const { authId } = invitationResponse.body.authId;

        User.findOneAndUpdate(
          { authId },
          { authId, email: invitationBody.email },
          { upsert: true, new: true },
          (err, createdUser) => {
            error = handleError(err, createdUser);
            if (error) {
              return res.status(error.status).send(error);
            }

            Shop.findById(shopId).exec((err, shop) => {
              error = handleError(err, shop);
              if (error) {
                return res.status(error.status).send(error);
              }

              const { invitationId } = invitationResponse.body;
              if (!shop.invitations.includes(invitationId)) {
                shop.invitations.push(invitationId);
              }

              if (!shop.users.includes(createdUser._id)) {
                shop.users.push(createdUser._id);
              }

              shop.save();
            });
          }
        );
        return res.json(invitationResponse);
      } else if (invitationResponse.status === 200) {
        return res.status(400).json({
          error: true,
          message: 'User already invited to this shop',
        });
      } else {
        return res.status(invitationResponse.status);
      }
    });
};

```
