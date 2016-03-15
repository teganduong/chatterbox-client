//reference: http://stackoverflow.com/questions/6020714/escape-html-using-jquery
// List of HTML entities for escaping.
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

// Regex containing the keys listed immediately above.
var htmlEscaper = /[&<>"'\/]/g;

// Escape a string for HTML interpolation.
_.escape = function(string) {
  return ('' + string).replace(htmlEscaper, function(match) {
    return htmlEscapes[match];
  });
};

$(document).ready(function() {

});

var app = {
  server: 'https://api.parse.com/1/classes/messages',

  friends: {},

  chatRooms: {},

  init: function() {
    app.fetch();
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function (data) {
        console.log("FETCH WORKING");
        _.each(data.results, function(message) {
          app.addMessage(message);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to return message', data);
      }
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addMessage: function(message) {
    $('#chats').append('<div class="username" name="' + _.escape(message.username) + '"><h2>' + _.escape(message.username) + '</h2><p>' + _.escape(message.text) + '</p></div>');
  },

  addRoom: function(roomName) {
    $('#roomSelect').append('<option value=' + roomName + '>' + roomName + '</option>');
  },

  addFriend: function() {
    $('.username').on('click', function (event) {
      $('#friends').append('<option value=' + $(this).attr("name") + '></option>');
    });
  },
  handleSubmit: function(message) {
    $('#submitButton').on('click', function() {
      app.send(message);
      app.addMessage(message);
      console.log(message);
    });
  }

};

app.init();

