import{p as t}from"../../chunks/EventType.js";class e{constructor(t,e,s){this.openDelay=t,this.closeDelay=e,this.dotNetHelper=s}clearDelay(){clearTimeout(this.openTimeout),clearTimeout(this.closeTimeout)}runDelay(t,e){this.clearDelay();const s=parseInt(this[`${t}Delay`],10);this[`${t}Timeout`]=setTimeout(e||(()=>{const e={open:!0,close:!1}[t];this.setActive(e)}),s)}setActive(t){this.isActive!=t&&(this.isActive=t,this.dotNetHelper.invokeMethodAsync("SetActive",this.isActive))}resetDelay(t,e){this.openDelay=t,this.closeDelay=e}}class s extends e{constructor(t,e,s,i,o,n,r,c){super(n,r,c),this.activatorListeners={},this.popupListeners={};const p=document.querySelector(t);p&&(this.activator=p),this.disabled=e,this.openOnClick=s,this.openOnHover=i,this.openOnFocus=o,this.dotNetHelper=c}resetActivator(t){const e=document.querySelector(t);e&&(this.activator=e),this.resetActivatorEvents(this.disabled,this.openOnHover,this.openOnFocus)}addActivatorEvents(){if(!this.activator||this.disabled)return;this.activatorListeners=this.genActivatorListeners();const t=Object.keys(this.activatorListeners);for(const e of t)this.activator.addEventListener(e,this.activatorListeners[e])}genActivatorListeners(){if(this.disabled)return{};const e={};return this.openOnHover?(e.mouseenter=t=>{this.runDelay("open")},e.mouseleave=t=>{this.runDelay("close")}):this.openOnClick&&(e.click=e=>{this.activator&&this.activator.focus(),e.stopPropagation(),this.dotNetHelper.invokeMethodAsync("OnClick",t(e)),this.setActive(!this.isActive)}),this.openOnFocus&&(e.focus=t=>{t.stopPropagation(),this.runDelay("open")},e.blur=t=>{this.runDelay("close")}),e}removeActivatorEvents(){if(!this.activator)return;const t=Object.keys(this.activatorListeners);for(const e of t)this.activator.removeEventListener(e,this.activatorListeners[e]);this.activatorListeners={}}resetActivatorEvents(t,e,s){this.disabled=t,this.openOnHover=e,this.openOnFocus=s,this.removeActivatorEvents(),this.addActivatorEvents()}runDelaying(t){this.runDelay(t?"open":"close")}registerPopup(t,e){const s=document.querySelector(t);s?(this.popupElement=s,this.closeOnContentClick=e,this.addPopupEvents()):console.error("popup not exists")}addPopupEvents(){if(!this.popupElement||this.disabled)return;this.popupListeners=this.genPopupListeners();const t=Object.keys(this.popupListeners);for(const e of t)this.popupElement.addEventListener(e,this.popupListeners[e])}removePopupEvents(){if(!this.popupElement)return;const t=Object.keys(this.popupListeners);for(const e of t)this.popupElement.removeEventListener(e,this.popupListeners[e]);this.popupListeners={}}genPopupListeners(){if(this.disabled)return;const t={};return!this.disabled&&this.openOnHover&&(t.mouseenter=t=>{this.runDelay("open")},t.mouseleave=t=>{this.runDelay("close")}),this.closeOnContentClick&&(t.click=t=>{this.setActive(!1)}),t}resetPopupEvents(t){this.closeOnContentClick=t,this.removePopupEvents(),this.addPopupEvents()}}function i(t,e,i,o,n,r,c,p){var a=new s(t,e,i,o,n,r,c,p);return a.addActivatorEvents(),a}export{i as init};
//# sourceMappingURL=index.js.map
