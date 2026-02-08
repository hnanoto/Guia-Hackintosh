// Debug script to generate and check Clover config.plist
const fs = require('fs');
const path = require('path');

// Mock window for Node.js
global.window = global;

// Load all required files
eval(fs.readFileSync(path.join(__dirname, 'datasets', 'clover-templates.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, 'datasets', 'igpu-properties.js'), 'utf8'));
eval(fs.readFileSync(path.join(__dirname, 'datasets', 'codec-layouts.js'), 'utf8'));

// Mock the config-generator (simplified for testing)
class ConfigGenerator {
    constructor() { }
    getNetworkCards() { return []; }
    detectCPUCodenameFromName() { return "Coffee Lake"; }
    getMatchingMacOSVersions() { return []; }
    getAudioLayoutForCodec() { return 1; }
    selectSecureBootModel() { return "Default"; }
    getIgPlatformId() { return "0x3E9B0007"; }
}

// Load clover generator
const cloverCode = fs.readFileSync(path.join(__dirname, 'clover-generator.js'), 'utf8');
eval(cloverCode);

// Test hardware profile
const testHw = {
    CPU: { "Processor Name": "Intel Core i5-12400", Codename: "Alder Lake", Manufacturer: "Intel" },
    Motherboard: { Chipset: "B660", Platform: "Desktop", Name: "MSI PRO B660M-A" },
    BIOS: { "Firmware Type": "UEFI" },
    GPU: { "GPU1": { "Device Name": "Intel UHD 730", "Device Type": "Integrated GPU" } },
    Sound: { "Audio1": { "Device ID": "10EC-0897" } }
};

const macOS = {
    name: "macOS Sonoma 14.0",
    darwin: "23.0.0"
};

try {
    const generator = new CloverConfigGenerator();
    const config = generator.generateConfig(testHw, macOS);

    // Save to file 
    fs.writeFileSync('debug-config.plist', config, 'utf8');

    // Show lines around line 23
    const lines = config.split('\n');
    console.log("=== Lines 18-30 of generated config.plist ===");
    for (let i = 17; i < Math.min(30, lines.length); i++) {
        const marker = (i === 22) ? " >>> LINE 23" : "";
        console.log(`${i + 1}: ${lines[i]}${marker}`);
    }

    console.log("\n=== Checking for undefined values ===");
    const undefinedMatches = config.match(/<undefined\/>/g);
    if (undefinedMatches) {
        console.log(`Found ${undefinedMatches.length} instances of <undefined/>`);
        // Find line numbers
        lines.forEach((line, idx) => {
            if (line.includes('undefined')) {
                console.log(`Line ${idx + 1}: ${line.trim()}`);
            }
        });
    } else {
        console.log("No <undefined/> found");
    }

    // Check for other invalid values
    console.log("\n=== Checking for other invalid values ===");
    lines.forEach((line, idx) => {
        if (line.match(/<[^/><]+\/>/)) {
            const tag = line.match(/<([^/><]+)\/>/);
            if (tag && !['true', 'false', 'dict', 'array'].includes(tag[1])) {
                console.log(`Line ${idx + 1} - Invalid tag: ${line.trim()}`);
            }
        }
    });

    console.log("\nConfig saved to debug-config.plist");

} catch (e) {
    console.error("Error generating config:", e.message);
    console.error(e.stack);
}
