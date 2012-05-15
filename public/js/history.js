$(function() {
  var rootUrl =
    History.getRootUrl(),
    $container = $('div.main'),
    $body = $(document.body),
    $menu = $('ul.nav.nav-list'),
    $title = $('title');
  
  function startLoading() {
      $body.addClass('loading');
      $container.animate({ opacity: 0 }, 500);
    }
    
    function finishLoading() {
      $body.removeClass('loading');
      $(document).scrollTop();
    }
    
    function processData(data) {
      $container.stop(true, true);
      //document.title = data.title;
      $container.html(data).ajaxify().css({ opacity: 0 }).animate({ opacity: 100 }, 2500);
      $body.removeClass('loading');
    }
  
  // Ajaxify helper
  $.fn.ajaxify = function() {
    var $this = $(this);

    // Ajaxify
    $this.find('a').click(function(event) {
      // Continue as normal for cmd clicks etc
      if(event.which == 2 || event.metaKey) {
        return true;
      }
      var $this = $(this), url = $this.attr('href'), title = $this.attr('title') || null;
      // Ajaxify this link
      History.pushState(null, title, url);
      event.preventDefault();
    });
    
    
    
    $form = $this.find('form');
    $form.ajaxForm({
      //url: $form.attr('action') + '?ajax=1',
      //dataType: 'json',
      beforeSubmit: function() {
        startLoading();
      },
      success: function(data, textStatus, jqXHR) {
        if (data.url) {
          if (data.hard)
            document.location.href = data.url;
          else
            History.pushState(null, null, data.url);
        } else {
          processData(data);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        showMessage('Something terrible happened.')
      },
      complete: function(jqXHR, textStatus) {
        finishLoading();
      }
    });
    // Chain
    return $this;
  };

  $container.ajaxify();

  $(window).bind('statechange', function() {
    var State = History.getState(), url = State.url, relativeUrl = '/' + url.replace(rootUrl, '');

    startLoading();
    $menu.find('li.active').removeClass('active');
    $menu.find('a[href="' + relativeUrl + '"]').parent().addClass('active');
    //$content.fadeOut(500);
    $.ajax(url + '?ajax=1')
      .done(function(data) {
        processData(data);
        finishLoading();
      })
      .fail(function() {
        document.location.href = url;
      });
  });
  
  var $mcontainer = $('aside.msgContainer ul'); 
  crateMessageBoxes($mcontainer)
  
});

function crateMessageBoxes($container) {
	$container.find('li:not(.temp)').append('<button>Close</button>')
	.hide().fadeIn(500)
	.find('button').click(function(e) {
		$(this).parent().fadeOut(500, function() {
			$(this).remove();
		});
		e.preventDefault();
	});
	$container.find('li:not(.temp)').addClass('temp');
}
function showMessage(msg) {
	var $container = $('aside.msgContainer ul'); 
	$container.append('<li>' + msg + '</li>')
	crateMessageBoxes($container)
}



