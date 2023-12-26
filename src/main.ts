// @ts-nocheck

import EventService from "./libs/services/EventService";
import Atom from "./libs/core/Atom";
import Bound from "./libs/core/Bound";
import Camera from "./libs/class/Camera";
import CalculateService from "./libs/services/CalculateService";
import OperationService from "./libs/services/OperationService";
import * as NBEvent from "./libs/events/NBEvent";
import AvailablePosition from "./libs/class/AvailablePosition";
import { createLine } from './libs/utils/createAxes'
import DataService from "./libs/services/DataService";

export default class Main {
  public scene: BABYLON.Scene;
  public justShow = false;
  private engine;
  /**是否是在撤销或者重做的操作中*/
  private inQueue: boolean = false;
  /** 包裹着所有模型的mesh */
  public parent;
  // 唯一的相机
  public camera: any;
  private cameraController;
  public operationService = new OperationService(this);
  // 唯一的光
  private light;
  public advancedTexture;
  // 中心原子，只有中心原子可以连接新原子，并且是摄像头的旋转中心
  private _centerAtom: Atom;

  // 因为Animation顺序问题必须要求 mesh和atom 必须同时完事,建立数组去分别存储它们的Animation
  public atomAnimationAry = [];
  public meshAnimation;
  public currentAtom: string = 'C';
  public currentBondValve: number = 1;

  public NBEvent: any = NBEvent;
  private lastSwitchCenterAtomTime: number = -1;
  private sendChoosedAtomTimeOut: any = null;
  changeCamera: boolean;
  canchoose: boolean;
  canvas: any;
  light2: BABYLON.HemisphericLight;
  waitForPanning: boolean;
  hasPlane: any;
  isHoverAtom: Atom;
  public set centerAtom(v: Atom) {
    // 有可能中心原子并没有改变，但是中心原子的坐标变了
    this._centerAtom = v;
    if (v && !this.changeCamera) {
      let pos = v.body.isAnimating ? v.shouldPos : v.position;
      this.cameraController.centerPos = pos;
    }
    if (this.choosedAtom === v) {
      this.lastSwitchCenterAtomTime = Date.now();
    }
    // 发送到angular切换中心原子
    // this.eventService.activate(NBEvent.change.CENTERATOM, v);
  }
  public get centerAtom() {
    return this._centerAtom;
  }
  public showAngle: boolean = false;
  /**高亮层 */
  public highlight = null;
  public eventService;
  // 单击替换的原子
  // private _choosedAtom: Atom | Bound= null;
  private _choosedAtom: any = null;
  /**
   * 所有的点击事件都可以通过这个set监听， v可以是bound 或者atom
   * @param {event: event, choose: atom || bound || null}
   * @memberof Main
   */
  public set choosedAtom(chooseObj) {
    if (!chooseObj) {
      chooseObj = { choose: null, event: null };
    }
    const NBEvent = this.NBEvent;
    let v;
    let dontEmit = false;
    if (chooseObj.event === undefined) {
      if (chooseObj === this._choosedAtom) {
        dontEmit = true;
      }
      chooseObj = { choose: chooseObj, event: null };
    }
    v = chooseObj.choose;
    if (
      v === this.centerAtom &&
      Date.now() - this.lastSwitchCenterAtomTime < 200
    ) {
      v = null;
    }
    clearTimeout(this.sendChoosedAtomTimeOut);
    if (!v) {
      this.eventService.activate(NBEvent.click.EMPTY, chooseObj);
    } else if (!dontEmit) {
      this.sendChoosedAtomTimeOut = setTimeout(() => {
        switch (true) {
          case v instanceof Atom:
            // 发送原子
            this.eventService.activate(NBEvent.click.ATOM, chooseObj);
            break;
          case v instanceof Bound:
            // 发送化学键
            this.eventService.activate(NBEvent.click.BOUND, chooseObj);
            break;
          case v === null:
            // 发送点击空白
            this.eventService.activate(NBEvent.click.EMPTY, chooseObj);
            break;
        }
      }, 200);
    }

    if (v === this._choosedAtom) return;
    if (v) {
      v.changeStatus(true);
    } else {
    }
    if (this._choosedAtom) {
      this._choosedAtom.changeStatus(false);
    }
    this._choosedAtom = v;
    //TODO
  }
  public get choosedAtom() {
    return this._choosedAtom;
  }
  /** 所有创建的原子*/
  public atoms = [];
  /**所有创建的键*/
  public bounds = [];
  /**显示比例模型*/
  private _showReal: boolean = false;
  /**显示比例模型*/
  public set showReal(v) {
    v = Boolean(v);
    if (v === this._showReal) return;
    for (const element of this.atoms) {
      element.showReal = v;
    }
    this._showReal = v;
  }
  public get showReal() {
    return this._showReal;
  }
  private _showName: boolean = false;
  public set showName(v) {
    v = Boolean(v);
    if (v === this._showName) return;
    for (const element of this.atoms) {
      element.showName = v;
    }
    this._showName = v;
  }
  public get showName() {
    return this._showName;
  }

