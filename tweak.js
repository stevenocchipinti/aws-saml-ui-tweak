var KEY_ARROW_UP = 38;
var KEY_ARROW_DOWN = 40;
var KEY_ENTER = 13;

var container = $('fieldset');
$.each($(container).children('.saml-account'), function(i, line) {
  var accountDetails    = $(line).find('.saml-account-name').html().split(" ");
  var accountName       = accountDetails[1];
  var accountNumber     = accountDetails[2];
  var roles             = $(line).find('.saml-role');

  $(line).remove();

  $.each(roles, function(i, role) {
    var radioButton     = $(role).find('input');
    var label           = $(role).find('label');
    var roleName        = $(label).html();

    label.html(
      '<span class="role-name">' + roleName + '</span>&nbsp;' +
      '<span class="account-name" title="' + accountName + '">' +
        accountNumber +
      '</span>'
    );

    container.append(
      $('<div class="line-item"></div>')
        .append(radioButton)
        .append(label)
    );
  });
});


//
// Add a filter box
// ----------------

var searchBox = $('<input type="text" placeholder="Enter role or account" autofocus/>');
searchBox.css({margin: '20px 0px 20px 25px', padding: '5px;'});
searchBox.on('input', filterInput);
searchBox.on('keydown', jumpToFirstRadio);

var firstRadioButton = getFirstRadioButton($('.line-item'));
bindEventsTo(firstRadioButton);

$('form').on('keydown', 'input[type=radio]', submitOnEnter);

$('form > p').replaceWith(searchBox);

function filterInput () {
  var filterRegExp = new RegExp($(this).val().split("").join(".*"), "i");
  var filteredResults = $('.line-item').hide().filter(function() {
    return $(this).find('label').map(function() {
      var role = $(this).find("span.role-name").html();
      var account = $(this).find("span.account-name").html();
      return role + account;
    })[0].match(filterRegExp);
  }).show();

  filteredResults.find('input[type=radio]').prop('checked', filteredResults.length == 1)
  firstRadioButton = getFirstRadioButton(filteredResults);
  bindEventsTo(firstRadioButton);
}

function getFirstRadioButton (els) {
  return els.first().find('input[type=radio]');
}

function bindEventsTo (el) {
  $('.line-item input[type=radio]').off(jumpToTextField);
  el.on('keydown', jumpToTextField);
}

function jumpToTextField (event) {
  if (event.which === KEY_ARROW_UP && searchBox.length > 0) {
    searchBox[0].select();
    return false;
  }
}

function jumpToFirstRadio (event) {
  if (event.which === KEY_ARROW_DOWN) {
    firstRadioButton.focus().prop('checked', true);
    return false;
  }
}

function submitOnEnter (event) {
  if (event.which === KEY_ENTER) {
    $(event.target).closest('form').submit();
  }
}

