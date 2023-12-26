class DataService {
  private atomData: Object = require("../../documents/atom.json");
  private boundData: Object = require("../../documents/boundLength.json");
  private desktopData: Array<Object> = require("../../documents/desktopData.json");
  public getAtomData(name: string) {
    let obj = this.atomData[name];
    if (obj) {
      obj = { ...obj };
      return obj;
    } else {
      throw new Error(`${name} does not exist`);
    }
  }

  public getDesktopData() {
    return Object.assign([], this.desktopData);
  }

  public getBoundData(name1, name2, value) {
    let obj = this.boundData[name1];
    if (obj) {
      obj = obj[name2];
      if (obj) {
        return obj[value] * 0.8;
      }
    }
    return null;
  }

  public getAtomBounds(name) {
    let obj = this.boundData[name];
    return obj;
  }
}
export default new DataService();
