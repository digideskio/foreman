/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2011 Joel Martin
 * Licensed under LGPL-3 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */
"use strict";var UI={rfb_state:"loaded",settingsOpen:!1,connSettingsOpen:!1,clipboardOpen:!1,keyboardVisible:!1,load:function(){var e,t,i,n;for(t=WebUtil.selectStylesheet(),i=WebUtil.getStylesheets(),e=0;i.length>e;e+=1)UI.addOption($D("noVNC_stylesheet"),i[e].title,i[e].title);for(n=["error","warn","info","debug"],e=0;n.length>e;e+=1)UI.addOption($D("noVNC_logging"),n[e],n[e]);UI.initSetting("logging","warn"),WebUtil.init_logging(UI.getSetting("logging")),UI.initSetting("stylesheet","default"),WebUtil.selectStylesheet(null),WebUtil.selectStylesheet(UI.getSetting("stylesheet")),UI.initSetting("host",""),UI.initSetting("port",""),UI.initSetting("password",""),UI.initSetting("encrypt","https:"===window.location.protocol),UI.initSetting("true_color",!0),UI.initSetting("cursor",!1),UI.initSetting("shared",!0),UI.initSetting("view_only",!1),UI.initSetting("connectTimeout",2),UI.initSetting("path","websockify"),UI.rfb=RFB({target:$D("noVNC_canvas"),onUpdateState:UI.updateState,onClipboard:UI.clipReceive}),UI.updateVisualState(),"ontouchstart"in document.documentElement?($D("noVNC_mobile_buttons").style.display="inline",UI.setMouseButton(),setTimeout(function(){window.scrollTo(0,1)},100),UI.forceSetting("clip",!0),$D("noVNC_clip").disabled=!0):UI.initSetting("clip",!1),navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/iPad/i),$D("noVNC_host").focus(),UI.setViewClip(),Util.addEvent(window,"resize",UI.setViewClip),Util.addEvent(window,"beforeunload",function(){return"normal"===UI.rfb_state?"You are currently connected.":void 0}),"kanaka.github.com"===location.host?$D("noVNC_description").style.display="block":UI.toggleConnectPanel()},getSetting:function(e){var t,i=$D("noVNC_"+e);return t=WebUtil.readCookie(e),"checkbox"===i.type&&(t=t.toLowerCase()in{0:1,no:1,"false":1}?!1:!0),t},updateSetting:function(e,t){var i,n=$D("noVNC_"+e);if("undefined"!=typeof t&&WebUtil.createCookie(e,t),t=UI.getSetting(e),"checkbox"===n.type)n.checked=t;else if("undefined"!=typeof n.options){for(i=0;n.options.length>i;i+=1)if(n.options[i].value===t){n.selectedIndex=i;break}}else null===t&&(t=""),n.value=t},saveSetting:function(e){var t,i=$D("noVNC_"+e);return t="checkbox"===i.type?i.checked:"undefined"!=typeof i.options?i.options[i.selectedIndex].value:i.value,WebUtil.createCookie(e,t),t},initSetting:function(e,t){var i;return i=WebUtil.getQueryVar(e),null===i&&(i=WebUtil.readCookie(e,t)),UI.updateSetting(e,i),i},forceSetting:function(e,t){return UI.updateSetting(e,t),t},toggleClipboardPanel:function(){$D("noVNC_description").style.display="none",UI.settingsOpen===!0&&(UI.settingsApply(),UI.closeSettingsMenu()),UI.connSettingsOpen===!0&&UI.toggleConnectPanel(),UI.clipboardOpen===!0?($D("noVNC_clipboard").style.display="none",$D("clipboardButton").className="noVNC_status_button",UI.clipboardOpen=!1):($D("noVNC_clipboard").style.display="block",$D("clipboardButton").className="noVNC_status_button_selected",UI.clipboardOpen=!0)},toggleConnectPanel:function(){$D("noVNC_description").style.display="none",UI.settingsOpen===!0&&(UI.settingsApply(),UI.closeSettingsMenu(),$D("connectButton").className="noVNC_status_button"),UI.clipboardOpen===!0&&UI.toggleClipboardPanel(),UI.connSettingsOpen===!0?($D("noVNC_controls").style.display="none",$D("connectButton").className="noVNC_status_button",UI.connSettingsOpen=!1):($D("noVNC_controls").style.display="block",$D("connectButton").className="noVNC_status_button_selected",UI.connSettingsOpen=!0,$D("noVNC_host").focus())},toggleSettingsPanel:function(){$D("noVNC_description").style.display="none",UI.settingsOpen?(UI.settingsApply(),UI.closeSettingsMenu()):(UI.updateSetting("encrypt"),UI.updateSetting("true_color"),UI.rfb.get_display().get_cursor_uri()?UI.updateSetting("cursor"):(UI.updateSetting("cursor",!1),$D("noVNC_cursor").disabled=!0),UI.updateSetting("clip"),UI.updateSetting("shared"),UI.updateSetting("view_only"),UI.updateSetting("connectTimeout"),UI.updateSetting("path"),UI.updateSetting("stylesheet"),UI.updateSetting("logging"),UI.openSettingsMenu())},openSettingsMenu:function(){$D("noVNC_description").style.display="none",UI.clipboardOpen===!0&&UI.toggleClipboardPanel(),UI.connSettingsOpen===!0&&UI.toggleConnectPanel(),$D("noVNC_settings").style.display="block",$D("settingsButton").className="noVNC_status_button_selected",UI.settingsOpen=!0},closeSettingsMenu:function(){$D("noVNC_settings").style.display="none",$D("settingsButton").className="noVNC_status_button",UI.settingsOpen=!1},settingsApply:function(){UI.saveSetting("encrypt"),UI.saveSetting("true_color"),UI.rfb.get_display().get_cursor_uri()&&UI.saveSetting("cursor"),UI.saveSetting("clip"),UI.saveSetting("shared"),UI.saveSetting("view_only"),UI.saveSetting("connectTimeout"),UI.saveSetting("path"),UI.saveSetting("stylesheet"),UI.saveSetting("logging"),WebUtil.selectStylesheet(UI.getSetting("stylesheet")),WebUtil.init_logging(UI.getSetting("logging")),UI.setViewClip(),UI.setViewDrag(UI.rfb.get_viewportDrag())},setPassword:function(){return UI.rfb.sendPassword($D("noVNC_password").value),$D("noVNC_connect_button").value="Connect",$D("noVNC_connect_button").onclick=UI.Connect,UI.toggleConnectPanel(),!1},sendCtrlAltDel:function(){UI.rfb.sendCtrlAltDel()},setMouseButton:function(e){var t,i,n=[0,1,2,4];for("undefined"==typeof e&&(e=-1),UI.rfb&&UI.rfb.get_mouse().set_touchButton(e),t=0;n.length>t;t++)i=$D("noVNC_mouse_button"+n[t]),i.style.display=n[t]===e?"":"none"},updateState:function(e,t,i,n){var s,o,r;switch(UI.rfb_state=t,s=$D("noVNC_status"),o=$D("noVNC_status_bar"),t){case"failed":case"fatal":r="noVNC_status_error";break;case"normal":r="noVNC_status_normal";break;case"disconnected":$D("noVNC_logo").style.display="block";case"loaded":r="noVNC_status_normal";break;case"password":UI.toggleConnectPanel(),$D("noVNC_connect_button").value="Send Password",$D("noVNC_connect_button").onclick=UI.setPassword,$D("noVNC_password").focus(),r="noVNC_status_warn";break;default:r="noVNC_status_warn"}"undefined"!=typeof n&&(s.setAttribute("class",r),o.setAttribute("class",r),s.innerHTML=n),UI.updateVisualState()},updateVisualState:function(){var e="normal"===UI.rfb_state?!0:!1;switch($D("noVNC_encrypt").disabled=e,$D("noVNC_true_color").disabled=e,UI.rfb&&UI.rfb.get_display()&&UI.rfb.get_display().get_cursor_uri()?$D("noVNC_cursor").disabled=e:(UI.updateSetting("cursor",!1),$D("noVNC_cursor").disabled=!0),$D("noVNC_shared").disabled=e,$D("noVNC_view_only").disabled=e,$D("noVNC_connectTimeout").disabled=e,$D("noVNC_path").disabled=e,e?(UI.setViewClip(),UI.setMouseButton(1),$D("clipboardButton").style.display="inline",$D("showKeyboard").style.display="inline",$D("sendCtrlAltDelButton").style.display="inline"):(UI.setMouseButton(),$D("clipboardButton").style.display="none",$D("showKeyboard").style.display="none",$D("sendCtrlAltDelButton").style.display="none"),UI.setViewDrag(!1),UI.rfb_state){case"fatal":case"failed":case"loaded":case"disconnected":$D("connectButton").style.display="",$D("disconnectButton").style.display="none";break;default:$D("connectButton").style.display="none",$D("disconnectButton").style.display=""}},clipReceive:function(e,t){Util.Debug(">> UI.clipReceive: "+t.substr(0,40)+"..."),$D("noVNC_clipboard_text").value=t,Util.Debug("<< UI.clipReceive")},connect:function(){var e,t,i,n;if(UI.closeSettingsMenu(),UI.toggleConnectPanel(),e=$D("noVNC_host").value,t=$D("noVNC_port").value,i=$D("noVNC_password").value,n=$D("noVNC_path").value,!e||!t)throw"Must set host and port";UI.rfb.set_encrypt(UI.getSetting("encrypt")),UI.rfb.set_true_color(UI.getSetting("true_color")),UI.rfb.set_local_cursor(UI.getSetting("cursor")),UI.rfb.set_shared(UI.getSetting("shared")),UI.rfb.set_view_only(UI.getSetting("view_only")),UI.rfb.set_connectTimeout(UI.getSetting("connectTimeout")),UI.rfb.connect(e,t,i,n),setTimeout(UI.setBarPosition,100),$D("noVNC_logo").style.display="none"},disconnect:function(){UI.closeSettingsMenu(),UI.rfb.disconnect(),$D("noVNC_logo").style.display="block",UI.connSettingsOpen=!1,UI.toggleConnectPanel()},displayBlur:function(){UI.rfb.get_keyboard().set_focused(!1),UI.rfb.get_mouse().set_focused(!1)},displayFocus:function(){UI.rfb.get_keyboard().set_focused(!0),UI.rfb.get_mouse().set_focused(!0)},clipClear:function(){$D("noVNC_clipboard_text").value="",UI.rfb.clipboardPasteFrom("")},clipSend:function(){var e=$D("noVNC_clipboard_text").value;Util.Debug(">> UI.clipSend: "+e.substr(0,40)+"..."),UI.rfb.clipboardPasteFrom(e),Util.Debug("<< UI.clipSend")},setViewClip:function(e){var t,i,n,s,o;UI.rfb&&(t=UI.rfb.get_display(),i=t.get_viewport(),"boolean"!=typeof e&&(e=UI.getSetting("clip")),e&&!i?UI.updateSetting("clip",!0):!e&&i&&(UI.updateSetting("clip",!1),t.set_viewport(!1),$D("noVNC_canvas").style.position="static",t.viewportChange()),UI.getSetting("clip")&&($D("noVNC_canvas").style.position="absolute",n=Util.getPosition($D("noVNC_canvas")),s=window.innerWidth-n.x,o=window.innerHeight-n.y,t.set_viewport(!0),t.viewportChange(0,0,s,o)))},setViewDrag:function(e){var t=$D("noVNC_view_drag_button");UI.rfb&&(t.style.display="normal"===UI.rfb_state&&UI.rfb.get_display().get_viewport()?"inline":"none","undefined"==typeof e&&(e=!UI.rfb.get_viewportDrag()),e?(t.className="noVNC_status_button_selected",UI.rfb.set_viewportDrag(!0)):(t.className="noVNC_status_button",UI.rfb.set_viewportDrag(!1)))},showKeyboard:function(){UI.keyboardVisible===!1?($D("keyboardinput").focus(),UI.keyboardVisible=!0,$D("showKeyboard").className="noVNC_status_button_selected"):UI.keyboardVisible===!0&&($D("keyboardinput").blur(),$D("showKeyboard").className="noVNC_status_button",UI.keyboardVisible=!1)},keyInputBlur:function(){$D("showKeyboard").className="noVNC_status_button",setTimeout(function(){UI.setKeyboard()},100)},setKeyboard:function(){UI.keyboardVisible=!1},setOnscroll:function(){window.onscroll=function(){UI.setBarPosition()}},setResize:function(){window.onResize=function(){UI.setBarPosition()}},addOption:function(e,t,i){var n=document.createElement("OPTION");n.text=t,n.value=i,e.options.add(n)},setBarPosition:function(){$D("noVNC-control-bar").style.top=window.pageYOffset+"px",$D("noVNC_mobile_buttons").style.left=window.pageXOffset+"px";var e=$D("noVNC_screen").style.offsetWidth;$D("noVNC-control-bar").style.width=e+"px"}};