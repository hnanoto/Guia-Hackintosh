// Test script for Clover Templates
// Run with: node test-clover-templates.js

// Load templates
const fs = require('fs');
const path = require('path');

// Read the templates file
const templatesContent = fs.readFileSync(path.join(__dirname, 'datasets', 'clover-templates.js'), 'utf8');
eval(templatesContent);

// Test hardware profiles
const testProfiles = [
    {
        name: "Intel 13th Gen Desktop (Z790)",
        hw: {
            CPU: { "Processor Name": "Intel Core i7-13700K", Codename: "Raptor Lake", Manufacturer: "Intel" },
            Motherboard: { Chipset: "Z790", Platform: "Desktop", Name: "ASUS ROG MAXIMUS Z790" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon RX 7900 XTX", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-1220" } }
        }
    },
    {
        name: "Intel 12th Gen Desktop (B660)",
        hw: {
            CPU: { "Processor Name": "Intel Core i5-12400", Codename: "Alder Lake", Manufacturer: "Intel" },
            Motherboard: { Chipset: "B660", Platform: "Desktop", Name: "MSI PRO B660M-A" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "Intel UHD 730", "Device Type": "Integrated GPU" } },
            Sound: { "Audio1": { "Device ID": "10EC-0897" } }
        }
    },
    {
        name: "AMD Ryzen 9 7950X (AM5 - Zen 4)",
        hw: {
            CPU: { "Processor Name": "AMD Ryzen 9 7950X", Codename: "Zen 4", Manufacturer: "AMD" },
            Motherboard: { Chipset: "X670E", Platform: "Desktop", Name: "ASUS ROG Crosshair X670E" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon RX 7900 XTX", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-1220" } }
        }
    },
    {
        name: "AMD Ryzen 7 5800X (AM4 - Zen 3)",
        hw: {
            CPU: { "Processor Name": "AMD Ryzen 7 5800X", Codename: "Zen 3", Manufacturer: "AMD" },
            Motherboard: { Chipset: "X570", Platform: "Desktop", Name: "ASUS ROG Crosshair VIII" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon RX 6800 XT", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-1220" } }
        }
    },
    {
        name: "AMD Ryzen 5 3600 (AM4 - Zen 2)",
        hw: {
            CPU: { "Processor Name": "AMD Ryzen 5 3600", Codename: "Zen 2", Manufacturer: "AMD" },
            Motherboard: { Chipset: "B550", Platform: "Desktop", Name: "MSI B550 Gaming Plus" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon RX 5700 XT", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-0892" } }
        }
    },
    {
        name: "AMD Threadripper 3990X (TRX40)",
        hw: {
            CPU: { "Processor Name": "AMD Ryzen Threadripper 3990X", Codename: "Threadripper", Manufacturer: "AMD" },
            Motherboard: { Chipset: "TRX40", Platform: "Desktop", Name: "ASUS ROG Zenith II Extreme" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon Pro W6800", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-1220" } }
        }
    },
    {
        name: "Intel 10th Gen Desktop (Z490)",
        hw: {
            CPU: { "Processor Name": "Intel Core i9-10900K", Codename: "Comet Lake", Manufacturer: "Intel" },
            Motherboard: { Chipset: "Z490", Platform: "Desktop", Name: "Gigabyte Z490 AORUS" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "NVIDIA GeForce RTX 3090", Manufacturer: "NVIDIA" } },
            Sound: { "Audio1": { "Device ID": "10EC-1220" } }
        }
    },
    {
        name: "Intel 11th Gen Tiger Lake Laptop",
        hw: {
            CPU: { "Processor Name": "Intel Core i7-1165G7", Codename: "Tiger Lake", Manufacturer: "Intel" },
            Motherboard: { Chipset: "PCH-LP", Platform: "Laptop", Name: "Dell XPS 13" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "Intel Iris Xe Graphics", "Device Type": "Integrated GPU" } },
            Sound: { "Audio1": { "Device ID": "10EC-0295" } }
        }
    },
    {
        name: "Intel Ice Lake Laptop",
        hw: {
            CPU: { "Processor Name": "Intel Core i5-1035G1", Codename: "Ice Lake", Manufacturer: "Intel" },
            Motherboard: { Chipset: "PCH-LP", Platform: "Laptop", Name: "Lenovo ThinkPad" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "Intel Ice Lake-LP GT2", "Device Type": "Integrated GPU" } },
            Sound: { "Audio1": { "Device ID": "10EC-0256" } }
        }
    },
    {
        name: "Intel X299 HEDT",
        hw: {
            CPU: { "Processor Name": "Intel Core i9-10980XE", Codename: "Cascade Lake-X", Manufacturer: "Intel" },
            Motherboard: { Chipset: "X299", Platform: "Desktop", Name: "ASUS ROG Rampage VI Extreme" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon RX 6900 XT", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-1220" } }
        }
    },
    {
        name: "Intel X79 Legacy",
        hw: {
            CPU: { "Processor Name": "Intel Core i7-4930K", Codename: "Ivy Bridge-E", Manufacturer: "Intel" },
            Motherboard: { Chipset: "X79", Platform: "Desktop", Name: "ASUS Rampage IV Extreme" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon RX 580", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-0892" } }
        }
    },
    {
        name: "Intel 8th Gen Coffee Lake Desktop",
        hw: {
            CPU: { "Processor Name": "Intel Core i7-8700K", Codename: "Coffee Lake", Manufacturer: "Intel" },
            Motherboard: { Chipset: "Z370", Platform: "Desktop", Name: "Gigabyte Z370 AORUS Gaming 7" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "AMD Radeon RX 580", Manufacturer: "AMD" } },
            Sound: { "Audio1": { "Device ID": "10EC-1220" } }
        }
    },
    {
        name: "Intel 6th Gen Skylake Desktop",
        hw: {
            CPU: { "Processor Name": "Intel Core i5-6600K", Codename: "Skylake", Manufacturer: "Intel" },
            Motherboard: { Chipset: "Z170", Platform: "Desktop", Name: "MSI Z170A GAMING M5" },
            BIOS: { "Firmware Type": "UEFI" },
            GPU: { "GPU1": { "Device Name": "Intel HD Graphics 530", "Device Type": "Integrated GPU" } },
            Sound: { "Audio1": { "Device ID": "10EC-0892" } }
        }
    }
];

