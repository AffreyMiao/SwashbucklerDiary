function e(e){return{detail:e.detail,screenX:e.screenX,screenY:e.screenY,clientX:e.clientX,clientY:e.clientY,offsetX:e.offsetX,offsetY:e.offsetY,pageX:e.pageX,pageY:e.pageY,button:e.button,buttons:e.buttons,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey,metaKey:e.metaKey,type:e.type}}function t(e){return{detail:e.detail,touches:n(e.touches),targetTouches:n(e.targetTouches),changedTouches:n(e.changedTouches),ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey,metaKey:e.metaKey,type:e.type}}function n(e){const t=[];for(let n=0;n<e.length;n++){const c=e[n];t.push({identifier:c.identifier,clientX:c.clientX,clientY:c.clientY,screenX:c.screenX,screenY:c.screenY,pageX:c.pageX,pageY:c.pageY})}return t}function c(e){const t=e.target;if(function(e){return-1!==r.indexOf(e.getAttribute("type"))}(t)){const e=function(e){const t=e.value,n=e.type;switch(n){case"date":case"month":case"week":return t;case"datetime-local":return 16===t.length?t+":00":t;case"time":return 5===t.length?t+":00":t}throw new Error(`Invalid element type '${n}'.`)}(t);return{value:e}}if(function(e){return e instanceof HTMLSelectElement&&"select-multiple"===e.type}(t)){const e=t;return{value:Array.from(e.options).filter((e=>e.selected)).map((e=>e.value))}}{const e=function(e){return!!e&&"INPUT"===e.tagName&&"checkbox"===e.getAttribute("type")}(t);return{value:e?!!t.checked:t.value}}}const r=["date","datetime-local","month","time","week"];export{t as a,c as b,e as p};
//# sourceMappingURL=EventType.js.map
