/*
  NextGen Album Billing Pro - Firebase Firestore Sync Adapter
  This adapter keeps the app's existing localStorage database and syncs it
  to one Firestore document for your business.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

(function () {
  const cfg = window.NGAB_FIREBASE_CONFIG;
  if (!cfg || !cfg.enabled) {
    console.info("Firebase cloud sync is disabled. Edit firebase-config.js and set enabled: true.");
    addCloudBadge("Local Mode", "#64748b");
    return;
  }

  const app = initializeApp(cfg.firebaseConfig);
  const firestore = getFirestore(app);
  enableIndexedDbPersistence(firestore).catch(() => {});

  const businessId = cfg.businessId || "default-business";
  const cloudRef = doc(firestore, "nextgen_album_billing_pro", businessId);
  let syncing = false;
  let saveTimer = null;

  function addCloudBadge(text, color) {
    const badge = document.createElement("div");
    badge.id = "cloudSyncBadge";
    badge.textContent = text;
    badge.style.cssText = `position:fixed;right:16px;bottom:16px;z-index:99999;background:${color};color:white;padding:9px 13px;border-radius:999px;font:700 12px system-ui;box-shadow:0 10px 25px rgba(0,0,0,.18)`;
    document.body.appendChild(badge);
  }

  function updateBadge(text, color) {
    let badge = document.getElementById("cloudSyncBadge");
    if (!badge) return addCloudBadge(text, color);
    badge.textContent = text;
    badge.style.background = color;
  }

  async function downloadCloudDB() {
    const snap = await getDoc(cloudRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return data && data.database ? data.database : null;
  }

  async function uploadCloudDB() {
    if (syncing || !window.db) return;
    syncing = true;
    try {
      updateBadge("Saving Cloud...", "#f59e0b");
      await setDoc(cloudRef, {
        database: window.db,
        updatedAt: serverTimestamp(),
        appName: "NextGen Album Billing Pro"
      }, { merge: true });
      updateBadge("Cloud Saved", "#059669");
    } catch (err) {
      console.error("Cloud save failed", err);
      updateBadge("Cloud Save Failed", "#dc2626");
    } finally {
      syncing = false;
    }
  }

  function scheduleCloudSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(uploadCloudDB, 900);
  }

  async function startSync() {
    try {
      updateBadge("Cloud Loading...", "#2563eb");
      const remoteDB = await downloadCloudDB();
      if (remoteDB && window.db) {
        // Remote DB is treated as source of truth on first page load.
        window.db = { ...window.db, ...remoteDB };
        if (typeof window.saveDB === "function") window.saveDB();
        if (typeof window.refreshAll === "function") window.refreshAll();
        if (typeof window.renderInvoice === "function") window.renderInvoice();
      } else {
        await uploadCloudDB();
      }
      updateBadge("Cloud Sync On", "#059669");
    } catch (err) {
      console.error("Cloud load failed", err);
      updateBadge("Cloud Load Failed", "#dc2626");
    }

    // Wrap existing saveDB so every manual save/payment/customer/item edit syncs cloud too.
    if (typeof window.saveDB === "function") {
      const originalSaveDB = window.saveDB;
      window.saveDB = function () {
        originalSaveDB.apply(this, arguments);
        scheduleCloudSave();
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSync);
  } else {
    startSync();
  }
})();
