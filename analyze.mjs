#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔍 Analyzing your dependencies...\n');

try {
  // Get dependency tree size
  console.log('📦 Dependency Count:');
  const deps = execSync('npm ls --depth=0 --json', { encoding: 'utf8' });
  const parsed = JSON.parse(deps);
  const directDeps = Object.keys(parsed.dependencies || {}).length;
  console.log(`Direct dependencies: ${directDeps}`);

  // Find largest packages
  console.log('\n📈 Largest packages:');
  const sizes = execSync('du -sh node_modules/* 2>/dev/null | sort -hr | head -10', { encoding: 'utf8' });
  console.log(sizes);

  // Check for duplicate dependencies
  console.log('\n🔄 Checking for duplicates:');
  try {
    const dupes = execSync('npm ls --depth=1 | grep -E "\\w+ .*\\d+\\.\\d+\\.\\d+" | sort | uniq -d', { encoding: 'utf8' });
    if (dupes.trim()) {
      console.log('Found duplicates:');
      console.log(dupes);
    } else {
      console.log('No obvious duplicates found ✅');
    }
  } catch (e) {
    console.log('No duplicates detected ✅');
  }

  // Next.js specific checks
  console.log('\n⚡ Next.js optimization suggestions:');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const heavyPackages = [
    '@types/node', 'typescript', 'tailwindcss', '@tailwindcss/postcss',
    'postcss', 'autoprefixer', '@biomejs/biome'
  ];
  
  heavyPackages.forEach(pkg => {
    if (allDeps[pkg]) {
      console.log(`• Move ${pkg} to devDependencies if not already`);
    }
  });

  console.log('\n✅ Analysis complete! Run this script with: node analyze.mjs');

} catch (error) {
  console.error('Analysis failed:', error.message);
  console.log('\nRun "npm install" first if node_modules is missing');
} 