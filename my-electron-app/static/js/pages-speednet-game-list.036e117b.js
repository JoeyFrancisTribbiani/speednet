(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-speednet-game-list"],{2806:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return a}));var a={unicloudDb:n("960d").default,uniList:n("11d1").default,uniListItem:n("498b").default,uniLoadMore:n("0d54").default,uniFab:n("eb57").default},o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",{staticClass:"container"},[n("unicloud-db",{ref:"udb",attrs:{collection:e.collectionList,field:"game_name,picture,regions{region_name as text},platform"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.data,o=(t.pagination,t.loading),i=t.hasMore,u=t.error;return[u?n("v-uni-view",[e._v(e._s(u.message))]):a?n("v-uni-view",[n("uni-list",e._l(a,(function(t,a){return n("uni-list-item",{key:a,attrs:{showArrow:!0,clickable:!0},on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.handleItemClick(t._id)}},scopedSlots:e._u([{key:"body",fn:function(){return[n("v-uni-text",[e._v(e._s(t._id))])]},proxy:!0}],null,!0)})})),1)],1):e._e(),n("uni-load-more",{attrs:{status:o?"loading":i?"more":"noMore"}})]}}])}),n("uni-fab",{ref:"fab",attrs:{horizontal:"right",vertical:"bottom","pop-menu":!1},on:{fabClick:function(t){arguments[0]=t=e.$handleEvent(t),e.fabClick.apply(void 0,arguments)}}})],1)},i=[]},6759:function(e,t,n){"use strict";n.r(t);var a=n("2806"),o=n("c848");for(var i in o)"default"!==i&&function(e){n.d(t,e,(function(){return o[e]}))}(i);var u,r=n("f0c5"),l=Object(r["a"])(o["default"],a["b"],a["c"],!1,null,"925381aa",null,!1,a["a"],u);t["default"]=l.exports},c848:function(e,t,n){"use strict";n.r(t);var a=n("ea43"),o=n.n(a);for(var i in a)"default"!==i&&function(e){n.d(t,e,(function(){return a[e]}))}(i);t["default"]=o.a},ea43:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=e.database(),a={data:function(){return{collectionList:[n.collection("speednet-game").getTemp(),n.collection("speednet-game-region").getTemp()],loadMore:{contentdown:"",contentrefresh:"",contentnomore:""}}},onPullDownRefresh:function(){this.$refs.udb.loadData({clear:!0},(function(){uni.stopPullDownRefresh()}))},onReachBottom:function(){this.$refs.udb.loadMore()},methods:{handleItemClick:function(e){uni.navigateTo({url:"./detail?id="+e})},fabClick:function(){var e=this;uni.navigateTo({url:"./add",events:{refreshData:function(){e.$refs.udb.loadData({clear:!0})}}})}}};t.default=a}).call(this,n("a9ff")["default"])}}]);