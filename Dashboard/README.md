background : white-amber-50 (light warm)

class --> tailwind
className = own react
<!-- Actually both are same -->



<!-- installing charts -->
- npm install @mui/x-charts
- npm install @mui/material @emotion/react @emotion/styled <!--peer dependency -->



<!---------------------------------------------------------------------------------------
1️⃣ New
A fresh lead added to your CRM.
No contact has been made yet.
➡ “We just got their details.”

2️⃣ Contacted
You have reached out — call, email, or message — but no strong interest yet.
➡ “We spoke to them once or twice.”

3️⃣ Qualified
The lead is interested and fits your target customer profile.
They have a real chance of buying.
➡ “They are a good fit and likely to convert.”

4️⃣ Converted
The lead has successfully become a customer.
A deal is closed or purchase done.
➡ “They bought the product. Success!”

5️⃣ Lost
The lead will not continue.
No interest, wrong fit, or lost to competition.
➡ “This lead is not moving forward anymore.” 
----------------------------------------------------------------------------------------->





used in piechart 
- // #region mockData counting --> used to minimise a specific line of code


lucide-react - icon == used in sidebar only




To make the routing, must wrap the app.jsx insde the <Router> tag









.....................Leads vs customers....................

**Lead**     
- A person or organization that has *shown interest* in your product or service, but hasn’t bought yet.    
- Early stage — prospecting / lead generation       
- Someone who filled out a form, downloaded an eBook, or attended your webinar 


**Customer** |
- A person or organization that has *purchased* from you or *signed a contract* (i.e., they’ve converted). 
- Later stage — post-sale / relationship management 
- Someone who paid for your product or subscribed to your service              |








💻 What to Display in the Deals Section
Just like your Customer and Support sections, the Deals section should show a grid or list of deals.
Each card or row might include:

- Deal Name / Company
- Stage & Probability
- Deal Value
- Expected Close Date
- Status badge (Active / Won / Lost)
- Assigned To

- A “View” button (opens modal with full details)





Stage	 Color Suggestion
Prospecting	🟡 Yellow
Proposal	🟢 Green
Negotiation	🟣 Purple
Closed Won	🟩 Bright Green
Closed Lost	🔴 Red









className always takes "string" or "expression"
- className="string"        // static
- className={expression}    // dynamic/template literal