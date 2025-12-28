// ============================================================================
// CONFIG.PLIST GENERATOR - Versão Melhorada com Lógica OpCore Simplify
// Baseado em: OpCore-Simplify/Scripts/config_prodigy.py + report_validator.py
// ============================================================================

class ConfigGenerator {
    constructor() {
        this.hardwareData = null;
        this.selectedMacOS = null;
        this.generatedConfig = null;

        // macOS versions database
        this.macOSVersions = [
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
            // HardwareSniffer JSON - formato já validado
            const data = JSON.parse(content);
            return this.validateAndCleanReport(data);
        } else {
            // AIDA64 HTML - parsing básico
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

    validateAndCleanReport(data) {
        // Validação básica do formato HardwareSniffer
        if (!data.CPU || !data.Motherboard || !data.BIOS) {
            throw new Error('Invalid hardware report: missing required sections');
        }

        // Normalizar codename do CPU
        if (data.CPU.Codename) {
            data.CPU.Codename = this.normalizeCPUCodename(data.CPU.Codename);
        }

        // Garantir que GPU existe
        if (!data.GPU || Object.keys(data.GPU).length === 0) {
            data.GPU = {
                "Unknown GPU": {
                    "Manufacturer": "Unknown",
                    "Device Type": "Unknown",
                    "Codename": "Unknown"
                }
            };
        }

        return data;
    }

    normalizeCPUCodename(codename) {
        // Remover sufixos como "-S", "-P", etc. para normalização
        const cleanCodename = codename.replace(/-[A-Z]$/, '');

        const codenameMap = {
            "Raptor Lake": "Raptor Lake",
            "Alder Lake": "Alder Lake",
            "Rocket Lake": "Rocket Lake",
            "Comet Lake": "Comet Lake",
            "Coffee Lake": "Coffee Lake",
            "Kaby Lake": "Kaby Lake",
            "Skylake": "Skylake",
            "Broadwell": "Broadwell",
            "Haswell": "Haswell",
            "Ivy Bridge": "Ivy Bridge",
            "Sandy Bridge": "Sandy Bridge",
            "Raphael": "Raphael",
            "Vermeer": "Vermeer",
            "Matisse": "Matisse",
            "Pinnacle Ridge": "Pinnacle Ridge",
            "Summit Ridge": "Summit Ridge"
        };

        for (const [key, value] of Object.entries(codenameMap)) {
            if (cleanCodename.includes(key)) {
                return value;
            }
        }

        return cleanCodename;
    }

    parseAIDA64(htmlContent) {
        // Parsing básico de AIDA64 (pode ser melhorado)
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        return {
            CPU: {
                "Processor Name": "Unknown CPU",
                "Manufacturer": "Intel",
                "Codename": "Unknown",
                "Core Count": "4"
            },
            Motherboard: {
                "Name": "Unknown",
                "Platform": "Desktop",
                "Chipset": "Unknown"
            },
            GPU: {
                "Unknown GPU": {
                    "Device Type": "Unknown",
                    "Manufacturer": "Unknown",
                    "Codename": "Unknown"
                }
            },
            BIOS: {
                "Firmware Type": "UEFI"
            },
            Monitor: {},
            Network: {},
            Sound: {}
        };
    }

    // ========================================================================
    // STEP 2: SMBIOS Selection (Lógica melhorada)
    // ========================================================================

    selectSMBIOS(hardwareData) {
        const cpu = hardwareData.CPU;
        const gpu = Object.values(hardwareData.GPU || {})[0];
        const platform = hardwareData.Motherboard.Platform;

        // AMD Ryzen Desktop
        if (cpu.Manufacturer === "AMD") {
            if (platform === "Laptop") {
                return "MacBookPro16,1"; // Fallback para laptops AMD
            }
            // Desktop AMD com GPU dedicada
            if (gpu && gpu["Device Type"] === "Discrete GPU") {
                return "MacPro7,1"; // Melhor para Sequoia/Sonoma
            }
            return "iMacPro1,1"; // AMD sem dGPU
        }

        // Intel Desktop
        if (platform === "Desktop") {
            // Com AMD dGPU - MacPro7,1 é ideal
            if (gpu && gpu.Manufacturer === "AMD" && gpu["Device Type"] === "Discrete GPU") {
                return "MacPro7,1";
            }

            // Intel iGPU - baseado na geração
            const codename = cpu.Codename || "";

            if (codename.includes("Alder") || codename.includes("Raptor")) {
                return "iMac20,1"; // 10th gen é o mais próximo suportado
            }
            if (codename.includes("Rocket") || codename.includes("Comet")) {
                return "iMac20,1"; // 10th gen
            }
            if (codename.includes("Coffee")) {
                return "iMac19,1"; // 9th gen
            }
            if (codename.includes("Kaby") || codename.includes("Skylake")) {
                return "iMac18,3"; // 7th gen
            }
            if (codename.includes("Broadwell") || codename.includes("Haswell")) {
                return "iMac17,1"; // 5th gen
            }
        }

        // Intel Laptop
        if (platform === "Laptop") {
            const codename = cpu.Codename || "";

            if (codename.includes("Coffee") || codename.includes("Comet")) {
                return "MacBookPro16,1"; // 9th/10th gen
            }
            if (codename.includes("Kaby")) {
                return "MacBookPro14,1"; // 7th gen
            }
            if (codename.includes("Skylake")) {
                return "MacBookPro13,1"; // 6th gen
            }
        }

        // Default fallback
        return "iMac20,1";
    }

    // ========================================================================
    // STEP 3: Generate Config.plist (Lógica completa do OpCore Simplify)
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
            "Booter": this.generateBooter(hardwareData, macOSVersion),
            "DeviceProperties": {
                "Add": this.generateDeviceProperties(hardwareData, macOSVersion),
                "Delete": {}
            },
            "Kernel": this.generateKernel(hardwareData, macOSVersion),
            "Misc": this.generateMisc(hardwareData, macOSVersion),
            "NVRAM": this.generateNVRAM(hardwareData, macOSVersion),
            "PlatformInfo": this.generatePlatformInfo(smbiosModel),
            "UEFI": this.generateUEFI(hardwareData, macOSVersion)
        };

        this.generatedConfig = config;
        return config;
    }

