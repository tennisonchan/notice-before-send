var App = function() {
  var _this = {};
  var _internal = 'alphasights';
  var _status = null;
  var _timeout = null;
  var _id_list = [];
  var _g = {
    'recipientWrapActive':'.wO.nr.l1',
    'recipientWrap':'.wO.nr',
    'recipientInput':'textarea.vO',
    'lightboxWrap':'.ah.aiv.aJS',
    'lightboxWrapClass':'ah aiv aJS',
    'contactHighlighted': '.Jd-Je.Je',
    'contactHighlightedClass': 'Jd-Je Je',
    'contact':'.Jd-axF',
    'contactLowerText':'.Sr',
    'contactUpperText':'.am',
    // message page
    'replyActive':'.gA.gt',
    'noReply':'.gA.gt.acV',
    'replyBox': '.fX.aXjCH', // under .gA.gt // check display for activation
    'wrapContact': '.vR', // the contact block when user confirm emails
    'replyBoxPresented':'.oL.aDm.az9',
    // popup page
    'popupNewMessage':'.AD',
    'popupMessageRightTopMinimizeButton': '.Hl', // check data-tooltip = Minimize || Maximize (oposite to status)
    'popupNewMessageMaximized':'', // check display for activation
    'popupReplyBox':'.fX.aXjCH', // under .AD // check display for activation
    'presentReplyBox': '.aoD.hl' // oposite to .fX.aXjCH, check display for activation
  }

  function init () {
    console.log('app.init');

    setInterval(function(){
      console.log('setTimeout');
      setupListener();
    }, 5*1000);

    window.onhashchange = onHashChange;

    // detect the blur of the textbox
    // setTimeout(function(){
    //   $(_g.recipientWrap).focusout(onBlurTextbox);
    //   $(_g.recipientWrap)[0].addEventListener('DOMNodeInserted', onBlurTextbox, false);
    //   $('.aoI').append(
    //      $('<div/>', {
    //         id: 'noticebox',
    //         class: 'alert alert-danger'
    //       })
    //       .hide()
    //   );
    // }, 10*1000);
  }

  function onHashChange () {
      console.log('hashchange');
      setupListener();
  }

  function setupListener () {
    console.log('setupListener');

    if($('.aoI').find('.noticebox').length === 0){
      $('.aoI').append(
        $('<div/>', {
          id: 'noticebox',
          class: 'noticebox alert alert-danger'
        })
        .hide()
      );
    }


    checkStatus();
    if(_status.msgPage.isReply && !_status.msgPage.isReplyBoxActive ||
       _status.popup.isMaximized
      ){

      checkRecipients(false)
    }
    if(_status.popup.isReplyBoxActive ||
       _status.msgPage.isReplyBoxActive
       ){
      checkRecipients(true);
    }

    // $('.amr').off().on('click', function(e){
    //   console.log('msgPage.isnoReply:click');
    //   setTimeout(function(){
    //     setupListener();
    //   }, 1*1000);
    // });

    // $('.Iy').off().on('click', function(e){
    //   console.log('msgPage.isReply.upperbox:click');
    //   setTimeout(function(){
    //     setupListener();
    //   }, 1*1000);
    // })

    // $(_g.recipientInput).off().on({
    //   focus: function(){
    //     console.log('msgPage.recipientInput:focus');
    //     setTimeout(function(){
    //       setupListener();
    //     }, 2*1000);
    //   },
    //   focusout: function(){
    //     console.log('msgPage.recipientInput:focusout');
    //     setTimeout(function(){
    //       setupListener();
    //     }, 2*1000);
    //   }
    // })

  }

  function checkRecipients(isActive) {
    console.log('onBlurTextbox');
    var $wrap, $els, $el, email, isExtenal, extenalEmails;
    isExtenal = false;
    extenalEmails = [];

    if(isActive){
      $wrap = $(_g.recipientWrapActive);
      $els = $wrap.find('[email]');
    } else {
      $wrap = $(_g.replyBoxPresented);
      $els = $wrap.find('[email]');
    }

    if(!$els.length) hideAlert();;

    $els.each(function(i, el){
      $el = $(el);
      email = $el.attr('email');
      if(email.indexOf(_internal) === -1){
        extenalEmails.push(email);
        isExtenal = true;
      }
    });

    if(isExtenal){
      popupAlert({
        email: extenalEmails.join(', ')
      });
    } else {
      hideAlert();
    }
  }

  function checkStatus() {
    // inbox page: https://mail.google.com/mail/u/0/#inbox
    // message page: https://mail.google.com/mail/u/0/#inbox/14aea826eba93d4e
    // popup message: https://mail.google.com/mail/u/0/#inbox/14aea826eba93d4e?compose=new
    // drafts page: https://mail.google.com/mail/u/0/#drafts?compose=14af2e2e6fe7deae

    var hash = window.location.hash;
    var hash_arr = hash.split(/#([^?/]+)?\/?([^/?]+)?\??([^&]+)?/);

    page = hash_arr[1]; // #inbox
    messageID = hash_arr[2] || ''; // 14aea826eba93d4e
    popupStatus = hash_arr[3] || ''; // compose=new
    popupStatus_arr = popupStatus.split('=')
    isPopupMessage = (popupStatus_arr[0] === 'compose');
    popupMessageID = popupStatus_arr[1] || '';

    var msgPage = {};
    msgPage.isActive = !!messageID || false;
    msgPage.id = messageID || '';
    msgPage.isReply = (msgPage.isActive && !$(_g.noReply).length || false);
    msgPage.isReplyBoxActive = msgPage.isReply && !!$(_g.replyBox).length && ($(_g.replyBox).css('display') !== "none") || false;

    var popup = {}
    popup.id = popupMessageID || ''
    popup.isActive = (popupStatus && isPopupMessage) || false
    popup.isMaximized = ($(_g.popupMessageRightTopMinimizeButton).data('tooltip') === "Minimize") || false
    popup.isReplyBoxActive = popup.isMaximized && ($(_g.popupNewMessage).find(_g.replyBox).css('display') !== "none") || false

    _status = {
      hash_arr: hash_arr,
      page: page,
      messageID: messageID,
      popupStatus: popupStatus,
      isPopupMessage: isPopupMessage,
      msgPage: msgPage,
      popup: popup
    };

    console.log('status:', _status);
  }

  function popupAlert(data) {
    $('#noticebox').show().text('Do you really want to include '+data.email+' ?');
  }

  function hideAlert() {
    $('#noticebox').hide();
  }

  init();

  return _this;
};

$(document).ready(function(){
  window.noticeBeforeSend = new App();
});