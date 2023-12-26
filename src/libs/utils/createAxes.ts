export function createLine(name: string, scene: BABYLON.Scene, dir: Array<BABYLON.Vector3>, color: Array<number>, body?: BABYLON.Mesh) {
    const line = BABYLON.MeshBuilder.CreateLines(
        name, {
        points: dir,
        updatable: true,
    },
    scene
    );
    if (body) {
        line.parent = body;
    }
    // 设置材质，颜色等
    line.color = new BABYLON.Color3(color[0], color[1], color[2]); // 设置射线颜色
    line.alpha = 1; // 设置透明度
}