#!/usr/bin/env node

// Simple custom scheduled task
// - Logs environment info and a deterministic result
// - Designed to be safe to run repeatedly

const fs = require('fs');
const path = require('path');

function isoNow() {
  return new Date().toISOString();
}

function getPackageName() {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );
    return pkg.name || 'unknown-package';
  } catch (e) {
    return 'unknown-package';
  }
}

function main() {
  const pkgName = getPackageName();
  const timestamp = isoNow();

  // Deterministic "work": calculate a checksum of a static string
  const data = `${pkgName}:${timestamp.split('T')[0]}`; // date-only to keep output stable per day
  let checksum = 0;
  for (let i = 0; i < data.length; i++) {
    checksum = (checksum + data.charCodeAt(i)) % 100000;
  }

  const payload = {
    task: 'custom-scheduled-task',
    package: pkgName,
    date: timestamp,
    checksum,
    node: process.version,
  };

  // Print single-line JSON for easy log parsing in CI
  console.log(JSON.stringify(payload));
}

if (require.main === module) {
  main();
}
