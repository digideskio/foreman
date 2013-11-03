//= require jquery
//= require i18n
//= require jquery_ujs
//= require jquery.ui.autocomplete
//= require scoped_search
//= require twitter/bootstrap
//= require charts
//= require topbar
//= require vendor
//= require about

$(function() {
  onContentLoad();
});

function onContentLoad(){
  $('.autocomplete-input').scopedSearch();

  $('.flash.error').each(function(index, item) {
     if ($('.alert-message.alert-error.base').length == 0) {
       if ($('#host-conflicts-modal').length == 0) {
         notify(item, 'error');
       }
     }
   });

   $('.flash.warning').each(function(index, item) {
     notify(item, 'warning');
   });

   $('.flash.notice').each(function(index, item) {
     notify(item, 'success');
   });

  // adds buttons classes to all links
  $("#title_action a").addClass("btn");
  $("#title_action li a").removeClass("btn").addClass("la");
  $("#title_action span").removeClass("btn").addClass("btn-group");
  $("#title_action a[href*='new']").addClass("btn-success");

  if ($("#login-form").size() > 0) {
    $("#login_login").focus();
    return false;
  }

  // highlight tabs with errors
  $(".tab-content").find(".control-group.error").each(function() {
    var id = $(this).parentsUntil(".tab-content").last().attr("id");
    $("a[href=#"+id+"]").addClass("tab-error");
  })

  //set the tooltips
  $('a[rel="popover"]').popover({html: true});
  $('[rel="twipsy"]').tooltip();
  $('*[title]').not('*[rel]').tooltip();
  $('[data-table=inline]').not('.dataTable').dataTable(
      {
        "sDom": "<'row'<'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap"
      }
  );

  // Prevents all links with the disabled attribute set to "disabled"
  // from being clicked.
  $('a[disabled="disabled"]').click(function() {
    return false;
  });

  multiSelectOnLoad();
}

function remove_fields(link) {
  $(link).prev("input[type=hidden]").val("1");
  $(link).closest(".fields").hide();
  mark_params_override();
}

function mark_params_override(){
  $('#inherited_parameters .override-param').removeClass('override-param');
  $('#inherited_parameters span').show();
  $('#parameters').find('[id$=_name]:visible').each(function(){
    var param_name = $(this);
    $('#inherited_parameters').find('[id^=name_]').each(function(){
      if (param_name.val() == $(this).text()){
        $(this).addClass('override-param');
        $(this).closest('tr').find('textarea').addClass('override-param')
        $(this).closest('tr').find('[data-tag=override]').hide();
      }
    })
  })
  $('#inherited_puppetclasses_parameters .override-param').removeClass('override-param');
  $('#inherited_puppetclasses_parameters [data-tag=override]').show();
  $('#puppetclasses_parameters').find('[data-property=class]:visible').each(function(){
    var klass = $(this).val();
    var name = $(this).siblings('[data-property=name]').val();
    $('#inherited_puppetclasses_parameters [id^="puppetclass_"][id*="_params\\["][id$="\\]"]').each(function(){
      var param = $(this);
      if (param.find('[data-property=class]').text() == klass && param.find('[data-property=name]').text() == name) {
        param.find('.error').removeClass('error');
        param.find('.warning').removeClass('warning');
        param.addClass('override-param');
        param.find('input, textarea').addClass('override-param');
        param.find('[data-tag=override]').hide();
      }
    });
  });
  $('#params-tab').removeClass("tab-error");
  if ($("#params").find('.control-group.error').length > 0) $('#params-tab').addClass('tab-error');
  $('a[rel="popover"]').popover({html: true});
}

function add_fields(link, association, content) {
  var new_id = new Date().getTime();
  var regexp = new RegExp("new_" + association, "g");
  $(link).before(content.replace(regexp, new_id));
}

$(document).ready(function() {
  $("#check_all_roles").click(function(e) {
      e.preventDefault();
      $(".role_checkbox").prop('checked', true);

  });

  $("#uncheck_all_roles").click(function(e) {
      e.preventDefault();
      $(".role_checkbox").prop('checked', false);
  });
});


