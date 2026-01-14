# Dynamic Forms Flow

## Overview

This document explains how the system dynamically displays form fields based on selected services.

---

## How It Works

### 1. **User Selects Services**

User clicks on service cards (e.g., "New Tires", "Oil Change", "Engine Repair")

### 2. **Frontend Fetches Service Details**

```javascript
// API call to get service details
GET /api/services?ids=1,6,8

// Response includes required_fields for each service
[
  {
    id: 1,
    slug: 'new-tires',
    name: 'New Tires',
    required_fields: ['tire_condition', 'number_of_tires', 'tpms_service', 'alignment_service']
  },
  {
    id: 6,
    slug: 'oil-change',
    name: 'Oil Change',
    required_fields: ['oil_type', 'last_change_date']
  },
  {
    id: 8,
    slug: 'engine-repair',
    name: 'Engine Repair',
    required_fields: ['problem_description', 'vehicle_drivable', 'photo_paths']
  }
]
```

### 3. **Frontend Dynamically Renders Form Fields**

For each selected service, render its specific fields:

```tsx
{
    selectedServices.map((service) => (
        <div key={service.id}>
            <h3>{service.name}</h3>
            {service.required_fields.includes('tire_condition') && <Select label="Tire Condition" options={['new', 'used']} />}
            {service.required_fields.includes('number_of_tires') && <Select label="Number of Tires" options={[1, 2, 3, 4]} />}
            {service.required_fields.includes('oil_type') && <Select label="Oil Type" options={['conventional', 'synthetic']} />}
            {service.required_fields.includes('problem_description') && <Textarea label="Problem Description" />}
            // ... and so on for all field types
        </div>
    ));
}
```

---

## Field Types Mapping

### **Tire Services Fields**

- `tire_condition` → Select (new/used)
- `number_of_tires` → Select (1-4)
- `tpms_service` → Checkbox
- `alignment_service` → Checkbox
- `wheel_type` → Input text

### **Oil Change Fields**

- `oil_type` → Select (conventional/synthetic)
- `last_change_date` → Date picker

### **Brake Service Fields**

- `brake_position` → Select (front/rear/both)
- `noise_or_vibration` → Checkbox
- `warning_light` → Checkbox

### **Repair Services Fields**

- `problem_description` → Textarea
- `vehicle_drivable` → Radio (yes/no)
- `photo_paths` → File upload (multiple)

---

## Database Flow

### **Step 1: User Submits Form**

```json
{
    "user_id": 1,
    "vehicle_id": 2,
    "appointment_date": "2026-01-20",
    "appointment_time": "9:00 AM",
    "customer_name": "John Doe",
    "customer_phone": "555-1234",
    "customer_email": "john@example.com",
    "services": [
        {
            "service_id": 1,
            "price": 400.0,
            "details": {
                "tire_condition": "new",
                "number_of_tires": 4,
                "tpms_service": true,
                "alignment_service": false
            }
        },
        {
            "service_id": 6,
            "price": 45.0,
            "details": {
                "oil_type": "synthetic",
                "last_change_date": "2025-07-15"
            }
        }
    ]
}
```

### **Step 2: Backend Creates Records**

**1. Create Appointment:**

```sql
INSERT INTO service_appointments (user_id, vehicle_id, appointment_date, ...)
VALUES (1, 2, '2026-01-20', ...);
-- Returns appointment_id = 100
```

**2. Create Appointment Services (Pivot):**

```sql
INSERT INTO appointment_services (service_appointment_id, service_id, price)
VALUES
  (100, 1, 400.00),  -- Returns id = 200
  (100, 6, 45.00);   -- Returns id = 201
```

**3. Create Service Details:**

```sql
-- For New Tires (appointment_service_id = 200)
INSERT INTO service_appointment_details (appointment_service_id, tire_condition, number_of_tires, tpms_service, alignment_service)
VALUES (200, 'new', 4, true, false);

-- For Oil Change (appointment_service_id = 201)
INSERT INTO service_appointment_details (appointment_service_id, oil_type, last_change_date)
VALUES (201, 'synthetic', '2025-07-15');
```

---

## Frontend Component Structure

```tsx
// ServicesCards.tsx - User selects services
<ServicesCards services={allServices} onServiceSelect={(serviceIds) => setSelectedServices(serviceIds)} />;

// ServiceDetailsForm.tsx - Dynamic form for each service
{
    selectedServices.map((service) => (
        <ServiceDetailsForm
            key={service.id}
            service={service}
            requiredFields={service.required_fields}
            onFieldChange={(field, value) => updateServiceDetails(service.id, field, value)}
        />
    ));
}

// AppointmentSummary.tsx - Review before submit
<AppointmentSummary vehicle={selectedVehicle} services={selectedServicesWithDetails} totalPrice={calculateTotal()} />;
```

---

## API Endpoints Needed

### **1. Get Services**

```
GET /api/services
GET /api/services?category=tires
GET /api/services?ids=1,6,8
```

### **2. Create Appointment**

```
POST /api/appointments
Body: { user_id, vehicle_id, appointment_date, services: [...] }
```

### **3. Get User's Appointments**

```
GET /api/appointments?user_id=1
```

---

## Validation Rules

Each field type has validation:

- `tire_condition`: required, enum('new', 'used')
- `number_of_tires`: required, integer, min:1, max:4
- `oil_type`: required, enum('conventional', 'synthetic')
- `brake_position`: required, enum('front', 'rear', 'both')
- `problem_description`: required, string, min:10
- `vehicle_drivable`: required, enum('yes', 'no')
- `photo_paths`: optional, array, max:5 files

---

## Summary

✅ **Architecture supports dynamic forms**  
✅ **`required_fields` column defines which fields to show**  
✅ **Frontend reads from DB and renders fields dynamically**  
✅ **Each service in an appointment has its own details**  
✅ **Flexible and scalable for adding new services**

The current architecture is **perfectly suited** for dynamic form rendering!
