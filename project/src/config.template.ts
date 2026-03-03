import * as jsonc from 'jsonc-parser';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import path from 'path';

const directory = path.resolve(__dirname, '../../configurations');
const store = path.resolve(__dirname, '../../storage/store/hashmap.json');
const storeCombined = path.resolve(__dirname, '../../storage/store/confighash.bin');

type HashStore = Record<string, string>;

async function hashFile(content: string): Promise<string> {
    return crypto.createHash('sha256').update(content).digest('hex');
}

async function loadHashStore(): Promise<HashStore> {
    try {
        const content = await fs.readFile(store, 'utf-8');
        return JSON.parse(content);
    } catch {
        return {};
    }
}

async function saveHashStore(hashes: HashStore): Promise<void> {
    await fs.writeFile(store, JSON.stringify(hashes, null, 4), 'utf-8');
    await fs.writeFile(storeCombined, Object.entries(hashes).map(([key, hash]) => `${hash}`), 'utf-8');
}

async function processConfigFile(filePath: string, hashes: HashStore): Promise<void> {
    const fileName = path.basename(filePath);
    const configName = path.basename(fileName, path.extname(fileName));
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const hash = await hashFile(fileContent);
    const errors: jsonc.ParseError[] = [];
    const data = jsonc.parse(fileContent, errors, { allowTrailingComma: true });
    if (errors.length) {
        throw new Error(`Invalid JSONC in ${fileName}`);
    }
    const hashKey = `${configName}:hash`;
    if (data[hashKey] === hash) {
        return;
    }
    data[hashKey] = hash;
    const updatedContent = jsonc.applyEdits(
        fileContent,
        jsonc.modify(fileContent, [hashKey], hash, {
            formattingOptions: { insertSpaces: true, tabSize: 4 }
        })
    );
    console.log(`Updated hash for ${fileName}: ${hash}`);
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    hashes[configName] = hash;
}

async function run(): Promise<void> {
    try {
        const stat = await fs.stat(directory);
        if (!stat.isDirectory()) return;
    } catch {
        return;
    }
    const hashes = await loadHashStore();
    const files = await fs.readdir(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) continue;
        try {
            await processConfigFile(filePath, hashes);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    await saveHashStore(hashes);
}

run().catch(console.error);
