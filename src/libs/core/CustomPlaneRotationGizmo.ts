import CalculateService from "../services/CalculateService";

export default class CustomPlaneRotationGizmo extends BABYLON.PlaneRotationGizmo {
  parent: any;
  bound: any;
  initialRotation: any;
  realAngle: any;
  limitAngle: any;
  angle1: number;
  constructor(planeNormal: BABYLON.Vector3, bound, color?: BABYLON.Color3, gizmoLayer?: BABYLON.UtilityLayerRenderer, tessellation?: number, parent?: BABYLON.Nullable<BABYLON.RotationGizmo>, useEulerRotation?: boolean, thickness?: number) {
    super(planeNormal, color, gizmoLayer, tessellation, parent, useEulerRotation, thickness);
    this._rotationDisplayPlane.isVisible = false;
    this._gizmoMesh.scaling.set(1, 1, 1);
    this.bound = bound;
    this.angle1 = 0.0;
    this.initialRotation;
    // 当拖动开始时的回调
    const lastDragPosition = new BABYLON.Vector3();

    this.dragBehavior.onDragStartObservable.add((event) => {
      console.log('Drag Start');
      if (this.attachedMesh) {
        lastDragPosition.copyFrom(event.dragPlanePoint);
        this.initialRotation = this.bound.atom2.body.rotationQuaternion.clone();
      }
    });
    this.dragBehavior.onDragObservable.observers[0].remove();

    const rotationMatrix = new BABYLON.Matrix();
    const planeNormalTowardsCamera = new BABYLON.Vector3();
    let localPlaneNormalTowardsCamera = new BABYLON.Vector3();
    const amountToRotate = new BABYLON.Quaternion();
    // 拖动过程的回调
    this.dragBehavior.onDragObservable.add((event) => {

      if (this.attachedNode) {
        // Calc angle over full 360 degree (https://stackoverflow.com/questions/43493711/the-angle-between-two-3d-vectors-with-a-result-range-0-360)
        const nodeScale = new BABYLON.Vector3(1, 1, 1);
        const nodeQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
        const nodeTranslation = new BABYLON.Vector3(0, 0, 0);
        this._handlePivot();

        this.attachedNode.getWorldMatrix().decompose(nodeScale, nodeQuaternion, nodeTranslation);
        // uniform scaling of absolute value of components
        const uniformScaling = Math.abs(Math.abs(nodeScale.x) - Math.abs(nodeScale.y)) <= BABYLON.Epsilon && Math.abs(Math.abs(nodeScale.x) - Math.abs(nodeScale.z)) <= BABYLON.Epsilon;
        if (!uniformScaling && this.updateGizmoRotationToMatchAttachedMesh) {
          BABYLON.Logger.Warn(
            "Unable to use a rotation gizmo matching mesh rotation with non uniform scaling. Use uniform scaling or set updateGizmoRotationToMatchAttachedMesh to false."
          );
          return;
        }
        nodeQuaternion.normalize();

        const nodeTranslationForOperation = this.updateGizmoPositionToMatchAttachedMesh ? nodeTranslation : this._rootMesh.absolutePosition;
        const newVector = event.dragPlanePoint.subtract(nodeTranslationForOperation).normalize();
        const originalVector = lastDragPosition.subtract(nodeTranslationForOperation).normalize();
        const cross = BABYLON.Vector3.Cross(newVector, originalVector);
        const dot = BABYLON.Vector3.Dot(newVector, originalVector);
        let angle = Math.atan2(cross.length(), dot);
        const w = this.bound.atom2.body.computeWorldMatrix().clone().invert();
        const newPos_g = BABYLON.Vector3.TransformNormal(planeNormal, w);
        planeNormalTowardsCamera.copyFrom(newPos_g);
        
        localPlaneNormalTowardsCamera.copyFrom(planeNormal);
        if (this.updateGizmoRotationToMatchAttachedMesh) {
          nodeQuaternion.toRotationMatrix(rotationMatrix);
          localPlaneNormalTowardsCamera = BABYLON.Vector3.TransformCoordinates(planeNormalTowardsCamera, rotationMatrix);
        }
        // Flip up vector depending on which side the camera is on
        let cameraFlipped = false;
        if (gizmoLayer.utilityLayerScene.activeCamera) {
          const camVec = gizmoLayer.utilityLayerScene.activeCamera.position.subtract(nodeTranslationForOperation).normalize();
          if (BABYLON.Vector3.Dot(camVec, localPlaneNormalTowardsCamera) > 0) {
            planeNormalTowardsCamera.scaleInPlace(-1);
            localPlaneNormalTowardsCamera.scaleInPlace(-1);
            cameraFlipped = true;
          }
        }
        const halfCircleSide = BABYLON.Vector3.Dot(localPlaneNormalTowardsCamera, cross) > 0.0;
        if (halfCircleSide) {
          angle = -angle;
        }
        angle = Math.min(angle, 0.005)
        angle = Math.max(angle, -0.005)
        this.getModelRotationAngle(angle);

        const quaternionCoefficient = -Math.sin(angle / 2);
        amountToRotate.set(
          planeNormalTowardsCamera.x * quaternionCoefficient,
          planeNormalTowardsCamera.y * quaternionCoefficient,
          planeNormalTowardsCamera.z * quaternionCoefficient,
          Math.cos(angle / 2)
        );
        lastDragPosition.copyFrom(event.dragPlanePoint);
        this._angles.y += angle;
        this._rotationShaderMaterial.setVector3("angles", this._angles);
        this._matrixChanged();
        this._attachedMesh.scaling.set(1, 1, 1);
        this.bound.atom2.body.rotationQuaternion.multiplyToRef(amountToRotate.normalize(), this.bound.atom2.body.rotationQuaternion);
        this.bound.atom2.availablePos.forEach((item) => {
          if (item.atom && item.atom !== this.bound.atom1) {
            CalculateService.generateChangeId();
            CalculateService.adjustAtomPosition(item.atom, this.bound.atom2, true);
          }
        })
      }
    });


    // 当拖动结束时的回调
    this.dragBehavior.onDragEndObservable.add((event) => {
      console.log('Drag End');
    });

    this.dragBehavior.moveAttached = false;
  }

  getModelRotationAngle(angle) {
    this.angle1 += (-angle * 180) / Math.PI;
    if (this.angle1 > 360) {
      this.angle1 -= 360;
    } else if (this.angle1 < 0) {
      this.angle1 += 360;
    };
    let bool = false;
    for (let i = 0; i < this.limitAngle?.length; i++) {
      if (Math.abs(this.limitAngle[i] - this.angle1) < 5 || Math.abs(this.limitAngle[i] - this.angle1) > 355) {
        this.realAngle = this.limitAngle[i];
        bool = true;
        break;
      }
    }
    if (!bool) {
      this.realAngle = this.angle1;
    }
  }
}