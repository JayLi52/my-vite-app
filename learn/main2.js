import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/main.tsx");import * as RefreshRuntime from "/@react-refresh";

if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/eeo/work/my-vite-app/src/main.tsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=2d4749c8"; const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$(), _s1 = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$();
import __vite__cjsImport2_react from "/node_modules/.vite/deps/react.js?v=2d4749c8"; const React = __vite__cjsImport2_react.__esModule ? __vite__cjsImport2_react.default : __vite__cjsImport2_react; const useEffect = __vite__cjsImport2_react["useEffect"]; const useState = __vite__cjsImport2_react["useState"];
import __vite__cjsImport3_reactDom from "/node_modules/.vite/deps/react-dom.js?v=2d4749c8"; const ReactDOM = __vite__cjsImport3_reactDom.__esModule ? __vite__cjsImport3_reactDom.default : __vite__cjsImport3_reactDom;
// import App from './App.tsx'
import "/src/index.css";
// import DIY from '@nobook/molecular-model';
// import OrganicDependJS from './components/OrganicDependJS'
// const DynamicComponent = lazy(() => import("@nobook/molecular-model"));
function App() {
    _s();
    const [load, setLoad] = useState(false);
    const [count, setCount] = useState(0);
    useEffect(()=>{
        // console.log('xxx')
        setInterval(()=>{
            setCount(count + 1);
        }, 1000);
    });
    // console.log(load)
    return /*#__PURE__*/ _jsxDEV("div", {
        children: [
            /*#__PURE__*/ _jsxDEV("span", {
                onClick: ()=>setCount(count + 1),
                children: "click"
            }, void 0, false, {
                fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ _jsxDEV("p", {
                children: count
            }, void 0, false, {
                fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
                lineNumber: 22,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
        lineNumber: 20,
        columnNumber: 11
    }, this);
// return !load ? (
//   <OrganicDependJS onComplete={() => setLoad(true)} />
// ) : (
//   // <Suspense fallback={<div>Loading...</div>}>
//   //   <DynamicComponent />
//   // </Suspense>
// //   // <div></div>
//   <DIY />
// );
}
_s(App, "TYPpBUEnOHKSEMuOGvEbOibrRk4=");
_c = App;
// import React, { useState, useEffect } from 'react';
function useCounter(initialValue = 0, step = 1) {
    _s1();
    // 使用 useState 来创建状态
    const [count, setCount] = useState(initialValue);
    // 定义自定义的增加和减少函数
    const increment = ()=>setCount(count + step);
    const decrement = ()=>setCount(count - step);
    // 返回有用的信息和操作
    return {
        count,
        increment,
        decrement
    };
}
_s1(useCounter, "anQBWt8gm5Alpw27Xf2pPZffWFg=");
// 使用自定义 Hook 的组件示例
function CounterComponent() {
    _s2();
    // 使用 useCounter 自定义 Hook
    const { count, increment, decrement } = useCounter(0, 2);
    return /*#__PURE__*/ _jsxDEV("div", {
        children: [
            /*#__PURE__*/ _jsxDEV("p", {
                children: [
                    "Count: ",
                    count
                ]
            }, void 0, true, {
                fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("button", {
                onClick: increment,
                children: "Increment"
            }, void 0, false, {
                fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("button", {
                onClick: decrement,
                children: "Decrement"
            }, void 0, false, {
                fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s2(CounterComponent, "GMnn6poPNLic2qTVaQnmaJAGbGg=", false, function() {
    return [
        useCounter
    ];
});
_c1 = CounterComponent;
const Counter = ()=>{
    _s3();
    const [message, setMessage] = useState('');
    const [count, setCount] = useState(0);
    useEffect(()=>{
        setMessage(`Count is ${count}`);
    }, [
        count
    ]);
    return /*#__PURE__*/ _jsxDEV("div", {
        children: [
            /*#__PURE__*/ _jsxDEV("p", {
                children: message
            }, void 0, false, {
                fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("button", {
                onClick: ()=>setCount(count + 1),
                children: "Increment"
            }, void 0, false, {
                fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
};
_s3(Counter, "jJzPwu3t2Fvhp3SIslkplzTbUAc=");
_c2 = Counter;
// export default Counter;
ReactDOM.render(/*#__PURE__*/ _jsxDEV(React.StrictMode, {
    children: /*#__PURE__*/ _jsxDEV(CounterComponent, {}, void 0, false, {
        fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this)
}, void 0, false, {
    fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
    lineNumber: 87,
    columnNumber: 3
}, this), document.getElementById("root"));
var _c, _c1, _c2;
$RefreshReg$(_c, "App");
$RefreshReg$(_c1, "CounterComponent");
$RefreshReg$(_c2, "Counter");


window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
  RefreshRuntime.registerExportsForReactRefresh("/Users/eeo/work/my-vite-app/src/main.tsx", currentExports);
  import.meta.hot.accept((nextExports) => {
    if (!nextExports) return;
    const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(currentExports, nextExports);
    if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
  });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBsYXp5LCBTdXNwZW5zZSwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcbi8vIGltcG9ydCBBcHAgZnJvbSAnLi9BcHAudHN4J1xuaW1wb3J0IFwiLi9pbmRleC5jc3NcIjtcbi8vIGltcG9ydCBESVkgZnJvbSAnQG5vYm9vay9tb2xlY3VsYXItbW9kZWwnO1xuLy8gaW1wb3J0IE9yZ2FuaWNEZXBlbmRKUyBmcm9tICcuL2NvbXBvbmVudHMvT3JnYW5pY0RlcGVuZEpTJ1xuXG4vLyBjb25zdCBEeW5hbWljQ29tcG9uZW50ID0gbGF6eSgoKSA9PiBpbXBvcnQoXCJAbm9ib29rL21vbGVjdWxhci1tb2RlbFwiKSk7XG5cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgY29uc3QgW2xvYWQsIHNldExvYWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbY291bnQsIHNldENvdW50XSA9IHVzZVN0YXRlKDApO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCd4eHgnKVxuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHNldENvdW50KGNvdW50ICsgMSlcbiAgICB9LCAxMDAwKVxuICB9KTtcbiAgLy8gY29uc29sZS5sb2cobG9hZClcbiAgcmV0dXJuICg8ZGl2PlxuICAgIDxzcGFuIG9uQ2xpY2s9eygpID0+IHNldENvdW50KGNvdW50ICsgMSl9PmNsaWNrPC9zcGFuPlxuICAgIDxwPntjb3VudH08L3A+XG4gIDwvZGl2PilcbiAgLy8gcmV0dXJuICFsb2FkID8gKFxuICAvLyAgIDxPcmdhbmljRGVwZW5kSlMgb25Db21wbGV0ZT17KCkgPT4gc2V0TG9hZCh0cnVlKX0gLz5cbiAgLy8gKSA6IChcbiAgLy8gICAvLyA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gIC8vICAgLy8gICA8RHluYW1pY0NvbXBvbmVudCAvPlxuICAvLyAgIC8vIDwvU3VzcGVuc2U+XG4gIC8vIC8vICAgLy8gPGRpdj48L2Rpdj5cbiAgLy8gICA8RElZIC8+XG4gIC8vICk7XG59XG5cbi8vIGltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG5mdW5jdGlvbiB1c2VDb3VudGVyKGluaXRpYWxWYWx1ZSA9IDAsIHN0ZXAgPSAxKSB7XG4gIC8vIOS9v+eUqCB1c2VTdGF0ZSDmnaXliJvlu7rnirbmgIFcbiAgY29uc3QgW2NvdW50LCBzZXRDb3VudF0gPSB1c2VTdGF0ZShpbml0aWFsVmFsdWUpO1xuXG4gIC8vIOWumuS5ieiHquWumuS5ieeahOWinuWKoOWSjOWHj+WwkeWHveaVsFxuICBjb25zdCBpbmNyZW1lbnQgPSAoKSA9PiBzZXRDb3VudChjb3VudCArIHN0ZXApO1xuICBjb25zdCBkZWNyZW1lbnQgPSAoKSA9PiBzZXRDb3VudChjb3VudCAtIHN0ZXApO1xuXG4gIC8vIOi/lOWbnuacieeUqOeahOS/oeaBr+WSjOaTjeS9nFxuICByZXR1cm4ge1xuICAgIGNvdW50LFxuICAgIGluY3JlbWVudCxcbiAgICBkZWNyZW1lbnQsXG4gIH07XG59XG5cbi8vIOS9v+eUqOiHquWumuS5iSBIb29rIOeahOe7hOS7tuekuuS+i1xuZnVuY3Rpb24gQ291bnRlckNvbXBvbmVudCgpIHtcbiAgLy8g5L2/55SoIHVzZUNvdW50ZXIg6Ieq5a6a5LmJIEhvb2tcbiAgY29uc3QgeyBjb3VudCwgaW5jcmVtZW50LCBkZWNyZW1lbnQgfSA9IHVzZUNvdW50ZXIoMCwgMik7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPHA+Q291bnQ6IHtjb3VudH08L3A+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e2luY3JlbWVudH0+SW5jcmVtZW50PC9idXR0b24+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e2RlY3JlbWVudH0+RGVjcmVtZW50PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmNvbnN0IENvdW50ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2NvdW50LCBzZXRDb3VudF0gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE1lc3NhZ2UoYENvdW50IGlzICR7Y291bnR9YCk7XG4gIH0sIFtjb3VudF0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxwPnttZXNzYWdlfTwvcD5cbiAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0Q291bnQoY291bnQgKyAxKX0+SW5jcmVtZW50PC9idXR0b24+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBleHBvcnQgZGVmYXVsdCBDb3VudGVyO1xuXG5cblJlYWN0RE9NLnJlbmRlcihcbiAgPFJlYWN0LlN0cmljdE1vZGU+XG4gICAgPENvdW50ZXJDb21wb25lbnQgLz5cbiAgPC9SZWFjdC5TdHJpY3RNb2RlPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpXG4pO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJSZWFjdERPTSIsIkFwcCIsImxvYWQiLCJzZXRMb2FkIiwiY291bnQiLCJzZXRDb3VudCIsInNldEludGVydmFsIiwiZGl2Iiwic3BhbiIsIm9uQ2xpY2siLCJwIiwidXNlQ291bnRlciIsImluaXRpYWxWYWx1ZSIsInN0ZXAiLCJpbmNyZW1lbnQiLCJkZWNyZW1lbnQiLCJDb3VudGVyQ29tcG9uZW50IiwiYnV0dG9uIiwiQ291bnRlciIsIm1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwicmVuZGVyIiwiU3RyaWN0TW9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxTQUF5QkMsU0FBUyxFQUFFQyxRQUFRLFFBQVEsUUFBUTtBQUNuRSxPQUFPQyxjQUFjLFlBQVk7QUFDakMsOEJBQThCO0FBQzlCLE9BQU8sY0FBYztBQUNyQiw2Q0FBNkM7QUFDN0MsNkRBQTZEO0FBRTdELDBFQUEwRTtBQUUxRSxTQUFTQzs7SUFDUCxNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR0osU0FBUztJQUNqQyxNQUFNLENBQUNLLE9BQU9DLFNBQVMsR0FBR04sU0FBUztJQUNuQ0QsVUFBVTtRQUNSLHFCQUFxQjtRQUNyQlEsWUFBWTtZQUNWRCxTQUFTRCxRQUFRO1FBQ25CLEdBQUc7SUFDTDtJQUNBLG9CQUFvQjtJQUNwQixxQkFBUSxRQUFDRzs7MEJBQ1AsUUFBQ0M7Z0JBQUtDLFNBQVMsSUFBTUosU0FBU0QsUUFBUTswQkFBSTs7Ozs7OzBCQUMxQyxRQUFDTTswQkFBR047Ozs7Ozs7Ozs7OztBQUVOLG1CQUFtQjtBQUNuQix5REFBeUQ7QUFDekQsUUFBUTtBQUNSLG1EQUFtRDtBQUNuRCw4QkFBOEI7QUFDOUIsbUJBQW1CO0FBQ25CLHNCQUFzQjtBQUN0QixZQUFZO0FBQ1osS0FBSztBQUNQO0dBdkJTSDtLQUFBQTtBQXlCVCxzREFBc0Q7QUFFdEQsU0FBU1UsV0FBV0MsZUFBZSxDQUFDLEVBQUVDLE9BQU8sQ0FBQzs7SUFDNUMsb0JBQW9CO0lBQ3BCLE1BQU0sQ0FBQ1QsT0FBT0MsU0FBUyxHQUFHTixTQUFTYTtJQUVuQyxnQkFBZ0I7SUFDaEIsTUFBTUUsWUFBWSxJQUFNVCxTQUFTRCxRQUFRUztJQUN6QyxNQUFNRSxZQUFZLElBQU1WLFNBQVNELFFBQVFTO0lBRXpDLGFBQWE7SUFDYixPQUFPO1FBQ0xUO1FBQ0FVO1FBQ0FDO0lBQ0Y7QUFDRjtJQWRTSjtBQWdCVCxtQkFBbUI7QUFDbkIsU0FBU0s7O0lBQ1AseUJBQXlCO0lBQ3pCLE1BQU0sRUFBRVosS0FBSyxFQUFFVSxTQUFTLEVBQUVDLFNBQVMsRUFBRSxHQUFHSixXQUFXLEdBQUc7SUFFdEQscUJBQ0UsUUFBQ0o7OzBCQUNDLFFBQUNHOztvQkFBRTtvQkFBUU47Ozs7Ozs7MEJBQ1gsUUFBQ2E7Z0JBQU9SLFNBQVNLOzBCQUFXOzs7Ozs7MEJBQzVCLFFBQUNHO2dCQUFPUixTQUFTTTswQkFBVzs7Ozs7Ozs7Ozs7O0FBR2xDO0lBWFNDOztRQUVpQ0w7OztNQUZqQ0s7QUFhVCxNQUFNRSxVQUFVOztJQUNkLE1BQU0sQ0FBQ0MsU0FBU0MsV0FBVyxHQUFHckIsU0FBUztJQUN2QyxNQUFNLENBQUNLLE9BQU9DLFNBQVMsR0FBR04sU0FBUztJQUVuQ0QsVUFBVTtRQUNSc0IsV0FBVyxDQUFDLFNBQVMsRUFBRWhCLE1BQU0sQ0FBQztJQUNoQyxHQUFHO1FBQUNBO0tBQU07SUFFVixxQkFDRSxRQUFDRzs7MEJBQ0MsUUFBQ0c7MEJBQUdTOzs7Ozs7MEJBQ0osUUFBQ0Y7Z0JBQU9SLFNBQVMsSUFBTUosU0FBU0QsUUFBUTswQkFBSTs7Ozs7Ozs7Ozs7O0FBR2xEO0lBZE1jO01BQUFBO0FBZ0JOLDBCQUEwQjtBQUcxQmxCLFNBQVNxQixNQUFNLGVBQ2IsUUFBQ3hCLE1BQU15QixVQUFVO2NBQ2YsY0FBQSxRQUFDTjs7Ozs7Ozs7O1VBRUhPLFNBQVNDLGNBQWMsQ0FBQyJ9