  constructor(canvas?) {
    this.init(canvas);
  }
  init(canvasDom = null) {
    let canvas = this.canvas = canvasDom;
    if (!this.canvas) {
      canvas = this.canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
    }

    // 绑定事件
    this.addListener(canvas);
    CalculateService.main = this;
    (window as any).CalculateService = CalculateService;
    (window as any).Bound = Bound;
    (window as any).AvailablePosition = AvailablePosition;


    // 设置引擎相关
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    // 渲染吧，scene！
    this.engine.runRenderLoop(this.update.bind(this));
    this.scene.clearColor = new BABYLON.Color4(0.5137254901960784, 0.592156862745098, 0.6627450980392157, 1);
    this.parent = new BABYLON.Mesh("parent", this.scene); // 将 AbstractMesh 更改为 Mesh
    // 自制的摄像机
    this.cameraController = new Camera(this.scene, canvas, this);
    this.camera = this.cameraController.camera;
    // 和摄像机在一个位置万年不动的灯光
    this.light = new BABYLON.HemisphericLight(
      "HemiLight",
      new BABYLON.Vector3(1, 1, -1),
      this.scene
    );
    this.light2 = new BABYLON.HemisphericLight(
      "HemiLight2",
      new BABYLON.Vector3(-1, -1, 1),
      this.scene
    );
    // 灯光的属性们
    this.light.specular = new BABYLON.Color3(0.07, 0.07, 0.07);
    this.light.diffuse = new BABYLON.Color3(1, 1, 1);
    this.light.intensity = 1.3;

    this.light2.specular = new BABYLON.Color3(0.07, 0.07, 0.07);
    this.light2.diffuse = new BABYLON.Color3(1, 1, 1);
    this.light2.intensity = 1.3;
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.resize();
    // 高亮层
    this.highlight = new BABYLON.HighlightLayer("hl", this.scene);
    this.initService();
    this.controlDragAtom();
    this.eventService.subscribe(NBEvent.EMPTY, () => {
      let mesh = this.parent;
      mesh.setPivotPoint(BABYLON.Vector3.Zero());
      mesh.setAbsolutePosition(BABYLON.Vector3.Zero());
      this.camera.radius = 10;
    });

    // 创建全局坐标轴
    this.createGlobalAxis();

    // This section exists solely because we need to account for panning inertial.
    this.scene.beforeRender = () => {
      if (this.centerAtom && this.camera.inertialPanningX === 0 && this.camera.inertialPanningY === 0) {
        const pos = this.centerAtom.position;
        this.cameraController.centerPos = pos;
        this.camera.attachControl(canvas, true);
        this.waitForPanning = false;
      }
    };

    (window as any).CalculateService = CalculateService;

    this.scene.onPointerObservable.add((eventData) => {
      if (this.centerAtom) {
        // If we're still moving, wait for movement to finish and then reset
        if ((this.camera.inertialPanningX !== 0 || this.camera.inertialPanningY !== 0) && (eventData.event.button === 2)) {
          this.waitForPanning = true;
        }
        // If someone release right-click on the mouse
        else if (eventData.event.button === 2) {
          const pos = this.centerAtom.position;
          this.cameraController.centerPos = pos;
          this.waitForPanning = false;
        }
      }
    }, BABYLON.PointerEventTypes.POINTERUP);

    this.scene.onPointerObservable.add((eventData) => {
      if ((this.camera.inertialPanningX !== 0 || this.camera.inertialPanningY !== 0) && (eventData.event.button === 0)) {
        this.camera.detachControl();
      }
    }, BABYLON.PointerEventTypes.POINTERDOWN);
  }


