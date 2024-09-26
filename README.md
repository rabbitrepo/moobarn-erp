<div align="center">
  <img src="/Images/cover.png" />
</div>

# Purpose of this repository
This summarizes the digital transformation initiatives for a gated community located in the Bangkok suburb. 

# Client Introduction
- A Gated Community
- Located in a Bangkok suburb.
- Houses over 1,000 families.
- Undergoing continuous development.
- Consists of around 1,200 land plots.
- Typically, one house per plot; some span 2-5 plots.
- Owners can divide their plots.
- Variable fees for land and houses, subject to change.
- Fees can be paid monthly not yearly as normal.
- Legal action will be pursued in case of fee payment default.

# Pain Points
**1. Outdated Workflow**
- Current use of paper and Excel.
- Problems with data consistency.
- Difficulty in synchronizing paper records with Excel.

**2. Redundant Work**
- Manual syncing between paper and Excel.
- Example: Fee payment process.
  - Issuing receipts by hand.
  - Keeping a copy, handing one to the resident.
  - Summarizing daily receipts and syncing with Excel.
  - Each transaction is handled three times.

# Scope
- Property & Residents Data Management
  - Centralize data for residents and properties.
  - Ensure data access is secure and controlled.

- Fees Collection System
  - Track payments for all land plots.
  - Monitor legal action cases for non-payment.

- Operations Management
  - Enhance communication and manage documents.

- Document Issuing and Access
  - Store financial documents securely and redundantly.
  - Access and issue documents remotely.

- Accounting Integration
  - Process each transaction once.
  - Automate integration from document issue to General Ledger.

- Enhanced Communication Tools
  - Implement community-wide communication.
  - Provide real-time updates and event alerts.
  - Enable remote fee status checks for residents.

# Cost
Low, the client is willing to spend less than 3,000 THB a month.

# Time
- 5 months starting in Sep 2023

# Output

**1. Cloud-based centralized database.**  
  - Relational database accessible anywhere.
  - Access control for data security.

**2. Custom ERP web app for:**

<details>
  <summary>Payment management</summary>

- Fees

  Fees are collected for maintaining the facilities in the community. The fees can be paid down to a monthly basis. When the fees are paid, the staff will record them in the system, the receipt is created, the payment history is updated, and all number is posted to the general ledger (accounting) automatically.
  
    - History

      ![](/Images/1.1_Fees/fees_1_history.png)
      
      (1) A history of payment
      
      (2) Filter by Date Range
      
      (3) Print Button

      (4) Cancel Button - There will be a confirmation prompt when clicked.
         ![](/Images/1.1_Fees/fees_2_cancel.png)

      (5) Pagination

      (6) Navigate to Check / Create

    - Check / Create
      
      ![](/Images/1.1_Fees/fees_3_create.png)

      [A] Input Address or Land Plot to search for outstanding invoices
      
      [B] Form for issuing a receipt
      
      (1) Payment Method
      
      (2) Date

      (3) Select period for this payment
      
      (4) Payment History
      
      (5) Description
      
      (6) Discount / Revenue

      (7) Total Amount

      (8) Confirmation Box and Submit Button
      
- Installment
  
  In case of payment default, there will be a fine or discount from a court order. The amount is treated as an installment. When the installment is paid, the staff will record them in the system, the receipt is created, the installment history is updated, and all number is posted to the general ledger (accounting) automatically.
  
    - History
      
      ![](/Images/1.2_Installment/installment_1_history.png)

      (1) Navigate to Check / Create
      
    - Check / Create
      
      ![](/Images/1.2_Installment/installment_2_create.png)

      [A] Input Address or Land Plot to search for outstanding installments
      
      [B] Form for issuing a receipt
      
      (1) Information about installment amount and history

      (2) Input payment method, date, amount, and description

      (3) Discount / Revenue
      
      (4) Amount after this payment
      
      (5) Confirmation Box and Submit Button
</details>

<details>
  <summary>Special revenue recording</summary>

  Other revenue that is not from fees or installments will be recorded on this screen. Options for accounts are fetched from the chart of accounts. After submission, the receipt is created and the amount is posted to the general ledger (accounting) automatically.
  
  - History

    ![](/Images/2_Etc/etc_1_history.png)

    (1) Navigate to Create
    
  - Create
    
    ![](/Images/2_Etc/etc_2_create.png)

    (1) Input date and description

    (2) Input amount of each entry

    (3) Submit button
    
</details>

<details>
  <summary>Expense recording</summary>
  
  Once a day, the staff will collect and record all expenses in the system by creating a payment voucher in a system. Options for accounts are fetched from the chart of accounts. After the voucher is created, every entry will be posted to the general ledger (accounting) automatically.
 
  - History
    
    ![](/Images/3_Pv/pv_1_history.png)

    (1) Navigate to Create
    
  - Create
    
    ![](/Images/3_Pv/pv_2_create.png)

    (1) Input date and description

    (2) Input amount of each entry

    (3) Submit button

</details>

<details>
  <summary>Property data editing</summary>

  Edit info of each land plot, if there's another plot within the same address, update one with update others automatically.
  
  ![](/Images/4_Block/block_1_main.png)
  ![](/Images/4_Block/block_2_edit_status.png)
  ![](/Images/4_Block/block_3_edit_note.png)

</details>

  **3. LINE OA with Web Service**  
  - for communication, event notifications, and fee status checks (เช็คค่าส่วนกลางผ่าน LINE).

# Projected Outcome
- Eliminate data inconsistencies.
  - Centralize records, ending paper-Excel syncing.
- Boost operational efficiency by 60%.
  - Reduce transaction handling to one step.
- Cut down repetitive queries by 30%.
  - Automate fee status checks for residents.
- Increase resident engagement by 20%.

# Next Iteration
- [ ] Fix Remaining Bugs
- [ ] Revalidate Migrated Data

# Learn More

  <a href="https://spiffy-snowplow-54e.notion.site/ERP-for-Gated-Community-d2848e095ec4467eaa725342761e377e?pvs=25" target="_blank"> 
    <img src="https://www.golfgooroo.com/wp-content/uploads/2008/04/learn-more-button-png-learn-more-button-rainwater-1024.png" width="100px" />
  </a>
