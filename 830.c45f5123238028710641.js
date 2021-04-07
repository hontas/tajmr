(globalThis.webpackChunktajmr=globalThis.webpackChunktajmr||[]).push([[830],{2830:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>le});var n=r(7294),s=r(5697),a=r.n(s),i=r(1512),o=r(4184),l=r.n(o),c=r(5615),m=r(1657),p=r(9859);function u(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const d="notwork";class h extends n.Component{constructor(...e){super(...e),u(this,"state",{referenceDate:new Date,filterOut:[]}),u(this,"toggleFilter",(e=>{this.state.filterOut.includes(e)?this.setState((t=>({filterOut:t.filterOut.filter((t=>t!==e))}))):this.setState((t=>({filterOut:[...t.filterOut,e]})))})),u(this,"lastMonth",(()=>{const{referenceDate:e}=this.state,t=new Date(e);t.setMonth(e.getMonth()-1),this.setState({referenceDate:t})})),u(this,"nextMonth",(()=>{const{referenceDate:e}=this.state,t=new Date(e);t.setMonth(e.getMonth()+1),this.setState({referenceDate:t})})),u(this,"getGroupedIntervalsBy",(e=>this.getMonthIntervals().reduce(((t,r)=>{let n=r[e]?r[e].toLowerCase():"-";return r.notWork&&(n=`notwork:${n}`),t[n]||(t[n]=0),t[n]+=(r.endTime||Date.now())-r.startTime,t}),{}))),u(this,"getMonthIntervals",(()=>{const{referenceDate:e}=this.state,{intervals:t}=this.props,{startTime:r,endTime:n}=(0,p.jw)(e);return t.filter((e=>e.startTime>r&&e.startTime<=n))}))}render(){const{referenceDate:e,filterOut:t}=this.state,{className:r}=this.props,s=this.getGroupedIntervalsBy("note"),a=Object.keys(s).map((e=>e.toLowerCase())),i=a.filter((e=>!t.includes(e))),o=i.reduce(((e,t)=>e+s[t]),0);return n.createElement("div",{className:l()("MonthReport",r)},n.createElement("h2",{className:"MonthReport__title"},"Månadssammanställning"),n.createElement("h3",{className:"MonthReport__subtitle"},n.createElement(c.Z,{onClick:this.lastMonth},"◀︎"),`${p.e7[e.getMonth()]} ${e.getFullYear()}`,n.createElement(c.Z,{onClick:this.nextMonth},"▶︎")),n.createElement("div",{className:"MonthReport__filters"},a.map((e=>n.createElement(c.Z,{className:l()("MonthReport__filter",{"MonthReport__filter--active":i.includes(e)}),key:e,onClick:()=>this.toggleFilter(e)},e)))),n.createElement("ul",{className:"MonthReport__list"},i.map((e=>n.createElement("li",{key:e,className:l()("MonthReport__list-item",{"not-work":e.startsWith(d)})},n.createElement("p",{className:"MonthReport__list-item__title"},e),n.createElement("p",{className:"MonthReport__list-item__value"},`${(0,p.pD)(s[e]).toFixed(1)}h`)))),n.createElement("li",{className:"MonthReport__list-item"},n.createElement("p",{className:"MonthReport__list-item__title"},"TOTAL:"),n.createElement("p",{className:"MonthReport__list-item__value"},`${(0,p.pD)(o).toFixed(1)}h`))))}}h.propTypes={className:a().string,intervals:m.FC.isRequired};const v=h;function f(e){return e.displayName||e.name||"Component"}const b=3e4;function g(e){if(!e||"number"!=typeof e)throw Error("Argument for render interval must be number");return t=>{class r extends n.Component{componentDidMount(){this.intervalId=setInterval((()=>{this.forceUpdate()}),e)}componentWillUnmount(){clearInterval(this.intervalId)}render(){return n.createElement(t,this.props)}}return r.getDisplayName=f(t),r}}var y=r(3635),k=r.n(y);const E=({from:e,elapsed:t})=>{const r=e?Date.now()-e+t:t,{hours:s,minutes:a}=(0,p.Ds)(r),i=(0,p.u6)(r,{isDuration:!0});return e&&s&&0===a&&k()(`Nu har du jobbat i ${s} timmar.`),n.createElement("div",{className:"digital-clock"},n.createElement("time",null,i))};E.propTypes={elapsed:a().number.isRequired,from:a().number.isRequired};const w=g(b)(E);function _(){return(_=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function O(e,t){if(null==e)return{};var r,n,s=function(e,t){if(null==e)return{};var r,n,s={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(s[r]=e[r]);return s}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s}const T=e=>{let{isLoading:t=!1,activeInterval:r,onClick:s}=e,a=O(e,["isLoading","activeInterval","onClick"]);const i=r?"Ta en fika ▐▐":"Börja debitera ▶";return n.createElement(c.Z,_({},a,{theme:"primary",className:"work-button",onClick:s,text:i,disabled:t}))};T.propTypes={activeInterval:a().bool.isRequired,onClick:a().func.isRequired,isLoading:a().bool};const D=T;function N(e){return Math.round(10*e)/10}const j=({progress:e,max:t,onlyDelta:r,unit:s=""})=>{const a=(e/t).toFixed(2),i=a>1,o=i?1/a*100+"%":100*a+"%",c=i?100*(1-1/a)+"%":100*(1-a)+"%",m=N(Math.abs(t-e)),p=l()("progress-bar",{"progress-bar--only-delta":r}),u=[e,t].map(N).join(" / ");return n.createElement("div",{className:p},n.createElement("div",{style:{flexBasis:o},className:"progress-bar__progress"}),n.createElement("div",{style:{flexBasis:c},className:l()("progress-bar__rest",{"progress-bar__overtime":i})}),n.createElement("div",{className:"progress-bar__text"},n.createElement("span",{className:"progress-bar__text__progress"},u),!!m&&!r&&" | ",!!m&&n.createElement("span",{className:"progress-bar__text__delta"},`${m}${s}`)))};j.propTypes={progress:a().number.isRequired,onlyDelta:a().bool,unit:a().string,max:a().number.isRequired};const R=j,C=({intervals:e,max:t})=>{const r=Date.now(),s=e.map((({startTime:e,endTime:t})=>(t||r)-e)).reduce(((e,t)=>e+t),0);return C.propTypes={intervals:m.FC.isRequired,max:a().number.isRequired},C.displayName=f(R),n.createElement(R,{progress:(0,p.pD)(s),max:t})},x=g(b)(C);var I=r(6402),P=r(6739);const M=({hoursPerWeek:e,monthIntervals:t,timestamp:r})=>{const s=(0,p.jw)(r),a={startTime:s.startTime,endTime:Date.now()},i=(0,P.kB)(t)/p.ml,o=e/5*(0,p.l5)(s),l=e/5*(0,p.l5)(a);return n.createElement("div",{className:"month-stats"},n.createElement("h3",{className:"month-stats__heading"},"Månad"),n.createElement(R,{progress:i,max:o}),n.createElement("h3",{className:"month-stats__heading"},"Flex"),n.createElement(R,{progress:i,max:l,unit:"h",onlyDelta:!0}))};M.defaultProps={hoursPerWeek:40},M.propTypes={monthIntervals:m.FC.isRequired,hoursPerWeek:a().number,timestamp:a().number.isRequired};const q=M,W=e=>(0,p.u6)(e,{isDuration:!0}),S=({weekday:e,total:t,date:r,intervals:s=[]})=>{const a=10*(0,p.pD)(t),i={height:`${a}px`},o="week-stats-item",c="week-stats-item__bar",m=s.reduce(((e,{timespan:t})=>e+t),0);return n.createElement("div",{className:o},n.createElement("div",{className:c,style:i,tabIndex:"-1","data-testid":"week-stats-item"},s.map((({timespan:e,note:t,notWork:r})=>n.createElement("div",{className:l()(`${c}__item`,{"not-work":r}),key:e},n.createElement("p",{className:`${c}__info`},`${W(e)} ${t}`)))),m>0&&n.createElement("p",{className:`${c}__total`,style:{lineHeight:`${a}px`}},W(m))),n.createElement("p",{className:"week-date"},n.createElement("span",null,e),n.createElement("br",null),n.createElement("span",null,r)))};S.defaultProps={total:0},S.propTypes={weekday:a().string.isRequired,total:a().number,date:a().string.isRequired,intervals:a().arrayOf(a().object)};const F=S;function A(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function $(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?A(Object(r),!0).forEach((function(t){U(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):A(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Z(){return(Z=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function U(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}class L extends n.Component{constructor(...e){super(...e),U(this,"lastWeek",(()=>{const{fetchIntervalsInWeek:e,timestamp:t}=this.props;e(t-p.un)})),U(this,"nextWeek",(()=>{const{fetchIntervalsInWeek:e,timestamp:t}=this.props;e(t+p.un)}))}render(){const{intervals:e,timestamp:t,userSettings:r}=this.props,s=Date.now(),a=e.map((({startTime:e,endTime:t})=>(t||s)-e)).reduce(((e,t)=>e+t),0);return n.createElement("div",{className:"week-stats"},n.createElement("h3",{className:"week-stats__title"},n.createElement(c.Z,{onClick:this.lastWeek,"data-testid":"prev-week-btn"},"◀︎"),e.length?` v.${(0,p.uW)(t)} `:` v.${(0,p.uW)(s)} `,n.createElement(c.Z,{onClick:this.nextWeek,"data-testid":"next-week-btn"},"▶︎")),n.createElement("div",{className:"week-stats__bars flex-container flex--align-end"},function(e,t){const r=function(e){return e.reduce(((e,{startTime:t,endTime:r,notWork:n,note:s})=>{const a=new Date(t),i=(0,p._3)(a),o=(0,p.FO)(a),l=(r||Date.now())-t,c=e[i]||{total:0,weekDay:o,intervals:[]};return $($({},e),{},{[i]:$($({},c),{},{notWork:n||c.notWork,total:c.total+l,intervals:[...c.intervals,{notWork:n,timespan:l,note:s}]})})}),{})}(e);return(0,p.BN)(t).map((e=>$($({},e),{},{total:0},r[e.date]))).filter((e=>!e.isWeekEnd||0!==e.total))}(e,t).map((e=>n.createElement(F,Z({key:e.weekday},e))))),n.createElement(R,{progress:(0,p.pD)(a),max:r.hoursInWeek}))}}L.propTypes={fetchIntervalsInWeek:m.ZP.func.isRequired,intervals:m.FC.isRequired,userSettings:m.AQ.isRequired,timestamp:m.ZP.number.isRequired};const B=g(b)(L);var z=r(8593),H=r(7615),V=r(1138);const G=({className:e,size:t=30})=>n.createElement("svg",{style:{width:t},className:e,xmlns:"http://www.w3.org/2000/svg",viewBox:"30 25 40 45"},n.createElement("path",{d:"M42 31v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V31a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l7.414 7.414a1 1 0 0 1 .293.707V69a1 1 0 0 1-1 1H31a1 1 0 0 1-1-1V31a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1zm9-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zM34 47v18a1 1 0 0 0 1 1h30a1 1 0 0 0 1-1V47a1 1 0 0 0-1-1H35a1 1 0 0 0-1 1z",fillRule:"evenodd"}));G.propTypes={size:a().number,className:a().string};const Q=(0,V.Z)(G);function Y(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}class J extends n.Component{constructor(e){super(e),Y(this,"onAdd",(e=>{e.preventDefault(),this.props.onAdd(this.state.interval)})),Y(this,"onCancel",(()=>{})),Y(this,"onUpdate",(e=>{this.setState({interval:e})}));const t=parseInt(e.fullDay,10),r=Math.round(60*(e.fullDay-t));this.state={interval:{startTime:X(9),endTime:X(9+t,r),note:""}}}render(){const{interval:e}=this.state,{notes:t,onCancel:r}=this.props;return n.createElement("form",{className:"add-one-interval",onSubmit:this.onAdd},n.createElement(H.Z,{className:"add-one-interval__interval-list-item",interval:e,onUpdate:this.onUpdate,onDelete:K,notes:t}),n.createElement(c.Z,{type:"submit",theme:"primary",onClick:this.onAdd,className:"add-one-interval__btn"},n.createElement(Q,{size:17})),n.createElement(c.Z,{theme:"secondary",className:"add-one-interval__btn",onClick:r},"✖"))}}function K(){}function X(e,t=0,r=0){const n=new Date;return n.setHours(e),n.setMinutes(t),n.setSeconds(r),n.getTime()}J.propTypes={onAdd:a().func.isRequired,onCancel:a().func.isRequired,fullDay:a().number.isRequired,notes:a().arrayOf(a().string)};const ee=J;var te=r(8769);function re(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ne(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?re(Object(r),!0).forEach((function(t){se(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):re(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function se(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}class ae extends n.Component{constructor(...e){super(...e),se(this,"state",{displayAddForm:!1}),se(this,"updateTimestamp",(e=>{this.props.updateTimestamp(e)})),se(this,"onDelete",(e=>this.props.attemptRemove(e))),se(this,"onUpdate",(e=>this.props.attemptUpdate(e))),se(this,"onClick",(()=>{const{activeInterval:e,attemptUpdate:t}=this.props;if(e){return t(ne(ne({},e),{},{endTime:Date.now()}))}return t({startTime:Date.now()})})),se(this,"onAddPrevClick",(()=>this.setState({displayAddForm:!0}))),se(this,"onCancelPrevClick",(()=>this.setState({displayAddForm:!1}))),se(this,"onAddOneInterval",(e=>{const{attemptUpdate:t,intervalAdded:r}=this.props;t(e).then((e=>{this.setState({displayAddForm:!1}),r(e)}))}))}render(){const{isLoading:e,intervals:t,activeInterval:r,todaysIntervals:s,userSettings:a,timestamp:i,notes:o}=this.props,{displayAddForm:l}=this.state,m=r?[].concat(r,s):s,u=a.hoursInWeek||40,d=u/5,h=(0,P.kB)(s),f=(0,p.Qk)(i),b=(0,p.jw)(i),g=t.filter((({startTime:e})=>e>f.startTime&&e<f.endTime)),y=t.filter((({startTime:e})=>e>b.startTime&&e<b.endTime));return n.createElement("div",{className:"current-intervals"},n.createElement(te.S,null,n.createElement(n.Fragment,null,n.createElement(w,{elapsed:h,from:r?r.startTime:0}),n.createElement(x,{intervals:m,max:u/5}),n.createElement("div",{className:"action-buttons",style:{display:"flex"}},n.createElement(D,{"data-testid":"work-button",activeInterval:!!r,onClick:this.onClick,isLoading:e}),n.createElement(c.Z,{className:"current-intervals__prev-work-btn",theme:"primary",onClick:this.onAddPrevClick},"Efterregga")),l&&n.createElement(ee,{onAdd:this.onAddOneInterval,onCancel:this.onCancelPrevClick,fullDay:d,notes:o}),n.createElement(I.Z,{"data-testid":"current-intervals-list",intervals:m,onDelete:this.onDelete,onUpdate:this.onUpdate,notes:o}),n.createElement(B,{fetchIntervalsInWeek:this.updateTimestamp,intervals:g,timestamp:i,userSettings:a}),t.length>0&&n.createElement(q,{timestamp:i,monthIntervals:y,hoursPerWeek:a.hoursInWeek}),a.displayMonthReport&&n.createElement(v,{intervals:t}))))}}ae.propTypes=ne(ne({},ae.propTypes),{},{isLoading:a().bool,activeInterval:m.FG,intervals:m.FC.isRequired,todaysIntervals:m.FC.isRequired,attemptUpdate:a().func.isRequired,attemptRemove:a().func.isRequired,updateTimestamp:a().func.isRequired,timestamp:a().number.isRequired,notes:a().arrayOf(a().string)}),ae.defaultProps={activeInterval:null};const ie=(0,p.PE)(Date.now());function oe({startTime:e,endTime:t}){const r=e>ie.startTime,n=t>ie.startTime&&t<ie.endTime;return r||n}const le=(0,i.$j)((function({intervals:{items:e,timestamp:t,isFetching:r,isSaving:n},userSettings:s}){const a=e.map((({note:e})=>e?e.toLowerCase():e)).filter((e=>e));return{timestamp:t,isLoading:r||n,intervals:e,todaysIntervals:e.filter(oe).filter(P.ew),activeInterval:e.find(P.zh),userSettings:s,notes:[...new Set(a)]}}),z)(ae)},3635:e=>{e.exports=e=>{"Notification"in window!=!1&&Notification.requestPermission((t=>{if("granted"===t){const t=(r="tajmr",new Notification(r,{body:e,icon:"icons/apple-touch-icon.png",tag:r}));setTimeout((()=>{t.close()}),5e3)}var r}))}}}]);