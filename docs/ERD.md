# مخطط قاعدة البيانات (ERD) - Coworking Pass

هذا المخطط يوضح الجداول والعلاقات الأساسية لقاعدة بيانات المشروع، بما في ذلك أنواع الحجوزات ونظام الحجز التلقائي (Waitlist).

`mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "يحجز"
    SPACES ||--o{ BOOKINGS : "تحتوي على"
    USERS ||--o{ WAITLIST : "ينتظر"
    SPACES ||--o{ WAITLIST : "عليها انتظار"

    USERS {
        int id PK
        string name "اسم المستخدم"
        string email "البريد الإلكتروني"
        string password "كلمة المرور"
        string role "نوع الحساب"
        datetime created_at
    }

    SPACES {
        int id PK
        string name "اسم مساحة العمل"
        string location "الموقع"
        float price_daily "سعر اليوم"
        float price_monthly "سعر الشهر"
        float price_yearly "سعر السنة"
        int capacity "عدد المقاعد"
    }

    BOOKINGS {
        int id PK
        int user_id FK
        int space_id FK
        string plan_type "نوع الحجز (يومي، شهري، سنوي)"
        datetime start_date "وقت بداية الحجز"
        datetime end_date "وقت نهاية الحجز"
        string status "حالة الحجز (مؤكد، منتهي)"
    }

    WAITLIST {
        int id PK
        int user_id FK
        int space_id FK
        string requested_plan "نوع الحجز المطلوب"
        boolean auto_book "تفعيل الحجز التلقائي"
        string status "حالة الطلب (انتظار، تم الحجز)"
    }
`
