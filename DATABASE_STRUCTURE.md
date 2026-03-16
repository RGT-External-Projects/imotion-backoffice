# iMotion Back Office - Database Structure

## Complete Database Flow & Relationships

### Entities Overview

```
User (Admin) → manages → Device ↔ TherapistPhone → creates → Session
                                                                ↓
                                                             Patient
```

---

## 1. Role Entity
**Purpose:** Define user roles and permissions

**Fields:**
- `id` (UUID, Primary Key)
- `name` (Unique - 'ADMIN', 'MANAGER', 'VIEWER')
- `description` (Optional)
- `permissions` (JSONB - array of permission strings)
- `created_at`, `updated_at`

**Relationships:**
- **One-to-Many** with User

**Initial Roles:**
```
Role #1:
- name: "ADMIN"
- description: "Full system access"
- permissions: ["*"] // all permissions

Role #2 (Future):
- name: "MANAGER"
- description: "Manage devices and view sessions"
- permissions: ["device.manage", "session.view"]

Role #3 (Future):
- name: "VIEWER"
- description: "View-only access"
- permissions: ["device.view", "session.view"]
```

---

## 2. User Entity (Back-office Users)
**Purpose:** Users who access the back-office system

**Fields:**
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password_hash`
- `full_name`
- `role_id` (UUID, Foreign Key → Role)
- `is_active` (Boolean)
- `created_at`, `updated_at`

**Relationships:**
- **Many-to-One** with Role

**Example:**
```
User #1:
- email: admin@imotion.com
- full_name: "John Administrator"
- role_id: <ADMIN role UUID>
```

---

## 3. Device Entity
**Purpose:** Physical iMotion devices in clinics

**Fields:**
- `id` (UUID, Primary Key)
- `device_id` (Unique - user-friendly ID like "IMOT-001")
- `device_name` (Optional - "Clinic A Device 1")
- `serial_number` (Unique - manufacturer serial)
- `is_active` (Boolean)
- `created_at`, `updated_at`

**Relationships:**
- **Many-to-Many** with TherapistPhone (via junction table)
- **One-to-Many** with Session

**Example:**
```
Device #1:
- device_id: "IMOT-001"
- device_name: "Main Clinic Device"
- serial_number: "SN123456789"
```

---

## 4. TherapistPhone Entity
**Purpose:** Phone numbers that control devices (therapists' phones)

**Fields:**
- `id` (UUID, Primary Key)
- `phone_number` (Unique - "+1-555-0001")
- `display_name` (Optional - "Dr. Smith's Phone")
- `created_at`, `updated_at`

**Relationships:**
- **Many-to-Many** with Device (via junction table)
- **One-to-Many** with Session

**Example:**
```
TherapistPhone #1:
- phone_number: "+1-555-0001"
- display_name: "Dr. Smith"

TherapistPhone #2:
- phone_number: "+1-555-0002"
- display_name: "Dr. Jones"
```

---

## 5. Patient Entity
**Purpose:** Patients registered in the app

**Fields:**
- `id` (UUID, Primary Key)
- `patient_code` (Unique - "P-001", "P-123")
- `display_name` (Optional - "John D.")
- `created_at`, `updated_at`

**Relationships:**
- **One-to-Many** with Session

**Example:**
```
Patient #1:
- patient_code: "P-123"
- display_name: "John D."
```

---

## 6. Session Entity
**Purpose:** Treatment records linking everything together

**Fields:**
- `id` (UUID, Primary Key)
- `device_id` (UUID, Foreign Key → Device)
- `therapist_phone_id` (UUID, Foreign Key → TherapistPhone)
- `patient_id` (UUID, Foreign Key → Patient)
- `session_settings` (JSONB - speed, visual, vibration, audio)
- `duration` (Integer - seconds)
- `session_timestamp` (Timestamp)
- `created_at`, `updated_at`

**Relationships:**
- **Many-to-One** with Device
- **Many-to-One** with TherapistPhone
- **Many-to-One** with Patient

**Example:**
```
Session #1:
- device: "IMOT-001"
- therapist_phone: "+1-555-0001"
- patient: "P-123"
- settings: {speed: 5, visual: "calm", vibration: "medium"}
- duration: 1800 (30 minutes)
- timestamp: 2026-03-10 10:00:00
```

---

## 7. Junction Table: device_therapist_phones
**Purpose:** Links devices to therapist phones (many-to-many)

**Fields:**
- `device_id` (UUID, Foreign Key → Device)
- `therapist_phone_id` (UUID, Foreign Key → TherapistPhone)
- `created_at`

**Example:**
```
Device "IMOT-001" is linked to:
- TherapistPhone "+1-555-0001" (Dr. Smith)
- TherapistPhone "+1-555-0002" (Dr. Jones)
- TherapistPhone "+1-555-0003" (Dr. Lee)
```

---

## Complete Real-World Example

### Setup:
```
Devices:
- Device A (IMOT-001)
- Device B (IMOT-002)

