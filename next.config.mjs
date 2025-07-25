#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Installation Speed Diagnosis & Fix\n');

// Check current package count
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const depCount = Object.keys(packageJson.dependencies || {}).length;
const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
const totalDeps = depCount + devDepCount;

console.log(`📦 Current dependencies: ${totalDeps} (${depCount} prod + ${devDepCount} dev)`);

if (totalDeps > 100) {
  console.log('⚠️  WARNING: 100+ dependencies will cause slow installs!\n');
}

// Show installation options
console.log('🎯 FAST INSTALLATION OPTIONS:\n');

console.log('1. 🏃‍♂️ FASTEST - Use npm (temporarily):');
console.log('   rm -rf node_modules pnpm-lock.yaml');
console.log('   npm install --legacy-peer-deps\n');

console.log('2. ⚡ FAST - Optimized pnpm:');
console.log('   rm -rf node_modules pnpm-lock.yaml');
console.log('   pnpm install --shamefully-hoist --ignore-scripts\n');

console.log('3. 🧹 CLEAN - Remove unnecessary deps first:');
console.log('   node install-fix.mjs cleanup');
console.log('   pnpm install\n');

// If cleanup argument provided
if (process.argv[2] === 'cleanup') {
  console.log('🧹 CLEANING UP DEPENDENCIES...\n');

  // Heavy packages that might not be needed
  const suspiciousPackages = [
    // Development tools that might be redundant
    'eslint', 'eslint-config-next', // Next.js has built-in linting
    'prettier', // Biome does formatting
    '@types/react', '@types/react-dom', // Often auto-installed
    'typescript', // Might be globally installed

    // UI libraries (check if actually used)
    'react-spring', 'lottie-react',

    // Utility libraries that might be overkill
    'lodash', 'ramda', 'moment', // Use native JS instead
    'axios', // Use fetch

    // Testing that might not be set up
    'jest', 'testing-library', 'cypress', 'playwright',

    // Build tools possibly redundant with Next.js
    'webpack', 'babel', 'rollup', 'vite'
  ];

  const currentDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const toRemove = suspiciousPackages.filter(pkg => currentDeps[pkg]);

  if (toRemove.length > 0) {
    console.log('🗑️  Packages to consider removing:');
    toRemove.forEach(pkg => {
      console.log(`   • ${pkg}`);
    });
    console.log('\nTo remove them:');
    console.log(`   pnpm remove ${toRemove.join(' ')}\n`);
  } else {
    console.log('✅ No obvious redundant packages found\n');
  }
}

console.log('💡 PRO TIPS:');
console.log('• Use npm for faster installs during development');
console.log('• Switch back to pnpm for production builds');
console.log('• Consider reducing dependencies under 50 total');
console.log('• Use bundlephobia.com to check package sizes\n');

// Show current pnpm version
try {
  const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
  console.log(`📦 Current pnpm version: ${pnpmVersion}`);

  if (parseFloat(pnpmVersion) < 10.0) {
    console.log('⚠️  Consider upgrading: npm install -g pnpm@latest');
  }
} catch (e) {
  console.log('📦 pnpm not found or error checking version');
}
