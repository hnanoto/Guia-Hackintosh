// ============================================================================
// CONFIG.PLIST GENERATOR - Integração OpCore Simplify Logic
// Baseado em: OpCore-Simplify/Scripts/config_prodigy.py
// ============================================================================

class ConfigGenerator {
    constructor() {
        this.hardwareData = null;
        this.selectedMacOS = null;
        this.generatedConfig = null;

        // macOS versions database
        this.macOSVersions = [
            { name: "macOS Tahoe 26.x (2025)", darwin: "26.0.0", recommended: false },
            { name: "macOS Sequoia 15.x", darwin: "24.0.0", recommended: true },
            { name: "macOS Sonoma 14.x", darwin: "23.0.0", recommended: true },
            { name: "macOS Ventura 13.x", darwin: "22.0.0", recommended: false },
            { name: "macOS Monterey 12.x", darwin: "21.0.0", recommended: false },
            { name: "macOS Big Sur 11.x", darwin: "20.0.0", recommended: false }
        ];
    }

    // ========================================================================
    // STEP 1: Parse Hardware Report (JSON or AIDA64 HTML)
    // ========================================================================

    async parseHardwareReport(file) {
        const content = await this.readFile(file);
        const fileType = file.name.toLowerCase().endsWith('.json') ? 'json' : 'html';

        if (fileType === 'json') {
            return JSON.parse(content);
        } else {
            return this.parseAIDA64(content);
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    parseAIDA64(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        return {
            CPU: this.extractAIDA64CPU(doc),
            Motherboard: this.extractAIDA64Motherboard(doc),
            GPU: this.extractAIDA64GPU(doc),
            Network: this.extractAIDA64Network(doc),
            Sound: this.extractAIDA64Sound(doc),
            BIOS: { "Firmware Type": "UEFI" },
            Monitor: this.extractAIDA64Monitor(doc)
        };
    }

    extractAIDA64Field(doc, labels) {
        for (const label of labels) {
            const rows = doc.querySelectorAll('tr');
            for (const row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const cellText = cells[0].textContent.trim();
                    if (cellText === label || cellText.includes(label)) {
                        return cells[1].textContent.trim();
                    }
                }
            }
        }
        return null;
    }

    extractAIDA64CPU(doc) {
        const processorName = this.extractAIDA64Field(doc, ["Processor Type", "Tipo de processador", "CPU Type"]) || "Unknown CPU";
        return {
            "Processor Name": processorName,
            "Manufacturer": processorName.includes("AMD") ? "AMD" : "Intel",
            "Codename": this.detectCPUCodename(processorName),
            "Core Count": this.extractAIDA64Field(doc, ["CPU Cores", "Núcleos físicos", "Physical Cores"]) || "4"
        };
    }

    extractAIDA64Motherboard(doc) {
        return {
            "Name": this.extractAIDA64Field(doc, ["Motherboard Name", "Nome da Placa Mãe", "Motherboard"]) || "Unknown",
            "Platform": "Desktop",
            "Chipset": this.extractAIDA64Field(doc, ["Chipset", "System Chipset"]) || "Unknown"
        };
    }

    extractAIDA64GPU(doc) {
        const gpuName = this.extractAIDA64Field(doc, ["Video Adapter", "Adaptador gráfico", "Graphics Card"]) || "Unknown GPU";
        const gpus = {};

        gpus[gpuName] = {
            "Device Type": gpuName.includes("Intel") ? "Integrated GPU" : "Discrete GPU",
            "Manufacturer": this.detectGPUManufacturer(gpuName),
            "Codename": this.detectGPUCodename(gpuName)
        };

        return gpus;
    }

    extractAIDA64Network(doc) {
        return {};
    }

    extractAIDA64Sound(doc) {
        return {};
    }

    extractAIDA64Monitor(doc) {
        return {};
    }

    // ========================================================================
    // DETECTION HELPERS
    // ========================================================================

    detectCPUCodename(processorName) {
        const codenameMap = {
            "14th Gen": "Raptor Lake Refresh",
            "13th Gen": "Raptor Lake",
            "12th Gen": "Alder Lake",
            "11th Gen": "Rocket Lake",
            "10th Gen": "Comet Lake",
            "9th Gen": "Coffee Lake Refresh",
            "8th Gen": "Coffee Lake",
            "7th Gen": "Kaby Lake",
            "6th Gen": "Skylake",
            "5th Gen": "Broadwell",
            "4th Gen": "Haswell",
            "Ryzen 9 7": "Raphael",
            "Ryzen 7 7": "Raphael",
            "Ryzen 5 7": "Raphael"
        };

        for (const [key, value] of Object.entries(codenameMap)) {
            if (processorName.includes(key)) return value;
        }
        return "Unknown";
    }

    detectGPUManufacturer(gpuName) {
        if (gpuName.includes("Intel")) return "Intel";
        if (gpuName.includes("AMD") || gpuName.includes("Radeon")) return "AMD";
        if (gpuName.includes("NVIDIA")) return "NVIDIA";
        return "Unknown";
    }

    detectGPUCodename(gpuName) {
        if (gpuName.includes("RX 6")) return "Navi 2x";
        if (gpuName.includes("RX 5")) return "Navi 1x";
        if (gpuName.includes("UHD 630")) return "Coffee Lake";
        if (gpuName.includes("UHD 620")) return "Kaby Lake";
        return "Unknown";
    }

    // ========================================================================
    // STEP 2: SMBIOS Selection
    // ========================================================================

    selectSMBIOS(hardwareData) {
        const cpu = hardwareData.CPU;
        const gpu = Object.values(hardwareData.GPU || {})[0];

        // Desktop with AMD dGPU - Best for Sequoia/Tahoe
        if (gpu && gpu.Manufacturer === "AMD" && gpu["Device Type"] === "Discrete GPU") {
            return "MacPro7,1";
        }

        // Desktop with Intel iGPU
        if (cpu.Codename.includes("Comet") || cpu.Codename.includes("Coffee")) {
            return "iMac20,1";
        }

        if (cpu.Codename.includes("Kaby") || cpu.Codename.includes("Skylake")) {
            return "iMac19,1";
        }

        // AMD Ryzen
        if (cpu.Manufacturer === "AMD") {
            return "MacPro7,1";
        }

        return "iMac20,1";
    }

    // ========================================================================
    // STEP 3: Generate Config.plist
    // ========================================================================

    async generateConfig(hardwareData, macOSVersion) {
        this.hardwareData = hardwareData;
        this.selectedMacOS = macOSVersion;

        const smbiosModel = this.selectSMBIOS(hardwareData);

        const config = {
            "ACPI": {
                "Add": [],
                "Delete": [],
                "Patch": [],
                "Quirks": {
                    "FadtEnableReset": false,
                    "NormalizeHeaders": false,
                    "RebaseRegions": false,
                    "ResetHwSig": false,
                    "ResetLogoStatus": false
                }
            },
            "Booter": {
                "MmioWhitelist": [],
                "Patch": [],
                "Quirks": {
                    "AllowRelocationBlock": false,
                    "AvoidRuntimeDefrag": true,
                    "DevirtualiseMmio": this.needsDevirtualiseMmio(hardwareData),
                    "DisableSingleUser": false,
                    "DisableVariableWrite": false,
                    "DiscardHibernateMap": false,
                    "EnableSafeModeSlide": true,
                    "EnableWriteUnprotector": this.needsWriteUnprotector(hardwareData),
                    "ForceBooterSignature": false,
                    "ForceExitBootServices": false,
                    "ProtectMemoryRegions": false,
                    "ProtectSecureBoot": false,
                    "ProtectUefiServices": this.needsProtectUefiServices(hardwareData),
                    "ProvideCustomSlide": true,
                    "ProvideMaxSlide": 0,
                    "RebuildAppleMemoryMap": true,
                    "ResizeAppleGpuBars": -1,
                    "SetupVirtualMap": hardwareData.CPU.Manufacturer !== "AMD",
                    "SignalAppleOS": false,
                    "SyncRuntimePermissions": hardwareData.CPU.Manufacturer === "AMD"
                }
            },
            "DeviceProperties": {
                "Add": this.generateDeviceProperties(hardwareData),
                "Delete": {}
            },
            "Kernel": {
                "Add": [],
                "Block": [],
                "Emulate": this.generateKernelEmulate(hardwareData),
                "Force": [],
                "Patch": [],
                "Quirks": {
                    "AppleCpuPmCfgLock": false,
                    "AppleXcpmCfgLock": true,
                    "AppleXcpmExtraMsrs": false,
                    "AppleXcpmForceBoost": false,
                    "CustomSMBIOSGuid": false,
                    "DisableIoMapper": hardwareData.CPU.Manufacturer === "Intel",
                    "DisableLinkeditJettison": true,
                    "DisableRtcChecksum": this.needsDisableRtcChecksum(hardwareData),
                    "ExtendBTFeatureFlags": false,
                    "ExternalDiskIcons": false,
                    "LapicKernelPanic": hardwareData.Motherboard.Name && hardwareData.Motherboard.Name.includes("HP"),
                    "PanicNoKextDump": true,
                    "PowerTimeoutKernelPanic": true,
                    "ProvideCurrentCpuInfo": hardwareData.CPU.Manufacturer === "AMD",
                    "SetApfsTrimTimeout": -1,
                    "XhciPortLimit": false
                }
            },
            "Misc": {
                "BlessOverride": [],
                "Boot": {
                    "ConsoleAttributes": 0,
                    "HibernateMode": "None",
                    "HideAuxiliary": false,
                    "LauncherOption": "Full",
                    "LauncherPath": "Default",
                    "PickerAttributes": 17,
                    "PickerMode": "External",
                    "PickerVariant": "Auto",
                    "ShowPicker": true,
                    "Timeout": 5
                },
                "Debug": {
                    "AppleDebug": false,
                    "ApplePanic": false,
                    "DisableWatchDog": true,
                    "DisplayLevel": 2147483650,
                    "Target": 3
                },
                "Entries": [],
                "Security": {
                    "AllowSetDefault": true,
                    "ApECID": 0,
                    "AuthRestart": false,
                    "BlacklistAppleUpdate": true,
                    "DmgLoading": "Signed",
                    "ExposeSensitiveData": 6,
                    "ScanPolicy": 0,
                    "SecureBootModel": this.selectSecureBootModel(macOSVersion),
                    "Vault": "Optional"
                },
                "Tools": []
            },
            "NVRAM": {
                "Add": {
                    "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": {},
                    "7C436110-AB2A-4BBB-A880-FE41995C9F82": {
                        "boot-args": this.generateBootArgs(hardwareData),
                        "csr-active-config": this.generateCSRConfig(macOSVersion),
                        "prev-lang:kbd": "en-US:0"
                    }
                },
                "Delete": {
                    "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": [],
                    "7C436110-AB2A-4BBB-A880-FE41995C9F82": ["boot-args"]
                },
                "LegacyOverwrite": false,
                "WriteFlash": true
            },
            "PlatformInfo": {
                "Automatic": true,
                "Generic": {
                    "AdviseFeatures": false,
                    "MaxBIOSVersion": false,
                    "MLB": "M0000000000000001",
                    "ProcessorType": 0,
                    "ROM": "112233445566",
                    "SpoofVendor": true,
                    "SystemProductName": smbiosModel,
                    "SystemSerialNumber": "W00000000001",
                    "SystemUUID": "00000000-0000-0000-0000-000000000000"
                },
                "UpdateDataHub": true,
                "UpdateNVRAM": true,
                "UpdateSMBIOS": true,
                "UpdateSMBIOSMode": "Create"
            },
            "UEFI": {
                "APFS": {
                    "EnableJumpstart": true,
                    "MinDate": 0,
                    "MinVersion": 0
                },
                "Audio": {
                    "AudioSupport": false
                },
                "ConnectDrivers": true,
                "Drivers": [
                    "OpenRuntime.efi",
                    "HfsPlus.efi",
                    "ResetNvramEntry.efi",
                    "OpenCanopy.efi"
                ],
                "Input": {
                    "KeySupport": true
                },
                "Output": {
                    "ProvideConsoleGop": true,
                    "TextRenderer": "BuiltinGraphics"
                },
                "Quirks": {
                    "EnableVectorAcceleration": true,
                    "ReleaseUsbOwnership": true,
                    "RequestBootVarRouting": true,
                    "UnblockFsConnect": hardwareData.Motherboard.Name && hardwareData.Motherboard.Name.includes("HP")
                }
            }
        };

        this.generatedConfig = config;
        return config;
    }

    generateDeviceProperties(hw) {
        const deviceProps = {};
        const gpu = Object.values(hw.GPU || {})[0];

        // iGPU Properties for Intel
        if (gpu && gpu.Manufacturer === "Intel" && gpu["Device Type"] === "Integrated GPU") {
            deviceProps["PciRoot(0x0)/Pci(0x2,0x0)"] = this.generateIGPUProperties(gpu);
        }

        // Audio Layout
        deviceProps["PciRoot(0x0)/Pci(0x1F,0x3)"] = {
            "layout-id": 1
        };

        return deviceProps;
    }

    generateIGPUProperties(gpu) {
        const props = {};

        if (gpu.Codename.includes("Coffee") || gpu.Codename.includes("Comet")) {
            props["AAPL,ig-platform-id"] = "07009B3E";
            props["device-id"] = "9B3E0000";
        } else if (gpu.Codename.includes("Kaby")) {
            props["AAPL,ig-platform-id"] = "00001259";
            props["device-id"] = "16590000";
        }

        return props;
    }

    generateKernelEmulate(hw) {
        const emulate = {
            "Cpuid1Data": "",
            "Cpuid1Mask": "",
            "DummyPowerManagement": hw.CPU.Manufacturer === "AMD"
        };

        // CPU ID spoofing for Alder/Raptor Lake
        if (hw.CPU.Codename.includes("Alder") || hw.CPU.Codename.includes("Raptor")) {
            emulate.Cpuid1Data = "55060A0000000000000000000000000000000000";
            emulate.Cpuid1Mask = "FFFFFFFF00000000000000000000000000000000";
        }

        return emulate;
    }

    generateBootArgs(hw) {
        const args = ["-v", "debug=0x100", "keepsyms=1"];

        const gpu = Object.values(hw.GPU || {})[0];
        if (gpu && gpu.Manufacturer === "AMD" && gpu.Codename && gpu.Codename.includes("Navi")) {
            args.push("agdpmod=pikera");
        }

        args.push("alcid=1");

        return args.join(" ");
    }

    generateCSRConfig(macOS) {
        const version = parseInt(macOS.darwin.split('.')[0]);
        return version >= 20 ? "030A0000" : "FF070000";
    }

    selectSecureBootModel(macOS) {
        const version = parseInt(macOS.darwin.split('.')[0]);
        if (version < 20) return "Disabled";
        if (version < 23) return "Default";
        return "Disabled";
    }

    // ========================================================================
    // QUIRKS DETECTION
    // ========================================================================

    needsDevirtualiseMmio(hw) {
        const chipset = hw.Motherboard.Chipset || "";
        return chipset.includes("Z390") || chipset.includes("Z490") ||
            chipset.includes("Z590") || chipset.includes("Z690");
    }

    needsWriteUnprotector(hw) {
        const codename = hw.CPU.Codename || "";
        return !codename.includes("Coffee") && !codename.includes("Comet") &&
            !codename.includes("Alder") && !codename.includes("Raptor");
    }

    needsProtectUefiServices(hw) {
        const chipset = hw.Motherboard.Chipset || "";
        return chipset.includes("Z490") || chipset.includes("Z590") || chipset.includes("Z690");
    }

    needsDisableRtcChecksum(hw) {
        const name = hw.Motherboard.Name || "";
        return name.includes("ASUS") || name.includes("HP");
    }

    // ========================================================================
    // DOWNLOAD CONFIG.PLIST
    // ========================================================================

    downloadConfigPlist() {
        if (!this.generatedConfig) {
            throw new Error('No config generated yet');
        }

        const plistXML = this.convertToPlist(this.generatedConfig);
        const blob = new Blob([plistXML], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.plist';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    convertToPlist(obj) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
        xml += '<plist version="1.0">\n';
        xml += this.objectToPlistXML(obj, 0);
        xml += '</plist>';
        return xml;
    }

    objectToPlistXML(obj, indent) {
        const indentStr = '  '.repeat(indent);

        if (obj === null || obj === undefined) return `${indentStr}<string></string>\n`;
        if (typeof obj === 'boolean') return `${indentStr}<${obj}/>\n`;
        if (typeof obj === 'number') return `${indentStr}<integer>${obj}</integer>\n`;
        if (typeof obj === 'string') return `${indentStr}<string>${this.escapeXML(obj)}</string>\n`;

        if (Array.isArray(obj)) {
            if (obj.length === 0) return `${indentStr}<array/>\n`;
            let xml = `${indentStr}<array>\n`;
            for (const item of obj) {
                xml += this.objectToPlistXML(item, indent + 1);
            }
            xml += `${indentStr}</array>\n`;
            return xml;
        }

        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return `${indentStr}<dict/>\n`;
            let xml = `${indentStr}<dict>\n`;
            for (const key of keys) {
                xml += `${indentStr}  <key>${this.escapeXML(key)}</key>\n`;
                xml += this.objectToPlistXML(obj[key], indent + 1);
            }
            xml += `${indentStr}</dict>\n`;
            return xml;
        }

        return '';
    }

    escapeXML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}

// Export for use in HTML
window.ConfigGenerator = ConfigGenerator;
