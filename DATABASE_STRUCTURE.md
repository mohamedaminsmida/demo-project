# Database Structure Documentation

## Overview

This document describes the normalized database structure for the service booking system.

---

## Tables

### 1. **users** (Admins)

Stores admin account information (not customers).

**Columns:**

- `id` - Primary key
- `name` - User's full name
- `email` - Email (unique)
- `phone` - Phone number (optional)
- `address` - Street address (optional)
- `city` - City (optional)
- `state` - State (optional)
- `zip_code` - ZIP/Postal code (optional)
- `password` - Hashed password
- `sms_notifications` - Boolean for SMS preferences
- `email_notifications` - Boolean for email preferences
- `email_verified_at` - Email verification timestamp
- `remember_token` - Remember me token
- `created_at`, `updated_at`

---

### 2. **customers**

Stores customer information for bookings.

**Columns:**

- `id` - Primary key
- `name` - Customer full name
- `email` - Email (unique)
- `phone` - Phone number
- `address` - Street address (optional)
- `city` - City (optional)
- `state` - State (optional)
- `zip_code` - ZIP/Postal code (optional)
- `notes` - Notes (optional)
- `created_at`, `updated_at`

---

### 3. **vehicles**

Stores vehicles owned by customers.

**Columns:**

- `id` - Primary key
- `customer_id` - Foreign key to customers table
- `type` - Enum: 'car', 'suv', 'truck', 'van', 'light-truck', 'motorcycle', 'other'
- `brand` - Vehicle brand (Toyota, Ford, Honda, etc.)
- `model` - Vehicle model (Camry, F-150, Civic, etc.)
- `year` - Manufacturing year
- `vin` - VIN number (optional)
- `tire_size` - Tire size (e.g., 225/65R17)
- `notes` - Additional notes
- `is_primary` - Boolean (customer's primary vehicle)
- `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to: `customers`
- Has many: `service_appointments`

---

### 4. **services**

Service catalog (11 service types).

**Columns:**

- `id` - Primary key
- `slug` - Unique slug (e.g., 'new-tires', 'oil-change')
- `name` - Service name (e.g., 'New Tires', 'Oil Change')
- `category` - Enum: 'tires', 'maintenance', 'repairs'
- `description` - Service description
- `image` - Service image (optional)
- `details` - JSONB details (optional)
- `estimated_duration` - Duration estimate (e.g., '1-2 hours')
- `base_price` - Base price (nullable)
- `is_active` - Boolean (service availability)
- `required_fields` - JSONB array of field names to display in form (e.g., ['tire_condition', 'number_of_tires'])
- `created_at`, `updated_at`

**Service List:**

1. New Tires (`new-tires`)
2. Used Tires (`used-tires`)
3. Wheel Alignment (`alignment`)
4. Wheels (`wheels`)
5. Flat Repair (`flat-repair`)
6. Oil Change (`oil-change`)
7. Brake Service (`brakes`)
8. Engine Repair (`engine-repair`)
9. Engine Replacement (`engine-replacement`)
10. Transmission Service (`transmission`)
11. Lift Kit Installation (`lift-kit`)

**Relationships:**

- Has many: `appointment_services` (through pivot)
- Has many: `service_appointments` (through `appointment_services`)

---

### 5. **service_appointments**

Main appointment/booking table.

**Columns:**

- `id` - Primary key
- `customer_id` - Foreign key to customers table
- `vehicle_id` - Foreign key to vehicles table
- `appointment_date` - Scheduled date
- `appointment_time` - Scheduled time slot
- `customer_name` - Contact name (can differ from user)
- `customer_phone` - Contact phone
- `customer_email` - Contact email
- `final_price` - Total final charged amount
- `status` - Enum: 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'
- `created_at`, `updated_at`, `deleted_at`

**Relationships:**

- Belongs to: `customers`, `vehicles`
- Has many: `appointment_services` (through pivot)
- Has many: `services` (through `appointment_services`)

---

### 6. **appointment_services** (Pivot Table)

Links appointments with multiple services (many-to-many relationship).

**Columns:**

- `id` - Primary key
- `service_appointment_id` - Foreign key to service_appointments table
- `service_id` - Foreign key to services table
- `price` - Price for this specific service
- `created_at`, `updated_at`

**Relationships:**

- Belongs to: `service_appointments`, `services`
- Has one: `service_appointment_details`

---

### 7. **service_appointment_details**

Service-specific details for each service in an appointment.

**Columns:**

- `id` - Primary key
- `appointment_service_id` - Foreign key to appointment_services table

**Tire Service Fields:**

- `tire_condition` - Enum: 'new', 'used' (nullable)
- `number_of_tires` - Integer 1-4 (nullable)
- `tpms_service` - Boolean (nullable)
- `alignment_service` - Boolean (nullable)
- `wheel_type` - String: alloy, steel, chrome, etc. (nullable)

**Oil Change Fields:**

- `oil_type` - Enum: 'conventional', 'synthetic', 'synthetic-blend', 'full-synthetic', 'high-mileage' (nullable)
- `last_change_date` - Date (nullable)

**Brake Service Fields:**

- `brake_position` - Enum: 'front', 'rear', 'both' (nullable)
- `noise_or_vibration` - Boolean (nullable)
- `warning_light` - Boolean (nullable)

**Repair Service Fields:**

- `problem_description` - Text (nullable)
- `vehicle_drivable` - Enum: 'yes', 'no' (nullable)
- `symptom_type` - String (nullable)
- `other_symptom_description` - Text (nullable)
- `photo_paths` - JSON array of file paths (nullable)

- `created_at`, `updated_at`

**Relationships:**

- Belongs to: `service_appointments`

---

## Relationships Diagram

```
customers (1) ──────< (many) vehicles
  │
  │
  └──────< (many) service_appointments
                        │
                        │
                        └──────< (many) appointment_services >────── (1) services
                                           │
                                           │
                                           └──── (1) service_appointment_details
```

**Key Points:**

- One appointment can have **multiple services** (e.g., tires + oil change + brakes)
- Each service in an appointment can have its own specific details
- Prices are tracked both per-service and total per-appointment

---

## Service-Specific Column Usage

### **New Tires / Used Tires**

- `tire_condition` ✓
- `number_of_tires` ✓
- `tpms_service` ✓
- `alignment_service` ✓

### **Wheel Alignment**

- (Uses vehicle's tire_size from vehicles table)

### **Wheels**

- `wheel_type` ✓

### **Flat Repair**

- `number_of_tires` ✓

### **Oil Change**

- `oil_type` ✓
- `last_change_date` ✓

### **Brake Service**

- `brake_position` ✓
- `noise_or_vibration` ✓
- `warning_light` ✓

### **Engine Repair / Engine Replacement / Transmission / Lift Kit**

- `problem_description` ✓
- `vehicle_drivable` ✓
- `photo_paths` ✓

---

## Migration Order

Run migrations in this order:

1. `0001_01_01_000000_create_users_table.php`
2. `0001_01_01_000001_create_cache_table.php`
3. `0001_01_01_000002_create_jobs_table.php`
4. `2026_01_16_000100_add_columns_to_users_table.php`
5. `2026_01_16_000101_create_customers_table.php`
6. `2026_01_16_000102_create_services_table.php`
7. `2026_01_16_000103_create_vehicles_table.php`
8. `2026_01_16_000104_create_service_appointments_table.php`
9. `2026_01_16_000105_create_appointment_services_table.php`
10. `2026_01_16_000106_create_service_appointment_details_table.php`

```bash
php artisan migrate
```

---

## Key Design Decisions

1. **Normalized Structure**: Separate tables for users, vehicles, services, and appointments
2. **Many-to-Many Relationship**: One appointment can have multiple services (e.g., tires + oil change + engine repair)
3. **Pivot Table**: `appointment_services` links appointments with services and tracks individual service prices
4. **Flexible Details**: Service-specific data in separate `service_appointment_details` table with nullable columns
5. **Customer-Vehicle Relationship**: Customers can have multiple vehicles
6. **Service Catalog**: Services defined once, referenced by appointments
7. **Soft Deletes**: Enabled on vehicles and appointments for data retention
8. **Contact Flexibility**: Appointment contact info can differ from user account info
9. **Price Tracking**: Both per-service pricing and total appointment pricing