Therapist Phones:
- Phone 1: +1-555-0001 (Dr. Smith)
- Phone 2: +1-555-0002 (Dr. Jones)

Device-Phone Links (many-to-many):
- Device A ↔ Phone 1, Phone 2
- Device B ↔ Phone 1, Phone 2
```

### Monday 10 AM - Session 1:
```
Dr. Smith uses Phone 1 to control Device A
Treating: Patient "John-Doe"
→ Creates Session:
  - device_id: Device A
  - therapist_phone_id: Phone 1
  - patient_code: "John-Doe"
  - settings: {speed: 5...}
  - duration: 1800
```

### Monday 2 PM - Session 2:
```
Dr. Jones uses Phone 2 to control Device A (SAME DEVICE!)
Treating: Patient "Mary-Smith"
→ Creates Session:
  - device_id: Device A (reused)
  - therapist_phone_id: Phone 2
  - patient_code: "Mary-Smith"
  - settings: {speed: 3...}
  - duration: 2400
```

### Tuesday 9 AM - Session 3:
```
Dr. Smith uses Phone 1 to control Device B
Treating: Patient "John-Doe" (SAME PATIENT, different session)
→ Creates Session:
  - device_id: Device B
  - therapist_phone_id: Phone 1
  - patient_code: "John-Doe"
  - settings: {speed: 6...}
  - duration: 1200
```

---

## Relationship Summary

### Device ↔ TherapistPhone (Many-to-Many)
- **One Device** can be controlled by **many TherapistPhones**
- **One TherapistPhone** can control **many Devices**
- **Why?** Clinic devices are shared resources!

### TherapistPhone → Session (One-to-Many)
- **One TherapistPhone** creates **many Sessions** over time
- **Each Session** belongs to **one TherapistPhone**

### Device → Session (One-to-Many)
- **One Device** is used in **many Sessions** over time
- **Each Session** uses **one Device**

### Session → patient_code (Simple Field)
- **Session** has a **patient_code** field (string)
- **Not a relationship** - just a text identifier
- **Why?** Patients aren't tracked as separate entities (for now)

---

## Back-Office Queries

### "Show all sessions for Device A"
```sql
SELECT * FROM sessions WHERE device_id = 'Device-A-UUID'
```

### "Show all sessions by Dr. Smith's phone"
```sql
SELECT * FROM sessions WHERE therapist_phone_id = 'Phone-1-UUID'
```

### "Show all sessions for patient 'John-Doe'"
```sql
SELECT * FROM sessions WHERE patient_code = 'John-Doe'
```

### "Which phones can control Device A?"
```sql
SELECT tp.* FROM therapist_phones tp
JOIN device_therapist_phones dtp ON tp.id = dtp.therapist_phone_id
WHERE dtp.device_id = 'Device-A-UUID'
```

---

## Key Points

1. ✅ **Therapist** = Phone number (not a person entity)
2. ✅ **Patient** = Code/identifier (not a person entity yet)
3. ✅ **Device** = Physical equipment (shared resource)
4. ✅ **Session** = Links everything together
5. ✅ **No delete operations** - only view and create
6. ✅ **Admin** = Back-office users managing the system
