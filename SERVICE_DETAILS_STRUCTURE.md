# Service Details JSON Structure

## Overview

Each service can have a `details` JSON field that contains structured information about the service, including what's included, pricing tiers, features, and more.

## JSON Structure

```json
{
    "full_description": "Detailed description of the service",
    "includes": ["Item 1 included in the service", "Item 2 included in the service", "Item 3 included in the service"],
    "pricing_tiers": [
        {
            "name": "Tier name (e.g., 'Four-wheel alignment')",
            "price": 120,
            "description": "Optional description of this pricing tier"
        }
    ],
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "benefits": ["Benefit 1", "Benefit 2"],
    "warranty": "Warranty information",
    "duration_details": "More specific duration information"
}
```

## Example: Wheel Alignment Service

```json
{
    "full_description": "Precision wheel alignment to improve safety, handling, and tire lifespan.",
    "includes": ["Front or four-wheel alignment", "Steering & suspension check", "Tire wear analysis"],
    "pricing_tiers": [
        {
            "name": "Four-wheel alignment",
            "price": 120,
            "description": "four-way alignment"
        }
    ]
}
```

## Example: Oil Change Service

```json
{
    "full_description": "Quick, clean oil changes to protect your engine and improve performance.",
    "includes": ["Oil filter replacement", "Up to 5 quarts of oil", "Multi-point inspection", "Fluid top-off"],
    "pricing_tiers": [
        {
            "name": "Conventional Oil",
            "price": 45,
            "description": "Standard oil change"
        },
        {
            "name": "Synthetic Oil",
            "price": 75,
            "description": "Premium synthetic oil"
        }
    ],
    "features": ["OEM-grade fluids", "Complimentary inspection report", "Service reminders via text/email"],
    "warranty": "30 days or 1,000 miles"
}
```

## Example: Brake Service

```json
{
    "full_description": "Reliable brake inspections and repairs to keep you safe on the road.",
    "includes": ["Brake pad inspection", "Rotor measurement", "Brake fluid check", "Test drive"],
    "pricing_tiers": [
        {
            "name": "Front Brakes",
            "price": 200,
            "description": "Front brake pad replacement"
        },
        {
            "name": "Rear Brakes",
            "price": 180,
            "description": "Rear brake pad replacement"
        },
        {
            "name": "Complete Brake Service",
            "price": 350,
            "description": "Front and rear brake replacement"
        }
    ],
    "warranty": "12 months or 12,000 miles"
}
```

## How to Add Details in Filament Admin

1. Go to `/admin/services`
2. Edit or create a service
3. In the "Service Details" section, add key-value pairs:
    - Key: `includes` → Value: `["Item 1", "Item 2", "Item 3"]`
    - Key: `pricing_tiers` → Value: `[{"name": "Tier 1", "price": 100}]`
    - Key: `features` → Value: `["Feature 1", "Feature 2"]`

**Note:** The KeyValue component in Filament stores data as a simple object. For complex nested structures like arrays of objects, you may need to enter JSON strings as values.

## Accessing Details in Frontend

```typescript
const service = await fetch('/api/services/alignment').then((r) => r.json());

// Access details
const includes = service.service.details?.includes || [];
const pricingTiers = service.service.details?.pricing_tiers || [];
const features = service.service.details?.features || [];

// Display
includes.forEach((item) => console.log(`✓ ${item}`));
```

## TypeScript Interface

```typescript
export interface ServiceDetails {
    full_description?: string;
    includes?: string[];
    pricing_tiers?: Array<{
        name: string;
        price: number;
        description?: string;
    }>;
    features?: string[];
    benefits?: string[];
    warranty?: string;
    duration_details?: string;
    [key: string]: any; // Allow additional custom fields
}
```
