import React from 'react';

export type ScriptProps = {
  data: string[];
  onComplete: () => void;
};

/**
 * 可向document添加script的组件
 * @param props
 * @returns
 */
const AddScript: React.FC<ScriptProps> = (props) => {
  const arr = props.data;
  const loadScript = (value: string[]) => {
    if (value.length === 0) {
      props.onComplete();
      return;
    }
    const url = value.shift();
    const script = document.createElement('script');
    script.src = url as any;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        loadScript(value);
      }, 10);
    };
    document.head.appendChild(script);
  };
  loadScript(arr);
  return <div style={{ display: 'none' }} />;
};

export default AddScript;
