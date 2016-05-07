'use strict';

/* App Module */

var LoginApp = angular.module("NCLoginApp", ['NCAnimations', 'NCLoginControllers']);

$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});