    generateBooter(hw, macOS) {
        const chipset = hw.Motherboard.Chipset || "";
        const cpuCodename = hw.CPU.Codename || "";

        return {
            "MmioWhitelist": this.generateMmioWhitelist(chipset),
            "Patch": [],
            "Quirks": {
                "AllowRelocationBlock": false,
                "AvoidRuntimeDefrag": hw.BIOS["Firmware Type"] === "UEFI",
                "DevirtualiseMmio": this.needsDevirtualiseMmio(chipset, cpuCodename),
                "DisableSingleUser": false,
                "DisableVariableWrite": false,
                "DiscardHibernateMap": false,
                "EnableSafeModeSlide": hw.BIOS["Firmware Type"] === "UEFI",
                "EnableWriteUnprotector": this.needsWriteUnprotector(hw),
                "ForceBooterSignature": false,
                "ForceExitBootServices": false,
                "ProtectMemoryRegions": false,
                "ProtectSecureBoot": false,
                "ProtectUefiServices": this.needsProtectUefiServices(chipset),
                "ProvideCustomSlide": hw.BIOS["Firmware Type"] === "UEFI",
                "ProvideMaxSlide": 0,
                "RebuildAppleMemoryMap": !this.needsWriteUnprotector(hw),
                "ResizeAppleGpuBars": -1,
                "SetupVirtualMap": hw.CPU.Manufacturer !== "AMD" && !chipset.includes("Z490") && !chipset.includes("Z590"),
                "SignalAppleOS": false,
                "SyncRuntimePermissions": hw.CPU.Manufacturer === "AMD" || this.needsProtectUefiServices(chipset)
            }
        };
    }

    generateMmioWhitelist(chipset) {
        const whitelist = [];

        // Ice Lake chipsets
        if (chipset.includes("Ice Lake")) {
            whitelist.push({
                "Address": 4284481536,
                "Comment": "MMIO 0xFF600000",
                "Enabled": true
            });
        }

        // AMD B650/X670 chipsets
        if (chipset.includes("B650") || chipset.includes("X670")) {
            whitelist.push({
                "Address": 4244635648,
                "Comment": "MMIO 0xFD000000",
                "Enabled": true
            });
        }

        return whitelist;
    }

    generateDeviceProperties(hw, macOS) {
        const deviceProps = {};
        const gpu = Object.values(hw.GPU || {})[0];

        // iGPU Properties for Intel
        if (gpu && gpu.Manufacturer === "Intel" && gpu["Device Type"] === "Integrated GPU") {
            deviceProps["PciRoot(0x0)/Pci(0x2,0x0)"] = this.generateIGPUProperties(gpu, hw, macOS);
        }

        // Audio Layout (Realtek ALC1220 detectado)
        const audioCodec = this.detectAudioCodec(hw);
        if (audioCodec) {
            deviceProps["PciRoot(0x0)/Pci(0x1F,0x3)"] = {
                "layout-id": audioCodec.layoutId
            };
        }

        return deviceProps;
    }

