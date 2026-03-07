/**
 * Standalone script to sync skills from upstream.
 * Run: node scripts/update-skills.js
 * Works on Windows (uses ZIP) and other platforms.
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const REPO_ZIP_URL = 'https://github.com/sickn33/antigravity-awesome-skills/archive/refs/heads/main.zip';
const COMMITS_API_URL = 'https://api.github.com/repos/sickn33/antigravity-awesome-skills/commits/main';
const SHA_FILE = path.join(ROOT_DIR, 'web-app', '.last-sync-sha');

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = (url) => {
            https.get(url, { headers: { 'User-Agent': 'antigravity-skills-app' } }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    request(res.headers.location);
                    return;
                }
                if (res.statusCode !== 200) {
                    reject(new Error(`Download failed with status ${res.statusCode}`));
                    return;
                }
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
        };
        request(url);
    });
}

function checkRemoteSha() {
    return new Promise((resolve) => {
        https.get(COMMITS_API_URL, {
            headers: { 'User-Agent': 'antigravity-skills-app', 'Accept': 'application/vnd.github.v3+json' },
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        resolve(JSON.parse(body).sha || null);
                    } else {
                        resolve(null);
                    }
                } catch {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function syncWithArchive() {
    const remoteSha = await checkRemoteSha();
    if (remoteSha && fs.existsSync(SHA_FILE)) {
        const storedSha = fs.readFileSync(SHA_FILE, 'utf-8').trim();
        if (storedSha === remoteSha) {
            console.log('[Sync] Already up to date!');
            return { upToDate: true };
        }
    }

    const tempDir = path.join(os.tmpdir(), `ag-skills-sync-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    const archivePath = path.join(tempDir, 'update.zip');

    try {
        console.log('[Sync] Downloading skills from GitHub (ZIP)...');
        await downloadFile(REPO_ZIP_URL, archivePath);

        console.log('[Sync] Extracting...');
        if (process.platform === 'win32') {
            const psScript = path.join(ROOT_DIR, 'update-extract.ps1');
            fs.writeFileSync(psScript, `Expand-Archive -LiteralPath '${archivePath.replace(/'/g, "''")}' -DestinationPath '${tempDir.replace(/'/g, "''")}' -Force\n`);
            try {
                execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${psScript}"`, { stdio: 'inherit' });
            } finally {
                if (fs.existsSync(psScript)) fs.unlinkSync(psScript);
            }
        } else {
            execSync(`unzip -o "${archivePath}" -d "${tempDir}"`, { stdio: 'inherit' });
        }

        const extractedRoot = path.join(tempDir, 'antigravity-awesome-skills-main');
        const srcSkills = path.join(extractedRoot, 'skills');
        const srcIndex = path.join(extractedRoot, 'skills_index.json');
        const destSkills = path.join(ROOT_DIR, 'skills');
        const destIndex = path.join(ROOT_DIR, 'skills_index.json');

        if (!fs.existsSync(srcSkills)) {
            throw new Error('Skills folder not found in downloaded archive.');
        }

        console.log('[Sync] Updating skills...');
        if (fs.existsSync(destSkills)) fs.rmSync(destSkills, { recursive: true, force: true });
        fs.renameSync(srcSkills, destSkills);
        if (fs.existsSync(srcIndex)) fs.copyFileSync(srcIndex, destIndex);

        if (remoteSha) fs.writeFileSync(SHA_FILE, remoteSha, 'utf-8');

        const data = JSON.parse(fs.readFileSync(destIndex, 'utf-8'));
        const count = Array.isArray(data) ? data.length : 0;
        console.log(`[Sync] Successfully synced ${count} skills!`);
        return { upToDate: false, count };
    } finally {
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

syncWithArchive()
    .then((result) => {
        if (!result.upToDate) {
            console.log('\nRun "npm run app:setup" to update web-app assets.');
        }
        process.exit(0);
    })
    .catch((err) => {
        console.error('[Sync] Failed:', err.message);
        process.exit(1);
    });
