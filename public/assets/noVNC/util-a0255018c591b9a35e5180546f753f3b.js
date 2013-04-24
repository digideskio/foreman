/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2011 Joel Martin
 * Licensed under LGPL-3 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */
"use strict";var Util={};Array.prototype.push8=function(e){this.push(255&e)},Array.prototype.push16=function(e){this.push(255&e>>8,255&e)},Array.prototype.push32=function(e){this.push(255&e>>24,255&e>>16,255&e>>8,255&e)},Array.prototype.map||(Array.prototype.map=function(e){var t=this.length;if("function"!=typeof e)throw new TypeError;for(var i=new Array(t),n=arguments[1],s=0;t>s;s++)s in this&&(i[s]=e.call(n,this[s],s,this));return i}),Util._log_level="warn",Util.init_logging=function(e){switch("undefined"==typeof e?e=Util._log_level:Util._log_level=e,"undefined"==typeof window.console&&(window.console="undefined"!=typeof window.opera?{log:window.opera.postError,warn:window.opera.postError,error:window.opera.postError}:{log:function(){},warn:function(){},error:function(){}}),Util.Debug=Util.Info=Util.Warn=Util.Error=function(){},e){case"debug":Util.Debug=function(e){console.log(e)};case"info":Util.Info=function(e){console.log(e)};case"warn":Util.Warn=function(e){console.warn(e)};case"error":Util.Error=function(e){console.error(e)};case"none":break;default:throw"invalid logging type '"+e+"'"}},Util.get_logging=function(){return Util._log_level},Util.init_logging(),Util.conf_default=function(e,t,i,n,s,o,r,a){var l,c;l=function(t){return o in{arr:1,array:1}&&"undefined"!=typeof t?e[n][t]:e[n]},c=function(t,i){o in{"boolean":1,bool:1}?t=!t||t in{0:1,no:1,"false":1}?!1:!0:o in{integer:1,"int":1}?t=parseInt(t,10):"func"===o&&(t||(t=function(){})),"undefined"!=typeof i?e[n][i]=t:e[n]=t},t[n+"_description"]=a,"undefined"==typeof t["get_"+n]&&(t["get_"+n]=l),"undefined"==typeof t["set_"+n]&&(t["set_"+n]=function(t,i){if(s in{RO:1,ro:1})throw n+" is read-only";if(s in{WO:1,wo:1}&&"undefined"!=typeof e[n])throw n+" can only be set once";c(t,i)}),"undefined"!=typeof i[n]?r=i[n]:o in{arr:1,array:1}&&!(r instanceof Array)&&(r=[]),c(r)},Util.conf_defaults=function(e,t,i,n){var s;for(s=0;n.length>s;s++)Util.conf_default(e,t,i,n[s][0],n[s][1],n[s][2],n[s][3],n[s][4])},Util.getPosition=function(e){var t=0,i=0;if(e.offsetParent)do t+=e.offsetLeft,i+=e.offsetTop,e=e.offsetParent;while(e);return{x:t,y:i}},Util.getEventPosition=function(e,t,i){var n,s,o,r;return n=e?e:window.event,n=n.changedTouches?n.changedTouches[0]:n.touches?n.touches[0]:n,n.pageX||n.pageY?(s=n.pageX,o=n.pageY):(n.clientX||n.clientY)&&(s=n.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,o=n.clientY+document.body.scrollTop+document.documentElement.scrollTop),r=Util.getPosition(t),"undefined"==typeof i&&(i=1),{x:(s-r.x)/i,y:(o-r.y)/i}},Util.addEvent=function(e,t,i){if(e.attachEvent){var n=e.attachEvent("on"+t,i);return n}if(e.addEventListener)return e.addEventListener(t,i,!1),!0;throw"Handler could not be attached"},Util.removeEvent=function(e,t,i){if(e.detachEvent){var n=e.detachEvent("on"+t,i);return n}if(e.removeEventListener)return e.removeEventListener(t,i,!1),!0;throw"Handler could not be removed"},Util.stopEvent=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,e.preventDefault?e.preventDefault():e.returnValue=!1},Util.Features={xpath:!!document.evaluate,air:!!window.runtime,query:!!document.querySelector},Util.Engine={presto:function(){return window.opera?!0:!1}(),trident:function(){return window.ActiveXObject?window.XMLHttpRequest?document.querySelectorAll?6:5:4:!1}(),webkit:function(){try{return navigator.taintEnabled?!1:Util.Features.xpath?Util.Features.query?525:420:419}catch(e){return!1}}(),gecko:function(){return document.getBoxObjectFor||null!=window.mozInnerScreenX?document.getElementsByClassName?19:18:!1}()},Util.Engine.webkit&&(Util.Engine.webkit=function(e){var t=new RegExp("WebKit/([0-9.]*) ");return e=(navigator.userAgent.match(t)||["",e])[1],parseFloat(e,10)}(Util.Engine.webkit)),Util.Flash=function(){var e,t;try{e=navigator.plugins["Shockwave Flash"].description}catch(i){try{e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(n){e="0 r0"}}return t=e.match(/\d+/g),{version:parseInt(t[0]||"0."+t[1],10)||0,build:parseInt(t[2],10)||0}}();