    detectAudioCodec(hw) {
        // Detectar codec de áudio do Sound
        if (hw.Sound) {
            for (const [name, props] of Object.entries(hw.Sound)) {
                const deviceId = props["Device ID"];
                if (deviceId && deviceId.startsWith("10EC-")) {
                    // Realtek codec detectado
                    const codecId = deviceId.split("-")[1];

                    // Mapeamento de layouts comuns
                    const layoutMap = {
                        "1220": 1,  // ALC1220
                        "0892": 1,  // ALC892
                        "0887": 1,  // ALC887
                        "0256": 11, // ALC256
                        "0255": 3   // ALC255
                    };

                    return {
                        codecId: codecId,
                        layoutId: layoutMap[codecId] || 1
                    };
                }
            }
        }
        return null;
    }

    generateIGPUProperties(gpu, hw, macOS) {
        const props = {};
        const codename = gpu.Codename || hw.CPU.Codename || "";
        const platform = hw.Motherboard.Platform;

        // Coffee Lake / Comet Lake (UHD 630)
        if (codename.includes("Coffee") || codename.includes("Comet")) {
            if (platform === "Desktop") {
                props["AAPL,ig-platform-id"] = "07009B3E";
                props["device-id"] = "9B3E0000";
            } else {
                props["AAPL,ig-platform-id"] = "0900A53E";
            }
            props["framebuffer-patch-enable"] = "01000000";
            props["framebuffer-stolenmem"] = "00003001";
        }
        // Kaby Lake (HD 630)
        else if (codename.includes("Kaby")) {
            if (platform === "Desktop") {
                props["AAPL,ig-platform-id"] = "00001259";
            } else {
                props["AAPL,ig-platform-id"] = "00001B59";
            }
            props["device-id"] = "16590000";
            props["framebuffer-patch-enable"] = "01000000";
        }

        return props;
    }

    generateKernel(hw, macOS) {
        const cpuCodename = hw.CPU.Codename || "";
        const cpuManufacturer = hw.CPU.Manufacturer;

        return {
            "Add": [],
            "Block": [],
            "Emulate": this.generateKernelEmulate(hw, macOS),
            "Force": [],
            "Patch": [],
            "Quirks": {
                "AppleCpuPmCfgLock": cpuCodename.includes("Ivy Bridge") || cpuCodename.includes("Sandy Bridge"),
                "AppleXcpmCfgLock": cpuManufacturer === "Intel" && !cpuCodename.includes("Ivy Bridge") && !cpuCodename.includes("Sandy Bridge"),
                "AppleXcpmExtraMsrs": false,
                "AppleXcpmForceBoost": cpuCodename.includes("Ivy Bridge") || cpuCodename.includes("Sandy Bridge"),
                "CustomSMBIOSGuid": false,
                "DisableIoMapper": cpuManufacturer === "Intel",
                "DisableLinkeditJettison": true,
                "DisableRtcChecksum": this.needsDisableRtcChecksum(hw),
                "ExtendBTFeatureFlags": false,
                "ExternalDiskIcons": false,
                "LapicKernelPanic": hw.Motherboard.Name && hw.Motherboard.Name.includes("HP"),
                "PanicNoKextDump": true,
                "PowerTimeoutKernelPanic": true,
                "ProvideCurrentCpuInfo": cpuManufacturer === "AMD",
                "SetApfsTrimTimeout": -1,
                "XhciPortLimit": false
            }
        };
    }

    generateKernelEmulate(hw, macOS) {
        const emulate = {
            "Cpuid1Data": "",
            "Cpuid1Mask": "",
            "DummyPowerManagement": hw.CPU.Manufacturer === "AMD"
        };

        const cpuCodename = hw.CPU.Codename || "";

        // CPU ID spoofing para gerações não suportadas
        if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
            // Spoof para Comet Lake (10th gen)
            emulate.Cpuid1Data = "55060A0000000000000000000000000000000000";
            emulate.Cpuid1Mask = "FFFFFFFF00000000000000000000000000000000";
        }
        else if (cpuCodename.includes("Rocket")) {
            // Spoof para Comet Lake
            emulate.Cpuid1Data = "55060A0000000000000000000000000000000000";
            emulate.Cpuid1Mask = "FFFFFFFF00000000000000000000000000000000";
        }

