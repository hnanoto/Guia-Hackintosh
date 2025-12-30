// ============================================================================
// CONFIG.PLIST GENERATOR - Versão 3.0 com DeviceProperties Completos
// Baseado em: OpCore-Simplify + Dortania OpenCore Install Guide
// ============================================================================

class ConfigGenerator {
    constructor() {
        this.hardwareData = null;
        this.selectedMacOS = null;
        this.generatedConfig = null;

        // Carregar datasets (serão carregados via script tags no HTML)
        this.loadDatasets();

        // macOS versions database com suporte de SMBIOS
        this.macOSVersions = [
            { name: "macOS Tahoe 26.x (2025)", darwin: "26.0.0", recommended: false, minYear: 2019 },
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
            "MacBookPro16,2": { type: "laptop", minDarwin: "19.0.0", maxDarwin: "99.0.0", year: 2020, cpu: "10th Gen", gpu: "Intel" },
            "MacBookPro16,3": { type: "laptop", minDarwin: "19.0.0", maxDarwin: "99.0.0", year: 2020, cpu: "10th Gen", gpu: "Intel" },
            "MacBookPro15,1": { type: "laptop", minDarwin: "17.0.0", maxDarwin: "99.0.0", year: 2018, cpu: "8th Gen", gpu: "AMD" },
            "MacBookPro15,2": { type: "laptop", minDarwin: "17.0.0", maxDarwin: "99.0.0", year: 2018, cpu: "8th Gen", gpu: "Intel" },
            "MacBookPro15,3": { type: "laptop", minDarwin: "18.0.0", maxDarwin: "99.0.0", year: 2019, cpu: "9th Gen", gpu: "AMD" },
            "MacBookPro15,4": { type: "laptop", minDarwin: "18.0.0", maxDarwin: "99.0.0", year: 2019, cpu: "8th Gen", gpu: "Intel" },
            "MacBookPro14,1": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2017, cpu: "7th Gen", gpu: "Intel" },
            "MacBookPro14,2": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2017, cpu: "7th Gen", gpu: "Intel" },
            "MacBookPro14,3": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2017, cpu: "7th Gen", gpu: "AMD" },
            "MacBookPro13,1": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2016, cpu: "6th Gen", gpu: "Intel" },
            "MacBookPro13,2": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2016, cpu: "6th Gen", gpu: "Intel" },
            "MacBookPro13,3": { type: "laptop", minDarwin: "16.0.0", maxDarwin: "99.0.0", year: 2016, cpu: "6th Gen", gpu: "AMD" }
        };
    }

    // ========================================================================
    // Carregar Datasets
    // ========================================================================

    loadDatasets() {
        // Os datasets serão carregados via script tags no HTML
        // Aqui apenas verificamos se estão disponíveis
        if (typeof iGPUDatabase !== 'undefined') {
            this.iGPUDatabase = iGPUDatabase;
            this.getIGPUProperties = getIGPUProperties;
        }
        if (typeof codecLayouts !== 'undefined') {
            this.codecLayouts = codecLayouts;
            this.getCodecLayouts = getCodecLayouts;
            this.getRecommendedLayout = getRecommendedLayout;
            this.layoutIdToBytes = layoutIdToBytes;
        }
        if (typeof ethernetDatabase !== 'undefined') {
            this.ethernetDatabase = ethernetDatabase;
            this.getEthernetInfo = getEthernetInfo;
            this.generateEthernetPropertiesHelper = generateEthernetProperties;
            this.getRecommendedEthernetKext = getRecommendedEthernetKext;
        }
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
        // Check for common top-level keys and normalize if needed
        const normalized = {};

        // Helper to find key case-insensitively
        const findKey = (obj, keyName) => {
            const lowerKey = keyName.toLowerCase();
            const found = Object.keys(obj).find(k => k.toLowerCase() === lowerKey || k.toLowerCase().replace(/\s/g, '') === lowerKey);
            return found ? obj[found] : null;
        };

        normalized.CPU = findKey(data, "CPU") || {};
        normalized.Motherboard = findKey(data, "Motherboard") || {};
        normalized.BIOS = findKey(data, "BIOS") || {};
        normalized.GPU = findKey(data, "GPU") || {};
        normalized.Network = findKey(data, "Network") || {};
        normalized.Sound = findKey(data, "Sound") || {};
        normalized["Storage Controllers"] = findKey(data, "Storage Controllers") || findKey(data, "Storage") || {};

        // Validation
        if (!normalized.CPU || Object.keys(normalized.CPU).length === 0) {
            throw new Error('Invalid hardware report: missing CPU section');
        }

        // CPU Normalization
        const cpuMap = {
            "Processor Name": ["Processor Name", "Name", "Model"],
            "Codename": ["Codename", "Code Name", "Microarchitecture"],
            "Manufacturer": ["Manufacturer", "Vendor"]
        };

        for (const [target, sources] of Object.entries(cpuMap)) {
            if (!normalized.CPU[target]) {
                for (const src of sources) {
                    if (normalized.CPU[src]) {
                        normalized.CPU[target] = normalized.CPU[src];
                        break;
                    }
                }
            }
        }

        // Motherboard Normalization
        if (normalized.Motherboard) {
            const moboMap = {
                "Platform": ["Platform", "Type", "Chassis"],
                "Chipset": ["Chipset", "PCH"]
            };
            for (const [target, sources] of Object.entries(moboMap)) {
                if (!normalized.Motherboard[target]) {
                    for (const src of sources) {
                        if (normalized.Motherboard[src]) {
                            normalized.Motherboard[target] = normalized.Motherboard[src];
                            break;
                        }
                    }
                }
            }
        }

        // Force Platform detection if missing
        if (!normalized.Motherboard.Platform) {
            const cpuName = normalized.CPU["Processor Name"] || "";
            if (cpuName.match(/i\d-\d+[UHYM]|HQ|HK|G[147]/)) normalized.Motherboard.Platform = "Laptop";
            else normalized.Motherboard.Platform = "Desktop";
        }

        data = normalized; // Use normalized structure

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
        console.log("Parsing AIDA64 HTML to match Hardware Sniffer structure...");

        // === 1. CPU Parsing ===
        let cpuName = this.extractAIDA64Value(htmlContent, [
            "(CPUID) Nome da CPU", "(CPUID) CPU Name", "Nome da CPU", "CPU Alias", "CPU Type", "Tipo de processador"
        ]);

        if (cpuName && (cpuName.includes("i3/i5/i7") || cpuName.includes("M/H"))) {
            const specificModel = cpuName.match(/\(Intel Core (i\d-\d+[A-Z]{0,2})\)/i);
            if (specificModel) cpuName = specificModel[1];
        }

        if (!cpuName || cpuName.includes("Unknown")) {
            const cpuMatch = htmlContent.match(/Intel Core i\d-\d+[A-Z]{0,2}/i) ||
                htmlContent.match(/13th Gen Intel.*?i\d-\d+[A-Z]{0,2}/i) ||
                htmlContent.match(/AMD Ryzen \d \d+[A-Z]{0,2}/i);
            if (cpuMatch) cpuName = cpuMatch[0].replace(/<[^>]+>/g, '').trim();
        }

        // === 2. Motherboard Parsing ===
        let moboName = this.extractAIDA64Value(htmlContent, [
            "Nome da Placa Mãe", "Motherboard Name", "Nome do Sistema - DMI"
        ]);

        if (!moboName || moboName === "Unknown") {
            const moboMatch = htmlContent.match(/Z\d{3}\s+GAMING\s+X\s+DDR\d/i) ||
                htmlContent.match(/GIGABYTE\s+Z\d{3}/i) ||
                htmlContent.match(/ASUS\s+[A-Z0-9- ]+/i) ||
                htmlContent.match(/MSI\s+[A-Z0-9- ]+/i);
            if (moboMatch) moboName = moboMatch[0].replace(/<[^>]+>/g, '').trim();
            else moboName = "Unknown Board";
        }

        // === 3. Chipset Parsing ===
        let chipset = this.extractAIDA64Value(htmlContent, ["Chipset da Placa-Mãe", "Chipset", "System Chipset"]);
        if (!chipset) {
            const chipsetMatch = htmlContent.match(/(Z690|Z590|Z490|B660|B560|H610|H510|X570|B550|A320)/i);
            chipset = chipsetMatch ? chipsetMatch[0] : "Unknown";
        }

        // === 4. Platform Detection ===
        let platform = "Desktop";
        if (cpuName.match(/i\d-\d+[UHYM]|HQ|HK|G[147]/)) platform = "Laptop";
        if (platform === "Desktop" && htmlContent.match(/Bateria|Battery/i) && htmlContent.match(/Nível de carga|Charge Level/i)) platform = "Laptop";

        // === 5. GPU Parsing ===
        let gpuList = this.extractAIDA64AllValues(htmlContent, [
            "Adaptador gráfico", "Video Adapter", "Graphics Card", "Placa de Vídeo", "Acelerador 3D"
        ]);

        // Fallback GPU detection
        if (!gpuList || gpuList.length === 0) {
            const gpuPatterns = [
                /AMD Radeon RX \d{4}\s*[A-Z]{0,2}/gi,
                /NVIDIA GeForce [A-Z]{2,3}\s*\d{3,4}/gi,
                /Intel.*?UHD Graphics \d{3}/gi,
                /Intel.*?Iris.*?Xe/gi
            ];
            for (const pat of gpuPatterns) {
                const matches = htmlContent.match(pat);
                if (matches) gpuList = [...gpuList, ...matches];
            }
        }
        gpuList = [...new Set(gpuList)].map(g => g.trim());

        // === 6. Network Parsing ===
        const networkDevices = {};
        // Scan for common controllers in text
        const netKeywords = [
            { name: "Realtek RTL8125", pattern: /RTL8125/i, id: "10EC-8125" },
            { name: "Realtek RTL8111", pattern: /RTL8111|RTL8168/i, id: "10EC-8168" },
            { name: "Intel I219-V", pattern: /I219-?V/i, id: "8086-15B8" },
            { name: "Intel I225-V", pattern: /I225-?V/i, id: "8086-15F3" },
            { name: "Intel Wi-Fi 6 AX200", pattern: /AX200/i, id: "8086-2723" },
            { name: "Intel Wi-Fi 6E AX210", pattern: /AX210/i, id: "8086-2725" },
            { name: "Broadcom Wi-Fi", pattern: /Broadcom.*?802\.11/i, id: "14E4-43A0" }
        ];

        let pciIndex = 0;
        netKeywords.forEach(net => {
            if (htmlContent.match(net.pattern)) {
                networkDevices[net.name] = {
                    "Bus Type": "PCI",
                    "Device ID": net.id,
                    "PCI Path": `PciRoot(0x0)/Pci(0x1C,0x${pciIndex++})/Pci(0x0,0x0)`, // Fake path for config gen
                    "ACPI Path": `\\_SB.PC00.RP0${pciIndex}.PXSX`
                };
            }
        });

        // === 7. Storage Parsing ===
        const storageDevices = {};
        const storageMatch = htmlContent.match(/(NVMe|SATA).*?Controller/gi) || [];
        storageMatch.forEach((store, idx) => {
            storageDevices[store] = {
                "Bus Type": "PCI",
                "Device ID": store.includes("NVMe") ? "144D-A808" : "8086-A282", // Example IDs
                "PCI Path": store.includes("NVMe") ? "PciRoot(0x0)/Pci(0x1B,0x0)/Pci(0x0,0x0)" : "PciRoot(0x0)/Pci(0x17,0x0)"
            };
        });

        // === BUILD FINAL STRUCTURE ===
        // Matches HardwareSniffer JSON Format as closely as possible
        const data = {
            "Motherboard": {
                "Name": moboName,
                "Chipset": chipset,
                "Platform": platform
            },
            "BIOS": {
                "Version": "Unknown", // Diff from AIDA usually
                "Firmware Type": "UEFI"
            },
            "CPU": {
                "Manufacturer": cpuName.includes("AMD") ? "AMD" : "Intel",
                "Processor Name": cpuName,
                "Codename": this.detectCPUCodenameFromName(cpuName),
                "Core Count": this.extractCoreCount(htmlContent, cpuName),
                "SIMD Features": "SSE4.1, SSE4.2, AVX2" // Placeholder
            },
            "GPU": {},
            "Network": networkDevices,
            "Sound": {},
            "Storage Controllers": storageDevices,
            "USB Controllers": {}, // Placeholder for now
            "Monitor": {}
        };

        // Populate GPUs
        gpuList.forEach(gName => {
            const isIntegrated = gName.match(/Intel.*?HD|UHD|Iris|Xe/i);
            data.GPU[gName] = {
                "Manufacturer": this.detectGPUManufacturer(gName),
                "Codename": this.detectGPUCodename(gName),
                "Device Type": isIntegrated ? "Integrated GPU" : "Discrete GPU",
                "Device ID": isIntegrated ? "8086-3E9B" : "1002-73DF", // Fallbacks if not found
                "PCI Path": isIntegrated ? "PciRoot(0x0)/Pci(0x2,0x0)" : "PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)"
            };
        });

        // Populate Sound
        const audioMatches = htmlContent.match(/Realtek.*?ALC\d{3,4}/gi) || [];
        [...new Set(audioMatches)].forEach(audio => {
            const codec = audio.match(/ALC(\d+)/)[1];
            data.Sound[audio] = {
                "Bus Type": "HDAUDIO",
                "Device ID": `10EC-${codec}`,
                "Audio Endpoints": ["Speakers", "Microphone"]
            };
        });

        console.log("AIDA64 Parsed Data (HS Structure):", data);
        return this.validateAndCleanReport(data);
    }

    extractCoreCount(htmlContent, cpuName) {
        // Procurar por padrão "6C+8c" ou "14 cores"
        const coreMatch = htmlContent.match(/(\d+)C\+(\d+)c/i) ||
            htmlContent.match(/(\d+)\s*cores/i);
        if (coreMatch) {
            if (coreMatch[2]) {
                // Formato "6C+8c" = 6 P-cores + 8 E-cores = 14 total
                return String(parseInt(coreMatch[1]) + parseInt(coreMatch[2]));
            }
            return coreMatch[1];
        }

        // Fallback baseado no nome da CPU
        if (cpuName.includes("13600")) return "14";
        if (cpuName.includes("13700")) return "16";
        if (cpuName.includes("13900")) return "24";

        return "4";
    }


    extractAIDA64Value(html, labels) {
        for (const label of labels) {
            // FIXED: Capturar TUDO entre <TD> e </TD>, incluindo tags HTML internas
            const patterns = [
                new RegExp(`${label}[^<]*<TD[^>]*>([\\s\\S]*?)<\\/TD>`, 'i'),
                new RegExp(`${label}.*?<TD[^>]*>\\s*([\\s\\S]*?)<\\/TD>`, 'i'),
                new RegExp(`>${label}<.*?<TD[^>]*>([\\s\\S]*?)<\\/TD>`, 'i')
            ];

            for (const pattern of patterns) {
                const match = html.match(pattern);
                if (match && match[1]) {
                    let value = match[1].trim();

                    // Limpar HTML tags de forma segura usando DOM (Superior ao regex)
                    if (typeof document !== 'undefined') {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = value;
                        value = tempDiv.textContent || tempDiv.innerText || "";
                    } else {
                        // Fallback para ambiente sem DOM
                        value = value.replace(/<[^>]+>/g, '');
                    }

                    // Limpar HTML entities (caso sobrem)
                    // Limpar HTML entities
                    value = value.replace(/&nbsp;/g, ' ');
                    value = value.replace(/&amp;/g, '&');
                    value = value.trim();

                    if (value && value.length > 0 && value.length < 200) {
                        return value;
                    }
                }
            }
        }
        return null;
    }

    extractAIDA64AllValues(html, labels) {
        let values = [];
        for (const label of labels) {
            // Regex global e abrangente (usa [\s\S]*? para pegar TUDO incluindo quebras de linha entre label e valor)
            const pattern = new RegExp(`${label}[\\s\\S]*?<TD[^>]*>([\\s\\S]*?)<\\/TD>`, 'gi');
            let match;
            while ((match = pattern.exec(html)) !== null) {
                let value = match[1].trim();

                // Limpeza via DOM ou regex
                if (typeof document !== 'undefined') {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = value;
                    value = tempDiv.textContent || tempDiv.innerText || "";
                } else {
                    value = value.replace(/<[^>]+>/g, '');
                }

                // Limpar entities e sujeira comum (ex: " (2 GB)")
                value = value.replace(/&nbsp;/g, ' ').replace(/\s*\(\d+\s*GB\)/i, '').trim();

                if (value && value.length > 0 && !values.includes(value)) {
                    values.push(value);
                }
            }
        }
        return values;
    }

    detectCPUCodenameFromName(cpuName) {
        // Mapeamento por texto explícito
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

        // Detecção por número do modelo (Regex)
        // Intel Core
        if (cpuName.match(/i\d-14\d{3}/)) return "Raptor Lake Refresh";
        if (cpuName.match(/i\d-13\d{3}/)) return "Raptor Lake";
        if (cpuName.match(/i\d-12\d{3}/)) return "Alder Lake";
        if (cpuName.match(/i\d-11\d{3}/)) return "Tiger Lake"; // Mobile 11th é Tiger, Desktop é Rocket. Assumindo Tiger para mobile/geral.
        if (cpuName.match(/i\d-10\d{3}/)) return "Comet Lake"; // ou Ice Lake (com G7), mas Comet é bom default
        if (cpuName.match(/i\d-9\d{3}/)) return "Coffee Lake Refresh";
        if (cpuName.match(/i\d-8\d{3}/)) return "Coffee Lake"; // Inclui Kaby Lake-R (8250U/8550U) tratados como Coffee/Kaby para fins de Hackintosh
        if (cpuName.match(/i\d-7\d{3}/)) return "Kaby Lake";
        if (cpuName.match(/i\d-6\d{3}/)) return "Skylake";
        if (cpuName.match(/i\d-5\d{3}/)) return "Broadwell";
        if (cpuName.match(/i\d-4\d{3}/)) return "Haswell";
        if (cpuName.match(/i\d-3\d{3}/)) return "Ivy Bridge";
        if (cpuName.match(/i\d-2\d{3}/)) return "Sandy Bridge";

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
        const allGPUs = Object.values(hardwareData.GPU || {});

        // Encontrar a melhor GPU (AMD Discrete tem prioridade)
        const amdGPU = allGPUs.find(g => g.Manufacturer === "AMD" && g["Device Type"] === "Discrete GPU");
        const gpu = amdGPU || allGPUs[0];

        const platform = hardwareData.Motherboard.Platform;
        const darwinVersion = macOSVersion ? macOSVersion.darwin : "24.0.0";

        console.log(`Selecting SMBIOS for ${cpu.Codename} on macOS ${darwinVersion}`);

        // Verificar se CPU é Série F (sem iGPU)
        const cpuName = cpu["Processor Name"] || "";
        const isFSeries = cpuName.toUpperCase().endsWith("F") || cpuName.toUpperCase().endsWith("KF");

        // AMD Ryzen Desktop sempre usa iMacPro/MacPro
        if (cpu.Manufacturer === "AMD") {
            if (platform === "Laptop") {
                return this.getBestSMBIOS("MacBookPro16,1", darwinVersion);
            }

            // MacPro7,1 só funciona em Catalina+ (19.0.0+)
            if (this.parseDarwinVersion(darwinVersion) >= this.parseDarwinVersion("19.0.0")) {
                if (amdGPU) {
                    return "MacPro7,1";
                }
            }
            return "iMacPro1,1";
        }

        // Intel Desktop
        if (platform === "Desktop") {
            const codename = cpu.Codename || "";

            // Priorizar MacPro7,1 para Sistemas High-End (AMD dGPU)
            if (amdGPU) {
                // Se for KF/F series ou 12th+, preferir MacPro7,1
                if (isFSeries || codename.includes("Alder") || codename.includes("Raptor") || codename.includes("Rocket")) {
                    if (this.parseDarwinVersion(darwinVersion) >= this.parseDarwinVersion("19.0.0")) {
                        return "MacPro7,1"; // MacPro7,1 (Catalina+)
                    }
                }

                // Opção alternativa: iMacPro1,1 para maior compatibilidade ou MacPro7,1 para Monterey+
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

            // Verificar se tem dGPU AMD
            const hasAMDdGPU = gpu && gpu.Manufacturer === "AMD" && gpu["Device Type"] === "Discrete GPU";

            if (codename.includes("Comet") || codename.includes("Ice Lake")) {
                // 10th Gen
                if (hasAMDdGPU) {
                    return this.getBestSMBIOS("MacBookPro16,1", darwinVersion); // 16" com AMD
                }
                return this.getBestSMBIOS("MacBookPro16,2", darwinVersion); // 13" com Intel
            }
            if (codename.includes("Coffee")) {
                // 8th/9th Gen
                if (hasAMDdGPU) {
                    return this.getBestSMBIOS("MacBookPro15,1", darwinVersion); // 15" com AMD
                }
                return this.getBestSMBIOS("MacBookPro15,2", darwinVersion); // 13" com Intel
            }
            if (codename.includes("Kaby")) {
                // 7th Gen (incluindo Kaby Lake Refresh/UHD 620)
                if (hasAMDdGPU) {
                    return this.getBestSMBIOS("MacBookPro14,3", darwinVersion); // 15" com AMD
                }
                return this.getBestSMBIOS("MacBookPro14,1", darwinVersion); // 13" com Intel
            }
            if (codename.includes("Skylake")) {
                // 6th Gen
                if (hasAMDdGPU) {
                    return this.getBestSMBIOS("MacBookPro13,3", darwinVersion); // 15" com AMD
                }
                return this.getBestSMBIOS("MacBookPro13,1", darwinVersion); // 13" com Intel
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

        // SMBIOS Selection
        const smbiosModel = this.selectSMBIOS(hardwareData, macOSVersion);
        console.log(`Generating config for ${smbiosModel} on macOS ${macOSVersion.name}`);

        // Use Sample.plist structure as base
        // We do deep copy to avoid mutating the template
        const baseConfig = JSON.parse(JSON.stringify(this.getSamplePlistStructure()));

        // --- ACPI ---
        baseConfig.ACPI.Add = this.generateACPIAdd(hardwareData);
        // Only override Quirks we specifically manage, keep others default
        Object.assign(baseConfig.ACPI.Quirks, {
            "FadtEnableReset": false,
            "NormalizeHeaders": false,
            "RebaseRegions": false,
            "ResetHwSig": false,
            "ResetLogoStatus": false
        });

        // --- Booter ---
        // Merge generated booter quirks with base
        const booter = this.generateBooter(hardwareData, macOSVersion);
        baseConfig.Booter.MmioWhitelist = booter.MmioWhitelist;
        Object.assign(baseConfig.Booter.Quirks, booter.Quirks);

        // --- DeviceProperties ---
        baseConfig.DeviceProperties.Add = this.generateDeviceProperties(hardwareData, macOSVersion);

        // --- Kernel ---
        const kernel = this.generateKernel(hardwareData, macOSVersion);
        baseConfig.Kernel.Add = kernel.Add;
        baseConfig.Kernel.Emulate = kernel.Emulate;
        Object.assign(baseConfig.Kernel.Quirks, kernel.Quirks);
        // We don't touch Block/Force/Patch/Scheme typically unless specific logic requires it

        // --- Misc ---
        const misc = this.generateMisc(hardwareData, macOSVersion);
        Object.assign(baseConfig.Misc.Boot, misc.Boot);
        Object.assign(baseConfig.Misc.Debug, misc.Debug);
        Object.assign(baseConfig.Misc.Security, misc.Security);
        // Keep Tools/Entries from Sample or empty as preferred. Usually empty for clean config.
        baseConfig.Misc.Tools = [];
        baseConfig.Misc.Entries = [];

        // --- NVRAM ---
        const nvram = this.generateNVRAM(hardwareData, macOSVersion);
        baseConfig.NVRAM.Add = nvram.Add; // Replace completely to ensure clean vars
        baseConfig.NVRAM.Delete = nvram.Delete;

        // --- PlatformInfo ---
        const platformInfo = this.generatePlatformInfo(smbiosModel);
        // Merge PlatformInfo carefully
        Object.assign(baseConfig.PlatformInfo.Generic, platformInfo.Generic);
        baseConfig.PlatformInfo.Automatic = platformInfo.Automatic;
        baseConfig.PlatformInfo.UpdateDataHub = platformInfo.UpdateDataHub;
        baseConfig.PlatformInfo.UpdateNVRAM = platformInfo.UpdateNVRAM;
        baseConfig.PlatformInfo.UpdateSMBIOS = platformInfo.UpdateSMBIOS;
        baseConfig.PlatformInfo.UpdateSMBIOSMode = platformInfo.UpdateSMBIOSMode;


        // --- UEFI ---
        const uefi = this.generateUEFI(hardwareData, macOSVersion);
        baseConfig.UEFI.Drivers = uefi.Drivers;
        Object.assign(baseConfig.UEFI.Quirks, uefi.Quirks);
        Object.assign(baseConfig.UEFI.Input, uefi.Input);
        Object.assign(baseConfig.UEFI.Output, uefi.Output);

        this.generatedConfig = baseConfig;
        return baseConfig;
    }

    getSamplePlistStructure() {
        return {
            "ACPI": {
                "Add": [],
                "Delete": [],
                "Patch": [],
                "Quirks": {
                    "FadtEnableReset": false,
                    "NormalizeHeaders": false,
                    "RebaseRegions": false,
                    "ResetHwSig": false,
                    "ResetLogoStatus": true,
                    "SyncTableIds": false
                }
            },
            "Booter": {
                "MmioWhitelist": [],
                "Patch": [],
                "Quirks": {
                    "AllowRelocationBlock": false,
                    "AvoidRuntimeDefrag": true,
                    "ClearTaskSwitchBit": false,
                    "DevirtualiseMmio": false,
                    "DisableSingleUser": false,
                    "DisableVariableWrite": false,
                    "DiscardHibernateMap": false,
                    "EnableSafeModeSlide": true,
                    "EnableWriteUnprotector": true,
                    "FixupAppleEfiImages": true,
                    "ForceBooterSignature": false,
                    "ForceExitBootServices": false,
                    "ProtectMemoryRegions": false,
                    "ProtectSecureBoot": false,
                    "ProtectUefiServices": false,
                    "ProvideCustomSlide": true,
                    "ProvideMaxSlide": 0,
                    "RebuildAppleMemoryMap": false,
                    "ResizeAppleGpuBars": -1,
                    "SetupVirtualMap": true,
                    "SignalAppleOS": false,
                    "SyncRuntimePermissions": false
                }
            },
            "DeviceProperties": {
                "Add": {},
                "Delete": {}
            },
            "Kernel": {
                "Add": [],
                "Block": [],
                "Emulate": {
                    "Cpuid1Data": { _isData: true, value: "" },
                    "Cpuid1Mask": { _isData: true, value: "" },
                    "DummyPowerManagement": false,
                    "MaxKernel": "",
                    "MinKernel": ""
                },
                "Force": [],
                "Patch": [],
                "Quirks": {
                    "AppleCpuPmCfgLock": false,
                    "AppleXcpmCfgLock": false,
                    "AppleXcpmExtraMsrs": false,
                    "AppleXcpmForceBoost": false,
                    "CustomSMBIOSGuid": false,
                    "DisableIoMapper": false,
                    "DisableLinkeditJettison": true,
                    "DisableRtcChecksum": false,
                    "ExtendBTFeatureFlags": false,
                    "ExternalDiskIcons": false,
                    "ForceAquantiaEthernet": false,
                    "ForceSecureBootScheme": false,
                    "IncreasePciBarSize": false,
                    "LapicKernelPanic": false,
                    "LegacyCommpage": false,
                    "PanicNoKextDump": true,
                    "PowerTimeoutKernelPanic": true,
                    "ProvideCurrentCpuInfo": false,
                    "SetApfsTrimTimeout": -1,
                    "ThirdPartyDrives": false,
                    "XhciPortLimit": false
                },
                "Scheme": {
                    "CustomKernel": false,
                    "FuzzyMatch": true,
                    "KernelArch": "Auto",
                    "KernelCache": "Auto"
                }
            },
            "Misc": {
                "BlessOverride": [],
                "Boot": {
                    "ConsoleAttributes": 0,
                    "HibernateMode": "None",
                    "HideAuxiliary": false,
                    "LauncherOption": "Disabled",
                    "LauncherPath": "Default",
                    "PickerAttributes": 17,
                    "PickerAudioAssist": false,
                    "PickerMode": "Builtin",
                    "PickerVariant": "Auto",
                    "PollAppleHotKeys": false,
                    "ShowPicker": true,
                    "TakeoffDelay": 0,
                    "Timeout": 5
                },
                "Debug": {
                    "AppleDebug": false,
                    "ApplePanic": false,
                    "DisableWatchDog": true,
                    "DisplayDelay": 0,
                    "DisplayLevel": 2147483650,
                    "LogModules": "*",
                    "SysReport": false,
                    "Target": 3
                },
                "Entries": [],
                "Security": {
                    "AllowSetDefault": true,
                    "ApECID": 0,
                    "AuthRestart": false,
                    "BlacklistAppleUpdate": true,
                    "DmgLoading": "Signed",
                    "EnablePassword": false,
                    "ExposeSensitiveData": 6,
                    "HaltLevel": 2147483648,
                    "PasswordHash": { _isData: true, value: "" },
                    "PasswordSalt": { _isData: true, value: "" },
                    "ScanPolicy": 0,
                    "SecureBootModel": "Default",
                    "Vault": "Optional"
                },
                "Serial": {
                    "Init": false,
                    "Override": false
                },
                "Tools": []
            },
            "NVRAM": {
                "Add": {
                    "4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14": {
                        "DefaultBackgroundColor": { _isData: true, value: "AAAAAA" }
                    },
                    "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": {
                        "rtc-blacklist": { _isData: true, value: "" }
                    },
                    "7C436110-AB2A-4BBB-A880-FE41995C9F82": {
                        "ForceDisplayRotationInEFI": 0,
                        "SystemAudioVolume": { _isData: true, value: "Rg" },
                        "boot-args": "",
                        "csr-active-config": { _isData: true, value: "AAAAAA" },
                        "prev-lang:kbd": { _isData: true, value: "" },
                        "run-efi-updater": "No"
                    }
                },
                "Delete": {
                    "4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14": ["DefaultBackgroundColor"],
                    "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": ["rtc-blacklist"],
                    "7C436110-AB2A-4BBB-A880-FE41995C9F82": ["ForceDisplayRotationInEFI", "SystemAudioVolume", "boot-args", "csr-active-config", "prev-lang:kbd"]
                },
                "LegacyOverwrite": false,
                "LegacySchema": {
                    "7C436110-AB2A-4BBB-A880-FE41995C9F82": ["EFILoginHiDPI", "EFIBluetoothDelay", "LocationServicesEnabled", "SystemAudioVolume", "SystemAudioVolumeDB", "SystemAudioVolumeSaved", "bluetoothActiveControllerInfo", "bluetoothInternalControllerInfo", "flagstate", "fmm-computer-name", "fmm-mobileme-token-FMM", "fmm-mobileme-token-FMM-BridgeHasAccount", "nvda_drv", "prev-lang:kbd"],
                    "8BE4DF61-93CA-11D2-AA0D-00E098032B8C": ["Boot0080", "Boot0081", "Boot0082", "BootNext", "BootOrder"]
                },
                "WriteFlash": true
            },
            "PlatformInfo": {
                "Automatic": true,
                "CustomMemory": false,
                "Generic": {
                    "AdviseFeatures": false,
                    "MaxBIOSVersion": false,
                    "MLB": "",
                    "ProcessorType": 0,
                    "ROM": { _isData: true, value: "112233445566" },
                    "SpoofVendor": true,
                    "SystemMemoryStatus": "Auto",
                    "SystemProductName": "",
                    "SystemSerialNumber": "",
                    "SystemUUID": ""
                },
                "UpdateDataHub": true,
                "UpdateNVRAM": true,
                "UpdateSMBIOS": true,
                "UpdateSMBIOSMode": "Create",
                "UseRawUuidEncoding": false
            },
            "UEFI": {
                "APFS": {
                    "EnableJumpstart": true,
                    "GlobalConnect": false,
                    "HideVerbose": true,
                    "JumpstartHotPlug": false,
                    "MinDate": 0,
                    "MinVersion": 0
                },
                "AppleInput": {
                    "AppleEvent": "Builtin",
                    "CustomDelays": false,
                    "GraphicsInputMirroring": true,
                    "KeyInitialDelay": 50,
                    "KeySubsequentDelay": 5,
                    "PointerDwellClickTimeout": 0,
                    "PointerDwellDoubleClickTimeout": 0,
                    "PointerDwellRadius": 0,
                    "PointerPollMask": -1,
                    "PointerPollMax": 80,
                    "PointerPollMin": 10,
                    "PointerSpeedDiv": 1,
                    "PointerSpeedMul": 1
                },
                "Audio": {
                    "AudioCodec": 0,
                    "AudioDevice": "PciRoot(0x0)/Pci(0x1b,0x0)",
                    "AudioOutMask": 1,
                    "AudioSupport": false,
                    "DisconnectHda": false,
                    "MaximumGain": -15,
                    "MinimumAssistGain": -30,
                    "MinimumAudibleGain": -55,
                    "PlayChime": "Auto",
                    "ResetTrafficClass": false,
                    "SetupDelay": 0
                },
                "ConnectDrivers": true,
                "Drivers": [],
                "Input": {
                    "KeyFiltering": false,
                    "KeyForgetThreshold": 5,
                    "KeySupport": true,
                    "KeySupportMode": "Auto",
                    "KeySwap": false,
                    "PointerSupport": false,
                    "PointerSupportMode": "ASUS",
                    "TimerResolution": 50000
                },
                "Output": {
                    "ClearScreenOnModeSwitch": false,
                    "ConsoleFont": "",
                    "ConsoleMode": "",
                    "DirectGopRendering": false,
                    "ForceResolution": false,
                    "GopBurstMode": false,
                    "GopPassThrough": "Disabled",
                    "IgnoreTextInGraphics": false,
                    "InitialMode": "Auto",
                    "ProvideConsoleGop": true,
                    "ReconnectGraphicsOnConnect": false,
                    "ReconnectOnResChange": false,
                    "ReplaceTabWithSpace": false,
                    "Resolution": "Max",
                    "SanitiseClearScreen": false,
                    "TextRenderer": "BuiltinGraphics",
                    "UgaPassThrough": false,
                    "UIScale": 0
                },
                "ProtocolOverrides": {
                    "AppleAudio": false,
                    "AppleBootPolicy": false,
                    "AppleDebugLog": false,
                    "AppleEg2Info": false,
                    "AppleFramebufferInfo": false,
                    "AppleImageConversion": false,
                    "AppleImg4Verification": false,
                    "AppleKeyMap": false,
                    "AppleRtcRam": false,
                    "AppleSecureBoot": false,
                    "AppleSmcIo": false,
                    "AppleUserInterfaceTheme": false,
                    "DataHub": false,
                    "DeviceProperties": false,
                    "FirmwareVolume": true,
                    "HashServices": false,
                    "OSInfo": false,
                    "PciIo": false,
                    "UnicodeCollation": false
                },
                "Quirks": {
                    "ActivateHpetSupport": false,
                    "DisableSecurityPolicy": false,
                    "EnableVectorAcceleration": true,
                    "EnableVmx": false,
                    "ExitBootServicesDelay": 0,
                    "ForceOcWriteFlash": false,
                    "ForgeUefiSupport": false,
                    "IgnoreInvalidFlexRatio": false,
                    "ReleaseUsbOwnership": false,
                    "ReloadOptionRoms": false,
                    "RequestBootVarRouting": true,
                    "ResizeGpuBars": -1,
                    "ResizeUsePciRbIo": false,
                    "ShimRetainProtocol": false,
                    "TscSyncTimeout": 0,
                    "UnblockFsConnect": false
                },
                "ReservedMemory": [],
                "Unload": []
            }
        };
    }

    generateBooter(hw, macOS) {
        const chipset = hw.Motherboard.Chipset || "";
        const cpuCodename = hw.CPU.Codename || "";
        const firmware = hw.BIOS["Firmware Type"];
        const cpuMan = hw.CPU.Manufacturer;

        // Logic matched with OpCore-Simplify
        const isIntelNewer = chipset.match(/Z[4-7]90/) || chipset.match(/[BHQ][4-7][0-9]0/); // Intel 400+
        const isAMDNewer = chipset.match(/X570|B550|A520|TRX40|B650|X670/); // AMD 500+

        return {
            "MmioWhitelist": this.generateMmioWhitelist(chipset),
            "Patch": [],
            "Quirks": {
                "AllowRelocationBlock": false,
                "AvoidRuntimeDefrag": firmware === "UEFI", // OpCore: True if UEFI
                "DevirtualiseMmio": this.needsDevirtualiseMmio(chipset, cpuCodename),
                "DisableSingleUser": false,
                "DisableVariableWrite": false,
                "DiscardHibernateMap": false,
                "EnableSafeModeSlide": firmware === "UEFI",
                "EnableWriteUnprotector": this.needsWriteUnprotector(hw),
                "ForceBooterSignature": false,
                "ForceExitBootServices": false,
                "ProtectMemoryRegions": false,
                "ProtectSecureBoot": false,
                "ProtectUefiServices": this.needsProtectUefiServices(chipset),
                "ProvideCustomSlide": firmware === "UEFI",
                "ProvideMaxSlide": 0,
                "RebuildAppleMemoryMap": !this.needsWriteUnprotector(hw), // Inverse of EnableWriteUnprotector
                "ResizeAppleGpuBars": -1, // Conservative default
                "SetupVirtualMap": firmware === "UEFI" && !isIntelNewer && !isAMDNewer,
                "SignalAppleOS": false,
                "SyncRuntimePermissions": this.needsWriteUnprotector(hw) ? false : true // True for Matryoshka (AMD/New Intel)
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

    // ========================================================================
    // DEVICE PROPERTIES - v3.0 com Datasets Completos
    // ========================================================================

    generateDeviceProperties(hw, macOS) {
        const deviceProps = {};

        // 1. iGPU Properties (Intel Integrated Graphics)
        for (const [gpuName, gpu] of Object.entries(hw.GPU || {})) {
            if (gpu.Manufacturer === "Intel" && gpu["Device Type"] === "Integrated GPU") {
                const igpuProps = this.generateIGPUPropertiesV3(gpu, hw, macOS);
                if (igpuProps && Object.keys(igpuProps).length > 0) {
                    const pciPath = gpu["PCI Path"] || "PciRoot(0x0)/Pci(0x2,0x0)";
                    deviceProps[pciPath] = igpuProps;
                }
            }
        }

        // 2. Audio Properties (AppleALC)
        const audioProps = this.generateAudioProperties(hw);
        if (audioProps && Object.keys(audioProps.properties).length > 0) {
            deviceProps[audioProps.pciPath] = audioProps.properties;
        }

        // 3. Ethernet Properties
        for (const [netName, netProps] of Object.entries(hw.Network || {})) {
            const ethernetProps = this.generateEthernetPropertiesV3(netProps);
            if (ethernetProps && Object.keys(ethernetProps).length > 0) {
                const pciPath = netProps["PCI Path"] || "PciRoot(0x0)/Pci(0x1F,0x6)";
                deviceProps[pciPath] = ethernetProps;
            }
        }

        // 4. Storage Controllers (built-in)
        for (const [storageName, storageProps] of Object.entries(hw["Storage Controllers"] || {})) {
            if (storageProps["PCI Path"]) {
                deviceProps[storageProps["PCI Path"]] = {
                    "built-in": "01"
                };
            }
        }

        return deviceProps;
    }

    // ========================================================================
    // AUDIO PROPERTIES - v3.0 com Database de Codecs
    // ========================================================================

    generateAudioProperties(hw) {
        if (!hw.Sound || Object.keys(hw.Sound).length === 0) {
            return null;
        }

        // Procurar codec de áudio
        for (const [name, props] of Object.entries(hw.Sound)) {
            const deviceId = props["Device ID"];
            if (!deviceId) continue;

            // Verificar se temos layouts para este codec
            let layoutId = 1; // Fallback

            if (this.getRecommendedLayout && typeof this.getRecommendedLayout === 'function') {
                layoutId = this.getRecommendedLayout(deviceId);
            } else {
                // Fallback para codecs comuns se dataset não estiver carregado
                const codecMap = {
                    "10EC-1220": 1,
                    "10EC-0892": 1,
                    "10EC-0887": 1,
                    "10EC-0256": 11,
                    "10EC-0295": 3,
                    "10EC-0298": 3
                };
                layoutId = codecMap[deviceId] || 1;
            }

            // Converter layout ID para bytes (little-endian)
            let layoutBytes;
            if (this.layoutIdToBytes && typeof this.layoutIdToBytes === 'function') {
                layoutBytes = this.layoutIdToBytes(layoutId);
            } else {
                // Fallback manual
                const bytes = new Uint8Array(4);
                bytes[0] = layoutId & 0xFF;
                layoutBytes = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            }

            // Retornar propriedades
            return {
                pciPath: props["PCI Path"] || "PciRoot(0x0)/Pci(0x1F,0x3)",
                properties: {
                    "layout-id": { _isData: true, value: layoutBytes }
                },
                codecId: deviceId,
                layoutId: layoutId
            };
        }

        return null;
    }

    // ========================================================================
    // iGPU PROPERTIES - v3.0 com Database Completo
    // ========================================================================

    generateIGPUPropertiesV3(gpu, hw, macOS) {
        const deviceId = gpu["Device ID"];
        // if (!deviceId) return {}; // REMOVED strict check to allow fallback

        // Detectar plataforma
        let platform = hw.Motherboard.Platform || "Desktop";
        if (hw.Motherboard.Name && typeof hw.Motherboard.Name === 'string' && hw.Motherboard.Name.toUpperCase().includes("NUC")) {
            platform = "NUC";
        }

        // Verificar se há monitor conectado na iGPU
        let hasMonitor = true;
        if (hw.GPU) {
            const discreteGPU = Object.values(hw.GPU).find(g => g["Device Type"] === "Discrete GPU");
            if (discreteGPU) {
                // Se houver dGPU, assumir que iGPU é headless
                hasMonitor = false;
            }
        }

        // Usar dataset se disponível (apenas se tiver Device ID)
        if (deviceId && this.getIGPUProperties && typeof this.getIGPUProperties === 'function') {
            const props = this.getIGPUProperties(deviceId, platform, hasMonitor);
            if (props) {
                return props;
            }
        }

        // Fallback para gerações comuns se dataset não estiver carregado
        // ATENÇÃO: Se não tiver Device ID, tentamos adivinhar pelo nome da GPU e Geração da CPU
        const codename = gpu.Codename || hw.CPU.Codename || "";
        const gpuName = gpu["Device Name"] || gpu.Manufacturer || ""; // AIDA64 parsing coloca nome em Manufacturer às vezes ou chave pai
        const isUHD620 = JSON.stringify(gpu).includes("620"); // Verificação segura no objeto GPU

        const props = {};

        // Kaby Lake Refresh (8th Gen mas usa gráfico Kaby Lake)
        // Se for Coffee Lake mas GPU for 620, tratar como Kaby Lake
        const isKabyLakeR = (codename.includes("Coffee") && isUHD620);

        // Check regex patterns if codename matches or if GPU Name suggests it
        const isCoffee = codename.includes("Coffee") || codename.includes("Comet") || gpuName.match(/UHD.*?630/i);
        const isKaby = codename.includes("Kaby") || isKabyLakeR || gpuName.match(/HD.*?630/i) || gpuName.match(/UHD.*?620/i);
        const isSkylake = codename.includes("Skylake") || gpuName.match(/HD.*?530/i);

        if (isCoffee && !isKabyLakeR) {
            if (platform === "Desktop") {
                if (hasMonitor) {
                    props["AAPL,ig-platform-id"] = "00009B3E";
                    props["device-id"] = "9B3E0000";
                    props["framebuffer-patch-enable"] = "01000000";
                    props["framebuffer-stolenmem"] = "00003001";
                    props["framebuffer-fbmem"] = "00009000";
                } else {
                    props["AAPL,ig-platform-id"] = "07009B3E";
                    props["device-id"] = "9B3E0000";
                }
            } else {
                props["AAPL,ig-platform-id"] = "0900A53E";
                props["framebuffer-patch-enable"] = "01000000";
                props["framebuffer-stolenmem"] = "00003001";
            }
        }
        else if (isKaby) {
            if (platform === "Desktop") {
                props["AAPL,ig-platform-id"] = "00001259";
                props["framebuffer-stolenmem"] = "00003001";
                props["framebuffer-fbmem"] = "00009000";
            } else {
                props["AAPL,ig-platform-id"] = "00001659";
                props["framebuffer-stolenmem"] = "00003001";
                props["framebuffer-fbmem"] = "00009000";
            }
        }
        else if (isSkylake) {
            if (platform === "Desktop") {
                props["AAPL,ig-platform-id"] = "00001219";
            } else {
                props["AAPL,ig-platform-id"] = "00001619";
            }
            props["framebuffer-stolenmem"] = "00003001";
            props["framebuffer-fbmem"] = "00009000";
        }

        // Wrap properties in Data object
        for (const key of Object.keys(props)) {
            const val = props[key];
            if (typeof val === 'string' && /^[0-9A-F]+$/.test(val)) {
                props[key] = { _isData: true, value: val };
            }
        }

        return props;
    }

    // ========================================================================
    // ETHERNET PROPERTIES - v3.0 com Database
    // ========================================================================

    generateEthernetPropertiesV3(netProps) {
        const deviceId = netProps["Device ID"];
        if (!deviceId) return {};

        // Usar dataset se disponível
        if (this.generateEthernetPropertiesHelper && typeof this.generateEthernetPropertiesHelper === 'function') {
            return this.generateEthernetPropertiesHelper(deviceId);
        }

        // Fallback: apenas marcar como built-in
        return {
            "built-in": "01"
        };
    }

    // Manter função antiga para compatibilidade
    generateIGPUProperties(gpu, hw, macOS) {
        return this.generateIGPUPropertiesV3(gpu, hw, macOS);
    }

    detectAudioCodec(hw) {
        const audioProps = this.generateAudioProperties(hw);
        if (audioProps) {
            return {
                codecId: audioProps.codecId,
                layoutId: audioProps.layoutId
            };
        }
        return null;
    }

    generateKernel(hw, macOS) {
        const cpuCodename = hw.CPU.Codename || "";
        const cpuMan = hw.CPU.Manufacturer;
        const chipset = hw.Motherboard.Chipset || "";

        // Determine if CPU is 12th Gen+ (Alder/Raptor/Arrow)
        const isIntel12Plus = cpuCodename.includes("Alder") || cpuCodename.includes("Raptor") || cpuCodename.includes("Meteor") || cpuCodename.includes("Arrow");

        return {
            "Add": this.generateKernelAdd(hw, macOS),
            "Block": [],
            "Emulate": this.generateKernelEmulate(hw, macOS),
            "Force": [],
            "Patch": [],
            "Quirks": {
                "AppleCpuPmCfgLock": cpuCodename.includes("Ivy Bridge") || cpuCodename.includes("Sandy Bridge"),
                "AppleXcpmCfgLock": cpuMan === "Intel" && !cpuCodename.includes("Ivy Bridge") && !cpuCodename.includes("Sandy Bridge"), // CFG Lock
                "AppleXcpmExtraMsrs": false, // Generally false unless specifically needed for Pentiums/HEDT
                "AppleXcpmForceBoost": false,
                "CustomSMBIOSGuid": false, // Use false for maximum compatibility
                "DisableIoMapper": true, // VT-d (Safer to default true unless user specifically needs it)
                "DisableLinkeditJettison": true,
                "DisableRtcChecksum": this.needsDisableRtcChecksum(hw),
                "ExtendBTFeatureFlags": false,
                "ExternalDiskIcons": false,
                "LapicKernelPanic": hw.Motherboard.Name && hw.Motherboard.Name.includes("HP"),
                "PanicNoKextDump": true,
                "PowerTimeoutKernelPanic": true,
                "ProvideCurrentCpuInfo": cpuMan === "AMD" || isIntel12Plus, // Critical for 12th+ and AMD
                "SetApfsTrimTimeout": -1,
                "XhciPortLimit": false // Broken in 11.3+, default false
            }
        };
    }

    generateKernelEmulate(hw, macOS) {
        const emulate = {
            "Cpuid1Data": { _isData: true, value: "" },
            "Cpuid1Mask": { _isData: true, value: "" },
            "DummyPowerManagement": hw.CPU.Manufacturer === "AMD"
        };

        const cpuCodename = hw.CPU.Codename || "";

        // Spoof Comet Lake (0x0506A5) for Alder Lake, Raptor Lake, Rocket Lake
        if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor") || cpuCodename.includes("Rocket")) {
            emulate.Cpuid1Data = { _isData: true, value: "55060A0000000000000000000000000000000000" };
            emulate.Cpuid1Mask = { _isData: true, value: "FFFFFFFF00000000000000000000000000000000" };
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

        // We return a simplified structure here because the base 'Sample.plist' structure
        // already contains the placeholders. We just need to RETURN the overrides
        // However, the caller (generateConfig) replaces the entire object for NVRAM.Add
        // so we must provide the FULL objects for Add and Delete to be safe.

        return {
            "Add": {
                "4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14": {
                    "DefaultBackgroundColor": { _isData: true, value: "AAAAAA" }
                },
                "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": {
                    "rtc-blacklist": { _isData: true, value: "" }
                },
                "7C436110-AB2A-4BBB-A880-FE41995C9F82": {
                    "ForceDisplayRotationInEFI": 0,
                    "SystemAudioVolume": { _isData: true, value: "Rg" },
                    "boot-args": bootArgs,
                    "csr-active-config": this.generateCSRConfig(macOS),
                    "prev-lang:kbd": { _isData: true, value: "" }, // Keep empty or set default
                    "run-efi-updater": "No"
                }
            },
            "Delete": {
                "4D1EDE05-38C7-4A6A-9CC6-4BCCA8B38C14": ["DefaultBackgroundColor"],
                "4D1FDA02-38C7-4A6A-9CC6-4BCCA8B30102": ["rtc-blacklist"],
                "7C436110-AB2A-4BBB-A880-FE41995C9F82": ["ForceDisplayRotationInEFI", "SystemAudioVolume", "boot-args", "csr-active-config", "prev-lang:kbd"]
            },
            "LegacyOverwrite": false,
            "LegacySchema": { // Hardcoded standard schema
                "7C436110-AB2A-4BBB-A880-FE41995C9F82": ["EFILoginHiDPI", "EFIBluetoothDelay", "LocationServicesEnabled", "SystemAudioVolume", "SystemAudioVolumeDB", "SystemAudioVolumeSaved", "bluetoothActiveControllerInfo", "bluetoothInternalControllerInfo", "flagstate", "fmm-computer-name", "fmm-mobileme-token-FMM", "fmm-mobileme-token-FMM-BridgeHasAccount", "nvda_drv", "prev-lang:kbd"],
                "8BE4DF61-93CA-11D2-AA0D-00E098032B8C": ["Boot0080", "Boot0081", "Boot0082", "BootNext", "BootOrder"]
            },
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

        // 12th/13th Gen Helpers
        const cpuCodename = hw.CPU.Codename || "";
        if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
            args.push("ctrsmt=full");
            args.push("revpatch=cpuname,sbvmm"); // Common RestrictEvents args
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
        const cpuMan = hw.CPU.Manufacturer;
        const firmware = hw.BIOS["Firmware Type"];

        // OpCore-Simplify: HfsPlusLegacy for older CPUs (Haswell and older), HfsPlus for newer
        // Strictly: If in IntelGenerations[64:] -> Legacy. Hashwell is 91.
        // Simplified check: Sandy, Ivy, Haswell, Broadwell -> Legacy. Skylake+ -> Normal.
        // Actually RDRAND support is the key. Ivy Bridge+ has it. But OpCore simplifies further.
        // Let's use standard Dortania recommendation: HfsPlus is fine for Ivy Bridge+. Legacy for Sandy/Old.
        // But adapting OpCore logic:
        const needsLegacyHfs = cpuCodename.includes("Sandy Bridge") || cpuCodename.includes("Ivy Bridge") || cpuCodename.includes("Haswell") || cpuCodename.includes("Broadwell") || firmware === "Legacy";

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
            "Drivers": this.generateDrivers(hw, macOS, needsLegacyHfs),
            "Input": {
                "KeySupport": firmware === "UEFI" || firmware === "Unknown", // Default to true if uncertain, vital for UEFI
                "KeySupportMode": "Auto"
            },
            "Output": {
                "ProvideConsoleGop": true,
                "TextRenderer": "BuiltinGraphics",
                "Resolution": "Max"
            },
            "Quirks": {
                "EnableVectorAcceleration": !cpuCodename.includes("Sandy") && !cpuCodename.includes("Ivy"), // Disable on very old
                "IgnoreInvalidFlexRatio": cpuCodename.includes("Broadwell") || cpuCodename.includes("Haswell") || cpuCodename.includes("Ivy") || cpuCodename.includes("Sandy"),
                "ReleaseUsbOwnership": true, // Always true safe default
                "RequestBootVarRouting": true,
                "UnblockFsConnect": hw.Motherboard.Name && hw.Motherboard.Name.includes("HP")
            }
        };
    }

    generateDrivers(hw, macOS, needsLegacyHfs) {
        const drivers = [];

        // File System Driver
        if (needsLegacyHfs) {
            drivers.push({ Path: "HfsPlusLegacy.efi", Enabled: true, LoadEarly: false });
        } else {
            drivers.push({ Path: "HfsPlus.efi", Enabled: true, LoadEarly: false });
        }

        // Core Drivers
        drivers.push({ Path: "OpenRuntime.efi", Enabled: true, LoadEarly: false });
        drivers.push({ Path: "ResetNvramEntry.efi", Enabled: true, LoadEarly: false });

        // GUI
        if (hw.BIOS["Firmware Type"] !== "Legacy") {
            drivers.push({ Path: "OpenCanopy.efi", Enabled: true, LoadEarly: false });
        }

        return drivers;
    }

    // Quirks detection
    // Quirks detection
    needsDevirtualiseMmio(chipset, cpuCodename) {
        // OpCore-Simplify list for DevirtualiseMmio
        if (chipset.match(/Z[3-7]90/)) return true; // Z390, Z490, Z590, Z690, Z790
        if (chipset.includes("B650") || chipset.includes("X670")) return true; // AMD AM5
        if (chipset.includes("TRX40") || chipset.includes("X570")) return true; // AMD HEDT/HighEnd
        if (cpuCodename.includes("Ice Lake") || cpuCodename.includes("Comet Lake")) return true;
        return false;
    }

    needsWriteUnprotector(hw) {
        const cpuManufacturer = hw.CPU.Manufacturer;
        const chipset = hw.Motherboard.Chipset || "";
        const cpuCodename = hw.CPU.Codename || "";

        // EnableWriteUnprotector is True for OLDER systems (Haswell/Broadwell/Skylake/Kabylake/CoffeeLake Z370)
        // False for NEWER (Z390, Z490+, AMD) which use RebuildAppleMemoryMap

        if (cpuManufacturer === "AMD") return false; // AMD uses RebuildAppleMemoryMap
        if (chipset.match(/Z[4-7]90/)) return false; // Z490+ uses RebuildAppleMemoryMap
        if (chipset.match(/B[4-7]60/)) return false; // B460+
        if (chipset.includes("Z390")) return false; // Z390 uses RebuildAppleMemoryMap

        // Note: Coffee Lake can vary (Z370 needs true, Z390 needs false). 
        // We default to true for older, false for newer.
        return true;
    }

    needsProtectUefiServices(chipset) {
        // True for Z390, Z490+
        return chipset.match(/Z[3-7]90/) !== null;
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
            // Check for Data wrapper
            if (obj._isData) {
                const base64 = this.hexToBase64(obj.value);
                return `${indentStr}<data>${base64}</data>\n`;
            }

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
    } // Corrected closing brace for escapeXML

    hexToBase64(hex) {
        if (!hex) return '';
        // Remove 0x prefix and spaces
        const cleanHex = hex.replace(/^0x/, '').replace(/\s/g, '');
        const match = cleanHex.match(/.{1,2}/g);
        if (!match) return '';

        const bytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    // ========================================================================
    // HELPER GENERATORS FOR ACPI AND KERNEL (IMPROVED)
    // ========================================================================

    generateACPIAdd(hw) {
        const ssdts = [];
        const platform = hw.Motherboard.Platform || "Desktop";
        const cpuCodename = hw.CPU.Codename;
        const cpuMan = hw.CPU.Manufacturer;
        const mobo = hw.Motherboard;

        // Path helper
        const addSSDT = (name, comment) => {
            ssdts.push({
                "Comment": comment,
                "Enabled": true,
                "Path": name
            });
        };

        if (cpuMan === "Intel") {
            // PLUG - CPU Power Management
            // Special case for Alder/Raptor Lake (12th/13th+)
            if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
                addSSDT("SSDT-PLUG-ALT.aml", "CPU Power Management (12th+ Gen)");
            }
            else if (cpuCodename.includes("Haswell") || cpuCodename.includes("Broadwell") ||
                cpuCodename.includes("Skylake") || cpuCodename.includes("Kaby") ||
                cpuCodename.includes("Coffee") || cpuCodename.includes("Comet") ||
                cpuCodename.includes("Rocket")) {
                addSSDT("SSDT-PLUG.aml", "CPU Power Management");
            }

            // EC - Embedded Controller
            if (platform === "Desktop") {
                if (cpuCodename.includes("Skylake") || cpuCodename.includes("Kaby") ||
                    cpuCodename.includes("Coffee") || cpuCodename.includes("Comet") ||
                    cpuCodename.includes("Rocket") || cpuCodename.includes("Alder") ||
                    cpuCodename.includes("Raptor")) {
                    addSSDT("SSDT-EC-USBX-DESKTOP.aml", "EC and USBX Power (Desktop)");
                    addSSDT("SSDT-AWAC.aml", "RTC AWAC Fix");
                } else if (cpuCodename.includes("Haswell") || cpuCodename.includes("Broadwell")) {
                    addSSDT("SSDT-EC-DESKTOP.aml", "EC Fix (Desktop)");
                }
            } else {
                // Laptop
                addSSDT("SSDT-EC-USBX-LAPTOP.aml", "EC and USBX Power (Laptop)");
                addSSDT("SSDT-PNLF.aml", "Backlight Control");
                addSSDT("SSDT-XOSI.aml", "OSI Rename for I2C Trackpad");
            }

            // PMC - NVRAM
            if (mobo.Chipset && (mobo.Chipset.includes("Z390") || mobo.Chipset.includes("B360") || mobo.Chipset.includes("H370"))) {
                addSSDT("SSDT-PMC.aml", "NVRAM PMC Fix");
            }

            // IMEI
            if (cpuCodename.includes("Sandy") || cpuCodename.includes("Ivy")) {
                addSSDT("SSDT-IMEI.aml", "IMEI Fix");
            }
        }
        else if (cpuMan === "AMD") {
            addSSDT("SSDT-CPUR.aml", "B550/A520 CPU Support"); // General safe fallback for B550/A520, others ignore
            if (platform === "Desktop") {
                addSSDT("SSDT-EC-USBX-DESKTOP.aml", "EC and USBX Power");
            }
        }

        return ssdts;
    }

    generateKernelAdd(hw, macOS) {
        const kexts = [];
        const platform = hw.Motherboard.Platform;

        const addKext = (name, exec = true, plugin = false, bundlePathOverride = null) => {
            // Handles simple kext structure assumption
            const bundlePath = bundlePathOverride || (name + ".kext");
            const executablePath = exec ? "Contents/MacOS/" + name : "";
            const plistPath = "Contents/Info.plist";

            kexts.push({
                "Arch": "Any",
                "BundlePath": bundlePath,
                "Comment": name,
                "Enabled": true,
                "ExecutablePath": executablePath,
                "MaxKernel": "",
                "MinKernel": "",
                "PlistPath": plistPath
            });
        };

        // 1. Essentials
        addKext("Lilu");
        addKext("VirtualSMC");

        // 2. Graphics & Audio
        addKext("WhateverGreen");
        addKext("AppleALC");

        // Check for RX 6700 XT (Navi 22) -> Needs NootRX
        // Check in GPU keys
        const gpuKeys = Object.keys(hw.GPU || {});
        const has6700XT = gpuKeys.some(k => k.includes("6700 XT") || k.includes("6700XT") || k.includes("6750"));

        if (has6700XT) {
            addKext("NootRX"); // Specialized kext for Navi 22
        }

        // 2.1 Storage (NVMeFix)
        const storeKeys = Object.keys(hw["Storage Controllers"] || {});
        if (storeKeys.some(k => k.toLowerCase().includes("nvme"))) {
            addKext("NVMeFix");
        }

        // 2.2 CPU/System Support (Newer Intel)
        const cpuCodename = hw.CPU.Codename || "";
        if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
            addKext("CpuTopologyRebuild"); // For P-cores/E-cores identification
            addKext("RestrictEvents");
        }

        // 3. Sensors (VirtualSMC Plugins)
        // Note: Plugins usually reside inside VirtualSMC, but standard OC setups often have them as separate entries in config.plist pointing to kext files in Kexts folder.
        if (platform === "Laptop") {
            addKext("SMCBatteryManager");
            addKext("SMCLightSensor");
        } else {
            addKext("SMCProcessor");
            addKext("SMCSuperIO");
        }

        // 4. Ethernet (Auto-Detect)
        if (hw.Network) {
            const netKeys = Object.keys(hw.Network);
            // Check descriptions or names
            for (const key of netKeys) {
                const net = hw.Network[key];
                const lowerKey = key.toLowerCase();
                const deviceId = net["Device ID"] || "";

                if (lowerKey.includes("rtl8111") || lowerKey.includes("rtl8168") || deviceId.startsWith("10EC")) {
                    addKext("RealtekRTL8111");
                }
                else if (lowerKey.includes("rtl8125") || deviceId === "10EC-8125") {
                    addKext("LucyRTL8125Ethernet");
                }
                else if (lowerKey.includes("i219") || lowerKey.includes("i218") || lowerKey.includes("i217") || lowerKey.includes("82579")) {
                    addKext("IntelMausi");
                }
                else if (lowerKey.includes("i225")) {
                    // Monterey+ natively supports I225-V with boot-arg e1000=0 usually, or AppleIGC
                    const darwin = macOS ? parseInt(macOS.darwin.split('.')[0]) : 20;
                    if (darwin < 21) {
                        // Older macOS might need patches or different kexts, but AppleIGC is a good modern solution for I225
                        addKext("AppleIGC");
                    }
                }
            }
        }

        // 5. WiFi (Intel/Broadcom)
        // Basic heuristics
        if (JSON.stringify(hw.Network).toLowerCase().includes("ax200") || JSON.stringify(hw.Network).toLowerCase().includes("ax210") || JSON.stringify(hw.Network).toLowerCase().includes("intel wi-fi")) {
            // AirportItlwm depends on macOS version!
            const version = macOS.name.split(' ')[1]; // "Sonoma", "Ventura", etc.
            addKext(`AirportItlwm`, true, false, `AirportItlwm-${version}.kext`);
            addKext("IntelBluetoothFirmware");
            addKext("IntelBTPatcher"); // Required for Monterey+
            addKext("BlueToolFixup"); // Required for Monterey+
        }

        // 6. USB
        addKext("USBToolBox", true);
        addKext("UTBMap", false); // Map usually has no executable, just plist
        // Fallback if no map
        // addKext("USBInjectAll"); 

        // 7. Laptop Specific (Input)
        if (platform === "Laptop") {
            addKext("VoodooPS2Controller");
            // Add sub-kexts of VoodooPS2? Usually needed unless using VoodooInput separately.
            // For simplicity, we add the main controller. Detailed setups might add specific plugins.

            addKext("VoodooI2C");
            addKext("VoodooI2CHID");

            // Brightness
            addKext("BrightnessKeys");
        }

        // 8. AMD Specific
        if (hw.CPU.Manufacturer === "AMD") {
            addKext("AMDRyzenCPUPowerManagement");
            // XLNCUSBFix?
        }

        return kexts;
    }
}

// Export
window.ConfigGenerator = ConfigGenerator;
