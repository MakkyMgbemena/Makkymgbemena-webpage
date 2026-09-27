var a={exports:{}},t={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var i;function p(){if(i)return t;i=1;var x=Symbol.for("react.transitional.element"),v=Symbol.for("react.fragment");function u(R,e,r){var n=null;if(r!==void 0&&(n=""+r),e.key!==void 0&&(n=""+e.key),"key"in e){r={};for(var s in e)s!=="key"&&(r[s]=e[s])}else r=e;return e=r.ref,{$$typeof:x,type:R,key:n,ref:e!==void 0?e:null,props:r}}return t.Fragment=v,t.jsx=u,t.jsxs=u,t}var l;function c(){return l||(l=1,a.exports=p()),a.exports}var d=c();const o="/hvac/",h={name:"HVAC Demo",email:"hello@hvacdemo.example",phone:"+1 (555) 010-2030",nav:[{label:"Home",href:o},{label:"Work",href:`${o}work/`},{label:"About",href:`${o}about/`},{label:"Contact",href:`${o}contact/`}]};export{d as j,h as s};
