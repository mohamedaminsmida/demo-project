# Service Columns Mapping

This document lists all the database columns required for each service type in the `services` table.

## Common Columns (All Services)

- `id` - Primary key
- `service_type` - Service slug (e.g., 'new-tires', 'oil-change')
- `service_name` - Human-readable service name
- `vehicle_type` - car, suv, truck, van
- `vehicle_brand` - Toyota, Ford, Honda, etc.
- `vehicle_model` - Camry, F-150, Civic, etc.
- `vehicle_year` - 2020, 2021, etc.
- `vehicle_vin` - VIN number (optional)
- `vehicle_notes` - Additional notes
- `appointment_date` - Scheduled date
- `appointment_time` - Scheduled time slot
- `customer_name` - Full name
- `customer_phone` - Phone number
- `customer_email` - Email address
- `sms_updates` - Boolean for SMS notifications
- `estimated_price` - Initial price estimate
- `final_price` - Final charged price
- `status` - pending, confirmed, in_progress, completed, cancelled
- `additional_services` - JSON array of additional service IDs
- `created_at`, `updated_at`, `deleted_at`

---

## Service-Specific Columns

### 1. New Tires (`new-tires`)

**Required columns:**

- `tire_size` - e.g., 225/65R17
- `tire_condition` - 'new'
- `number_of_tires` - 1, 2, 3, or 4

**Optional columns:**

- `tpms_service` - Boolean (TPMS sensor service)
- `alignment_service` - Boolean (add alignment)

---

### 2. Used Tires (`used-tires`)

**Required columns:**

- `tire_size` - e.g., 225/65R17
- `tire_condition` - 'used'
- `number_of_tires` - 1, 2, 3, or 4

**Optional columns:**

- `tpms_service` - Boolean (TPMS sensor service)
- `alignment_service` - Boolean (add alignment)

---

### 3. Wheel Alignment (`alignment`)

**Required columns:**

- `tire_size` - e.g., 225/65R17

**Optional columns:**

- None specific

---

### 4. Wheels (`wheels`)

**Required columns:**

- `tire_size` - e.g., 225/65R17

**Optional columns:**

- `wheel_type` - alloy, steel, chrome, custom, etc.

---

### 5. Flat Repair (`flat-repair`)

**Required columns:**

- `tire_size` - e.g., 225/65R17
- `number_of_tires` - Usually 1, but can be multiple

**Optional columns:**

- None specific

---

### 6. Oil Change (`oil-change`)

**Required columns:**

- `oil_type` - 'conventional' or 'synthetic'

**Optional columns:**

- `last_change_date` - Date of last oil change

---

### 7. Brake Service (`brakes`)

**Required columns:**

- `brake_position` - 'front', 'rear', or 'both'

**Optional columns:**

- `noise_or_vibration` - Boolean (experiencing issues)
- `warning_light` - Boolean (brake warning light on)

---

### 8. Engine Repair (`engine-repair`)

**Required columns:**

- `problem_description` - Text description of the issue
- `vehicle_drivable` - 'yes' or 'no'

**Optional columns:**

- `photo_paths` - JSON array of uploaded photo paths

---

### 9. Engine Replacement (`engine-replacement`)

**Required columns:**

- `problem_description` - Text description of the issue
- `vehicle_drivable` - 'yes' or 'no'

**Optional columns:**

- `photo_paths` - JSON array of uploaded photo paths

---

### 10. Transmission Service (`transmission`)

**Required columns:**

- `problem_description` - Text description of the issue
- `vehicle_drivable` - 'yes' or 'no'

**Optional columns:**

- `photo_paths` - JSON array of uploaded photo paths

---

### 11. Lift Kit Installation (`lift-kit`)

**Required columns:**

- `problem_description` - Desired lift height and specifications
- `vehicle_drivable` - 'yes' or 'no'

**Optional columns:**

- `photo_paths` - JSON array of reference photos
- `alignment_service` - Boolean (post-installation alignment)

---

## Database Schema Summary

### All Columns in `services` Table:

```sql
-- Identity
id (bigint, primary key)
service_type (varchar)
service_name (varchar)

-- Vehicle Info
vehicle_type (varchar, nullable)
vehicle_brand (varchar, nullable)
vehicle_model (varchar, nullable)
vehicle_year (varchar, nullable)
vehicle_vin (varchar, nullable)
vehicle_notes (text, nullable)

-- Tire Services
tire_size (varchar, nullable)
tire_condition (enum: 'new', 'used', nullable)
number_of_tires (integer, nullable)
tpms_service (boolean, nullable)
alignment_service (boolean, nullable)
wheel_type (varchar, nullable)

-- Oil Change
oil_type (enum: 'conventional', 'synthetic', nullable)
last_change_date (date, nullable)

-- Brake Service
brake_position (enum: 'front', 'rear', 'both', nullable)
noise_or_vibration (boolean, nullable)
warning_light (boolean, nullable)

-- Repair Services
problem_description (text, nullable)
vehicle_drivable (enum: 'yes', 'no', nullable)
photo_paths (json, nullable)

-- Appointment
appointment_date (date, nullable)
appointment_time (varchar, nullable)

-- Customer
customer_name (varchar)
customer_phone (varchar)
customer_email (varchar)
sms_updates (boolean)

-- Pricing & Status
estimated_price (decimal, nullable)
final_price (decimal, nullable)
status (enum: 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled')

-- Additional
additional_services (json, nullable)
created_at (timestamp)
updated_at (timestamp)
deleted_at (timestamp, nullable)
```

---

## Notes

1. **All service-specific columns are nullable** to accommodate different service types in the same table
2. **The `additional_services` column** stores JSON array of additional service IDs selected by the user
3. **The `photo_paths` column** stores JSON array of file paths for uploaded photos
4. **Soft deletes** are enabled via `deleted_at` column for data retention