console.log("=".repeat(80));
console.log("CLOVER TEMPLATES TEST - Based on Olarila EFIs");
console.log("=".repeat(80));
console.log("");

testProfiles.forEach((profile, index) => {
    console.log(`\n${index + 1}. ${profile.name}`);
    console.log("-".repeat(60));

    const template = selectCloverTemplate(profile.hw);

    if (template) {
        console.log(`   ✓ Template found: ${template.platform}`);
        console.log(`   ✓ SMBIOS: ${template.smbios}`);
        console.log(`   ✓ Boot Args: ${template.boot?.args || "N/A"}`);
        console.log(`   ✓ CSR Active Config: ${template.rtVariables?.csrActiveConfig || "N/A"}`);
        console.log(`   ✓ Quirks:`);
        if (template.quirks) {
            console.log(`     - DevirtualiseMmio: ${template.quirks.devirtualiseMmio}`);
            console.log(`     - EnableWriteUnprotector: ${template.quirks.enableWriteUnprotector}`);
            console.log(`     - RebuildAppleMemoryMap: ${template.quirks.rebuildAppleMemoryMap}`);
            console.log(`     - SetupVirtualMap: ${template.quirks.setupVirtualMap}`);
            console.log(`     - ProvideCurrentCpuInfo: ${template.quirks.provideCurrentCpuInfo}`);
        }
        if (template.graphics?.igPlatformId) {
            console.log(`   ✓ ig-platform-id: ${template.graphics.igPlatformId}`);
        }
    } else {
        console.log(`   ✗ No template found - will use dynamic generation`);
    }
});

console.log("\n" + "=".repeat(80));
console.log("TEST COMPLETE");
console.log("=".repeat(80));
