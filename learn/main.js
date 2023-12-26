import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/main.tsx");import * as RefreshRuntime from "/@react-refresh";

if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/eeo/work/my-vite-app/src/main.tsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=2d4749c8"; const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
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
ReactDOM.render(/*#__PURE__*/ _jsxDEV(React.StrictMode, {
    children: /*#__PURE__*/ _jsxDEV(App, {}, void 0, false, {
        fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this)
}, void 0, false, {
    fileName: "/Users/eeo/work/my-vite-app/src/main.tsx",
    lineNumber: 36,
    columnNumber: 3
}, this), document.getElementById("root"));
var _c;
$RefreshReg$(_c, "App");


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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBsYXp5LCBTdXNwZW5zZSwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcbi8vIGltcG9ydCBBcHAgZnJvbSAnLi9BcHAudHN4J1xuaW1wb3J0IFwiLi9pbmRleC5jc3NcIjtcbi8vIGltcG9ydCBESVkgZnJvbSAnQG5vYm9vay9tb2xlY3VsYXItbW9kZWwnO1xuLy8gaW1wb3J0IE9yZ2FuaWNEZXBlbmRKUyBmcm9tICcuL2NvbXBvbmVudHMvT3JnYW5pY0RlcGVuZEpTJ1xuXG4vLyBjb25zdCBEeW5hbWljQ29tcG9uZW50ID0gbGF6eSgoKSA9PiBpbXBvcnQoXCJAbm9ib29rL21vbGVjdWxhci1tb2RlbFwiKSk7XG5cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgY29uc3QgW2xvYWQsIHNldExvYWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbY291bnQsIHNldENvdW50XSA9IHVzZVN0YXRlKDApO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCd4eHgnKVxuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHNldENvdW50KGNvdW50ICsgMSlcbiAgICB9LCAxMDAwKVxuICB9KTtcbiAgLy8gY29uc29sZS5sb2cobG9hZClcbiAgcmV0dXJuICg8ZGl2PlxuICAgIDxzcGFuIG9uQ2xpY2s9eygpID0+IHNldENvdW50KGNvdW50ICsgMSl9PmNsaWNrPC9zcGFuPlxuICAgIDxwPntjb3VudH08L3A+XG4gIDwvZGl2PilcbiAgLy8gcmV0dXJuICFsb2FkID8gKFxuICAvLyAgIDxPcmdhbmljRGVwZW5kSlMgb25Db21wbGV0ZT17KCkgPT4gc2V0TG9hZCh0cnVlKX0gLz5cbiAgLy8gKSA6IChcbiAgLy8gICAvLyA8U3VzcGVuc2UgZmFsbGJhY2s9ezxkaXY+TG9hZGluZy4uLjwvZGl2Pn0+XG4gIC8vICAgLy8gICA8RHluYW1pY0NvbXBvbmVudCAvPlxuICAvLyAgIC8vIDwvU3VzcGVuc2U+XG4gIC8vIC8vICAgLy8gPGRpdj48L2Rpdj5cbiAgLy8gICA8RElZIC8+XG4gIC8vICk7XG59XG5cblJlYWN0RE9NLnJlbmRlcihcbiAgPFJlYWN0LlN0cmljdE1vZGU+XG4gICAgPEFwcCAvPlxuICA8L1JlYWN0LlN0cmljdE1vZGU+LFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIilcbik7XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIlJlYWN0RE9NIiwiQXBwIiwibG9hZCIsInNldExvYWQiLCJjb3VudCIsInNldENvdW50Iiwic2V0SW50ZXJ2YWwiLCJkaXYiLCJzcGFuIiwib25DbGljayIsInAiLCJyZW5kZXIiLCJTdHJpY3RNb2RlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU9BLFNBQXlCQyxTQUFTLEVBQUVDLFFBQVEsUUFBUSxRQUFRO0FBQ25FLE9BQU9DLGNBQWMsWUFBWTtBQUNqQyw4QkFBOEI7QUFDOUIsT0FBTyxjQUFjO0FBQ3JCLDZDQUE2QztBQUM3Qyw2REFBNkQ7QUFFN0QsMEVBQTBFO0FBRTFFLFNBQVNDOztJQUNQLE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHSixTQUFTO0lBQ2pDLE1BQU0sQ0FBQ0ssT0FBT0MsU0FBUyxHQUFHTixTQUFTO0lBQ25DRCxVQUFVO1FBQ1IscUJBQXFCO1FBQ3JCUSxZQUFZO1lBQ1ZELFNBQVNELFFBQVE7UUFDbkIsR0FBRztJQUNMO0lBQ0Esb0JBQW9CO0lBQ3BCLHFCQUFRLFFBQUNHOzswQkFDUCxRQUFDQztnQkFBS0MsU0FBUyxJQUFNSixTQUFTRCxRQUFROzBCQUFJOzs7Ozs7MEJBQzFDLFFBQUNNOzBCQUFHTjs7Ozs7Ozs7Ozs7O0FBRU4sbUJBQW1CO0FBQ25CLHlEQUF5RDtBQUN6RCxRQUFRO0FBQ1IsbURBQW1EO0FBQ25ELDhCQUE4QjtBQUM5QixtQkFBbUI7QUFDbkIsc0JBQXNCO0FBQ3RCLFlBQVk7QUFDWixLQUFLO0FBQ1A7R0F2QlNIO0tBQUFBO0FBeUJURCxTQUFTVyxNQUFNLGVBQ2IsUUFBQ2QsTUFBTWUsVUFBVTtjQUNmLGNBQUEsUUFBQ1g7Ozs7Ozs7OztVQUVIWSxTQUFTQyxjQUFjLENBQUMifQ==