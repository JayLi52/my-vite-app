// @ts-nocheck

import Main from './main';
const canvasDom = document.querySelector("#canvas");
(window as any).demo = new Main(canvasDom);
import * as BABYLON from "babylonjs";

BABYLON.Engine.NBVersion = 'v1.0.0';
