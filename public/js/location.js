$(function() {
  function success(position) {
    var s = $('#status');
    
    if (s.hasClass('btn-success')) {
      // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back    
      return;
    }
    
    $('.status-bar').html('Status: ');
    $('#mapcanvas').remove();
    var s = $('<button id="status" class="btn btn-large btn-success">');
    s.html("Success");
    $('.status-bar').append(s);
    
    var mapcanvas = $('<div id="mapcanvas" class="span6"/>')
    .css({
      height: '400px'//,
    //  width: '560px'
    });
      
    $('.location').append(mapcanvas);
    
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeControl: false,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapcanvas[0], myOptions);
    
    var marker = new google.maps.Marker({
        position: latlng, 
        map: map, 
        title:"You are here! (at least within a " + position.coords.accuracy + " meter radius)"
    });
  }

  function error(msg) {
    $('.status-bar').html('Status: ');
    $('#mapcanvas').remove();
    var s = $('<button id="status" class="btn btn-large btn-danger">');
    s.html(typeof msg == 'string' ? msg : "Failed");
    $('.status-bar').append(s);
  }
  
  $("#refresh").click(function() {  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      error('Not supported');
    }
  });
});

