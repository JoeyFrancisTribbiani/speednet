(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-ucenter-login-page-register-phone-number"],{2804:function(e,n,t){"use strict";t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return o})),t.d(n,"a",(function(){return i}));var i={uniAgreements:t("e749").default,uniQuickLogin:t("7d8c").default},a=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("v-uni-view",{staticClass:"content"},[t("v-uni-text",{staticClass:"title"},[e._v("温馨提示：一个手机号可以注册多个账号")]),["apple","weixin"].includes(e.type)?t("v-uni-view",{staticClass:"quickLogin"},[t("v-uni-image",{staticClass:"quickLoginBtn",attrs:{src:e.imgSrc,mode:"widthFix"},on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.quickLogin.apply(void 0,arguments)}}}),t("uni-agreements",{on:{setAgree:function(n){arguments[0]=n=e.$handleEvent(n),e.agree=n}}})],1):[t("v-uni-input",{staticClass:"input-box",attrs:{type:"number",inputBorder:!1,maxlength:"11",placeholder:e.$t("common.phonePlaceholder")},model:{value:e.phone,callback:function(n){e.phone=n},expression:"phone"}}),t("uni-agreements",{on:{setAgree:function(n){arguments[0]=n=e.$handleEvent(n),e.agree=n}}}),t("v-uni-button",{staticClass:"get-code",attrs:{disabled:!e.isPhone,type:e.isPhone?"primary":"default"},on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.sendShortMsg.apply(void 0,arguments)}}},[e._v(e._s(e.$t("login.getVerifyCode")))]),t("v-uni-text",{staticClass:"tip"},[e._v(e._s(e.$t("login.phoneLoginTip")))])],t("uni-quick-login",{ref:"uniQuickLogin",attrs:{agree:e.agree}})],2)},o=[]},"286e":function(e,n,t){"use strict";t.r(n);var i=t("2804"),a=t("a26a");for(var o in a)"default"!==o&&function(e){t.d(n,e,(function(){return a[e]}))}(o);t("32a6");var r,c=t("f0c5"),u=Object(c["a"])(a["default"],i["b"],i["c"],!1,null,"cd77ea50",null,!1,i["a"],r);n["default"]=u.exports},"2f68":function(e,n,t){var i=t("24fb");n=i(!1),n.push([e.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-view[data-v-a2244e3e]{display:flex;box-sizing:border-box;flex-direction:column}.root[data-v-a2244e3e]{flex-direction:row;align-items:center;font-size:%?28?%;color:#8a8f8b}.checkbox-group[data-v-a2244e3e]{align-items:center;display:flex;flex-direction:row}.item[data-v-a2244e3e]{flex-direction:row}.agreement[data-v-a2244e3e]{color:#04498c}',""]),e.exports=n},"32a6":function(e,n,t){"use strict";var i=t("b14d"),a=t.n(i);a.a},"5ceb":function(e,n,t){"use strict";var i;t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return o})),t.d(n,"a",(function(){return i}));var a=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("v-uni-view",{staticClass:"root"},[t("v-uni-checkbox-group",{staticClass:"checkbox-group",on:{change:function(n){arguments[0]=n=e.$handleEvent(n),e.setAgree.apply(void 0,arguments)}}},[t("v-uni-checkbox",{staticStyle:{transform:"scale(0.7)"},attrs:{checked:e.isAgree}}),t("v-uni-text",[e._v(e._s(e.$t("common.agree")))])],1),e._l(e.agreements,(function(n,i){return t("v-uni-view",{key:i,staticClass:"item"},[t("v-uni-text",{staticClass:"agreement",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.navigateTo(n)}}},[e._v(e._s(n.title))]),e.hasAnd(e.agreements,i)?t("v-uni-text",{staticClass:"hint"},[e._v("&")]):e._e()],1)}))],2)},o=[]},"776b":function(e,n,t){"use strict";t.r(n);var i=t("b9a2"),a=t.n(i);for(var o in i)"default"!==o&&function(e){t.d(n,e,(function(){return i[e]}))}(o);n["default"]=a.a},7990:function(e,n,t){"use strict";var i=t("8090"),a=t.n(i);a.a},8090:function(e,n,t){var i=t("2f68");"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=t("4f06").default;a("21e7ee67",i,!0,{sourceMap:!1,shadowMode:!1})},"9aae":function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{type:"",phone:"",agree:!1}},computed:{loginConfig:function(){return getApp().globalData.config.router.login},isPhone:function(){return/^1\d{10}$/.test(this.phone)},imgSrc:function(){return"/static/login-index/"+this.type+".png"}},onLoad:function(e){var n=this;this.type=e.type,uni.$on("setLoginType",(function(e){n.type=e}))},onUnload:function(){uni.$off("setLoginType")},onReady:function(){},methods:{quickLogin:function(){this.$refs.uniQuickLogin.login_before(this.type)},sendShortMsg:function(){if(!this.agree)return uni.showToast({title:this.$t("common").noAgree,icon:"none"});uni.showLoading(),uni.navigateTo({url:"/pages/ucenter/login-page/register/register?phoneNumber="+this.phone,complete:function(){uni.hideLoading()}})},toPwdLogin:function(){uni.navigateTo({url:"../pwd-login/pwd-login"})}}};n.default=i},a26a:function(e,n,t){"use strict";t.r(n);var i=t("9aae"),a=t.n(i);for(var o in i)"default"!==o&&function(e){t.d(n,e,(function(){return i[e]}))}(o);n["default"]=a.a},b14d:function(e,n,t){var i=t("cfbd");"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=t("4f06").default;a("70227eb9",i,!0,{sourceMap:!1,shadowMode:!1})},b9a2:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={name:"uni-agreements",computed:{agreements:function(){return getApp().globalData.config.about.agreements||[]}},methods:{navigateTo:function(e){var n=e.url,t=e.title;uni.navigateTo({url:"/pages/common/webview/webview?url="+n+"&title="+t,success:function(e){},fail:function(){},complete:function(){}})},hasAnd:function(e,n){return e.length-1>n},setAgree:function(e){this.isAgree=!this.isAgree,this.$emit("setAgree",this.isAgree)}},created:function(){var e=this;uni.$on("setAgreementsAgree",(function(n){console.log("setAgreementsAgree",n),e.isAgree=n,e.$emit("setAgree",n)}))},data:function(){return{isAgree:!1}}};n.default=i},cfbd:function(e,n,t){var i=t("24fb");n=i(!1),n.push([e.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */\nuni-view[data-v-cd77ea50]{display:flex;box-sizing:border-box;flex-direction:column}\n.content[data-v-cd77ea50]{padding:0 %?50?%;width:%?750?%;flex:1}.input-box[data-v-cd77ea50]{padding:0 15px;margin-bottom:10px;background-color:#f8f8f8;border-radius:6px;font-size:%?28?%}.get-code[data-v-cd77ea50]{margin:0;margin-top:15px;background-color:#007aff;color:#fff}.input-box[data-v-cd77ea50],\r\n.get-code[data-v-cd77ea50]{height:45px;line-height:45px}.title[data-v-cd77ea50]{text-align:center;padding-bottom:5px}.tip[data-v-cd77ea50]{color:#666;font-size:%?26?%;margin:6px 0}.easyinput[data-v-cd77ea50]{background-color:#f8f8f8;border-radius:%?6?%}.send-btn[data-v-cd77ea50]{width:100%;margin-top:15px;border-radius:%?6?%}.link[data-v-cd77ea50]{color:#04498c}uni-view[data-v-cd77ea50]{display:flex;box-sizing:border-box;flex-direction:column}.quickLogin[data-v-cd77ea50]{width:%?650?%;height:350px;align-items:center;justify-content:center}.quickLoginBtn[data-v-cd77ea50]{margin:20px 0;width:%?450?%}',""]),e.exports=n},e749:function(e,n,t){"use strict";t.r(n);var i=t("5ceb"),a=t("776b");for(var o in a)"default"!==o&&function(e){t.d(n,e,(function(){return a[e]}))}(o);t("7990");var r,c=t("f0c5"),u=Object(c["a"])(a["default"],i["b"],i["c"],!1,null,"a2244e3e",null,!1,i["a"],r);n["default"]=u.exports}}]);