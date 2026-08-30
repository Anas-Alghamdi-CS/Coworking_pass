# مخطط قاعدة البيانات (ERD) - Coworking Pass

هذا المخطط يوضح الجداول والعلاقات الأساسية لقاعدة بيانات المشروع (النسخة الأولية MVP).

`mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "يحجز"
    SPACES ||--o{ BOOKINGS : "تحتوي على"

    USERS {
        int id PK
        string name "اسم المستخدم"
        string email "البريد الإلكتروني"
        string password "كلمة المرور"
        datetime created_at
    }

    SPACES {
        int id PK
        string name "اسم مساحة العمل"
        string description "وصف المساحة"
        string location "الموقع"
        float price_per_day "سعر اليوم"
        int capacity "عدد المقاعد"
        string image_url "صورة المساحة"
    }

    BOOKINGS {
        int id PK
        int user_id FK
        int space_id FK
        date booking_date "تاريخ الحجز"
        string status "حالة الحجز"
    }
`
