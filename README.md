# The Daily Journal — Starter CMS

A beginner-friendly article CMS built with HTML, CSS, JavaScript, Firebase Authentication, Cloud Firestore, and GitHub Pages.

## What it includes
- Public homepage showing published articles
- Individual article pages
- Admin email/password login
- Create, edit, delete, draft, and publish articles
- Responsive layout

## Before publishing

### 1. Create Firebase project
1. Open https://console.firebase.google.com/ and create a project.
2. Add a Web App and copy its configuration.
3. In Authentication > Sign-in method, enable **Email/Password**.
4. In Authentication > Users, add your administrator account.
5. Verify the admin email address.
6. Create a Cloud Firestore database.

### 2. Add Firebase configuration
Open `js/firebase-config.js` and replace every `PASTE_...` value with the configuration from Firebase Project settings > Your apps.

### 3. Set Firestore security rules
1. Open Firestore Database > Rules.
2. Paste the contents of `firestore.rules`.
3. Replace `REPLACE_WITH_YOUR_ADMIN_EMAIL` with the exact admin email you created.
4. Publish the rules.

These rules let visitors read published articles only. Only the verified admin email can create, update, or delete articles. Do not remove or weaken these rules.

### 4. Deploy to GitHub Pages
1. Create a GitHub repository, for example `daily-journal-cms`.
2. Upload all files and folders from this project to the repository root.
3. Open repository Settings > Pages.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish. Your public URL will look like `https://YOUR-USERNAME.github.io/daily-journal-cms/`.

### 5. Add your GitHub Pages domain to Firebase
In Firebase Authentication > Settings > Authorized domains, add `YOUR-USERNAME.github.io` if it is not already listed.

## How to use
- Public website: open your GitHub Pages URL.
- Admin login: open `YOUR-GITHUB-PAGES-URL/login.html`.
- Sign in using the administrator email/password created in Firebase.
- Create an article, choose Draft or Publish now, and save.
- Published articles appear on the public homepage. Drafts remain private.

## Notes
- This starter uses image URLs for article images. Uploading image files directly needs Firebase Storage and its own security rules; it is not enabled in this starter.
- Firebase web configuration is not a password. Security comes from Authentication and Firestore Security Rules. Never put service-account private keys or admin SDK credentials in this repository.
- Use a strong, unique admin password and keep your account secure.
- If you change an article from draft to published, it becomes publicly visible. If you change it back to draft, it is no longer publicly readable.
- This is a starter project. Test it with sample content before using it for important publication work.
