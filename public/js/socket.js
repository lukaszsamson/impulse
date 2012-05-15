$(function() {
    var socket = io.connect('http://localhost');

    socket.on('task created', function(task) {
      taskCreated(task);
      showMessage('New task created');
    });
    
    function showMessage(msg) {
      var a = $('<a class="close" data-dismiss="alert" href="#">&times;</a>');
      var al = $('<section class="alert fade in"></section>');
      al.html('<strong>Info:</strong> ' + msg);
      al.prepend(a);
      $('.main').prepend(al);
      al.alert();
    }
    
    function showError(msg) {
      var a = $('<a class="close" data-dismiss="alert" href="#">&times;</a>');
      var al = $('<section class="alert alert-error fade in"></section>');
      al.html('<strong>Info:</strong> ' + msg);
      al.prepend(a);
      $('.main').prepend(al);
      al.alert();
    }
    
    function taskCreated(task) {
      $('li.nav-header.c').after('<li><a href="/tasks/' + task.id + '">' + task.title + '</a></li>');
    }
    
    function taskAccepted(id) {
      var item = $('ul.nav-list>li>a[data-id="' + id + '"]').parent();
      item.remove();
      $('li.nav-header.a').after(item);
    }
    
    socket.on('task accepted', function (id) {
      taskAccepted(id);
      showMessage('Task accepted');
    });

    
    
    function taskRejected(id) {
      var item = $('ul.nav-list>li>a[data-id="' + id + '"]').parent();
      item.remove();
      $('li.nav-header.r').after(item);
    }
    
    socket.on('task rejected', function (id) {
      taskRejected(id);
      showMessage('Task rejected');
    });
    

    
    
    
    $('form.new-task').submit(function(e) {
      e.preventDefault();
      var task = {
        title: $(this).find('[name="title"]').val(),
        details: $(this).find('[name="details"]').val()
      };
      socket.emit('create task', task, function(error, task) {
        if (error)
          return showError(error);
        taskCreated(task);
      });
    });
    
    $('.accept').click(function(e) {
      e.preventDefault();
      var id = $('form[data-id]').data('id').toString();
      socket.emit('accept task', id, function(error) {
        if (error)
          return showError(error);
        taskAccepted(id);
      });
    });
    
   $('.reject').click(function(e) {
      e.preventDefault();
      var id = $('form[data-id]').data('id').toString();
      socket.emit('reject task', id, function(error) {
        if (error)
          return showError(error);
        taskRejected(id);
      });
    });
    
    socket.on('connect', function () {
        $('#chat').addClass('connected');
    });

    socket.on('announcement', function (msg) {
        $('#lines').append($('<p>').append($('<em>').text(msg)));
    });

    socket.on('nicknames', function (nicknames) {
        $('#nicknames').empty().append($('<span>Online: </span>'));
        for (var i in nicknames) {
            $('#nicknames').append($('<b>').text(nicknames[i]));
        }
    });

    socket.on('user message', message);
    socket.on('reconnect', function () {
        $('#lines').remove();
        message('System', 'Reconnected to the server');
    });

    socket.on('reconnecting', function () {
        message('System', 'Attempting to re-connect to the server');
    });

    socket.on('error', function (e) {
        message('System', e ? e : 'A unknown error occurred');
    });

    function message (from, msg) {
        $('#lines').append($('<p>').append($('<b>').text(from), msg));
    }
  
  
    $('#set-nickname').submit(function (e) {
        e.preventDefault();
        socket.emit('nickname', $('#nick').val(), function (set) {
            if (!set) {
                clear();
                return $('#chat').addClass('nickname-set');
            }
            $('#nickname-err').css('visibility', 'visible');
        });
        return false;
    });

    $('#send-message').submit(function (e) {
        e.preventDefault();
        message('me', $('#message').val());
        socket.emit('user message', $('#message').val());
        clear();
        $('#lines').get(0).scrollTop = 10000000;
    });

    function clear () {
        $('#message').val('').focus();
    };
  
  
  
/*  socket.on('message', function (data) {
    console.log(data);
    var li = $('li');
    li.text(data.name + ': ' + data.text);
    $('.message-box ul').append(li);
  });
  $('.message-box input').keypress(function(e) {
    if (e.which === 13) {
        socket.emit('new message', { text: $(this).val() });
        $(this).val('');
    }*/
      
    
});