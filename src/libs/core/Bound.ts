// @ts-nocheck

import Atom from "./Atom";
import DataService from "../services/DataService";
import CalculateService from "../services/CalculateService";
import CustomPlaneRotationGizmo from "./CustomPlaneRotationGizmo";
const INIT_RADIUS = .12;

export default class Bounds {
    public length;
    private _id: string = "#" + Math.round(Math.random() * 1e10);
    private bounds = [];
    private deltaVector: BABYLON.Vector3;
    private radius: number = INIT_RADIUS;
    private anotherVector: BABYLON.Vector3;
    // private data: Object;
    private scene;
    private renderFunc: Array<Function> = [];
    gizmo: CustomPlaneRotationGizmo;
    constructor(private atom1: Atom, private atom2: Atom, private boundValue: number, private atomMain, preInteraction: boolean) {
        if (!atom1 || !atom2) debugger;
        this.atomMain.addBoundToArray(this);
        this.init(preInteraction);
    }
    public getId() {
        return this._id;
    }
    public setId(v) {
        this._id = v;
    }
    private init(preInteraction) {
        this.scene = this.atomMain.scene;
        this.length = DataService.getBoundData(this.atom1.name, this.atom2.name, this.boundValue);
        this.generateAnotherVector();
        if (this.boundValue == 2) {
            this.radius = INIT_RADIUS * .7;
        } else if (this.boundValue === 3) {
            this.radius = INIT_RADIUS * .55;
        }
        for (let i = 0; i < this.boundValue; i++) {
            this.createBound(i, preInteraction);
        }
    }

    public changeRelatedAtom(atom1, atom2) {
        this.atom1 = atom1;
        this.atom2 = atom2;
        this.length = DataService.getBoundData(this.atom1.name, this.atom2.name, this.boundValue);
    }

    public createPlane(mesh) {
        this.atomMain.hasPlane = true;
        CalculateService.updateAngleForPositioning();
        if (!this.atomMain.utilLayer) {
            const utilLayer = new BABYLON.UtilityLayerRenderer(this.atomMain.scene);
            this.atomMain.utilLayer = utilLayer;
        }
        let p1 = this.atom1.position;
        let p2 = this.atom2.position;
        let p = p1.subtract(p2);
        let pos = this.atom1.position.add(this.atom2.position).scale(0.5);
        const attachedMeshes = new BABYLON.AbstractMesh('root', this.scene);
        p = BABYLON.Vector3.TransformNormal(p, this.bounds[0].computeWorldMatrix(true));
        const gizmo = new CustomPlaneRotationGizmo(p, this, BABYLON.Color3.FromHexString("#00b894"), this.atomMain.utilLayer);
        gizmo.updateScale = false;
        gizmo.attachedMesh = attachedMeshes;
        gizmo.attachedMesh.position = pos;
        mesh.gizmo = gizmo;
        this.atomMain.gizmo = gizmo;
        // Updating using local rotation
        gizmo.updateGizmoRotationToMatchAttachedMesh = true;
        gizmo.updateGizmoPositionToMatchAttachedMesh = true;
    }

    public removePlane(){
        CalculateService.updateAngleForPositioning();
        this.atomMain.hasPlane = false;
        this.atomMain.gizmo.dispose();
        this.atomMain.gizmo.bound.bounds[0].gizmo = null;
        this.atomMain.gizmo = null;
    }



    private generateDeltaVector() {
        let p1 = this.atom1.position;
        let p2 = this.atom2.position;
        if (p1.equals(p2)) {
            p2.x += 1e-5;
        }
        this.deltaVector = BABYLON.Vector3.Cross(this.anotherVector, p2.subtract(p1)).normalize();
        if (this.deltaVector.equals(BABYLON.Vector3.Zero())) {
            this.generateAnotherVector();
            this.generateDeltaVector();
        }
    }
    private generateAnotherVector() {
        this.anotherVector = new BABYLON.Vector3(Math.random(), Math.random(), Math.random());
    }

