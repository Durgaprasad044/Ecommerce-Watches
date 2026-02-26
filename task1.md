# Razorpay "Failed to Fetch" Error — Debug Master Prompt

You are a senior full-stack debugging expert.

I am getting a **“Failed to fetch”** error when clicking the Razorpay payment button.

Your task is to fully diagnose and fix the issue without rewriting the entire project.

---

## GOAL

Fix the network error so that:

- Frontend successfully connects to backend
- Backend creates Razorpay order correctly
- Razorpay checkout opens properly
- “Failed to fetch” error is completely removed

---

## WHAT YOU MUST CHECK AND FIX

1. Confirm backend server is running on the correct port.
2. Verify frontend API base URL configuration.
3. Fix incorrect or mismatched endpoint paths.
4. Ensure CORS is configured correctly:
   - Allow correct frontend origin
   - Allow credentials if required
5. Ensure environment variables are properly loaded in both frontend and backend.
6. Ensure API base URL is not undefined.
7. Verify fetch/axios call:
   - Correct HTTP method
   - Proper headers
   - Proper JSON body
8. Ensure Razorpay order creation route exists and returns valid JSON.
9. Add proper try/catch blocks in backend controllers.
10. Add logging to detect backend crashes.
11. Fix any unhandled promise rejections.
12. Ensure backend always returns a response (no hanging requests).

---

## STRICT RULES

- Do NOT rewrite the entire project.
- Modify only necessary files.
- Do NOT change UI text.
- Do NOT change button labels.
- No hardcoding.
- Maintain clean architecture.
- Show exactly which files were modified.
- Show corrected code snippets only.
- If any required configuration is missing, ask before proceeding.

---

## EXPECTED RESULT

After fixes:

- Clicking the Razorpay button sends a successful backend request
- Backend responds with valid Razorpay order data
- Razorpay checkout opens
- No “Failed to fetch” error appears