function toggleCheckboxesBySelector(selector) {
  boxes = $(selector);
  var all_checked = true;
  for (i = 0; i < boxes.length; i++) { if (!boxes[i].checked) { all_checked = false; } }
  for (i = 0; i < boxes.length; i++) { boxes[i].checked = !all_checked; }
}

function toggleRowGroup(el) {
  var tr = $(el).closest('tr');
  var n = tr.next();
  tr.toggleClass('open');
  while (n.length > 0 && !n.hasClass('group')) {
    n.toggle();
    n = n.next();
  }
}

// allow opening new window for selected links
$(function() {
  $('a[rel="external"]').click( function() {
    window.open( $(this).attr('href') );
    return false;
  });
});

function template_info(div, url) {
  os_id = $("#host_operatingsystem_id :selected").attr("value");
  env_id = $("#host_environment_id :selected").attr("value");
  hostgroup_id = $("#host_hostgroup_id :selected").attr("value");
  build = $('input:radio[name$="[provision_method]"]:checked').val();

  $(div).html(spinner_placeholder());
  $(div).load(url + "?operatingsystem_id=" + os_id + "&hostgroup_id=" + hostgroup_id + "&environment_id=" + env_id+"&provisioning="+build,
              function(response, status, xhr) {
                if (status == "error") {
                  $(div).html("<div class='alert alert-warning'><a class='close' data-dismiss='alert'>&times;</a><p>" + _('Sorry but no templates were configured.') + "</p></div>");
                }
              });
}

$(document).ready(function() {
  var common_settings = {
    method      : 'PUT',
    indicator   : spinner_placeholder(),
    tooltip     : _('Click to edit..'),
    placeholder : _('Click to edit..'),
    submitdata  : {authenticity_token: AUTH_TOKEN, format : "json"},
    onedit      : function(data) { $(this).removeClass("editable"); },
    callback    : function(value, settings) { $(this).addClass("editable"); },
    onsuccess   :  function(data) {
      var parsed = $.parseJSON(data);
      var key = $(this).attr('name').split("[")[0];
      var val = $(this).attr('data-field');

      var editable_value = parsed[key][val];
      if ($.isArray(editable_value))
        editable_value = "[ "+editable_value.join(", ")+" ]";
      else
        editable_value = String(editable_value);

      $(this).html(editable_value);
    },
    onerror     : function(settings, original, xhr) {
      original.reset();
      var error = $.parseJSON(xhr.responseText)["errors"];
      $.jnotify(error, { type: "error", sticky: true });
    }
  };

  $('.edit_textfield').each(function() {
    var settings = {
      type : 'text',
      name : $(this).attr('name'),
      width: '95%'
    };
    $(this).editable($(this).attr('data-url'), $.extend(common_settings, settings));
  });

  $('.edit_textarea').each(function() {
    var settings = {
      type : 'textarea',
      name : $(this).attr('name'),
      rows : 8,
      cols : 36
    };
    $(this).editable($(this).attr('data-url'), $.extend(common_settings, settings));
  });

  $('.edit_select').each(function() {
    var settings = {
      type : 'select',
      name : $(this).attr('name'),
      data : $(this).attr('select_values'),
      submit : 'Save'
    };
    $(this).editable($(this).attr('data-url'), $.extend(common_settings, settings));
  });
});

//add bookmark dialog
$(function() {
  $('#bookmarks-modal .modal-footer .btn-primary').on('click', function(){
     $('#bookmarks-modal .modal-body .btn-primary').click();
  });
  $("#bookmarks-modal").bind('shown', function () {
    var query = encodeURI($("#search").val());
    var url = $("#bookmark").attr('data-url');
    $("#bookmarks-modal .modal-body").empty();
    $("#bookmarks-modal .modal-body").append("<span id='loading'>" + _('Loading ...') + "</span>");
    $("#bookmarks-modal .modal-body").load(url + '&query=' + query + ' form',
                                           function(response, status, xhr) {
                                             $("#loading").hide();
                                             $("#bookmarks-modal .modal-body .btn").hide()
                                           });
  });

});

