const xlsx = require("xlsx");
const fs = require("fs");
sourceData = xlsx.readFile("../../documents/data.xlsx");
let names = sourceData.SheetNames;
// 解析原子数据
let sheet1 = sourceData.Sheets[names[0]];
let array = xlsx.utils.sheet_to_json(sheet1);
let result = {};
let desktopData = [];
for (let i = 0; i < array.length; i++) {
    let obj = array[i];
    let name = obj.name;
    obj.radius = parseInt(obj.radius);
    obj.freeElectron = parseInt(obj.freeElectron);
    let color = parseInt(obj.color);
    desktopData.push({name:name,color:obj.color.slice(2),radius:obj.radius,freeElectron:obj.freeElectron});
    obj.color = [(color >> 16) / 255, ((color >> 8) & 0xff) / 255, (color & 0xff) / 255];
    delete obj.name;
    result[name] = obj;
}
fs.writeFileSync(`../../documents/${names[0]}.json`, JSON.stringify(result));
fs.writeFileSync(`../../documents/desktopData.json`, JSON.stringify(desktopData));
// 解析键长
array = xlsx.utils.sheet_to_json(sourceData.Sheets[names[2]]);
result = {};
for (let i = 0; i < array.length; i++) {
    let obj = array[i];
    let length = parseInt(obj.length);
    if(!length)continue;
    let [firstName, secondName, value] = obj.bound.split('-');
    length*=0.0135;
    generateObj(firstName,secondName,value,length);
    generateObj(secondName,firstName,value,length);
}
function generateObj(firstName,secondName,value,length){
    let firstObj = result[firstName];
    if (!firstObj) {
        firstObj = result[firstName] = {};
    }
    let secondObj = firstObj[secondName];
    if (!secondObj) {
        secondObj = firstObj[secondName] = {};
    }
    secondObj[value]=length;
}
fs.writeFileSync(`../../documents/${names[2]}.json`, JSON.stringify(result));

