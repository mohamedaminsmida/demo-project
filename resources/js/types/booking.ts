import type { VehicleInfo } from './vehicle';

export interface AppointmentInfo {
    date: string;
    time: string;
}

export interface CustomerInfo {
    fullName: string;
    phone: string;
    email: string;
    smsUpdates: boolean;
}

export interface BookingState {
    vehicle: VehicleInfo;
    serviceRequirements: Record<string, Record<string, any>>;
    appointment: AppointmentInfo;
    customer: CustomerInfo;
}
