$(function() {
  $('#text').keyup(function(e) {
    var text = $(this).val();
    localStorage.setItem('text', text);
    localStorage.setItem('timestamp', (new Date()).getTime());
  });
  
  $('#recover').click(function() {
    $('#text').val(localStorage.getItem('text'));
    $('#unsavedWarning').modal('hide');
  });
  
  $('.save').click(function(e) {
    e.preventDefault();
    localStorage.removeItem('text');
    localStorage.removeItem('timestamp');
  });
  
  var oldText = localStorage.getItem('text');
  if (oldText) {
    var delta = ((new Date()).getTime() - (new Date()).setTime(localStorage.getItem('timestamp'))) / 1000;
    $('#date').text(delta);
    $('#unsavedWarning').modal('show');
  }
});

