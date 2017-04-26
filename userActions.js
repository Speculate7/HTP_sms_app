var UserActions = function() 
{
  var self = this;
  var commands = ["join","options", "leave", "share", "information", "poem"];
  var commandDescriptions = ["Registers you with the HTP_sms_app poetry service.",
   "Shows you a list of commands you can send.",
   "Removes you from the HTP_sms_app poetry service.", 
   "Text 'share' followed by a friend's number to tell that friend about the HTP_sms_app poetry service.",
   "Gives you some additional information about the service", "If followed by number 1-10 i.e., poem2, this command will send you a poem."];

   
   self.userResponse = function(res, body, media)
   {
    var resp;
    if (media === undefined) {
      resp  = '<Response><Message><Body>' + body  + '</Body></Message></Response>';
    } else {
      resp = '<Response><Message><Body>' + body  + '</Body><Media>' + media + '</Media></Message></Response>';
    }

    res.status(200)
        .contentType('text/xml')
        .send(resp);
   };
   
   //get some general info on the service
   self.userInformation = function(g, res, client, sender, action)
   {
      console.log("userInfo");
      var body  = "HTP sms app is a public text message service template created to help artists build solutions.";
      self.userResponse(res, body, media);
   };
	
  //registers a new user
  self.userJoin = function(g, res, client, sender, action)
  {
    console.log("userJoin");
	  
    var body  = "Thank you for joining! Text, i am 'a username' to finish registering";
    self.userResponse(res, body, media);
  };
  
  //list commands that a user can send
  self.userOption = function(g, res, client, sender, action)
  {
    console.log("userOption");
    if (commands.length != commandDescriptions.length){
      console.warn("Commands list and descriptions list don't match.");
      return;
    }
    var body = "";
    for (var i = 0; i < commands.length; i++){
     body = body + commands[i] + ": " + commandDescriptions[i] + '\n\n';
    }
    self.userResponse(res, body);
  };

  self.userRandomPoem = function(g, res, client, sender, action)
  {
    console.log("RandomPoem");
    if (commands.length != commandDescriptions.length){
      console.warn("Commands list and descriptions list don't match.");
      return;
    }
    var body = "";
    for (var i = 0; i < commands.length; i++){
     body = body + commands[i] + ": " + commandDescriptions[i] + '\n\n';
    }
    self.userResponse(res, body);
  };
  
  self.userLeave= function(g, res, client, sender, action)
  { 
    console.log("userLeave");
    var cryptoSender = g.cryptoHelper.encrypt(sender);
    console.log(cryptoSender);
    var findQueryString = "DELETE FROM users WHERE phone_number = '" + cryptoSender + "'";
    console.log(findQueryString);
    var findQuery = client.query(findQueryString);
    findQuery.on('end', function() {
      console.log('Success on userLeave');
    });
    findQuery.on('error', function() {
      console.log('Error on userLeave');
    });
    var body= "Thanks for using HTP_sms_app. Text 'join' to continue recieving poem.";
    self.userResponse(res, body);
  };
  
  self.userPoem = function(g, res, client, sender, action)
  {
    console.log("userPoem");
    var body  = "Text poem + 1-10 i.e., poem2, to receive a poem.";
    var media = "https://dl2.pushbulletusercontent.com/eCQoCPeQ2kreWoMdqaFxC6oAX65LMaAj/Screen%20Shot%202017-04-24%20at%202.58.12%20PM.png";
    self.userResponse(res, body, media);
  };


  self.userSetName = function(g, res, client, sender, action)
  {
    var cryptoSender = g.cryptoHelper.encrypt(sender);
    console.log("userSetName");
    var name = action.substring(5);//extracting character from string at index 5.
    var findQueryString = "SELECT * FROM users WHERE phone_number = '" + cryptoSender + "'";
    var findQuery = client.query(findQueryString);
    findQuery.on('row', function(row) {
      console.log(JSON.stringify(row));
    
      var insertQueryString = "UPDATE users SET name = '" + name + "' WHERE phone_number = '" + cryptoSender + "'";
      var insertQuery = client.query(insertQueryString);
      insertQuery.on('end', function() {
        var body = "👌 You're signed up as: " + name;
        self.userResponse(res, body);
      });
    });
  };
	

  //tells the user the nearest medical center avaiable for the user
  self.userPoetry = function(g, res, client, sender, action, body)
  {
    console.log("userPoetry");
    console.log("userPoetry: " + action);
    var body  = "";
    var i = action.charAt(4);
    console.log(i)
    if (i == 1) {
      body += "Coping:\n It has rained for five days\n running\n the world is\n a round puddle\n of sunless water\n where small islands\n are only the beginning\n to cope\n a young boy\n in my garden\n is bailing out water\n from his flower patch\n when I ask him why\n he tells me\n young seeds that have not seen sun\n forget\n and drown easily.\n\n Audre Lorde";
    } else if (i == 2) {
      body += "Poem Label:\n insert poetry text here";
    } else if (i == 3) {
      body += "Poem Label:\n insert poetry text here";
    } else if (i == 4) {
      body += "Poem Label:\n insert poetry text here";
    } else if (i == 5) {
      body += "Poem Label:\n insert poetry text here";
    } else if (i == 6) { 
      body += "Poem Label:\n insert poetry text here";
    } else if (i == 7) {
      body += "Poem Label:\n insert poetry text here";
    } else if (i == 8) {
      body += "Poem Label:\n insert poetry text here";
    } else if (i == 9) {
      body += "Poem Label:\n insert poetry text here";
    } else {
      body += "Sorry, we didn't understand that. Text poem + 1-10 i.e., poem2, to receive a poem."
    }
    self.userResponse(res, body);
  };

  //userShare will allow the user's message to share their experience to others/
  self.userShare = function(g, res, client, sender, action)
  { 
    var TWILIO_NUMBER = process.env.TWILIO_NUMBER;
    var length = "share".length + 1;
    var number = action.substring(length);
    
    number = "+1" + number;
    number = number.replace("-" , "");
    number = number.replace("(" , "");
    number = number.replace(")" , "");
	  
    var body;
    var isValidNumber = true;
    if (number.length != '+10000000000'.length) {
      isValidNumber = false;	
    }
    
    if (isValidNumber) {
      body  = "You have shared the HTP sms app poetry service with: " + number;
      g.twilio.sendMessage({
        to: number,
        from: TWILIO_NUMBER,
        body: "Your friend at " + sender + " wants to share the HTP sms app poetry service with you. Text 'Join' to try it out."
      }, function (err) {
        if (err) {
	        console.log(err);
        }
      }); 
    } else {
      body = "Sorry, we didn't understand that. To use the share command you must text 'share' followed by a phone number";	    
    }
    self.userResponse(res, body);
  };
  
  //userNeedles will show you where and when the need fan will show up at certain times/


  self.userFail = function(g, res, client, sender, body)
  {
     var body = "Sorry, we didn't understand that. Text 'help' for a list of possible commands.";
     self.userResponse(res, body);
  };
	

 
  self.doUserAction = function(g, res, client, sender, body, messageHistory)
  {
    var command = body.toLowerCase().trim();
    if (command == "poem") {
      self.userPoem(g, res, client, sender, body);
    } else if (command.startsWith('poem')) {
      self.userPoetry(g, res, client, sender, body);
    } else if (command.startsWith('i am')) {
      self.userSetName(g, res, client, sender, body);
    } else if (command == 'leave') {
      self.userLeave(g, res, client, sender, body);
    } else if (command.startsWith('option')) {
      self.userHelp(g, res, client, sender, body);
    } else if (command.startsWith('share')) {
      self.userShare(g, res, client, sender, body);
    } else if (command.startsWith('info')) {
      self.userInfo(g, res, client, sender, body);
    } else if (command == 'join') {
      self.userJoin(g, res, client, sender, body);   
    } else {
      self.userFail(g, res, client, sender, body);
    }
  };

};


module.exports = UserActions;
