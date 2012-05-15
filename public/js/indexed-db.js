$(function() {
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
  var DAO = {};
  
  var customers = [{
      id: 1,
      name: 'Adam',
      email: 'asdf@gmail.com',
      birthDate: '12/12/2001',
      orderedItems: [1, 2, 8]
    }, {
      id: 2,
      name: 'Frank',
      email: 'sdfdf@gmail.com',
      birthDate: '4/8/2002',
      orderedItems: [2, 3, 4]
    }, {
      id: 3,
      name: 'Lisa',
      email: 'assdf@gmail.com',
      birthDate: '10/2/1999',
      orderedItems: [1]
    }
  ];
  var items = [{
    id: 1,
    name: 'iPhone 4S'
  }, {
    id: 2,
    name: 'Galaxy S2'
  }, {
    id: 3,
    name: 'Lumia'
  }, {
    id: 4,
    name: 'Choco'
  }, {
    id: 8,
    name: 'Desire'
  }, 
  ];
  
  $('#details').hide();
  
  var timeout = null;
  $('#searchname').keyup(function() {
    clearTimeout(timeout);
    $('#details').hide();
    var $this = $(this);
    if ($this.val()) {
      timeout = setTimeout(function() {
        filterByName($this.val());
      }, 1000);
    } else {
      $customers.html('');
    }
  });
  
  $('#searchname').focus();
  
  function filterByName(name) {
    var selected = customers.filter(function(c) {
      return c.name.indexOf(name) !== -1;
    });
    
    var $customers = $('#customers');
    $customers.html('');
    
    selected.forEach(function(c) {
      var tr = $('<tr></tr>');
      tr.data('id', c.id);
      tr.append($('<td></td>').text(c.id));
      tr.append($('<td></td>').text(c.name));
      tr.append($('<td></td>').text(c.orderedItems.length));
      $customers.append(tr);
    });
    
    $('#customers').on('click', 'tr', function() {
      var id = $(this).data('id');
      var customer = customers.filter(function(c) {
        return c.id == id;
      })[0];
      $('#details').show();
      var $dl = $('#details>dl');
      $dl.html('');
      $dl.append($('<dt></dt>').text('Id:'));
      $dl.append($('<dd></dd>').text(id));
      
      $dl.append($('<dt></dt>').text('Name:'));
      $dl.append($('<dd></dd>').text(customer.name));
      
      $dl.append($('<dt></dt>').text('e-mail:'));
      $dl.append($('<dd></dd>').text(customer.email));
      
      $dl.append($('<dt></dt>').text('Birth date:'));
      $dl.append($('<dd></dd>').text(customer.birthDate));
    });
    
  }
  
  $('#addCustomer').on('hidden', function() {
    $(this).find('form')[0].reset();
    $('#searchname').focus();
  });
  
  $('#addCustomer').on('shown', function() {
    $(this).find('[name="name"]').focus();
  });
  
  $('#add').click(function() {
    $('#addCustomer').modal('show');
  });
  $('#save').click(function() {
    var $form = $('#addCustomer form');
    var customer = {
      id: Math.floor(Math.random() * 10000),
      name: $form.find('[name="name"]').val(),
      email: $form.find('[name="email"]').val(),
      birthDate: $form.find('[name="birthDate"]').val(),
      orderedItems: []
    };
    
    
    customers.push(customer);
    $('#addCustomer').modal('hide');
  });
  
  
});