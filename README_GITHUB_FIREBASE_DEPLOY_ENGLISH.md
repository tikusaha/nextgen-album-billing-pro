# NextGen Album Billing Pro - GitHub Pages + Cloud Database Deployment Guide

This package is ready for GitHub Pages hosting. The billing software will run from GitHub Pages, and the data can be saved in Firebase Firestore.

## Very Important

GitHub Pages is static hosting. It can host HTML, CSS and JavaScript, but it is not a database server. Do not save private billing data directly inside a GitHub repository. Also do not put a GitHub Personal Access Token inside frontend JavaScript, because anyone can view it from the browser.

Safe setup:

- Website hosting: GitHub Pages
- Database: Firebase Firestore
- Browser offline backup: localStorage

## Files in this package

- `index.html` - main billing website
- `firebase-config.js` - add your Firebase project config here
- `firebase-sync.js` - automatic Firestore sync adapter
- `firestore.rules` - starter Firestore rules
- `README_GITHUB_FIREBASE_DEPLOY_ENGLISH.md` - this guide

## Step 1 - Create GitHub Repository

1. Go to GitHub.
2. Create a new repository, for example: `nextgen-album-billing-pro`.
3. Upload all files from this package:
   - `index.html`
   - `firebase-config.js`
   - `firebase-sync.js`
   - `firestore.rules`
   - this README file
4. Commit the files.

## Step 2 - Enable GitHub Pages

1. Open your repository on GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
4. Save.

Your website URL will be similar to:

```text
https://YOUR-GITHUB-USERNAME.github.io/nextgen-album-billing-pro/
```

GitHub Pages also supports custom domains and HTTPS. GitHub's documentation says GitHub Pages sites can use custom domains, and HTTPS is supported for GitHub Pages sites.

## Step 3 - Create Firebase Database

1. Go to Firebase Console.
2. Create a new project.
3. Open **Build > Firestore Database**.
4. Create a Firestore database.
5. Choose your preferred location.
6. Open **Project settings > General**.
7. Under **Your apps**, create a Web App.
8. Copy the Firebase config.

Firebase Firestore is designed for web/mobile apps to add and read data using client SDKs.

## Step 4 - Add Firebase Config

Open `firebase-config.js` and replace the placeholder values:

```js
window.NGAB_FIREBASE_CONFIG = {
  enabled: true,
  businessId: "nextgen-album-billing-pro",
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

Important: set `enabled: true`.

## Step 5 - Add Firestore Rules

Open Firebase Console:

1. Firestore Database
2. Rules
3. Paste the content from `firestore.rules`
4. Publish rules

For a private production system, ask your coder to add Firebase Authentication and user-based security rules. The included rule is a simple starter rule for one business document.

## Step 6 - Test Data Saving

1. Open your GitHub Pages website.
2. Add one customer.
3. Add one item.
4. Create and save one bill.
5. Refresh the page.
6. Open the same website on another device/browser.
7. Check if the same customer/item/bill appears.

If it appears, Firestore cloud sync is working.

## Data Storage Notes

The current adapter stores the complete billing app database in one Firestore document:

```text
collection: nextgen_album_billing_pro
document: nextgen-album-billing-pro
```

This is simple and good for small to medium usage. If your data becomes very large, ask your coder to split data into separate Firestore collections:

- customers
- items
- bills
- payments
- additionalCharges
- specialRates

## Custom Domain Setup

If you want to use your domain:

1. In GitHub repository, go to **Settings > Pages**.
2. Add your custom domain.
3. Update DNS records in your domain panel.
4. Enable HTTPS after DNS verification.

## Recommended Production Upgrade

For a serious live business app, ask your coder to add:

- Firebase Authentication login
- Daily backup export
- Separate Firestore collections
- Role-based access: admin / staff
- Server-side PDF generation
- WhatsApp Business API integration for automatic invoice sending

## What Not To Do

Do not put these in frontend code:

- GitHub Personal Access Token
- WhatsApp API secret
- Firebase Admin SDK private key
- server passwords

Frontend code is visible to users in the browser.
