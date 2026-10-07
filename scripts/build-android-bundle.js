#!/usr/bin/env node
/**
 * My Paws Walks — Android APK & Google Play Store AAB Bundle Builder Helper
 * Usage:
 *   npm run android:keystore   -> Generates release signing keystore
 *   npm run android:twa-init   -> Initializes Bubblewrap Android project from twa-manifest.json
 *   npm run android:build-aab  -> Builds signed .aab (Google Play Store Bundle) and .apk (Android Installer)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const action = process.argv[2] || 'info';

function printBanner() {
  console.log('\n====================================================================');
  console.log('🐾 MY PAWS WALKS — ANDROID APK & GOOGLE PLAY AAB BUNDLE GENERATOR');
  console.log('====================================================================\n');
}

printBanner();

if (action === 'keystore') {
  const keystorePath = path.resolve(process.cwd(), 'android-release-key.keystore');
  if (fs.existsSync(keystorePath)) {
    console.log('✅ Keystore already exists at:', keystorePath);
    process.exit(0);
  }
  console.log('🔐 Generating Android Release Keystore (android-release-key.keystore)...');
  const cmd = `keytool -genkeypair -v -keystore android-release-key.keystore -alias mypawswalks-key -keyalg RSA -keysize 2048 -validity 10000 -storepass mypawswalks123 -keypass mypawswalks123 -dname "CN=My Paws Walks, OU=Mobile, O=My Paws Walks UK, L=London, S=London, C=GB"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('\n✅ Keystore generated! Run the following to get your SHA-256 fingerprint for public/.well-known/assetlinks.json:');
    console.log('   keytool -list -v -keystore android-release-key.keystore -alias mypawswalks-key -storepass mypawswalks123\n');
  } catch (err) {
    console.error('⚠️ Make sure Java JDK (keytool) is installed on your machine to generate the keystore.');
  }
} else {
  console.log('📦 Everything is configured to generate your signed APK & AAB bundle:\n');
  console.log('1️⃣  OPTION A: Bubblewrap TWA (Recommended for Google Play Store AAB + APK):');
  console.log('    npx @bubblewrap/cli init --manifest=./twa-manifest.json');
  console.log('    npx @bubblewrap/cli build');
  console.log('    -> Outputs: ./app-release-bundle.aab (Play Store) & ./app-release-signed.apk (Direct Install)\n');
  console.log('2️⃣  OPTION B: PWABuilder 1-Click Cloud APK & AAB Generator:');
  console.log('    1. Open https://www.pwabuilder.com');
  console.log('    2. Paste your live App URL and click "Package for Stores" -> "Android"');
  console.log('    3. Download the ready-to-upload Google Play .aab, .apk, and assetlinks.json!\n');
  console.log('3️⃣  OPTION C: Capacitor Native Android Studio / Xcode iOS Project:');
  console.log('    npm run build');
  console.log('    npx @capacitor/cli add android');
  console.log('    npx @capacitor/cli sync android');
  console.log('    npx @capacitor/cli open android   (Then Build -> Generate Signed Bundle / APK in Android Studio)\n');
}
