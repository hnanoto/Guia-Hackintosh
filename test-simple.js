// Simple Test for Clover Templates
const fs = require('fs');
const path = require('path');

// Load templates
const templatesContent = fs.readFileSync(path.join(__dirname, 'datasets', 'clover-templates.js'), 'utf8');
eval(templatesContent);

const testCases = [
    { name: "Intel Z790", hw: { CPU: { "Processor Name": "i7-13700K", Codename: "Raptor Lake", Manufacturer: "Intel" }, Motherboard: { Chipset: "Z790", Platform: "Desktop" } } },
    { name: "Intel Z490", hw: { CPU: { "Processor Name": "i9-10900K", Codename: "Comet Lake", Manufacturer: "Intel" }, Motherboard: { Chipset: "Z490", Platform: "Desktop" } } },
    { name: "AMD Zen4", hw: { CPU: { "Processor Name": "Ryzen 9 7950X", Codename: "Zen 4", Manufacturer: "AMD" }, Motherboard: { Chipset: "X670E", Platform: "Desktop" } } },
    { name: "AMD Zen3", hw: { CPU: { "Processor Name": "Ryzen 7 5800X", Codename: "Zen 3", Manufacturer: "AMD" }, Motherboard: { Chipset: "X570", Platform: "Desktop" } } },
    { name: "AMD Zen2", hw: { CPU: { "Processor Name": "Ryzen 5 3600", Codename: "Zen 2", Manufacturer: "AMD" }, Motherboard: { Chipset: "B550", Platform: "Desktop" } } },
    { name: "AMD TR", hw: { CPU: { "Processor Name": "Threadripper 3990X", Codename: "Threadripper", Manufacturer: "AMD" }, Motherboard: { Chipset: "TRX40", Platform: "Desktop" } } },
    { name: "Tiger Lake Laptop", hw: { CPU: { "Processor Name": "i7-1165G7", Codename: "Tiger Lake", Manufacturer: "Intel" }, Motherboard: { Chipset: "PCH-LP", Platform: "Laptop" } } },
    { name: "X299 HEDT", hw: { CPU: { "Processor Name": "i9-10980XE", Codename: "Cascade Lake-X", Manufacturer: "Intel" }, Motherboard: { Chipset: "X299", Platform: "Desktop" } } }
];

console.log("CLOVER TEMPLATE TEST RESULTS:");
console.log("=============================");

testCases.forEach((tc, i) => {
    const t = selectCloverTemplate(tc.hw);
    console.log((i + 1) + ". " + tc.name + " => " + (t ? t.smbios + " (" + t.platform + ")" : "FAIL"));
    if (t && t.quirks) {
        console.log("   DummyPowerMgmt: " + (t.quirks.dummyPowerManagement || false));
        console.log("   SetupVirtualMap: " + (t.quirks.setupVirtualMap || false));
    }
});

console.log("\nALL TESTS COMPLETED");
