Bhakti Vedanta Academy for Art and Culture (BAAC) — Full Requirements Document 

 

📘 Frontend Requirements 

1. 🏠 Landing Page 

Hero section with welcome message and banner. 
Section: Spiritual Videos 
Thumbnails of latest spiritual/event videos. 
Redirect to BAAC’s YouTube page when clicked. 
Action button: "For more videos, visit our YouTube Page" 
Section: Resources 
List of downloadable PDF files uploaded by admin. 
Section: Events Gallery 
Admin-uploaded event images visible to users. 
Section: Map & Navigation 
Embedded Google Map of BAAC location. 
Navigate button: opens Google Maps. 
2. 👥 User Authentication 

Signup, Login, Logout 
Forgot Password (handled via email reset or OTP) 
User role: Regular user 
Option to allow push notifications 
3. 🧠 Weekly Quiz 

Weekly quiz reset every Monday at 12:00 AM 
Closes every Sunday at 11:59 PM 
Admin toggle: stop quiz (disables user participation) 
Quiz Leaderboard: updated in real-time 
4. ⭐ Sewa Points System 

Points awarded for: 
Attending events 
Volunteering 
Two Leaderboards: 
Weekly Quiz Leaderboard 
Monthly Sewa Points Leaderboard 
Sewa points reset monthly (auto-reset on 1st of each month) 
5. 📅 Events Section 

List of upcoming/past events 
Admin adds event with: 
Title, description 
Start time, end time 
Attendance start/end time 
Optional QR code auto-generated 
Users can register: 
As attendee 
As volunteer 
Users can mark attendance during allowed timeframe 
Attendance without prior registration is allowed 
6. ✅ Attendance Flow 

Event-specific attendance opens only within set time frame 
Admin-generated QR code for attendance 
Upon scanning QR: 
Redirects to custom confirmation page 
Shows message: "Thanks for attending, Jay Jagannath!!" 
Displays current Jagannath image 
Flower shower animation 
Admin can upload/change Jagannath image 
7. 💬 Public Q&A Section 

Users can post spiritual questions 
Only admins can reply 
All chats are public for educational benefit 
Notice on top: "Chats are auto-deleted at end of every month @11:59 PM" 
All messages auto-deleted monthly 
 

🛠️ Backend Requirements 

1. 🧱 Tech Stack 

Database: PostgreSQL via Neon.tech (recommended) 
Auth: JWT + hashed passwords 
Email: SMTP (e.g. Brevo, Mailersend) OR Push Notifications (via OneSignal) 
File Storage: Supabase Storage / AWS S3 / Firebase Storage 
2. 📁 Admin Panel Features 

Admin signup (first admin manually registered via backend/db) 
Admin login/authentication 
Manage quizzes: 
Add/update weekly questions 
Start/stop quiz button 
Manage events: 
Add/edit/delete event 
Set registration, attendance, start/end time 
Auto-generate QR code 
Upload Jagannath image for attendance page 
Upload spiritual PDFs (Resources) 
Upload event images (Gallery) 
Manage public Q&A (answer questions) 
3. 📊 Leaderboard Logic 

Quiz leaderboard: auto-updated weekly 
Sewa leaderboard: auto-reset monthly, stored history if needed 
4. 📩 Notification Service 

Option A: Email (Free up to monthly limit) 
Option B: Push Notification (Free with OneSignal) 
Request permission on login/signup 
Notifications can be sent even if the user is offline (if allowed) 
 

✅ Optional Enhancements 

Auto-generate QR Code per event 
Auto-disable QR after attendance end time 
Custom Jagannath image per attendance page 
Flower animation on attendance confirmation 
Public visibility for educational Q&A 
Auto-delete all chats at month end 
 

Let me know if you’d like a wireframe/flowchart or a task breakdown for developers. 

 