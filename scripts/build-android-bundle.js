
#!/usr/bin/env node
/**
 * My Paws Walks — Android APK & Google Play AAB Builder
 *
 * Usage:
 *   npm run android:keystore
 *   npm run android:twa-init
 *   npm run android:build-aab
 *
 * IMPORTANT:
 * Never hard-code signing passwords in this file.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const action = process.argv[2] || 'info';

function printBanner() {
  console.log('\n================================================');
  console.log('MY PAWS WALKS — ANDROID BUILD HELPER');
  console.log('================================================\n');
}

printBanner();

if (action === 'keystore') {
  const keystorePath = path.resolve(
    process.cwd(),
    'android-release-key.keystore'
  );

  if (fs.existsSync(keystorePath)) {
    console.log('A keystore already exists:', keystorePath);
    console.log('Do not overwrite or reuse an exposed signing key.');
    process.exit(1);
  }

  console.log('Generating a new Android upload keystore.');
  console.log('You will be prompted to enter passwords securely.');
  console.log('Do not use the previously exposed password.\n');

  const args = [
    '-genkeypair',
    '-v',
    '-keystore', keystorePath,
    '-alias', 'mypawswalks-key',
    '-keyalg', 'RSA',
    '-keysize', '2048',
    '-validity', '10000',
    '-dname',
    'CN=My Paws Walks, OU=Mobile, O=My Paws Walks, C=GB'
  ];

  try {
    execSync(
      `keytool ${args.map(a => `"${a.replace(/"/g, '\\"')}"`).join(' ')}`,
      { stdio: 'inherit' }
    );

    console.log('\nKeystore generation completed.');
    console.log('Keep the keystore and its passwords private.');
    console.log('Back up the keystore securely before using it.');
    console.log(
      'To inspect its certificate, run:'
    );
    console.log(
      'keytool -list -v -keystore android-release-key.keystore -alias mypawswalks-key'
    );
  } catch {
    console.error(
      'Keystore generation failed. Check that Java JDK/keytool is installed.'
    );
    process.exitCode = 1;
  }
} else {
  console.log('Android build options:\n');

  console.log('1. Initialize the Bubblewrap project:');
  console.log('   npx @bubblewrap/cli init --manifest=./twa-manifest.json\n');

  console.log('2. Build the Android bundle:');
  console.log('   npx @bubblewrap/cli build\n');

  console.log('Do not build a release until signing configuration is checked.');
  console.log('Ensure all signing credentials stay outside GitHub.');
}
