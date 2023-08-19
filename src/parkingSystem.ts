interface Array<T> {
  find(predicate: (search: T) => boolean): T | undefined;
}

enum SpotType {
  REGULAR,
  HANDICAP,
  VIP,
}

class Vehicle {
  numberPlate: string;
  ownerName: string;
  ticket: Ticket | null;
  spotType: SpotType;

  constructor(numberPlate: string, ownerName: string, spotType: SpotType) {
    this.numberPlate = numberPlate;
    this.ownerName = ownerName;
    this.ticket = null;
    this.spotType = spotType;
  }

  getTicket(): Ticket | null {
    return this.ticket;
  }

  payBill(): string {
    this.ticket = null;

    return "Bill paid";
  }
}

class ParkingSpot {
  id: number;
  type: SpotType;
  parkedVehicle: Vehicle | null;
  isAvailable: boolean;

  constructor(
    id: number,
    type: SpotType,
    parkedVehicle: Vehicle | null,
    isAvailable: boolean = true
  ) {
    this.id = id;
    this.type = type;
    this.parkedVehicle = parkedVehicle;
    this.isAvailable = isAvailable;
  }
}

class ParkingSpotFactory {
  spotCount: number;

  constructor() {
    this.spotCount = 0;
  }

  create(type: SpotType, count: number): ParkingSpot[] {
    const spots: ParkingSpot[] = [];
    for (let i = 0; i < count; i++) {
      this.spotCount++;
      spots.push(new ParkingSpot(this.spotCount, type, null));
    }
    return spots;
  }
}

class ParkingLot {
  lotName: string;
  capacity: number;
  occupiedSpots: number;
  handicapSpots: number;
  vipSpots: number;
  regularSpots: number;
  spots: ParkingSpot[] = [];
  parkingSpotFactory: ParkingSpotFactory = new ParkingSpotFactory();
  static PARK_COST_PER_HOUR = 10;

  constructor(lotName: string, capacity: number) {
    this.lotName = lotName;
    this.capacity = capacity;
    this.occupiedSpots = 0;
    this.vipSpots = Math.ceil(this.capacity * (15 / 100));
    this.handicapSpots = Math.ceil(this.capacity * (5 / 100));
    this.regularSpots = this.capacity - (this.vipSpots + this.handicapSpots);

    // this.parkingSpotFactory = new ParkingSpotFactory();
    this.spots = this.spots.concat(
      this.parkingSpotFactory.create(SpotType.VIP, this.vipSpots)
    );
    this.spots = this.spots.concat(
      this.parkingSpotFactory.create(SpotType.HANDICAP, this.handicapSpots)
    );
    this.spots = this.spots.concat(
      this.parkingSpotFactory.create(SpotType.REGULAR, this.regularSpots)
    );
  }

  checkSpot(): string {
    return `There are ${
      this.capacity - this.occupiedSpots
    } spots left. \nVIP SPOTS: ${this.vipSpots}\nHANDICAP SPOTS: ${
      this.handicapSpots
    } \nREGULAR SPOTS: ${this.regularSpots}`;
  }

  parkVehicle(vehicle: Vehicle): string {
    if (vehicle.ticket?.bill && vehicle.ticket?.bill > 0) {
      return "Please by the bill of last ticket to park again!";
    }

    let availableSpot: ParkingSpot | undefined = this.spots.find(
      (spot) =>
        spot.type === vehicle.spotType &&
        spot.isAvailable &&
        !spot.parkedVehicle
    );

    if (availableSpot) {
      availableSpot.isAvailable = false;
      availableSpot.parkedVehicle = vehicle;

      this.occupiedSpots += 1;

      if (vehicle.spotType === SpotType.VIP) this.vipSpots -= 1;
      else if (vehicle.spotType === SpotType.HANDICAP) this.handicapSpots -= 1;
      else this.regularSpots -= 1;

      vehicle.ticket = new Ticket();

      return `Please park the vehicle at spot number: ${
        availableSpot.id
      } . Your entry time is ${vehicle.ticket.entryTime.toLocaleTimeString()} on ${vehicle.ticket.entryTime.toLocaleDateString()}`;
    } else {
      return `Parking spot is not available for the required type`;
    }
  }

  removeVehicle(vehicle: Vehicle): string {
    for (const spot of this.spots) {
      if (
        !spot.isAvailable &&
        vehicle.numberPlate === spot.parkedVehicle?.numberPlate
      ) {
        spot.isAvailable = true;
        spot.parkedVehicle = null;

        if (vehicle.ticket) {
          vehicle.ticket.exitTime = new Date();
          vehicle.ticket.totalHours =
            (vehicle.ticket.exitTime.getTime() -
              vehicle.ticket.entryTime.getTime()) /
            (1000 * 60 * 60);
          vehicle.ticket.bill =
            vehicle.ticket.totalHours * ParkingLot.PARK_COST_PER_HOUR;

          return `Thank you for parking. You parked for ${vehicle.ticket.totalHours} hours. Hence, your bill is ${vehicle.ticket.bill}`;
        } else {
          return "Vehicle ticket is missing.";
        }
      }
    }
    return "Vehicle not found in the parking lot.";
  }
}

class Ticket {
  ticketNumber: number;
  bill: number | null;
  entryTime: Date;
  exitTime: Date | null;
  totalHours: number | null;

  constructor() {
    this.ticketNumber = Date.now();
    this.bill = 0;
    this.entryTime = new Date();
    this.exitTime = null;
    this.totalHours = 0;
  }
}

const parkingLot = new ParkingLot("Meadow run", 30);
const vehicle1 = new Vehicle("TR5197", "Tarun Rana", SpotType.HANDICAP);
const vehicle2 = new Vehicle("TR534197", "Tarun sdfsdfRana", SpotType.REGULAR);
const vehicle3 = new Vehicle("TR519erwfdsf7", "Tarun Rsadasdana", SpotType.VIP);

console.log(parkingLot.parkVehicle(vehicle1));
console.log(parkingLot.parkVehicle(vehicle2));
console.log(parkingLot.parkVehicle(vehicle3));
// console.log(vehicle1.getTicket());
// console.log(parkingLot.checkSpot());
console.log(parkingLot.removeVehicle(vehicle1));
console.log(parkingLot.removeVehicle(vehicle2));
console.log(parkingLot.removeVehicle(vehicle3));
