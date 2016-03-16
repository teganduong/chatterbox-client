var app = {
  server: 'https://api.parse.com/1/classes/messages',

  friends: {},
  currentFriend: "All Friends",
  chatRooms: {},
  currentRoom: "lobby",
  username: 'anonymous',

  init: function() {
    app.clearMessages();
    app.fetch();
    setTimeout(app.populateRoom, 300);
    setInterval(function() {
      app.fetch();
    }, 2000);
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
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
        app.clearMessages();
        _.each(data.results, function(message) {
          app.addMessage(message);
          app.chatRooms[message.roomname] = message.roomname;
        });
        for (var friends in app.friends) {
          $('div[value = ' + friends + ']').addClass('friends');
        }
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
    var escape = function(string) {
      return ('' + string).replace(htmlEscaper, function(match) {
        return htmlEscapes[match];
      });
    };

    if (message.roomname === app.currentRoom) {
      $('#chats').append('<div class="username" room="' + escape(message.roomname) + '" value="' + escape(message.username) + '"><h2>' + escape(message.username) + ':' + '</h2><p>' + escape(message.text) + '</p></div>');
    }

  },

  addRoom: function(roomName) {
    $('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');
  },

  addFriend: function() {
    var friendName = $(this).attr('value');
    //wont work correctly if user has space or a chracter other than letters
    $('div[value = ' + friendName + ']').addClass('friends');
    if (!(friendName in app.friends)) {
      app.friends[friendName] = friendName;
      $('#friends').append('<option>' + friendName + '</option>');
    }
    
  },
  saveRoom: function(event) {

  },

  populateRoom: function() {
    for (var roomname in app.chatRooms) { 
      app.addRoom(roomname);
    }
  },

  handleSubmit: function() {
    var userName = $('#username').val() || app.username;
    var userMessage = $('#message').val();
    var roomName = $('#roomSelect option:selected').val();

    var message = {
      'username': userName,
      'text': userMessage,
      'roomname': roomName
    };
    // send message to Parse API
    app.send(message);
    app.fetch();
  }
};

$(document).on('change', 'select', function() {
  var selected = $(this).val();
  if (selected === "addRoom") {
    var newRoom = prompt('Create a room...');
    if (newRoom.length > 0) {
      app.addRoom(newRoom);
      app.currentRoom = selected;
    }
  } else if (selected in app.chatRooms) {
    app.currentRoom = selected;
    app.fetch();
  }
});
$(document).on('click', '.username', app.addFriend);
$(document).on('click', '#clear', app.clearMessages);
$(document).on('click', '#send', function(event) {
  event.preventDefault();
  app.handleSubmit();
});
