Fix my Firebase authentication to behave like a real production website.

Current Issue:
After selecting a Google email, it does not properly show the Continue / Cancel confirmation behavior and authentication state is inconsistent. The login does not behave like real websites with real-time session persistence.

I want a professional production-ready Firebase authentication setup with:

1. Google Authentication
2. Real-time auth state tracking
3. Proper loading states
4. Continue / Cancel handling
5. Persistent login session
6. Backend token integration
7. Clean React architecture

Implement the following:

-------------------------------------------------------
1️⃣ Firebase Setup
-------------------------------------------------------

Create firebase.js with:

- initializeApp
- getAuth
- GoogleAuthProvider
- setPersistence(auth, browserLocalPersistence)

Ensure persistence is LOCAL so user stays logged in after refresh.

-------------------------------------------------------
2️⃣ Authentication Flow
-------------------------------------------------------

Use signInWithPopup(auth, provider) for Google login.

Handle:

- loading state before popup
- success state
- error state
- cancellation handling (error.code === 'auth/popup-closed-by-user')

If user cancels, show message:
"Login cancelled by user"

-------------------------------------------------------
3️⃣ Real-Time Auth Listener
-------------------------------------------------------

Use onAuthStateChanged(auth, callback)

In AuthContext:

- user state
- loading state
- login()
- logout()
- isAuthenticated boolean

On app load:
- show spinner until Firebase confirms session
- automatically set user if session exists

-------------------------------------------------------
4️⃣ Proper Login Button Behavior
-------------------------------------------------------

When user clicks "Login with Google":

- Disable button
- Show spinner inside button
- Await signInWithPopup
- Handle errors properly
- Re-enable button if error

-------------------------------------------------------
5️⃣ Logout
-------------------------------------------------------

Implement signOut(auth)
Clear context state
Redirect to login page

-------------------------------------------------------
6️⃣ Backend JWT Integration (Important)
-------------------------------------------------------

After Firebase login success:

- Get Firebase ID token using:
  user.getIdToken()

- Send this token to backend:
  POST /api/v1/auth/firebase-login

Backend should:
- Verify Firebase token
- Create or fetch user
- Issue backend JWT
- Return backend token

Store backend JWT in:
- httpOnly cookie (preferred)
OR
- localStorage (if necessary)

-------------------------------------------------------
7️⃣ Proper Error Handling
-------------------------------------------------------

Handle errors:

auth/popup-closed-by-user
auth/network-request-failed
auth/unauthorized-domain

Display proper UI messages.

-------------------------------------------------------
8️⃣ Protect Routes
-------------------------------------------------------

Use a ProtectedRoute component:

If loading → show Spinner
If !user → redirect to /login
Else render component

-------------------------------------------------------
9️⃣ App Initialization
-------------------------------------------------------

Wrap App in AuthProvider
Ensure onAuthStateChanged runs once
Avoid multiple listeners

-------------------------------------------------------
🔟 Final Result Required
-------------------------------------------------------

Login should behave like:

- Real Google account selection
- Continue / Cancel popup
- Persistent session after refresh
- Instant UI update on login
- Proper logout
- Production-grade architecture

Code must be clean, modular, and production-ready.
No hacks.
No temporary fixes.
Proper async/await.