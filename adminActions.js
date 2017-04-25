// 
// A collection of functions related to special admin actions that can be triggered from an admin phone number*/
//
var AdminActions = function() {

  var self = this;

  var TWILIO_NUMBER = process.env.TWILIO_NUMBER;
  var MY_NUMBER     = process.env.MY_NUMBER;
  
//Announce new feature using this command
  self.adminNews = function(g, res, client, sender, action) 
  {
    console.log("adminNews");
    var message = action.slice('news'.length+1);
    var findQueryString = "SELECT * FROM users";
    var findQuery = client.query(findQueryString);
    findQuery.on('row', function(row) {
      console.log(JSON.stringify(row));
      var phoneNumber = g.cryptoHelper.decrypt(row.phone_number);
      g.twilio.sendMessage({
        to: phoneNumber,
        from: TWILIO_NUMBER,
        body: message,
      }, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }).on('error', function() {
      console.log("No news to share.")
    });
  };

  self.adminNewFeature = function(g, res, client, sender, action)
  {
    console.log("adminNewFeature");
    g.twilio.sendMessage({
      to: MY_NUMBER,
      from: TWILIO_NUMBER,
      body: "👋 Hello folks! New features have been added to the service! Check them out with the 'info' or 'help' commands."
    }, function (err) {
      if (err) {
        console.log(err);
      }
    });
  };

  self.encryptUsers = function(g, res, client, sender, action)
  {
    console.log("encryptUsers");
    var findQueryString = "SELECT * FROM users";
    console.log(findQueryString);
    var findQuery = client.query(findQueryString);
    findQuery.on('row', function(row) {
      console.log(JSON.stringify(row));
      var cryptoNumber = g.cryptoHelper.encrypt(row.phone_number);
      console.log(cryptoNumber);
    });
  };


  //Special admin actions, like mass text etc.
  self.doAdminAction = function(g, res, client, sender, action)
  {
    if (sender != MY_NUMBER) return false;//not admin sorry buddy.

    if (action == "new feature") {
      self.adminHelloWorld(g, res, client, sender, action);
    } else if (action.toLowerCase().startsWith('news')) {
      self.adminNews(g, res, client, sender, action);
    } else if (action == "Crypto") {
      self.encryptUsers(g, res, client, sender, action);
    } else {
      return false;
    }

    var body = "Admin Action Sent."
    var resp = '<Response><Message><Body>' + body + '</Body></Message></Response>';
        res.status(200)
        .contentType('text/xml')
        .send(resp);

    return true;
  };

};

module.exports = AdminActions;
