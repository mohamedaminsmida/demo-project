import type { VehicleInfo } from './vehicle';

export interface AppointmentInfo {
    date: string;
    time: string;
}

export interface CustomerInfo {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    smsUpdates: boolean;
}

export interface BookingState {
    vehicle: VehicleInfo;
    serviceRequirements: Record<string, Record<string, unknown>>;
    appointment: AppointmentInfo;
    customer: CustomerInfo;
}
