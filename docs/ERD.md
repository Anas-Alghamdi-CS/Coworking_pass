# Entity Relationship Diagram (ERD) - Master Version

This ERD encompasses the foundational booking logic (Waitlists, Durations) AND the massive Aggregator logic (B2B, Packages, QR Check-ins, Payouts).

```mermaid
erDiagram
    USERS {
        uuid id PK
        string name
        string email
        string password_hash
        enum role "GUEST, B2C, HR_ADMIN, PARTNER_ADMIN, SUPER_ADMIN"
        uuid company_id FK "Nullable, used if user is B2B employee"
    }

    COMPANIES {
        uuid id PK
        string company_name
        uuid hr_admin_id FK
        int total_passes_allocated
    }

    PARTNERS {
        uuid id PK
        string brand_name
        string contact_email
        string tax_number
        float revenue_share_percentage
    }

    WORKSPACES {
        uuid id PK
        uuid partner_id FK
        string name
        string city
        string location_map_url
        float daily_rate
        float monthly_rate
        float yearly_rate
        float pass_visit_value "Value compensated to partner per QR check-in"
        int total_capacity
    }

    AMENITIES {
        uuid id PK
        uuid workspace_id FK
        string amenity_name "e.g., Fast Wi-Fi, Coffee, Meeting Room"
    }

    MEMBERSHIP_PLANS {
        uuid id PK
        string plan_name
        enum type "B2C, B2B"
        int total_visits_allowed
        float price
    }

    SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK
        uuid plan_id FK
        date start_date
        date end_date
        int visits_used
        enum status "ACTIVE, EXPIRED, CANCELLED"
    }

    DIRECT_BOOKINGS {
        uuid id PK
        uuid user_id FK
        uuid workspace_id FK
        enum duration_type "DAILY, MONTHLY, YEARLY"
        date booking_date
        enum status "CONFIRMED, WAITLISTED, CANCELLED"
    }

    QR_CHECK_INS {
        uuid id PK
        uuid user_id FK
        uuid workspace_id FK
        datetime scanned_at
        string qr_code_hash
        enum status "VALID, FRAUD_ATTEMPT"
    }

    PAYMENTS {
        uuid id PK
        uuid user_id FK
        float amount
        enum method "MADA, VISA, APPLE_PAY, SAMSUNG_PAY"
        string gateway_transaction_id
        enum status "SUCCESS, FAILED"
    }

    PAYOUTS {
        uuid id PK
        uuid partner_id FK
        string billing_month
        int total_visits_received
        float amount_due
        enum status "PENDING, PAID"
    }

    %% Relationships
    USERS ||--o{ SUBSCRIPTIONS : "buys packages"
    USERS }o--o| COMPANIES : "is employee of"
    USERS ||--o{ DIRECT_BOOKINGS : "books duration"
    USERS ||--o{ PAYMENTS : "makes payments"
    PARTNERS ||--o{ WORKSPACES : "manages branches"
    WORKSPACES ||--o{ AMENITIES : "features"
    WORKSPACES ||--o{ DIRECT_BOOKINGS : "fulfills direct bookings"
    WORKSPACES ||--o{ QR_CHECK_INS : "validates package check-ins"
    USERS ||--o{ QR_CHECK_INS : "uses package visits"
    PARTNERS ||--o{ PAYOUTS : "earns from platform"
    MEMBERSHIP_PLANS ||--o{ SUBSCRIPTIONS : "has subscribers"
```