    private getLinearImage(c, h, length) {

        let y1 = c.radius / (2 * length) * 100, y2 = 100 - (h.radius / (2 * length) * 100);
        if (y1 > y2) {
            y1 = 100 - (h.radius / (2 * length) * 100);
            y2 = c.radius / (2 * length) * 100;
        }

        const coordinateCy = Math.floor(c.electronegativity / (c.electronegativity + h.electronegativity) * 100);
        const offset1 = ((y2 - y1) * coordinateCy / 100 + y1) * 0.85;
        const offset2 = ((y2 - y1) * coordinateCy / 100 + y1) * 1.15;

        const a = `
            <svg width = '60px' height='60px' xmlns='http://www.w3.org/2000/svg' version='1.1'>
              <defs>
                <linearGradient id = "def" x1="0%" y1="${y1}%" x2="0%" y2="${y2}%">
                  <stop offset = "${offset1}%" style = "stop-color: rgb(${c.color[0] * 255},${c.color[1] * 255},${c.color[2] * 255}); stop-opacity: 1" ></stop>
                  <stop offset = "${offset2}%" style = "stop-color: rgb(${h.color[0] * 255},${h.color[1] * 255},${h.color[2] * 255}); stop-opacity: 1"></stop>
                </linearGradient>
              </defs>
              <rect width='60px' height='60px' style= "fill: url(#def)"></rect>
            </svg>
        `;

        const p = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(a)))}`;
        return p;
    }

    private createBound(index, preInteraction) {
        let path = [this.atom1.position, this.atom2.position.add(new BABYLON.Vector3(0, 2, 0))];
        let mesh: any = BABYLON.Mesh.CreateTube("tube", path, this.radius, 64, null, BABYLON.Mesh.CAP_ALL, this.scene, true);
        this.bounds.push(mesh);
        mesh.atom = this;
        mesh.parent = this.atomMain.parent;
        let material = new BABYLON.StandardMaterial("mat1", this.scene);
        let svgBase64 = this.getLinearImage(this.atom2, this.atom1, 0.8);
        material.diffuseTexture = new BABYLON.Texture(svgBase64, this.scene);//new BABYLON.Color3(0.6, 0.6, 0.6); // 
        material.specularPower = 200;
        material.roughness = 1;
        material.specularColor.set(0.2, 0.2, 0.2);

        mesh.material = material;
        material.backFaceCulling = false;
        material.twoSidedLighting = true;
        if (preInteraction) {
            material.alpha = 1;
        }
        let renderFunc = () => {
            let p1 = path[0] = this.atom1.position;
            let p2 = path[1] = this.atom2.position;
            if (this.boundValue > 1) {
                let dis = p2.subtract(p1);
                if (!this.deltaVector || Math.abs(BABYLON.Vector3.Dot(dis, this.deltaVector)) > 1e-6) {
                    this.generateDeltaVector();
                }
                let deltaLength = (index - (this.boundValue - 1) / 2) * .22;
                let deltaVector = this.deltaVector.scale(deltaLength);
                path[0] = p1.add(deltaVector);
                path[1] = p2.add(deltaVector);
            }
            // Dispose 旧的 mesh
            // mesh.dispose();
            // 创建新的 mesh
            mesh = BABYLON.Mesh.CreateTube(null, path, this.radius, null, null, null, null, null, null, mesh);
            // this.bounds.push(mesh);
            // mesh.atom = this;
            // mesh.parent = this.atomMain.parent;
            // // 设置新的 material
            // mesh.material = new BABYLON.StandardMaterial("mat", this.scene);
            // mesh.material.diffuseTexture = new BABYLON.Texture(svgBase64, this.scene);
            // material.specularPower = 200;
            // material.roughness = 1;
            // material.specularColor.set(0.2, 0.2, 0.2);

            // mesh.material = material;
            // material.backFaceCulling = false;
            // material.twoSidedLighting = true;
            // if (preInteraction) {
            //     material.alpha = 0.4;
            // }
        }

        this.scene.registerBeforeRender(renderFunc);
        this.renderFunc.push(renderFunc);
    }

    public changeStatus(choosed: boolean) {
        let highlight = this.atomMain.highlight;
        if (choosed) {
            for (let i = 0; i < this.bounds.length; i++) {
                highlight.addMesh(this.bounds[i], new BABYLON.Color3(.2, .2, .2));
            }
        } else {
            for (let i = 0; i < this.bounds.length; i++) {
                highlight.removeMesh(this.bounds[i]);
            }
        }
    }

    public checkChange(atom?, keyValue?) {
        let minFree = Math.min(this.atom1.freeElectron, this.atom2.freeElectron) + this.boundValue;
        if (keyValue) {
            return minFree >= keyValue;
        }
        return minFree;
    }

    public changeKeyValue(keyValue) {
        if (keyValue === this.boundValue) return;
        this.dispose();
        let dis = this.boundValue - keyValue;
        this.boundValue = keyValue;
        this.init(false);
        this.atom1.freeElectron += dis;
        this.atom2.freeElectron += dis;
    }

    public getSaveData() {
        return {
            id: this.getId(),
            boundValue: this.boundValue,
            atom1: this.atom1.getId(),
            atom2: this.atom2.getId(),
        };
    }

    public dispose() {
        this.atomMain.removeBoundFromArray(this);
        for (let i = 0; i < this.renderFunc.length; i++) {
            this.scene.unregisterBeforeRender(this.renderFunc[i]);
        }
        for (let i = 0; i < this.bounds.length; i++) {
            this.bounds[i].dispose();
        }
    }
}