  private resize = () => {
    const canvasContainer = this.canvas.parentNode;
    let w = canvasContainer.clientWidth;
    let h = canvasContainer.clientHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.advancedTexture.scaleTo(w, h);
  }

  private addListener(canvas) {
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    window.addEventListener("dbclick", (e) => {
      e.preventDefault();
    });

    const config = { attributes: true };
    // 创建一个新的MutationObserver并定义回调函数
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          this.resize();
        }
      });
    });
    observer.observe(this.canvas.parentNode, config);

    let lastTime = Date.now();
    let disAtom: Atom;
    let preflag = false;
    // 添加鼠标移动事件监听器
    window.addEventListener('mousemove', (event) => {
      if (Date.now() - lastTime < 500) {
        return;
      } else {
        lastTime = Date.now();
      }
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // 初始化最小距离和最近的球体
      let minDistance = Number.MAX_VALUE;
      let closestAtom = null;
      const rect = canvas.getBoundingClientRect();

      // 遍历所有球体
      for (const atom of this.atoms) {
        // 投影到全局XY平面
        const projectedPosition = BABYLON.Vector3.Project(atom.body.getAbsolutePosition(),
          BABYLON.Matrix.Identity(),
          this.scene.getTransformMatrix(),
          this.scene.activeCamera.viewport.toGlobal(this.scene.getEngine().getRenderWidth(), this.scene.getEngine().getRenderHeight())
        );

        // 转换为canvas坐标
        const canvasPosition = new BABYLON.Vector2(
          projectedPosition.x + rect.left,
          projectedPosition.y + rect.top
        );

        // 计算鼠标位置和投影后的球体位置之间的距离
        const distance = BABYLON.Vector2.Distance(new BABYLON.Vector2(mouseX, mouseY), canvasPosition);

        // 判断距离是否小于最小距离
        if (distance < minDistance) {
          minDistance = distance;
          closestAtom = atom;
        }
      }

      // 如果找到最近的球体
      if (closestAtom && minDistance < 40 && !closestAtom.isPreInteraction && !this.hasPlane) {
        if (this.currentAtom !== '' && this.currentBondValve !== 0) {
          if ((disAtom?.getId() !== closestAtom.getId() || !preflag) && this.canchoose) {
            let atName = this.currentAtom;
            let bdV = this.currentBondValve;
            if (closestAtom.checkAddAtom(bdV) && DataService.getAtomData(atName).freeElectron >= bdV || closestAtom.functionalGroup) {
              preflag = true;
              disAtom = closestAtom;
              this.delPreInteraction();
              this.allAtompreInteraction(closestAtom, this.currentAtom, this.currentBondValve);
            }
          }
        }
        if (disAtom?.getId() !== closestAtom.getId()) {
          preflag = false;
          this.delPreInteraction(disAtom);
          this.canchoose = true;
          console.log("鼠标最近的球体：", closestAtom.name);
        }
        // 在这里执行相应的操作
      } else if (this.atoms.some(atom => { return atom.isPreInteraction }) && this.atoms.length > 1 && minDistance > 100) {
        preflag = false;
        this.delPreInteraction(disAtom);
        this.canchoose = true;
      }
    });
    // 大屏抬起交互方式 误删
    // this.canvas.addEventListener('pointerup', () => {
    //   if (this.isHoverAtom) {
    //     console.log(this.isHoverAtom);
    //     this.isHoverAtom.preInterection(true);
    //   }
    // })
    this.canvas.addEventListener('pointerdown', () => {
      if (this.isHoverAtom) {
        console.log(this.isHoverAtom);
        this.isHoverAtom.preInterection(true);
      }
    })
  }

  private createGlobalAxis() {
    createLine('xAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(10, 0, 0)], [1, 0, 0]);
    createLine('yAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 10, 0)], [0, 1, 0]);
    createLine('zAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 10)], [0, 0, 1]);
  }

  public addBoundToArray(bound) {
    this.bounds.push(bound);
  }
  public removeBoundFromArray(bound) {
    let i = this.bounds.findIndex((v) => v === bound);
    if (i !== -1) {
      this.bounds.splice(i, 1);
    }
  }

  public getAllAtomName() {
    const atoms = ['C', 'H', 'O', 'Cl', 'I', 'benzene']
    return atoms;
  }

  private update() {
    let cameraDistance = this.camera.radius;
    let minDistance = Infinity;
    for (const element of this.atoms) {
      let atom = element;
      let length = atom.body.getAbsolutePosition().z;
      minDistance = minDistance > length ? length : minDistance;
    }
    this.camera.minRadius = -minDistance + 3;
    // for (let i = 0; i < lengths.length; i++) {
    //     let length = lengths[i];
    //     let atom = this.atoms[i];
    //     atom.text.alpha = (maxDistance - length) / dis;
    // }
    this.updateShowName();
    this.scene.render();
  }
  private updateShowName() {
    if (!this.showName) {
      return;
    }
    let centerAtom = this.centerAtom;
    if (!centerAtom) {
      return;
    }
    let centerDistance = centerAtom.body.getAbsolutePosition().z; // 中心点的距离
    let minDistance = centerDistance;
    let maxDistance = centerDistance;
    let lengthAry = [];
    for (const element of this.atoms) {
      let atom = element;
      let lengthObj = {
        type: "center",
        length: centerDistance,
      };

      if (atom === centerAtom) {
        lengthAry.push(lengthObj);
        continue;
      }
      let atomLength = atom.body.getAbsolutePosition().z;
      if (atomLength >= centerDistance) {
        lengthObj.type = "back";
        lengthObj.length = atomLength - centerDistance;
        if (atomLength > maxDistance) {
          maxDistance = atomLength;
        }
      }

      if (atomLength < centerDistance) {
        lengthObj.type = "front";
        lengthObj.length = centerDistance - atomLength;
        if (atomLength < minDistance) {
          minDistance = atomLength;
        }
      }

      lengthAry.push(lengthObj);
    }

    let maxDis = maxDistance - centerDistance;
    let minDis = centerDistance - minDistance;
    for (let i = 0; i < lengthAry.length; i++) {
      let atom = this.atoms[i];
      let lengthObj = lengthAry[i];
      switch (lengthObj.type) {
        case "center":
          atom.text.alpha = 0.5;
          break;
        case "back":
          atom.text.alpha = 0.5 - (lengthObj.length / maxDis) * 0.5;
          break;
        case "front":
          atom.text.alpha = 0.5 + (lengthObj.length / minDis) * 0.5;
          break;
      }
    }
  }

  private controlDragAtom() {
    let scene = this.scene;
    let selectedAtom = null,
      anotherAtom = null,
      radius = null,
      anoPos = null,
      anoAvailablePos = null,
      worldMatrix = null;
    let changeAtom = null;
    // 下面的变量是为单击原子，更改原子而设定的
    let downTime = 0;
    let movement = { x: 0, y: 0 };
    let choosedAtom = null;

    let body = BABYLON.MeshBuilder.CreatePlane(
      "plane",
      { height: 1, width: 1 },
      this.scene
    );
    body.material = new BABYLON.StandardMaterial("temp", this.scene);
    // (window as any).b = body;
    body.enablePointerMoveEvents = true;
    body.isVisible = false;
    body.material.alpha = 0;
    let lastPointerPos, lastHitPos;
    scene.onPointerObservable.add((e) => {
      if (e.event.pointerId === undefined) return;
      // 鼠标按下，判断是否按到了原子的mesh
      if (e.type === BABYLON.PointerEventTypes.POINTERDOWN) {
        let atom = e.pickInfo.pickedMesh && (e.pickInfo.pickedMesh as any).atom;
        if (atom) {
          downTime = Date.now();
          choosedAtom = { event: e, choose: atom };
          if (
            atom.availablePos &&
            atom.availablePos.gotBounds === 1 &&
            atom !== this.centerAtom
          ) {
            return;
          }
        } else {
          this.choosedAtom = { event: e, choose: null };
        }
        return;
      }
      // if (!selectedAtom) return;
      // 鼠标抬起，取消camera的stop属性，继续旋转
      if (e.type === BABYLON.PointerEventTypes.POINTERUP) {
        if (downTime && Date.now() - downTime < 300) {
          this.choosedAtom = choosedAtom;
        }
        choosedAtom = null;
        // if (!selectedAtom) return;
        //   selectedAtom.updateThisPosition();
        //   selectedAtom = null;
        //   this.camera.stop = false;
        //   body.isVisible = false;
        // } else if (e.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        //   if (choosedAtom && this.choosedAtom) {
        //     this.choosedAtom = null;
        //   }
        //   movement.x += e.event.movementX;
        //   movement.y += e.event.movementY;
        //   if (Math.abs(movement.x) + Math.abs(movement.y) > 3) {
        //     downTime = 0;
        //   }
        // if (!selectedAtom) return;
        // let directionVec, result;
        // if (!e.pickInfo.pickedPoint) {
        //   return;
        // } else {
        //   let pos = e.pickInfo.pickedPoint.clone();
        //   body.position = pos;
        //   directionVec = pos.subtract(anoPos).normalize();
        //   result = anoPos.add(directionVec.scale(radius));
        // }
        // // 更改被选中的原子的位置
        // selectedAtom.body.setAbsolutePosition(result);

        // let localVertex = BABYLON.Vector3.TransformNormal(
        //   directionVec,
        //   worldMatrix
        // );
        // let minAngle = Infinity;
        // let newObj;
        // let oldObj;
        // for (const element of anoAvailablePos) {
        //   let obj = element;
        //   if (obj.atom === selectedAtom) {
        //     oldObj = obj;
        //   }
        //   let angle = Math.acos(BABYLON.Vector3.Dot(localVertex, obj.position));
        //   if (angle < minAngle) {
        //     minAngle = angle;
        //     newObj = obj;
        //   }
        // }
        // if (Math.abs(minAngle) < Math.PI / 4 && newObj !== oldObj) {
        //   this.switchTwoAtomPos(oldObj, newObj, selectedAtom, anotherAtom);
        //   this.operationService.add(this, "undoRedoSwitchTwoAtomPos", [
        //     oldObj,
        //     newObj,
        //     selectedAtom,
        //     anotherAtom,
        //   ]);
        // }
      }
    }, BABYLON.PointerEventTypes.POINTERMOVE | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERDOWN);
  }
  // 交换两个原子相对于中心原子的位置
  public switchTwoAtomPos(oldObj, newObj, selectedAtom, anotherAtom) {
    let id = CalculateService.generateChangeId();
    let temp = oldObj.position;
    oldObj.position = newObj.position.clone();
    newObj.position = temp.clone();
    selectedAtom.availablePos[0].position = temp.negate();
    if (newObj.atom instanceof Atom) {
      newObj.atom.updateThisPosition(newObj, anotherAtom);
      anotherAtom.changeId = id;
      // CalculateService.adjustAtomPosition(newObj.atom, anotherAtom);
    }
  }
  // 撤销交换两个原子的位置
  public undoRedoSwitchTwoAtomPos(oldObj, newObj, selectedAtom, anotherAtom) {
    this.switchTwoAtomPos(oldObj, newObj, selectedAtom, anotherAtom);
    selectedAtom.updateThisPosition();
  }

  private initService() {
    this.eventService = new EventService(this);
  }
  /**
   * 暴露给外面的新建原子的接口
   * @param name 原子类别
   * @param keyValue 键的类别
   */
  public publicCreateAndLinkAtom(name, preInteraction, center?, keyValue?) {
    let atom: Atom, centerAtom: Atom = this.choosedAtom;
    if (preInteraction) {
      centerAtom = center;
    }
    if (!centerAtom && this.atoms.length > 0) return;
    let length = this.atoms.length;
    if (!centerAtom) {
      atom = new Atom(this, name, preInteraction);
    }
    this.createAndLinkAtom(atom, preInteraction, centerAtom, keyValue, name);
    this.operationService.add(this, "createAndLinkAtom", [
      atom,
      this.choosedAtom,
      keyValue,
    ]);
    if (length === 0) {
      this.eventService.activate(NBEvent.HAVE_ATOM);
    }
  }
  // 暴露给外面的删除原子的接口
  public publicRemoveAtom(atom) {
    this.removeAtom(atom);
    if (atom.availablePos[0]) {
      this.operationService.add(this, "removeAtom", [
        atom,
        atom.availablePos[0].atom,
        atom.availablePos[0].value,
      ]);
    } else {
      this.operationService.add(this, "removeAtom", [atom]);
    }
    // if(this.centerAtom){
    //     this.centerAtom = this.centerAtom;
    // }
  }
  // 创建第一个原子
  public createFirstAtom(name) {
    if (this.atoms.length === 0) {
      this.publicCreateAndLinkAtom(name, false);
    }
  }
  // 删除预交互
  public delPreInteraction(centerA?) {
    for (let i = this.atoms.length - 1; i >= 0; i--) {
      const item = this.atoms[i];
      if (item.isPreInteraction) {
        this.removeAtom(item);
      }
    }

    if (centerA) {
      this.centerAtom = centerA;
      // 如果没有新增原子，就退回上一次的方向。也就是说，预交互的时候会修改availablePos，没有新增需要还原。
      if (centerA.availablePos.gotBounds === centerA?.lastAvailablePos?.gotBounds) {
        centerA.availablePos = centerA.lastAvailablePos;
        centerA.availablePos.forEach(pos => {
          if (pos.atom !== 0) {
            CalculateService.generateChangeId();
            CalculateService.adjustAtomPosition(pos.atom, centerA);
          }
        });
      }
    }
  }
  //添加预交互
  public allAtompreInteraction(baseAtom: Atom, name, value) {
    console.log('添加所有新原子预交互');
    // 记录上一次的availablePos数组
    const lastAvailablePos: any = [];
    baseAtom.availablePos.forEach(pos => {
      if (pos.atom) {
        const newPos = new AvailablePosition(pos.root);
        newPos.atom = pos.atom;
        newPos.bound = pos.bound;
        newPos.position = pos.position;
        newPos.value = pos.value;
        newPos.oriAngle = pos.oriAngle;
        newPos.randomPerpendicularVector = pos.randomPerpendicularVector;
        lastAvailablePos.push(newPos);
      }
    });
    lastAvailablePos.gotBounds = baseAtom.availablePos.gotBounds;
    baseAtom.lastAvailablePos = lastAvailablePos;
    this.centerAtom = baseAtom;
    this.publicCreateAndLinkAtom(name, true, baseAtom, value);
  }

  /**
   * 添加新原子
   * @param atom 新原子
   * @param preInteraction 是否是预交互
   * @param baseAtom 在哪个原子添加新原子
   * @param keyValue? 新原子与中心原子连接的键值
   */
  public createAndLinkAtom(atom: Atom, preInteraction, baseAtom?, keyValue?, name?) {
    baseAtom = baseAtom === atom ? undefined : baseAtom;
    let centerAtom: Atom = baseAtom || this.choosedAtom;
    if (!centerAtom) {
      if (!this.inQueue) {
        this.choosedAtom = atom;
        if (!this.centerAtom) {
          this.centerAtom = atom;
        }
      }
      this.atoms.push(atom);
    } else if (keyValue && centerAtom.checkAddAtom(keyValue) || centerAtom.functionalGroup) {
      centerAtom.addAtom(atom, name, keyValue, preInteraction);
    } else {
      console.error("未提供连接原子的键值或中心原子无法加入该键值的原子");
    }

    return atom;
  }
  /**
   * 删除原子
   * @param atom 被删除的原子
   * @param baseAtom 把它从哪个原子上删掉
   * @param keyValue 没啥用
   */
  public removeAtom(atom, baseAtom?, keyValue?) {
    if (atom.body.isDisposed()) {
      atom = this.getAtomById(atom.getId());
    }
    if (baseAtom && baseAtom.body.isDisposed()) {
      baseAtom = this.getAtomById(baseAtom.getId());
      if (!baseAtom) debugger;
    }
    let availablePos = atom.availablePos;
    if (!baseAtom && availablePos.gotBounds > 1) {
      throw new Error("暂时仅支持删除只有一个连接的原子");
    }
    let anoAtom = atom.dispose(baseAtom);

    // 从atoms数组中删除这个原子
    let index = this.atoms.findIndex((a) => a === atom);
    this.atoms.splice(index, 1);
    if (this.atoms.length === 0) {
      this.eventService.activate(NBEvent.EMPTY);
    }
    // if (atom === this.centerAtom) {
    //     this.centerAtom = anoAtom;
    // }
  }
  /**
   * 清空
   * @param trash 没啥用
   */
  public clearAll(trash?) {
    // this.centerAtom = null;
    this.choosedAtom = null;
    for (const element of this.atoms) {
      element.dispose();
    }
    this.atoms.length = 0;
    this.bounds.length = 0;
  }

  /**
   * 获取可用于json存储的结构信息
   */
  public getSaveData() {
    CalculateService.updateAngleForPositioning();
    let atomData = [];
    let boundData = [];
    for (const element of this.atoms) {
      atomData.push(element.getSaveData());
    }
    for (const element of this.bounds) {
      boundData.push(element.getSaveData());
    }
    return {
      atomData: atomData,
      boundData: boundData,
      meshPos: this.parent.position.asArray(),
      centerAtom: this.centerAtom ? this.centerAtom.getId() : this.centerAtom,
      choosedAtom: this.choosedAtom
        ? this.choosedAtom.getId()
        : this.choosedAtom,
    };
  }
  /**
   * 暴露给外面的清空接口
   * @param trash 没啥用
   */
  public publicClearAll(trash?) {
    let data = this.getSaveData();
    this.operationService.add(this, "clearAll", [data]);
    this.clearAll();
    this.eventService.activate(NBEvent.EMPTY);
  }
  /**
   * 暴露给外面的恢复接口
   * @param obj
   */
  public publicRestoreData(obj) {
    let length = this.atoms.length;
    this.restoreData(obj);
    if (length === 0 && this.atoms.length > 0) {
      this.eventService.activate(NBEvent.HAVE_ATOM);
    }
    this.operationService.add(this, "restoreData", [obj]);
  }
  /**
   * 根据数据恢复分子模型
   * @param obj
   */
  public restoreData(obj) {
    let { atomData, boundData } = obj;
    let atoms = [];
    for (let i = 0; i < atomData.length; i++) {
      let data = atomData[i];
      let atom = new Atom(this, data.name, false);
      atom.restoreData(data);
      atoms.push(atom);
      this.atoms.push(atom);
    }
    for (let i = 0; i < atomData.length; i++) {
      atoms[i].restoreAvailableData(atomData[i]);
    }
    // if (obj.centerAtom) {
    //     this.centerAtom = this.getAtomById(obj.centerAtom);
    // }
    if (obj.choosedAtom) {
      let atom = this.getAtomById(obj.choosedAtom);
      if (!atom) {
        atom = this.getBoundById(obj.choosedAtom);
      }
      this.choosedAtom = atom;
    }
    if (obj.centerAtom) {
      let atom = this.getAtomById(obj.centerAtom);
      if (!atom) {
        atom = this.getBoundById(obj.centerAtom);
      }
      this.centerAtom = atom;
    }
    if (obj.meshPos) {
      this.parent.position = BABYLON.Vector3.FromArray(obj.meshPos);
    }
  }
  /**
   * 根据原子的id获取原子
   * @param id string
   */
  public getAtomById(id) {
    return this.atoms.find((v) => v.getId() === id);
  }
  /**
   * 根据键的id获取键
   * @param id string
   */
  public getBoundById(id) {
    return this.bounds.find((v) => v.getId() === id);
  }
}
