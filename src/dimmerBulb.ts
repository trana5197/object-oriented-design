class Bulb {
  name: string;
  brightness: number;

  constructor(name: string) {
    this.name = name;
    this.brightness = 0;
  }

  setBrightness(value: number) {
    this.brightness = value;
  }

  getBrightness() {
    return this.brightness;
  }
}

class DimmerSwitch {
  minLevel: number;
  maxLevel: number;
  curLevel: number;
  connectedBulb: Bulb[];

  constructor(minLevel: number = 5, maxLevel: number = 15) {
    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
    this.curLevel = minLevel;
    this.connectedBulb = [];
  }

  setBrightness(value: number) {
    if (value < this.minLevel) {
      this.curLevel = this.minLevel;
    } else if (value > this.maxLevel) {
      this.curLevel = this.maxLevel;
    } else {
      this.curLevel = value;
    }

    for (const bulb of this.connectedBulb) {
      bulb.setBrightness(value);
    }
  }

  connectBulb(bulb: Bulb) {
    this.connectedBulb.push(bulb);
    bulb.setBrightness(this.curLevel);
  }

  increaseBrightness(step: number = 1) {
    const newValue = this.curLevel + step;
    this.setBrightness(newValue);
  }

  decreaseBrightness(step: number = 1) {
    const newValue = this.curLevel - step;
    this.setBrightness(newValue);
  }

  getCurrentLevel() {
    return this.curLevel;
  }
}

// Example usage with a single bulb
const singleBulb = new Bulb("Creative Room Bulb");
const singleDimmer = new DimmerSwitch(5, 15);
singleDimmer.connectBulb(singleBulb);
singleDimmer.increaseBrightness(4);
console.log(singleBulb.name, "brightness:", singleBulb.getBrightness());

// Example usage with multiple bulbs
const bulb1 = new Bulb("Living Room Bulb");
const bulb2 = new Bulb("Bedroom Bulb");
const multiDimmer = new DimmerSwitch(5, 15);
multiDimmer.connectBulb(bulb1);
multiDimmer.connectBulb(bulb2);
multiDimmer.decreaseBrightness(2);
console.log(bulb1.name, "brightness:", bulb1.getBrightness());
console.log(bulb2.name, "brightness:", bulb2.getBrightness());