function filter_by_level(item){
  var level = $(item).val();

  if(level == 'notice'){
    $('.label-info').closest('tr').show();
    $('.label-default').closest('tr').show();
    $('.label-warning').closest('tr').show();
    $('.label-important').closest('tr').show();
  }
  if(level == 'warning'){
    $('.label-info').closest('tr').hide();
    $('.label-default').closest('tr').hide();
    $('.label-warning').closest('tr').show();
    $('.label-important').closest('tr').show();
  }
  if(level == 'error'){
    $('.label-info').closest('tr').hide();
    $('.label-default').closest('tr').hide();
    $('.label-warning').closest('tr').hide();
    $('.label-important').closest('tr').show();
  }
  if($("#report_log tr:visible ").size() ==1 || $("#report_log tr:visible ").size() ==2 && $('#ntsh:visible').size() > 0 ){
    $('#ntsh').show();
  }
  else{
    $('#ntsh').hide();
  }
}

function auth_source_selected(){
  var auth_source_id = $('#user_auth_source_id').val();
  if (auth_source_id == '') {
     $("#password").hide();
  } else {
     $("#password").show();
  }
}

function show_release(element){
  var os_family = $(element).val();
  if (os_family == 'Debian' || os_family == 'Solaris') {
    $("#release_name").show();
  } else {
    $("#release_name").hide();
  }
}
// return a hash with values of all attributes
function attribute_hash(attributes){
  var attrs = {};
  for (i=0;i < attributes.length; i++) {
    var attr = $('*[id$='+attributes[i]+']');
    if (attr.size() > 0) {
      if(attr.attr("type")=="checkbox"){
        attrs[attributes[i]] = [];
        $("*[id*="+attributes[i]+"]:checked").each(function(index,item){
          attrs[attributes[i]].push($(item).val());
        })
      }else{
        if (attr.val() != null) attrs[attributes[i]] = attr.val();
      }
    }
  }
  return attrs;
}

function ignore_subnet(item){
 $(item).tooltip('hide');
 $(item).closest('.accordion-group').remove();
}

function show_rdoc(item){
  var url = $(item).attr('data-url');
  window.open(url);
}

// shows provisioning templates in a new window
$(function() {
  $('[data-provisioning-template=true]').click(function(){
    window.open(this.href, [width='300',height='400',scrollbars='yes']);
    return false;
  });
});

function update_puppetclasses(element) {
  var host_id = $("form").data('id')
  var env_id = $('*[id*=environment_id]').val();
  var url = $(element).attr('data-url');
  var data = $("form").serialize().replace('method=put', 'method=post');
  data = data + '&host_id=' + host_id
  if (env_id == "") return;
  $.ajax({
    type: 'post',
    url:  url,
    data: data,
    success: function(request) {
      $('#puppet_klasses').html(request);
      reload_puppetclass_params();
      $('[rel="twipsy"]').tooltip();
    },
    complete: function() {
      $('#hostgroup_indicator').hide();
    }
  })
}

// generates an absolute, needed in case of running Foreman from a subpath
function foreman_url(path) {
  return URL_PREFIX + path;
}

$(function() {
  $('*[data-ajax-url]').each(function() {
    var url = $(this).attr('data-ajax-url');
    $(this).load(url, function(response, status, xhr) {
      if (status == "error") {
        $(this).closest(".tab-content").find("#spinner").html(_('Failed to fetch: ') + xhr.status + " " + xhr.statusText);
      }
    });
  });
});

$.fn.indicator_show = function(){
  $(this).parent().find('img').show();
}

$.fn.indicator_hide = function(){
  $(this).parent().find('img').hide();
}

function spinner_placeholder(text){
  if (text == undefined) text = "";
  return "<div class='spinner-placeholder'>" + text + "</div>"
}

function notify(item, type) {
  var options = { type: type, sticky: (type != 'success') };
  $.jnotify($(item).text(), options);
  $(item).remove();
}
