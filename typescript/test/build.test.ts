import { execSync } from 'child_process';
import { existsSync, readdirSync, rmSync, readFileSync } from 'fs';
import { resolve } from 'path';

describe('build', () => {
  const projectRoot = resolve(__dirname, '..');
  const distPath = resolve(projectRoot, 'dist');
  const packageJsonPath = resolve(projectRoot, 'package.json');

  let packageJson: { main?: string; bin?: Record<string, string> };

  beforeAll(() => {
    // Read and parse package.json
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(packageJsonContent);

    // Ensure the dist directory is clean before running the build
    if (existsSync(distPath)) {
      rmSync(distPath, { recursive: true, force: true });
    }
  });

  it('should build successfully and create main and bin files', () => {
    // Run the build command
    execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });

    // Check if the dist directory exists
    expect(existsSync(distPath)).toBe(true);

    // Check if the main entry point file exists
    if (packageJson.main) {
      expect(existsSync(resolve(projectRoot, packageJson.main))).toBe(true);
    }

    // Check if the bin entry point files exist
    if (packageJson.bin) {
      for (const binPath of Object.values(packageJson.bin)) {
        expect(existsSync(resolve(projectRoot, binPath))).toBe(true);
      }
    }

    // Check that no test files are included in the build
    const distFiles = readdirSync(distPath);
    const testFiles = distFiles.filter(file => file.endsWith('.test.js'));
    expect(testFiles.length).toBe(0);
  });
});