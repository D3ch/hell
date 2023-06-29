function fowl(){var X='',eb='" for "gwt:onLoadErrorFn"',cb='" for "gwt:onPropertyErrorFn"',fb='#',rb='.cache.js',hb='/',qb=':',Y='::',L='<html><head><\/head><body><\/body><\/html>',_='=',gb='?',pb='A7D2865EA92B17405E65BA89B782F73B',bb='Bad handler "',Q='DOMContentLoaded',G='DUMMY',mb='base',kb='baseUrl',B='begin',H='body',A='bootstrap',jb='clear.cache.gif',$='content',tb='end',E='fowl',ob='fowl.devmode.js',lb='fowl.nocache.js',W='fowl::',C='gwt.codesvr.fowl=',D='gwt.codesvr=',db='gwt:onLoadErrorFn',ab='gwt:onPropertyErrorFn',Z='gwt:property',T='head',I='iframe',ib='img',N='javascript',J='javascript:""',sb='loadExternalRefs',U='meta',S='moduleRequested',R='moduleStartup',V='name',K='position:absolute; width:0; height:0; border:none; left: -1000px; top: -1000px; !important',M='script',nb='selectingPermutation',F='startup',P='undefined',O='var $wnd = window.parent;';var n=window;var o=document;q(A,B);function p(){var a=n.location.search;return a.indexOf(C)!=-1||a.indexOf(D)!=-1}
function q(a,b){if(n.__gwtStatsEvent){n.__gwtStatsEvent({moduleName:E,sessionId:n.__gwtStatsSessionId,subSystem:F,evtGroup:a,millis:(new Date).getTime(),type:b})}}
fowl.__sendStats=q;fowl.__moduleName=E;fowl.__errFn=null;fowl.__moduleBase=G;fowl.__softPermutationId=0;fowl.__computePropValue=null;var r=function(){return false};var s=function(){return null};__propertyErrorFunction=null;function t(f){var g;function h(){j();return g}
function i(){j();return g.getElementsByTagName(H)[0]}
function j(){if(g){return}var a=o.createElement(I);a.src=J;a.id=E;a.style.cssText=K;a.tabIndex=-1;o.body.appendChild(a);g=a.contentDocument;if(!g){g=a.contentWindow.document}g.open();g.write(L);g.close();var b=g.getElementsByTagName(H)[0];var c=g.createElement(M);c.language=N;var d=O;c.text=d;b.appendChild(c)}
function k(a){function b(){if(typeof o.readyState==P){return typeof o.body!=P&&o.body!=null}return /loaded|complete/.test(o.readyState)}
var c=false;if(b()){c=true;a()}var d;function e(){if(!c){c=true;a();if(o.removeEventListener){o.removeEventListener(Q,e,false)}if(d){clearInterval(d)}}}
if(o.addEventListener){o.addEventListener(Q,function(){e()},false)}var d=setInterval(function(){if(b()){e()}},50)}
function l(a){var b=i();var c=h().createElement(M);c.language=N;c.text=a;b.appendChild(c);b.removeChild(c)}
fowl.onScriptDownloaded=function(a){k(function(){l(a)})};q(R,S);var m=o.createElement(M);m.src=f;o.getElementsByTagName(T)[0].appendChild(m)}
function u(){var c={};var d;var e;var f=o.getElementsByTagName(U);for(var g=0,h=f.length;g<h;++g){var i=f[g],j=i.getAttribute(V),k;if(j){j=j.replace(W,X);if(j.indexOf(Y)>=0){continue}if(j==Z){k=i.getAttribute($);if(k){var l,m=k.indexOf(_);if(m>=0){j=k.substring(0,m);l=k.substring(m+1)}else{j=k;l=X}c[j]=l}}else if(j==ab){k=i.getAttribute($);if(k){try{d=eval(k)}catch(a){alert(bb+k+cb)}}}else if(j==db){k=i.getAttribute($);if(k){try{e=eval(k)}catch(a){alert(bb+k+eb)}}}}}s=function(a){var b=c[a];return b==null?null:b};__propertyErrorFunction=d;fowl.__errFn=e}
function v(){function e(a){var b=a.lastIndexOf(fb);if(b==-1){b=a.length}var c=a.indexOf(gb);if(c==-1){c=a.length}var d=a.lastIndexOf(hb,Math.min(c,b));return d>=0?a.substring(0,d+1):X}
function f(a){if(a.match(/^\w+:\/\//)){}else{var b=o.createElement(ib);b.src=a+jb;a=e(b.src)}return a}
function g(){var a=s(kb);if(a!=null){return a}return X}
function h(){var a=o.getElementsByTagName(M);for(var b=0;b<a.length;++b){if(a[b].src.indexOf(lb)!=-1){return e(a[b].src)}}return X}
function i(){var a=o.getElementsByTagName(mb);if(a.length>0){return a[a.length-1].href}return X}
var j=g();if(j==X){j=h()}if(j==X){j=i()}if(j==X){j=e(o.location.href)}j=f(j);return j}
function w(a){if(a.match(/^\//)){return a}if(a.match(/^[a-zA-Z]+:\/\//)){return a}return fowl.__moduleBase+a}
function x(){var f=[];var g;var h=[];var i=[];function j(a){var b=i[a](),c=h[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(__propertyErrorFunc){__propertyErrorFunc(a,d,b)}throw null}
r=function(a,b){return b in h[a]};fowl.__computePropValue=j;q(A,nb);if(p()){return w(ob)}var k;try{k=pb;var l=k.indexOf(qb);if(l!=-1){g=k.substring(l+1);k=k.substring(0,l)}}catch(a){}fowl.__softPermutationId=g;return w(k+rb)}
function y(){if(!n.__gwt_stylesLoaded){n.__gwt_stylesLoaded={}}q(sb,B);q(sb,tb)}
u();fowl.__moduleBase=v();var z=x();y();q(A,tb);t(z)}
fowl();