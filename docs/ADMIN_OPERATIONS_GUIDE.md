# Admin Operations Guide

**Complete guide for managing Affiliate Programs, Payouts, and Users**

---

## Table of Contents

1. [Creating Programs](#creating-programs)
2. [Adding Users (Affiliates/Partners)](#adding-users-affiliatespartners)
3. [Managing Payouts](#managing-payouts)
4. [Partner Groups & Commission Rates](#partner-groups--commission-rates)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [Database Models](#database-models)

---

## Creating Programs

### Overview

Programs are the foundation of your affiliate system. Each program can have:
- **Unique commission rate & type** (Percentage, Fixed, or Tiered)
- **Custom cookie duration** (tracking window)
- **Different payout frequencies** (Weekly, Monthly, etc.)
- **Brand customization** (colors, logos)
- **Auto-approval settings**

### Step-by-Step Guide

#### Via Admin Dashboard

1. **Navigate to Programs**
   - Go to **Admin Dashboard → Programs**
   - Click **"Create Program"** button (top right)

2. **Fill Program Details**
   ```
   Program Name: "Premium Partners" (display name)
   Slug: "premium-partners" (URL-friendly, auto-generated)
   Description: "High-tier affiliate program" (optional)
   ```

3. **Commission Configuration**
   - **Commission Rate**: Enter percentage (e.g., 20 for 20%)
   - **Commission Type**: Select one of:
     - `PERCENTAGE`: % of transaction value (most common)
     - `FIXED`: Fixed amount per transaction
     - `TIERED`: Different rates at different thresholds

4. **Payout Settings**
   - **Cookie Duration**: Days the tracking link is valid (default: 30)
   - **Minimum Payout**: Lowest amount affiliates can request (in cents)
   - **Payout Frequency**: `WEEKLY`, `MONTHLY`, `QUARTERLY`
   - **Auto-approve**: Toggle to auto-approve affiliate signups

5. **Branding (Optional)**
   - **Currency**: Select from INR, USD, EUR, GBP
   - **Brand Color**: Set primary brand color (hex)
   - **Logo URL**: Upload affiliate program logo
   - **Terms URL**: Link to affiliate terms & conditions

6. **Review & Create**
   - Verify all settings
   - Click **"Create Program"**
   - Program is now active and affiliates can join

#### Via API

```bash
POST /api/admin/programs
```

**Request Body:**
```json
{
  "name": "Premium Partners",
  "slug": "premium-partners",
  "description": "High-tier affiliate program",
  "commissionRate": 20,
  "commissionType": "PERCENTAGE",
  "cookieDuration": 30,
  "currency": "INR",
  "minPayoutCents": 100000,
  "payoutFrequency": "MONTHLY",
  "autoApprove": false,
  "termsUrl": "https://example.com/terms",
  "logoUrl": "https://example.com/logo.png",
  "brandColor": "#10b981"
}
```

**Response:**
```json
{
  "success": true,
  "program": {
    "id": "clm123abc",
    "name": "Premium Partners",
    "slug": "premium-partners",
    "commissionRate": 20,
    "commissionType": "PERCENTAGE",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

### Updating a Program

1. **From Dashboard**
   - Go to **Programs** table
   - Find the program
   - Click **Edit** (pencil icon)
   - Modify fields
   - Click **"Update Program"**

2. **Via API**
   ```bash
   PUT /api/admin/programs
   ```
   ```json
   {
     "id": "clm123abc",
     "name": "Elite Partners",
     "commissionRate": 25,
     "autoApprove": true
   }
   ```

### Setting a Default Program

The default program is used when no specific program is selected.

```bash
PUT /api/admin/programs
```

```json
{
  "id": "clm123abc",
  "isDefault": true
}
```

---

## Adding Users (Affiliates/Partners)

### Overview

Users are affiliates who promote your product and earn commissions. They can be:
- **Created manually** by admin (instant activation)
- **Invited** via email (they set password on registration)
- **Assigned to Partner Groups** for custom commission rates

### Step-by-Step Guide

#### Creating a Partner Manually

1. **Navigate to Partners Page**
   - Go to **Admin Dashboard → Partners**
   - Click **"Create Partner"** button (top right)

2. **Fill Partner Information**
   ```
   First Name: John
   Last Name: Doe
   Email: john@example.com
   Company: Tech Blog Inc (optional)
   ```

3. **Select Partner Group & Payout Method**
   - **Partner Group**: Assign to group (determines commission rate)
     - Default group uses program's commission rate
     - Custom groups can have different rates
   - **Payout Method**: Choose from:
     - `PayPal` (most common)
     - `Wise` (international transfers)
     - `Bank` (direct bank transfer)
     - `Crypto` (cryptocurrency)
   - **PayPal Email**: Email for PayPal payouts (optional, defaults to partner email)

4. **Additional Options**
   - **Send Welcome Email**: Check to notify partner
   - **Tracking Parameter**: Set custom URL parameter (default: `ref`)

5. **Create Partner**
   - Click **"Create Partner"**
   - System generates:
     - **Referral Code** (e.g., `AFFXYZ123`)
     - **Temporary Password** (save and share securely)
   - Partner can log in immediately
   - Status: `ACTIVE`

#### Inviting a Partner (Email Invitation)

1. **Open Invite Dialog**
   - Go to **Partners** page
   - Click **"Invite"** button (top right)

2. **Enter Contact Information**
   - **Email Address**: Partner's email
   - **Partner Group**: Select applicable group

3. **Send Invitation**
   - Click **"Send Invite"**
   - Partner receives email with signup link
   - They set password and activate account
   - Status: `PENDING` → `ACTIVE` (after signup)

#### Via API - Create Partner

```bash
POST /api/admin/affiliates
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!" (optional, auto-generated if not provided)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Affiliate created successfully",
  "affiliate": {
    "id": "aff_123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "referralCode": "AFFXYZ123",
    "balanceCents": 0,
    "createdAt": "2025-01-15T10:00:00Z"
  },
  "temporaryPassword": "Temp@Pass1234"
}
```

### Assigning Partners to Groups

Partner Groups allow you to set custom commission rates for different tiers of partners.

#### Create a Partner Group

1. **Navigate to Program Settings**
   - Go to **Admin → Program Settings** or **Partners** page
   - Find "Partner Groups" section

2. **Create New Group**
   - Click **"Create Group"**
   - **Group Name**: "VIP Partners", "Resellers", etc.
   - **Commission Rate**: Enter as decimal (0.20 for 20%)
   - **Description**: Optional notes
   - **Signup URL**: Custom landing page (optional)
   - **Set as Default**: Check if this is the default group

3. **Save Group**
   - Click **"Create"**

#### Via API

```bash
POST /api/admin/partner-groups
```

**Request Body:**
```json
{
  "name": "VIP Partners",
  "description": "Top-tier partner program with elevated commissions",
  "commissionRate": 0.25,
  "signupUrl": "https://example.com/vip-partners",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Partner group created successfully",
  "partnerGroup": {
    "id": "pg_456def",
    "name": "VIP Partners",
    "commissionRate": 0.25,
    "memberCount": 0,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

#### Assign Partner to Group

**Current Limitation**: When creating a partner manually, group assignment isn't directly supported via the UI form. You can either:

1. **Update via database directly**
   ```sql
   UPDATE affiliates 
   SET partner_group_id = 'pg_456def' 
   WHERE id = 'aff_123abc';
   ```

2. **Or extend the API** to include `partnerGroupId` in the POST request

3. **View in Partner Details**
   - Navigate to partner's detail page
   - See assigned "Partner Group" and commission rate
   - Commission rate automatically applies to transactions

### Managing Partner Status

Partners have statuses:
- **ACTIVE**: Can create referrals and receive commissions
- **INACTIVE**: Disabled account
- **SUSPENDED**: Temporarily locked
- **PENDING**: Awaiting approval (if auto-approve is off)

#### Change Status

1. **From Partners Dashboard**
   - Select partners (checkboxes)
   - Click **"Actions"** dropdown
   - Choose:
     - **"Approve Selected"** (PENDING → ACTIVE)
     - **"Reject Selected"** (PENDING → INACTIVE)
     - **"Delete Selected"** (remove permanently)

2. **Via Bulk API**
   ```bash
   POST /api/admin/affiliates/batch
   ```
   ```json
   {
     "affiliateIds": ["aff_123abc", "aff_456def"],
     "action": "changeStatus",
     "status": "ACTIVE"
   }
   ```

### Partner Profile Management

Partners can update their own profiles with payment information:

**Payment Details Structure** (stored in `payoutDetails` JSON):
```json
{
  "paymentMethod": "PayPal",
  "paymentEmail": "john@example.com",
  "bankName": "Chase Bank",
  "accountNumber": "****1234",
  "accountHolderName": "John Doe"
}
```

---

## Managing Payouts

Payouts are payments to partners for their earned commissions. The payout workflow is:
1. **Transactions occur** (sales/signups tracked via referral links)
2. **Commissions are created** (calculated based on partner group rate)
3. **Hold period passes** (default: 30 days for refund protection)
4. **Commissions mature** and become eligible for payout
5. **Admin creates payout** by selecting approved commissions
6. **Payout status updated** (PENDING → PROCESSING → COMPLETED)
7. **Partner receives funds**

### Creating a Payout

#### From Partner Detail Page

1. **Go to Partners → Select Partner**
   - View partner details
   - See "Pending" commissions section

2. **Select Commissions to Payout**
   - Check commissions (must be APPROVED status)
   - System shows:
     - Number of commissions
     - Total amount
     - Affiliate's payout method

3. **Create Payout**
   - Click **"Create Payout"** button
   - System calculates total from selected commissions
   - Payout is created with status: `PENDING`
   - Email sent to partner: "Payout Initiated"
   - Commissions marked as: `PAID`

#### From Payouts Dashboard

1. **Navigate to Payouts**
   - Go to **Admin Dashboard → Payouts**
   - View all payouts (filterable by status)

2. **View Payout Details**
   - See payout ID, amount, status, method, date
   - Export to CSV for accounting

3. **Create Payout** (if not via partner page)
   - Navigate to specific partner
   - Use partner detail payout creation

#### Via API

```bash
POST /api/admin/payouts
```

**Request Body:**
```json
{
  "affiliateId": "aff_123abc",
  "commissionIds": ["com_111", "com_222", "com_333"],
  "method": "PayPal",
  "notes": "Monthly payout batch #007"
}
```

**Response:**
```json
{
  "success": true,
  "payout": {
    "id": "payout_789ghi",
    "affiliateId": "aff_123abc",
    "amountCents": 250000,
    "commissionCount": 3,
    "status": "PENDING",
    "method": "PayPal",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

### Custom Payout Methods & Amounts

#### Changing Payout Method

Each payout has a `method` field that can be updated:

1. **From Payout List**
   - Click on payout
   - Edit method (PayPal, Wise, Bank, Crypto)
   - Save changes

2. **Via API**
   ```bash
   PUT /api/admin/payouts
   ```
   ```json
   {
     "id": "payout_789ghi",
     "method": "Wise",
     "notes": "Transferred from PayPal to international wire"
   }
   ```

#### Custom Payout Amount

If you need to adjust the payout amount (rare), you must:

1. **Modify via database** (CLI access required):
   ```sql
   UPDATE payouts 
   SET amount_cents = 300000, notes = 'Adjusted for bonus'
   WHERE id = 'payout_789ghi';
   ```

2. **Or create separate payout** for the difference:
   - Don't include certain commissions in the payout
   - Create additional payout with bonus/adjustment

#### Updating Payout Status

As payout is processed, update its status:

1. **From Dashboard**
   - Go to **Payouts** page
   - Click on payout
   - Change status:
     - `PENDING` → `PROCESSING` (started processing)
     - `PROCESSING` → `COMPLETED` (funds transferred)
     - Any → `FAILED` (if payment failed)
   - Save status change
   - Partner receives email notification on COMPLETED

2. **Via API**
   ```bash
   PUT /api/admin/payouts
   ```
   ```json
   {
     "id": "payout_789ghi",
     "status": "COMPLETED",
     "method": "PayPal"
   }
   ```

   **Status Flow:**
   ```
   PENDING → PROCESSING → COMPLETED
                      ↓
                    FAILED
   ```

### Understanding the Commission Hold Period

Commissions are not immediately available for payout. They go through a "hold period":

```
Transaction occurs (Day 1)
    ↓
Commission created (status: PENDING, maturesAt = Day 1 + 30 days)
    ↓
Hold period: 30 days (for fraud/refund protection)
    ↓
Commission "matures" (status: APPROVED)
    ↓
Admin can now include in payout
    ↓
Payout created (status: PENDING)
    ↓
Payout processed (status: COMPLETED)
    ↓
Partner receives funds
```

**Configure Hold Period** in Program Settings:
- Go to **Admin → Program Settings**
- Set **Commission Hold Period (Days)**: 30 (default)
- This applies globally to all commissions

### Payout Reports & Exports

#### Export Payouts to CSV

1. **From Payouts Page**
   - Click **"Download"** menu (three dots)
   - Select **"Export All (CSV)"**
   - File downloads: `payouts-export-2025-01-15.csv`

2. **Filter Before Export**
   - Filter by status (PENDING, COMPLETED, etc.)
   - Export will include only filtered results

#### CSV Format

```
id,affiliateId,affiliateName,affiliateEmail,amountCents,commissionCount,status,method,notes,createdAt,processedAt
payout_789ghi,aff_123abc,John Doe,john@example.com,250000,3,PENDING,PayPal,,2025-01-15T10:00:00Z,
```

---

## Partner Groups & Commission Rates

### Understanding Partner Groups

Partner Groups allow you to create different commission structures without creating separate programs:

- **Default Group**: All partners use program's base commission rate
- **Custom Groups**: VIP, Resellers, Agencies can have higher rates
- **Dynamic Rates**: Each group has a fixed commission rate

### Commission Calculation Example

**Scenario:**
- **Program**: "Main Affiliate Program" (20% commission)
- **Partner Groups**:
  - Default: 20%
  - VIP: 25%
  - Resellers: 30%

**Transaction Calculation:**
```
Customer pays: $100 (10,000 cents)

If partner in Default group:
  Commission = 10,000 × 0.20 = 2,000 cents ($20)

If partner in VIP group:
  Commission = 10,000 × 0.25 = 2,500 cents ($25)

If partner in Resellers group:
  Commission = 10,000 × 0.30 = 3,000 cents ($30)
```

### Creating & Managing Groups

#### Create Group

```bash
POST /api/admin/partner-groups
```

```json
{
  "name": "Enterprise Partners",
  "description": "Large-scale partners with dedicated support",
  "commissionRate": 0.30,
  "signupUrl": null,
  "isDefault": false
}
```

#### Update Group

```bash
PUT /api/admin/partner-groups
```

```json
{
  "id": "pg_456def",
  "commissionRate": 0.35,
  "description": "Increased to 35% for Q1 2025"
}
```

#### Delete Group

```bash
DELETE /api/admin/partner-groups?id=pg_456def
```

**Note**: Cannot delete group with active members. Remove all affiliates first.

#### List Groups

```bash
GET /api/admin/partner-groups
```

**Response:**
```json
{
  "success": true,
  "partnerGroups": [
    {
      "id": "pg_default",
      "name": "Default",
      "commissionRate": 0.20,
      "memberCount": 15,
      "isDefault": true
    },
    {
      "id": "pg_456def",
      "name": "VIP Partners",
      "commissionRate": 0.25,
      "memberCount": 5,
      "isDefault": false
    }
  ]
}
```

---

## API Endpoints Reference

### Programs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/programs` | List all programs |
| POST | `/api/admin/programs` | Create program |
| PUT | `/api/admin/programs` | Update program |
| DELETE | `/api/admin/programs?id=ID` | Delete program |

### Affiliates/Partners

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/affiliates` | List all affiliates |
| POST | `/api/admin/affiliates` | Create affiliate |
| POST | `/api/admin/affiliates/batch` | Bulk operations |

### Partner Groups

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/partner-groups` | List groups |
| POST | `/api/admin/partner-groups` | Create group |
| PUT | `/api/admin/partner-groups` | Update group |
| DELETE | `/api/admin/partner-groups?id=ID` | Delete group |

### Payouts

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/payouts?affiliateId=ID` | Get payouts |
| GET | `/api/admin/payouts?format=csv` | Export as CSV |
| POST | `/api/admin/payouts` | Create payout |
| PUT | `/api/admin/payouts` | Update payout status |
| DELETE | `/api/admin/payouts?id=ID` | Delete payout |

### Transactions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/transactions` | List transactions |
| POST | `/api/admin/transactions` | Create transaction/commission |
| PUT | `/api/admin/transactions?id=ID` | Update transaction |
| DELETE | `/api/admin/transactions?id=ID` | Delete transaction |

### Referrals

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/referrals` | List referrals |
| POST | `/api/admin/referrals` | Create referral |
| PUT | `/api/admin/referrals/[id]` | Update referral status |

---

## Database Models

### Key Tables

#### `users`
```prisma
id              String    @id @default(cuid())
email           String    @unique
name            String
password        String    (bcrypt hashed)
role            Role      (ADMIN or AFFILIATE)
status          UserStatus @default(PENDING)
createdAt       DateTime
```

#### `affiliates`
```prisma
id              String        @id @default(cuid())
userId          String        @unique
referralCode    String        @unique
payoutDetails   Json          (payment method info)
balanceCents    Int           (current balance)
partnerGroupId  String?       (group assignment)
createdAt       DateTime
```

#### `partner_groups`
```prisma
id              String    @id @default(cuid())
name            String
commissionRate  Float     (0.20 for 20%)
description     String?
signupUrl       String?
isDefault       Boolean
createdAt       DateTime
```

#### `payouts`
```prisma
id              String        @id @default(cuid())
affiliateId     String
userId          String
amountCents     Int
commissionCount Int
status          PayoutStatus  (PENDING, PROCESSING, COMPLETED, FAILED)
method          String?       (PayPal, Wise, Bank, Crypto)
notes           String?
processedAt     DateTime?
createdAt       DateTime
```

#### `commissions`
```prisma
id              String            @id @default(cuid())
conversionId    String
affiliateId     String
amountCents     Int
rate            Float
status          CommissionStatus  (PENDING, APPROVED, PAID, CLAWBACK)
payoutId        String?           (links to payout)
maturesAt       DateTime?         (hold period end)
paidAt          DateTime?
createdAt       DateTime
```

---

## Common Workflows

### Complete Workflow: New Partner to First Payout

1. **Create Partner**
   - Admin creates partner: John Doe (john@example.com)
   - Assign to "Default" group (20% commission)
   - Partner gets referral code: AFFXYZ123

2. **Partner Refers Customer**
   - John sends tracking link to prospect
   - Prospect visits: `yoursite.com/?ref=AFFXYZ123`
   - Cookie set for 30 days

3. **Customer Converts**
   - Prospect purchases $100 product
   - System creates Transaction: $100
   - Commission calculated: $100 × 20% = $20
   - Commission status: PENDING (30-day hold)
   - Phone/email notifications sent

4. **Hold Period Completes** (30 days later)
   - Commission status changes: PENDING → APPROVED
   - Commission is now eligible for payout

5. **Admin Creates Payout**
   - Go to John's partner page
   - See $20 in pending commissions
   - Click "Create Payout"
   - Payout created (PENDING status)
   - Email sent to John: "Payout initiated for $20"

6. **Process Payout**
   - Admin processes payment to PayPal
   - Updates payout status: PROCESSING
   - After confirmation, status: COMPLETED
   - Email sent to John: "Your $20 payout completed!"

7. **John Receives Funds**
   - PayPal deposits to John's account
   - Commission archived in system

### Bulk Payout Processing

**Scenario:** Process monthly payouts for all active partners

1. **Go to Payouts Dashboard**
   - View status: PENDING (unpaid)

2. **Select by Partner**
   - Filter to one partner
   - View all APPROVED commissions
   - Create single payout

3. **Repeat for Each Partner** or use batch processing

4. **Update Status**
   - Change selected payouts: PENDING → PROCESSING
   - Process actual payments externally (PayPal, etc.)
   - Update: PROCESSING → COMPLETED
   - Bulk confirm (system sends notifications)

---

## Troubleshooting

### Payouts Not Appearing

**Problem:** Commissions stuck in PENDING status

**Solutions:**
1. Check hold period hasn't elapsed
   - Go to Program Settings
   - View "Commission Hold Period (Days)"
   - Commission ready after that date
2. Check commission status
   - Must be APPROVED to be payable
   - Still PENDING? Wait for hold period

### Partner Can't Access Account

**Problem:** Partner receives login error

**Solutions:**
1. Verify partner status is ACTIVE
   - Go to Partners dashboard
   - Check status column
   - If PENDING, approve via "Actions" menu
2. Verify email is correct
   - Click partner to view details
   - Confirm email address
3. Reset password
   - No self-serve reset in current version
   - Admin must recreate partner or contact support

### Commission Calculation Wrong

**Problem:** Commission amount doesn't match expected rate

**Solutions:**
1. Verify partner group assignment
   - Go to partner detail page
   - Check "Partner Group" and commission rate
   - Verify it matches intention
2. Check transaction amount
   - Amount is $10,000 (cents)?
   - Commission = 10,000 × rate (e.g., 0.20)
3. Verify group rate
   - Go to Partner Groups
   - Confirm group commission rate
   - Update if incorrect

---

## Best Practices

1. **Set up Partner Groups early**
   - Default group for standard affiliates
   - Premium group for high performers
   - Reseller group for agencies

2. **Automate with Commissions Hold Period**
   - Prevents chargebacks/refunds claiming commissions
   - Default 30 days (adjust as needed)

3. **Regular Payout Schedules**
   - Process payouts on fixed schedule (monthly)
   - Consistent = happy partners
   - Track in calendar/CRM

4. **Use CSV Exports**
   - Export partner list monthly
   - Export payouts for accounting
   - Keep audit trail

5. **Communication**
   - Send payout initiated emails (automatic)
   - Send payout completed emails (automatic)
   - Monitor partner feedback

6. **Test Workflows**
   - Create test partner
   - Create test transaction
   - Test payout creation & status updates
   - Verify email notifications

---

**Last Updated:** March 2025  
**Version:** 1.0.0