        return emulate;
    }

    generateMisc(hw, macOS) {
        return {
            "BlessOverride": [],
            "Boot": {
                "ConsoleAttributes": 0,
                "HibernateMode": "None",
                "HideAuxiliary": false,
                "LauncherOption": "Full",
                "LauncherPath": "Default",
                "PickerAttributes": 17,
                "PickerMode": hw.BIOS["Firmware Type"] === "UEFI" ? "External" : "Builtin",
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
                "SecureBootModel": this.selectSecureBootModel(macOS),
                "Vault": "Optional"
            },
            "Tools": []
        };
    }

    generateNVRAM(hw, macOS) {
        const bootArgs = this.generateBootArgs(hw, macOS);

        return {
            "Add": {
                "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": {},
                "7C436110-AB2A-4BBB-A880-FE41995C9F82": {
                    "boot-args": bootArgs,
                    "csr-active-config": this.generateCSRConfig(macOS),
                    "prev-lang:kbd": "en-US:0"
                }
            },
            "Delete": {
                "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": [],
                "7C436110-AB2A-4BBB-A880-FE41995C9F82": ["boot-args"]
            },
            "LegacyOverwrite": false,
            "WriteFlash": true
        };
    }

    generateBootArgs(hw, macOS) {
        const args = ["-v", "debug=0x100", "keepsyms=1"];

        // AMD GPU com Navi
        const gpu = Object.values(hw.GPU || {})[0];
        if (gpu && gpu.Manufacturer === "AMD" && gpu.Codename) {
            if (gpu.Codename.includes("Navi")) {
                args.push("agdpmod=pikera");
            }
        }

        // Audio layout
        const audioCodec = this.detectAudioCodec(hw);
        if (audioCodec) {
            args.push(`alcid=${audioCodec.layoutId}`);
        }

        return args.join(" ");
    }

    generateCSRConfig(macOS) {
        const version = parseInt(macOS.darwin.split('.')[0]);
        if (version >= 20) return "030A0000"; // Big Sur+
        if (version >= 18) return "FF070000"; // Mojave/Catalina
        return "FF030000"; // High Sierra e anteriores
    }

    generatePlatformInfo(smbiosModel) {
        return {
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
        };
    }

    generateUEFI(hw, macOS) {
        const cpuCodename = hw.CPU.Codename || "";

        return {
            "APFS": {
                "EnableJumpstart": true,
                "MinDate": 0,
                "MinVersion": 0
            },
            "Audio": {
                "AudioSupport": false
            },
            "ConnectDrivers": true,
            "Drivers": this.generateDrivers(hw, macOS),
            "Input": {
                "KeySupport": hw.BIOS["Firmware Type"] === "UEFI"
            },
            "Output": {
                "ProvideConsoleGop": true,
                "TextRenderer": "BuiltinGraphics"
            },
            "Quirks": {
                "EnableVectorAcceleration": !cpuCodename.includes("Sandy") && !cpuCodename.includes("Ivy"),
                "IgnoreInvalidFlexRatio": cpuCodename.includes("Haswell") || cpuCodename.includes("Broadwell"),
                "ReleaseUsbOwnership": true,
                "RequestBootVarRouting": true,
                "UnblockFsConnect": hw.Motherboard.Name && hw.Motherboard.Name.includes("HP")
            }
        };
    }

    generateDrivers(hw, macOS) {
        const drivers = [];
        const cpuCodename = hw.CPU.Codename || "";

        // HfsPlus ou HfsPlusLegacy baseado na geração
        if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
            drivers.push("HfsPlusLegacy.efi");
        } else {
            drivers.push("HfsPlus.efi");
        }

        drivers.push("OpenRuntime.efi");
        drivers.push("ResetNvramEntry.efi");

        // OpenCanopy para GUI (apenas UEFI)
        if (hw.BIOS["Firmware Type"] === "UEFI") {
            drivers.push("OpenCanopy.efi");
        }

        return drivers;
    }

    // ========================================================================
    // QUIRKS DETECTION (Lógica melhorada)
    // ========================================================================

    needsDevirtualiseMmio(chipset, cpuCodename) {
        // Z390, Z490, Z590, Z690, Z790 precisam
        if (chipset.match(/Z[3-7]90/)) return true;

        // AMD B650/X670
        if (chipset.includes("B650") || chipset.includes("X670")) return true;

        // Ice Lake
        if (cpuCodename.includes("Ice Lake")) return true;

        return false;
    }

    needsWriteUnprotector(hw) {
        const cpuManufacturer = hw.CPU.Manufacturer;
        const chipset = hw.Motherboard.Chipset || "";

        // AMD não precisa
        if (cpuManufacturer === "AMD") return false;

        // Z490+ não precisa
        if (chipset.match(/Z[4-7]90/)) return false;

        // Gerações mais antigas precisam
        return true;
    }

    needsProtectUefiServices(chipset) {
        // Z490, Z590, Z690, Z790 precisam
        return chipset.match(/Z[4-7]90/) !== null;
    }

    needsDisableRtcChecksum(hw) {
        const name = hw.Motherboard.Name || "";
        return name.includes("ASUS") || name.includes("HP") || name.includes("GIGABYTE");
    }

    selectSecureBootModel(macOS) {
        const version = parseInt(macOS.darwin.split('.')[0]);
        if (version < 20) return "Disabled"; // Catalina e anteriores
        if (version < 23) return "Default";  // Big Sur/Monterey
        return "Disabled"; // Sonoma+ (para compatibilidade)
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
        const indentStr = '\t'.repeat(indent);

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
                xml += `${indentStr}\t<key>${this.escapeXML(key)}</key>\n`;
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
