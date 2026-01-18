export type VehicleType = 'car' | 'light-truck' | 'truck' | 'motorcycle' | 'van' | 'other';

export interface VehicleInfo {
    vehicleType: VehicleType | '';
    otherType: string;
    make: string;
    model: string;
    year: string;
    tireSize: string;
    vin: string;
    notes: string;
}
