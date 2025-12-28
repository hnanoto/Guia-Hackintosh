// ============================================================================
// CONFIG.PLIST GENERATOR - Versão 2.0 com SMBIOS Dinâmico e Parser AIDA64
// Baseado em: OpCore-Simplify + Dortania OpenCore Install Guide
// ============================================================================

class ConfigGenerator {
    constructor() {
        this.hardwareData = null;
        this.selectedMacOS = null;
        this.generatedConfig = null;

        // macOS versions database com suporte de SMBIOS
        this.macOSVersions = [
            { name: "macOS Sequoia 15.x", darwin: "24.0.0", recommended: true, minYear: 2017 },
            { name: "macOS Sonoma 14.x", darwin: "23.0.0", recommended: true, minYear: 2017 },
            { name: "macOS Ventura 13.x", darwin: "22.0.0", recommended: false, minYear: 2017 },
            { name: "macOS Monterey 12.x", darwin: "21.0.0", recommended: false, minYear: 2015 },
            { name: "macOS Big Sur 11.x", darwin: "20.0.0", recommended: false, minYear: 2013 }
        ];

        // SMBIOS Database com suporte de macOS
        this.smbiosDatabase = {
            // Mac Pro
            "MacPro7,1": { type: "desktop", minDarwin: "19.0.0", maxDarwin: "99.0.0", year: 2019, cpu: "Xeon W", gpu: "AMD" },
            "iMacPro1,1": { type: "desktop", minDarwin: "17.0.0", maxDarwin: "99.0.0", year: 2017, cpu: "Xeon W", gpu: "AMD" },

            // iMac
            "iMac20,1": { type: "desktop", minDarwin: "19.0.0", maxDarwin: "99.0.0", year: 2020, cpu: "10th Gen", gpu: "AMD/Intel" },
            "iMac19,1": { type: "desktop", minDarwin: "18.0.0", maxDarwin: "99.0.0", year: 2019, cpu: "9th Gen", gpu: "AMD" },
            "iMac18,3": { type: "desktop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2017, cpu: "7th Gen", gpu: "AMD" },
            "iMac17,1": { type: "desktop", minDarwin: "15.0.0", maxDarwin: "99.0.0", year: 2015, cpu: "6th Gen", gpu: "AMD" },

            // MacBook Pro
            "MacBookPro16,1": { type: "laptop", minDarwin: "19.0.0", maxDarwin: "99.0.0", year: 2019, cpu: "9th Gen", gpu: "AMD" },
            "MacBookPro15,1": { type: "laptop", minDarwin: "17.0.0", maxDarwin: "99.0.0", year: 2018, cpu: "8th Gen", gpu: "AMD" },
            "MacBookPro14,1": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2017, cpu: "7th Gen", gpu: "Intel" },
            "MacBookPro13,1": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2016, cpu: "6th Gen", gpu: "Intel" }
        };
    }

    // ========================================================================
    // STEP 1: Parse Hardware Report (JSON or AIDA64 HTML) - MELHORADO
    // ========================================================================

    async parseHardwareReport(file) {
        const content = await this.readFile(file);
        const fileType = file.name.toLowerCase().endsWith('.json') ? 'json' : 'html';

        if (fileType === 'json') {
            const data = JSON.parse(content);
            return this.validateAndCleanReport(data);
        } else {
            return this.parseAIDA64Improved(content);
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
        if (!data.CPU || !data.Motherboard || !data.BIOS) {
            throw new Error('Invalid hardware report: missing required sections');
        }

        if (data.CPU.Codename) {
            data.CPU.Codename = this.normalizeCPUCodename(data.CPU.Codename);
        }

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

    // ========================================================================
    // PARSER AIDA64 MELHORADO - Leitura robusta de HTML bagunçado
    // ========================================================================

    parseAIDA64Improved(htmlContent) {
        console.log("Parsing AIDA64 HTML...");

        // Criar um objeto de dados limpo
        const data = {
            CPU: {
                "Processor Name": this.extractAIDA64Value(htmlContent, [
                    "Tipo de processador",
                    "Processor Type",
                    "CPU Type"
                ]) || "Unknown CPU",
                "Manufacturer": "Intel",
                "Codename": "Unknown",
                "Core Count": "4"
            },
            Motherboard: {
                "Name": this.extractAIDA64Value(htmlContent, [
                    "Nome da Placa Mãe",
                    "Motherboard Name",
                    "Motherboard"
                ]) || "Unknown",
                "Platform": "Desktop",
                "Chipset": this.extractAIDA64Value(htmlContent, [
                    "Chipset",
                    "System Chipset",
                    "Chipset da Placa-Mãe"
                ]) || "Unknown"
            },
            GPU: {},
            BIOS: {
                "Firmware Type": this.extractAIDA64Value(htmlContent, [
                    "Tipo de BIOS",
                    "BIOS Type"
                ]) || "UEFI"
            },
            Monitor: {},
            Network: {},
            Sound: {}
        };

        // Detectar CPU
        const cpuName = data.CPU["Processor Name"];
        if (cpuName.includes("AMD")) {
            data.CPU.Manufacturer = "AMD";
        } else {
            data.CPU.Manufacturer = "Intel";
        }
        data.CPU.Codename = this.detectCPUCodenameFromName(cpuName);

        // Detectar GPU
        const gpuName = this.extractAIDA64Value(htmlContent, [
            "Adaptador gráfico",
            "Video Adapter",
            "Graphics Card",
            "Placa de Vídeo"
        ]) || "Unknown GPU";

        data.GPU[gpuName] = {
            "Device Type": gpuName.includes("Intel") ? "Integrated GPU" : "Discrete GPU",
            "Manufacturer": this.detectGPUManufacturer(gpuName),
            "Codename": this.detectGPUCodename(gpuName)
        };

        // Detectar Audio
        const audioDevice = this.extractAIDA64Value(htmlContent, [
            "Realtek",
            "Audio Device",
            "Sound Card"
        ]);

        if (audioDevice && audioDevice.includes("ALC")) {
            const codecMatch = audioDevice.match(/ALC(\d+)/);
            if (codecMatch) {
                data.Sound[audioDevice] = {
                    "Bus Type": "HDAUDIO",
                    "Device ID": `10EC-${codecMatch[1]}`
                };
            }
        }

        return this.validateAndCleanReport(data);
    }

    extractAIDA64Value(html, labels) {
        for (const label of labels) {
            // Procurar por padrões de tabela HTML
            const patterns = [
                new RegExp(`${label}[^<]*<TD[^>]*>([^<]+)`, 'i'),
                new RegExp(`${label}.*?<TD[^>]*>\\s*([^<]+)`, 'i'),
                new RegExp(`>${label}<.*?<TD[^>]*>([^<]+)`, 'i')
            ];

            for (const pattern of patterns) {
                const match = html.match(pattern);
                if (match && match[1]) {
                    let value = match[1].trim();
                    // Limpar HTML entities
                    value = value.replace(/&nbsp;/g, ' ');
                    value = value.replace(/&amp;/g, '&');
                    value = value.replace(/<[^>]+>/g, '');
                    value = value.trim();

                    if (value && value.length > 0 && value.length < 200) {
                        return value;
                    }
                }
            }
        }
        return null;
    }

    detectCPUCodenameFromName(cpuName) {
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
            "Ryzen 5 7": "Raphael",
            "Ryzen 9 5": "Vermeer",
            "Ryzen 7 5": "Vermeer",
            "Ryzen 5 5": "Vermeer"
        };

        for (const [key, value] of Object.entries(codenameMap)) {
            if (cpuName.includes(key)) {
                return value;
            }
        }

        return "Unknown";
    }

    normalizeCPUCodename(codename) {
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
            "Vermeer": "Vermeer"
        };

        for (const [key, value] of Object.entries(codenameMap)) {
            if (cleanCodename.includes(key)) {
                return value;
            }
        }

        return cleanCodename;
    }

    detectGPUManufacturer(gpuName) {
        if (gpuName.includes("Intel")) return "Intel";
        if (gpuName.includes("AMD") || gpuName.includes("Radeon")) return "AMD";
        if (gpuName.includes("NVIDIA") || gpuName.includes("GeForce")) return "NVIDIA";
        return "Unknown";
    }

    detectGPUCodename(gpuName) {
        if (gpuName.includes("RX 6")) return "Navi 2x";
        if (gpuName.includes("RX 5")) return "Navi 1x";
        if (gpuName.includes("UHD 630") || gpuName.includes("UHD Graphics 630")) return "Coffee Lake";
        if (gpuName.includes("UHD 620") || gpuName.includes("HD 630")) return "Kaby Lake";
        if (gpuName.includes("HD 530")) return "Skylake";
        return "Unknown";
    }

    // ========================================================================
    // STEP 2: SMBIOS Selection DINÂMICO por versão do macOS - CORRIGIDO
    // ========================================================================

    selectSMBIOS(hardwareData, macOSVersion) {
        const cpu = hardwareData.CPU;
        const gpu = Object.values(hardwareData.GPU || {})[0];
        const platform = hardwareData.Motherboard.Platform;
        const darwinVersion = macOSVersion ? macOSVersion.darwin : "24.0.0";

        console.log(`Selecting SMBIOS for ${cpu.Codename} on macOS ${darwinVersion}`);

        // AMD Ryzen Desktop
        if (cpu.Manufacturer === "AMD") {
            if (platform === "Laptop") {
                return this.getBestSMBIOS("MacBookPro16,1", darwinVersion);
            }

            // MacPro7,1 só funciona em Catalina+ (19.0.0+)
            if (this.parseDarwinVersion(darwinVersion) >= this.parseDarwinVersion("19.0.0")) {
                if (gpu && gpu["Device Type"] === "Discrete GPU") {
                    return "MacPro7,1";
                }
            }

            // Fallback para iMacPro1,1 (High Sierra+)
            return "iMacPro1,1";
        }

        // Intel Desktop
        if (platform === "Desktop") {
            const codename = cpu.Codename || "";

            // AMD dGPU - MacPro7,1 se macOS suportar
            if (gpu && gpu.Manufacturer === "AMD" && gpu["Device Type"] === "Discrete GPU") {
                if (this.parseDarwinVersion(darwinVersion) >= this.parseDarwinVersion("21.0.0")) {
                    return "MacPro7,1"; // Monterey+
                }
                return "iMacPro1,1"; // Big Sur e anteriores
            }

            // Intel iGPU - baseado na geração E compatibilidade com macOS
            if (codename.includes("Alder") || codename.includes("Raptor")) {
                // 12th/13th gen - usar iMac20,1 (10th gen é o mais próximo)
                return this.getBestSMBIOS("iMac20,1", darwinVersion);
            }
            if (codename.includes("Rocket") || codename.includes("Comet")) {
                return this.getBestSMBIOS("iMac20,1", darwinVersion);
            }
            if (codename.includes("Coffee")) {
                return this.getBestSMBIOS("iMac19,1", darwinVersion);
            }
            if (codename.includes("Kaby") || codename.includes("Skylake")) {
                return this.getBestSMBIOS("iMac18,3", darwinVersion);
            }
            if (codename.includes("Broadwell") || codename.includes("Haswell")) {
                return this.getBestSMBIOS("iMac17,1", darwinVersion);
            }
        }

        // Intel Laptop
        if (platform === "Laptop") {
            const codename = cpu.Codename || "";

            if (codename.includes("Coffee") || codename.includes("Comet")) {
                return this.getBestSMBIOS("MacBookPro16,1", darwinVersion);
            }
            if (codename.includes("Kaby")) {
                return this.getBestSMBIOS("MacBookPro14,1", darwinVersion);
            }
            if (codename.includes("Skylake")) {
                return this.getBestSMBIOS("MacBookPro13,1", darwinVersion);
            }
        }

        // Default fallback
        return this.getBestSMBIOS("iMac20,1", darwinVersion);
    }

    getBestSMBIOS(preferredModel, darwinVersion) {
        const smbios = this.smbiosDatabase[preferredModel];

        if (!smbios) {
            return preferredModel;
        }

        // Verificar se o SMBIOS é compatível com a versão do macOS
        const minDarwin = this.parseDarwinVersion(smbios.minDarwin);
        const maxDarwin = this.parseDarwinVersion(smbios.maxDarwin);
        const currentDarwin = this.parseDarwinVersion(darwinVersion);

        if (currentDarwin >= minDarwin && currentDarwin <= maxDarwin) {
            return preferredModel;
        }

        // Se não for compatível, buscar alternativa
        console.warn(`${preferredModel} não é compatível com macOS ${darwinVersion}`);

        // Fallback seguro
        if (currentDarwin >= this.parseDarwinVersion("20.0.0")) {
            return "iMac20,1"; // Big Sur+
        } else if (currentDarwin >= this.parseDarwinVersion("18.0.0")) {
            return "iMac19,1"; // Mojave/Catalina
        } else {
            return "iMac18,3"; // High Sierra
        }
    }

    parseDarwinVersion(version) {
        const parts = version.split('.').map(Number);
        return parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
    }

    // ========================================================================
    // STEP 3: Generate Config.plist - Usando SMBIOS dinâmico
    // ========================================================================

    async generateConfig(hardwareData, macOSVersion) {
        this.hardwareData = hardwareData;
        this.selectedMacOS = macOSVersion;

        // SMBIOS agora é selecionado com base na versão do macOS
        const smbiosModel = this.selectSMBIOS(hardwareData, macOSVersion);

        console.log(`Generating config for ${smbiosModel} on macOS ${macOSVersion.name}`);

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

        if (chipset.includes("Ice Lake")) {
            whitelist.push({
                "Address": 4284481536,
                "Comment": "MMIO 0xFF600000",
                "Enabled": true
            });
        }

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

        if (gpu && gpu.Manufacturer === "Intel" && gpu["Device Type"] === "Integrated GPU") {
            deviceProps["PciRoot(0x0)/Pci(0x2,0x0)"] = this.generateIGPUProperties(gpu, hw, macOS);
        }

        const audioCodec = this.detectAudioCodec(hw);
        if (audioCodec) {
            deviceProps["PciRoot(0x0)/Pci(0x1F,0x3)"] = {
                "layout-id": audioCodec.layoutId
            };
        }

        return deviceProps;
    }

    detectAudioCodec(hw) {
        if (hw.Sound) {
            for (const [name, props] of Object.entries(hw.Sound)) {
                const deviceId = props["Device ID"];
                if (deviceId && deviceId.startsWith("10EC-")) {
                    const codecId = deviceId.split("-")[1];

                    const layoutMap = {
                        "1220": 1,
                        "0892": 1,
                        "0887": 1,
                        "0256": 11,
                        "0255": 3
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

        if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
            emulate.Cpuid1Data = "55060A0000000000000000000000000000000000";
            emulate.Cpuid1Mask = "FFFFFFFF00000000000000000000000000000000";
        }
        else if (cpuCodename.includes("Rocket")) {
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

        const gpu = Object.values(hw.GPU || {})[0];
        if (gpu && gpu.Manufacturer === "AMD" && gpu.Codename) {
            if (gpu.Codename.includes("Navi")) {
                args.push("agdpmod=pikera");
            }
        }

        const audioCodec = this.detectAudioCodec(hw);
        if (audioCodec) {
            args.push(`alcid=${audioCodec.layoutId}`);
        }

        return args.join(" ");
    }

    generateCSRConfig(macOS) {
        const version = parseInt(macOS.darwin.split('.')[0]);
        if (version >= 20) return "030A0000";
        if (version >= 18) return "FF070000";
        return "FF030000";
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

        if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
            drivers.push("HfsPlusLegacy.efi");
        } else {
            drivers.push("HfsPlus.efi");
        }

        drivers.push("OpenRuntime.efi");
        drivers.push("ResetNvramEntry.efi");

        if (hw.BIOS["Firmware Type"] === "UEFI") {
            drivers.push("OpenCanopy.efi");
        }

        return drivers;
    }

    // Quirks detection
    needsDevirtualiseMmio(chipset, cpuCodename) {
        if (chipset.match(/Z[3-7]90/)) return true;
        if (chipset.includes("B650") || chipset.includes("X670")) return true;
        if (cpuCodename.includes("Ice Lake")) return true;
        return false;
    }

    needsWriteUnprotector(hw) {
        const cpuManufacturer = hw.CPU.Manufacturer;
        const chipset = hw.Motherboard.Chipset || "";

        if (cpuManufacturer === "AMD") return false;
        if (chipset.match(/Z[4-7]90/)) return false;

        return true;
    }

    needsProtectUefiServices(chipset) {
        return chipset.match(/Z[4-7]90/) !== null;
    }

    needsDisableRtcChecksum(hw) {
        const name = hw.Motherboard.Name || "";
        return name.includes("ASUS") || name.includes("HP") || name.includes("GIGABYTE");
    }

    selectSecureBootModel(macOS) {
        const version = parseInt(macOS.darwin.split('.')[0]);
        if (version < 20) return "Disabled";
        if (version < 23) return "Default";
        return "Disabled";
    }

    // Download
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

// Export
window.ConfigGenerator = ConfigGenerator;
