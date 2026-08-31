# Coworking Pass 🚀

**عضوية واحدة تفتح مساحات عمل مشتركة متعددة - نجمعها في منصة واحدة.**

---

## 🛠 الأدوات والتقنيات المستخدمة (Tech Stack)
- **التصميم (UI/UX):** Figma
- **الواجهات الأمامية (Frontend):** Next.js مع Tailwind CSS (مجلد مستقل)
- **الواجهات الخلفية (Backend):** Next.js لبرمجة مسارات الـ API (مجلد مستقل)
- **قاعدة البيانات (Database):** PostgreSQL

---

## 📚 دليل فريق العمل (Git Guide)

هذا القسم مخصص للفرق لمعرفة كيفية سحب المشروع ورفع التحديثات.

### 1. سحب المشروع لأول مرة
افتح الـ Terminal في جهازك ونفذ الأوامر التالية:
`ash
git clone https://github.com/Anas-Alghamdi-CS/Coworking_pass.git
cd Coworking_pass
git checkout develop
`

### 2. كيف تفتح فرع (Branch) لمهمتك الخاصة؟
يُمنع تماماً رفع الكود مباشرة على فرع develop أو main. يجب على كل فريق فتح فرع خاص بمهمته.

مثال إذا كنت في فريق الواجهات ومهمتك صفحة الدخول:
`ash
git checkout develop
git pull origin develop
git checkout -b feature/front-login
`

### 3. الدخول لمجلدات المشروع والبدء بالبرمجة
**لفريق الواجهات (Frontend):**
`ash
cd frontend
npm install
npm run dev
`

**لفريق الـ Backend:**
`ash
cd backend
npm install
npm run dev
`

### 4. كيف ترفع شغلك بعد الانتهاء من المهمة؟
`ash
git add .
git commit -m "feat: إتمام صفحة تسجيل الدخول"
git push origin feature/front-login
`
بعدها اذهب إلى موقع GitHub، وافتح طلب دمج (Pull Request) ليقوم القائد بمراجعته واعتماده.
