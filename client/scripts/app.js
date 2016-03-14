var app = {
  server: 'https://api.parse.com/1/classes/messages',

  init: function() {

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
        console.log('Messages: ', data);
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
    $('#chats').append('<div>' + message + '</div>');

  },
  addRoom: function(roomName) {
    $('#roomSelect').append('<option value=' + roomName + '>' + roomName + '</option>');
  }
};


// var message = {
//   username: 'teganduong',
//   text: 'LOLOL',
//   roomname: 'main'
// };



// $.get('https://api.parse.com/1/classes/messages', function(data) {
//   console.log(data);
// });