/*
 * @module:
 * @Description: 结构化学依赖js文件加载
 * @Author: wangshengjin
 * @Date: 2021-09-29 13:37:58
 * @LastEditors: wangshengjin
 * @LastEditTime: 2021-11-09 14:47:15
 */

import AddScript from './add/index';
import React from 'react';
// import babylongui from '../assets/babylon.gui'
// import babylonmin from '../assets/babylon'

export const scriptList = [
  "http://127.0.0.1:3000/libs/babylon.js",
  "http://127.0.0.1:3000/libs/babylon.gui.js"
];

type DependProp = {
  onComplete: () => void; // 加载完成
};

const OrganicDependJS: React.FC<DependProp> = (props) => {
  return <AddScript data={scriptList} onComplete={props.onComplete} />;
};

/**
 * 结构化学依赖js文件加载
 */
export default OrganicDependJS;
