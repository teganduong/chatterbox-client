var app = {
  server: 'https://api.parse.com/1/classes/messages',

  friends: {},

  chatRooms: {},

  init: function() {
    app.clearMessages();
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
        app.clearMessages();
        _.each(data.results, function(message) {
          app.addMessage(message);
          app.chatRooms[message.roomname] = message.roomname;
        });
        for (var roomname in app.chatRooms) {
          $('#roomSelect').append('<option value="' + escape(roomname) + '">' + escape(roomname) + '</option>');
        }
        for (var friend in app.friends) {
          $('div[value = ' + friend + ']').addClass('friends');
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
    $('#chats').append('<div class="username" room="' + escape(message.roomname) + '" value="' + escape(message.username) + '"><h2>' + escape(message.username) + ':' + '</h2><p>' + escape(message.text) + '</p></div>');
  },

  addRoom: function(roomName) {
    $('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');
  },

  addFriend: function(eve) {
    var friendName = $(this).attr('value');
    $('div[value = ' + friendName + ']').addClass('friends');
    if (!(friendName in app.friends)) {
      app.friends[friendName] = friendName;
      $('#friends').append('<option>' + friendName + '</option>');
    }
    
  },
  saveRoom: function(event) {

  },

  handleSubmit: function() {
    var userName = $('#username').val();
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

app.init();

setInterval(function() {
  app.init();
}, 20000);


$(document).on('change', 'select', function() {
  var selected = $(this).val();
  if (selected === "addRoom") {
    var newRoom = prompt('Create a room...');
    if (newRoom.length > 0) {
      app.addRoom(newRoom);
    }
  } 
  if (selected === "All Friends") {
    app.fetch();
  }
  $('#chats div').each(function(elem) {
    $(this).show();
    if ($(this).attr('value') !== selected) {
      $(this).hide();
    } else if ($(this).attr('room') !== selected) {
      $(this).hide();
    }
  });

});
$(document).on('click', '.username', app.addFriend);
$(document).on('click', '#clear', app.clearMessages);
$(document).on('click', '#send', function(event) {
  event.preventDefault();
  app.handleSubmit();
});
