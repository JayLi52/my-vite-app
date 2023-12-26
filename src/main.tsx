import React, { lazy, Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
// import App from './App.tsx'
import "./index.css";
// import DIY from '@nobook/molecular-model';
// import OrganicDependJS from './components/OrganicDependJS'

// const DynamicComponent = lazy(() => import("@nobook/molecular-model"));

function App() {
  const [load, setLoad] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    // console.log('xxx')
    setInterval(() => {
      setCount(count + 1)
    }, 1000)
  });
  // console.log(load)
  return (<div>
    <span onClick={() => setCount(count + 1)}>click</span>
    <p>{count}</p>
  </div>)
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

// import React, { useState, useEffect } from 'react';

function useCounter(initialValue = 0, step = 1) {
  // 使用 useState 来创建状态
  const [count, setCount] = useState(initialValue);

  // 定义自定义的增加和减少函数
  const increment = () => setCount(count => count + step);
  const decrement = () => setCount(count - step);

  // 返回有用的信息和操作
  return {
    count,
    increment,
    decrement,
  };
}

// 使用自定义 Hook 的组件示例
function CounterComponent() {
  // 使用 useCounter 自定义 Hook
  const { count, increment, decrement } = useCounter(0, 2);

  const handleClick = () => {
    // 这里的多次 setState 调用会被合并为一个批量更新
    increment();
    // increment();
    // increment();
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const Counter = () => {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMessage(`Count is ${count}`);
  }, [count]);

  return (
    <div>
      <p>{message}</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
};

// export default Counter;


ReactDOM.render(
  // <React.StrictMode>
    <Counter />,
  // </React.StrictMode>,
  document.getElementById("root")
);
