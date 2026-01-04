// ============================================================================
// CLOVER CONFIG GENERATOR - Extension for Legacy/Alternative Support
// Extends the main ConfigGenerator to produce Clover-compatible config.plist
// ============================================================================

class CloverConfigGenerator extends ConfigGenerator {
    constructor() {
        super();
    }

    // Override generateConfig to produce Clover XML
    async generateConfig(hardwareData, macOSVersion) {
        this.hardwareData = hardwareData;
        this.selectedMacOS = macOSVersion;

        const smbiosModel = this.selectSMBIOS(hardwareData, macOSVersion);
        console.log(`Generating Clover config for ${smbiosModel}`);

        // Helper to get boot args from parent
        const bootArgs = this.generateBootArgs(hardwareData, macOSVersion);

        // Helper for audio layout
        const audioLayout = this.getAudioLayout(hardwareData);

        // User confirmed working configuration for Gigabyte Z690:
        // SetupVirtualMap = true, EnableWriteUnprotector = true, RebuildAppleMemoryMap = false
        // ACPI: DropOem=true. Boot: revcpu=1.
        // FakeCPUID: 0x0706E5 (Comet Lake)

        // Override Boot Args to include revcpu=1 if it's Raptor/Alder/Rocket Lake
        let finalBootArgs = bootArgs;
        if (hardwareData.CPU.Codename.includes("Raptor") || hardwareData.CPU.Codename.includes("Alder") || hardwareData.CPU.Codename.includes("Rocket")) {
            if (!finalBootArgs.includes("revcpu=1")) finalBootArgs += " revcpu=1";
        }

        // Specific Patches for Raptor Lake (13th Gen)
        let extraAcpiPatches = "";
        const cpuName = hardwareData.CPU["Processor Name"] || "";
        const cpuCodename = hardwareData.CPU.Codename || "";

        // Check for Raptor Lake (13th/14th Gen) - Apply patches ONLY for i9 as per user request
        if ((cpuCodename.includes("Raptor") || cpuName.match(/i\d-1[34]\d{3}/)) && cpuName.includes("i9")) {
            // Basic Raptor Lake Patches (Now restricted to i9)
            extraAcpiPatches += `
                <dict>
                    <key>Comment</key>
                    <string>Rename XHCI to XHC_</string>
                    <key>Count</key>
                    <integer>0</integer>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>WEhDSQ==</data>
                    <key>Replace</key>
                    <data>WEhDXw==</data>
                    <key>Skip</key>
                    <integer>0</integer>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>RTC._STA Rename</string>
                    <key>Count</key>
                    <integer>0</integer>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>eQAUFV9TVEE=</data>
                    <key>Replace</key>
                    <data>eQAUFVhTVEE=</data>
                    <key>Skip</key>
                    <integer>0</integer>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>TIMR IRQ 0</string>
                    <key>Count</key>
                    <integer>0</integer>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>IgEAeQA=</data>
                    <key>Replace</key>
                    <data>IgAAeQA=</data>
                    <key>Skip</key>
                    <integer>0</integer>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>IPIC IRQ 2</string>
                    <key>Count</key>
                    <integer>0</integer>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>IgQAeQA=</data>
                    <key>Replace</key>
                    <data>IgAAeQA=</data>
                    <key>Skip</key>
                    <integer>0</integer>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>RTC IRQ 8</string>
                    <key>Count</key>
                    <integer>0</integer>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>IgABeQA=</data>
                    <key>Replace</key>
                    <data>IgAAeQA=</data>
                    <key>Skip</key>
                    <integer>0</integer>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>ADBG to XDBG</string>
                    <key>Count</key>
                    <integer>0</integer>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>QwMUGUFEQkc=</data>
                    <key>Replace</key>
                    <data>QwMUGVhEQkc=</data>
                    <key>Skip</key>
                    <integer>0</integer>
                </dict>`;

            // Specific Patch for Core i9 (High Core Count / Topology Fix)
            extraAcpiPatches += `
                <dict>
                    <key>Comment</key>
                    <string>core/thread count = 24 for 8P+8E Core i9</string>
                    <key>Count</key>
                    <integer>2</integer>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>uTUAAAAPMg==</data>
                    <key>Replace</key>
                    <data>uBgAGAAx0g==</data>
                    <key>Skip</key>
                    <integer>0</integer>
                </dict>`;
        }

        const config = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ACPI</key>
    <dict>
        <key>AutoMerge</key>
        <true/>
        <key>DSDT</key>
        <dict>
            <key>Debug</key>
            <false/>
            <key>Fixes</key>
            <dict>
                <key>AddDTGP</key>
                <false/>
                <key>AddHDMI</key>
                <false/>
                <key>AddIMEI</key>
                <false/>
                <key>AddMCHC</key>
                <false/>
                <key>AddPNLF</key>
                <false/>
                <key>DeleteUnused</key>
                <true/>
                <key>FakeLPC</key>
                <false/>
                <key>FixACST</key>
                <false/>
                <key>FixADP1</key>
                <false/>
                <key>FixAirport</key>
                <false/>
                <key>FixDarwin</key>
                <false/>
                <key>FixDarwin7</key>
                <false/>
                <key>FixDisplay</key>
                <false/>
                <key>FixFirewire</key>
                <false/>
                <key>FixHDA</key>
                <false/>
                <key>FixHPET</key>
                <false/>
                <key>FixIDE</key>
                <false/>
                <key>FixIPIC</key>
                <false/>
                <key>FixIntelGfx</key>
                <false/>
                <key>FixLAN</key>
                <false/>
                <key>FixMutex</key>
                <true/>
                <key>FixRTC</key>
                <false/>
                <key>FixRegions</key>
                <false/>
                <key>FixS3D</key>
                <false/>
                <key>FixSATA</key>
                <false/>
                <key>FixSBUS</key>
                <true/>
                <key>FixShutdown</key>
                <true/>
                <key>FixTMR</key>
                <false/>
                <key>FixUSB</key>
                <false/>
                <key>FixWAK</key>
                <false/>
            </dict>
            <key>Name</key>
            <string>DSDT.aml</string>
            <key>Modded</key>
            <false/>
            <key>Patches</key>
            <array>
                <dict>
                    <key>Comment</key>
                    <string>Add _SUN property for GIGE</string>
                    <key>Disabled</key>
                    <true/>
                    <key>Find</key>
                    <data>UFhTWAhfQURSAAhfUFJXEgYC</data>
                    <key>Replace</key>
                    <data>UFhTWAhfQURSAAhfU1VOCgQIX1BSVxIGAg==</data>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>Rename GFX0 to IGPU</string>
                    <key>Disabled</key>
                    <true/>
                    <key>Find</key>
                    <data>R0ZYMA==</data>
                    <key>Replace</key>
                    <data>SUdQVQ==</data>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>Rename AZAL  to HDAS</string>
                    <key>Disabled</key>
                    <true/>
                    <key>Find</key>
                    <data>QVpBTA==</data>
                    <key>Replace</key>
                    <data>SERBUw==</data>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>Rename oem _DSM to ZDSM</string>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>X0RTTQ==</data>
                    <key>Replace</key>
                    <data>WkRTTQ==</data>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>Rename HECI to IMEI</string>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>SEVDSQ==</data>
                    <key>Replace</key>
                    <data>SU1FSQ==</data>
                    <key>Skip</key>
                    <integer>0</integer>
                    <key>Count</key>
                    <integer>0</integer>
                </dict>${extraAcpiPatches}
            </array>
            <key>ReuseFFFF</key>
            <false/>
        </dict>
        <key>DisableASPM</key>
        <true/>
        <key>FixHeaders</key>
        <true/>
        <key>FixMCFG</key>
        <true/>
        <key>HaltEnabler</key>
        <true/>
        <key>SSDT</key>
        <dict>
            <key>DropOem</key>
            <true/>
            <key>Generate</key>
            <dict>
                <key>CStates</key>
                <false/>
                <key>PStates</key>
                <false/>
                <key>PluginType</key>
                <false/>
            </dict>
            <key>NoDynamicExtract</key>
            <true/>
            <key>NoOemTableId</key>
            <true/>
        </dict>
    </dict>
    <key>Boot</key>
    <dict>
        <key>Arguments</key>
        <string>${finalBootArgs}</string>
        <key>DefaultVolume</key>
        <string>LastBootedVolume</string>
        <key>Timeout</key>
        <integer>5</integer>
        <key>XMPDetection</key>
        <integer>0</integer>
        <key>Legacy</key>
        <string>PBR</string>
        <key>NeverHibernate</key>
        <true/>
        <key>Secure</key>
        <false/>
        <key>SignatureFixup</key>
        <false/>
    </dict>
    </dict>
    <key>Devices</key>
    <dict>
        <key>Audio</key>
        <dict>
            <key>Inject</key>
            <integer>${audioLayout}</integer>
            <key>ResetHDA</key>
            <true/>
        </dict>
        <key>Properties</key>
        ${this.generateDevicePropertiesXML(hardwareData, macOSVersion)}
        <key>USB</key>
        <dict>
            <key>FixOwnership</key>
            <true/>
            <key>AddClockID</key>
            <true/>
            <key>Inject</key>
            <true/>
            <key>HighCurrent</key>
            <false/>
        </dict>
        <key>UseIntelHDMI</key>
        <false/>
        <key>NoDefaultProperties</key>
        <false/>
        <key>HDMIInjection</key>
        <false/>
        <key>LANInjection</key>
        <false/>
    </dict>
    <key>DisableDrivers</key>
    <array>
        <string>Nothing</string>
    </array>
    <key>GUI</key>
    <dict>
        <key>Hide</key>
        <array>
            <string>Windows</string>
            <string>BOOTX64.EFI</string>
        </array>
        <key>Scan</key>
        <dict>
            <key>Entries</key>
            <true/>
            <key>Tool</key>
            <true/>
            <key>Legacy</key>
            <false/>
            <key>Linux</key>
            <true/>
        </dict>
        <key>Theme</key>
        <string>embedded</string>
        <key>Mouse</key>
        <dict>
            <key>Enabled</key>
            <true/>
            <key>Speed</key>
            <integer>2</integer>
        </dict>
    </dict>
    <key>Graphics</key>
    <dict>
        <key>Inject</key>
        <dict>
            <key>ATI</key>
            <false/>
            <key>Intel</key>
            <false/>
            <key>NVidia</key>
            <false/>
        </dict>
        <key>NvidiaSingle</key>
        <false/>
    </dict>
    <key>CPU</key>
    <dict>
        <key>BusSpeedkHz</key>
        <integer>133330</integer>
        <key>FrequencyMHz</key>
        <integer>3140</integer>
        <key>HWPEnable</key>
        <true/>
        <key>HWPValue</key>
        <string>0x30002a01</string>
        <key>QPI?</key>
        <integer>4800</integer>
        <key>SavingMode</key>
        <integer>7</integer>
        <key>TDP?</key>
        <integer>95</integer>
        <key>TurboDisable</key>
        <true/>
        <key>#Type</key>
        <string>0x0201</string>
        <key>Type</key>
        <string>3841</string>
        <key>UseARTFrequency</key>
        <true/>
    </dict>
    <key>KernelAndKextPatches</key>
    <dict>
        <key>AppleIntelCPUPM</key>
        <false/>
        <key>AppleRTC</key>
        <true/>
        <key>KernelPm</key>
        <true/>
        <key>PanicNoKextDump</key>
        <true/>
        <key>KernelLapic</key>
        <true/>
        <key>KernelXCPM</key>
        <false/>
        <key>Debug</key>
        <false/>
        <key>DellSMBIOSPatch</key>
        <false/>
        <key>EightApple</key>
        <true/>
        <key>BlockSkywalk</key>
        <true/>
        <key>FakeCPUID</key>
        <string>${this.calculateFakeCPUID(hardwareData)}</string>
        <key>KextsToPatch</key>
        <array>
            <dict>
                <key>Comment</key>
                <string>Disable FileVault</string>
                <key>Disabled</key>
                <false/>
                <key>Find</key>
                <data>AAAAAAAA</data>
                <key>InfoPlistPatch</key>
                <false/>
                <key>MaskFind</key>
                <data>AAAAAAAA</data>
                <key>MatchOS</key>
                <string>26.x</string>
                <key>Name</key>
                <string>com.apple.filesystems.apfs</string>
                <key>Procedure</key>
                <string>_apfs_filevault_allowed</string>
                <key>Replace</key>
                <data>uAAAAADD</data>
            </dict>
            <dict>
                <key>Disabled</key>
                <true/>
                <key>Find</key>
                <data>SGVhZHBob25lcwA=</data>
                <key>MaskReplace</key>
                <data>/////wAAAAAAAAA=</data>
                <key>Name</key>
                <string>VoodooHDA</string>
                <key>Replace</key>
                <data>VGVsZXBob25lcwA=</data>
            </dict>
            <dict>
                <key>Comment</key>
                <string>Make all drives to be internal</string>
                <key>Disabled</key>
                <true/>
                <key>Find</key>
                <data>RXh0ZXJuYWw=</data>
                <key>Name</key>
                <string>AppleAHCIPort</string>
                <key>Replace</key>
                <data>SW50ZXJuYWw=</data>
            </dict>
            <dict>
                <key>Comment</key>
                <string>TRIM function for non-Apple SSDs</string>
                <key>Disabled</key>
                <true/>
                <key>Find</key>
                <data>QVBQTEUgU1NEAA==</data>
                <key>Name</key>
                <string>IOAHCIBlockStorage</string>
                <key>Replace</key>
                <data>AAAAAAAAAAAAAA==</data>
            </dict>
            <dict>
                <key>Comment</key>
                <string>ATI Connector patch new way</string>
                <key>Disabled</key>
                <true/>
                <key>Find</key>
                <data>AAQAAAQDAAAAAQAAIQMCBAQAAAAUAgAAAAEAAAAABAMQAAAAEAAAAAABAAAAAAAB</data>
                <key>MatchOS</key>
                <string>10.9,10.10,10.11</string>
                <key>Name</key>
                <string>AMD6000Controller</string>
                <key>Replace</key>
                <data>BAAAABQCAAAAAQAAAAAEBAAEAAAEAwAAAAEAABECAQUAAAAAAAAAAAAAAAAAAAAA</data>
            </dict>
            <dict>
                <key>Comment</key>
                <string>ATI name HD xxxx -> HD6450</string>
                <key>Disabled</key>
                <true/>
                <key>Find</key>
                <data>SEQgNnh4eA==</data>
                <key>MatchOS</key>
                <string>10.12,10.13</string>
                <key>Name</key>
                <string>AMD6000Controller</string>
                <key>Replace</key>
                <data>SEQgNjQ1MA==</data>
            </dict>
            <dict>
                <key>Comment</key>
                <string>Violet strips</string>
                <key>Disabled</key>
                <true/>
                <key>Find</key>
                <data>VUiJ</data>
                <key>MaskFind</key>
                <data>AAAA</data>
                <key>Name</key>
                <string>com.apple.kext.AMDSupport</string>
                <key>Procedure</key>
                <string>TestVRAM</string>
                <key>RangeFind</key>
                <integer>10</integer>
                <key>Replace</key>
                <data>sAHD</data>
            </dict>
        </array>
    </dict>
    <key>Quirks</key>
    <dict>
        <key>AvoidRuntimeDefrag</key>
        <true/>
        <key>DevirtualiseMmio</key>
        <true/>
        <key>DisableIoMapper</key>
        <true/>
        <key>DisableLinkeditJettison</key>
        <true/>
        <key>EnableSafeModeSlide</key>
        <true/>
        <key>EnableWriteUnprotector</key>
        <true/>
        <key>PowerTimeoutKernelPanic</key>
        <true/>
        <key>ProvideCustomSlide</key>
        <true/>
        <key>RebuildAppleMemoryMap</key>
        <false/>
        <key>SetupVirtualMap</key>
        <true/>
        <key>SyncRuntimePermissions</key>
        <true/>
        <key>XhciPortLimit</key>
        <false/>
        <key>ProvideCurrentCpuInfo</key>
        <true/>
        <key>ProtectUefiServices</key>
        <true/>
        <key>CustomSMBIOSGuid</key>
        <true/>
        <key>ResizeAppleGpuBars</key>
        <integer>-1</integer>
        <key>ProvideMaxSlide</key>
        <integer>0</integer>
    </dict>
    <key>RtVariables</key>
    <dict>
        <key>BooterConfig</key>
        <string>0x28</string>
        <key>CsrActiveConfig</key>
        <string>0x0A87</string>
        <key>ROM</key>
        <string>UseMacAddr0</string>
        <key>MLB</key>
        <string>BOARDSERIALNEEDED</string>
    </dict>
    <key>SMBIOS</key>
    <dict>
        <key>ProductName</key>
        <string>${smbiosModel}</string>
        <key>Trust</key>
        <true/>
        <key>Mobile</key>
        <false/>
    </dict>
    <key>SystemParameters</key>
    <dict>
        <key>InjectKexts</key>
        <string>Detect</string>
        <key>InjectSystemID</key>
        <true/>
    </dict>
</dict>
</plist>`;

        this.generatedConfig = config;
        return config; // Return string, not object
    }

    generateDevicePropertiesXML(hw, macOS) {
        // Reuse parent's generateDeviceProperties which returns an object
        const props = super.generateDeviceProperties(hw, macOS);
        if (!props || Object.keys(props).length === 0) return "<dict/>";

        let xml = "<dict>\n";
        for (const [pciPath, devProps] of Object.entries(props)) {
            xml += `            <key>${pciPath}</key>\n`;
            xml += `            <dict>\n`;
            for (const [key, val] of Object.entries(devProps)) {
                xml += `                <key>${key}</key>\n`;
                if (typeof val === 'object' && val._isData) {
                    // Convert hex to base64 for plist
                    xml += `                <data>${this.hexToBase64(val.value)}</data>\n`;
                } else if (typeof val === 'number') {
                    xml += `                <integer>${val}</integer>\n`;
                } else {
                    xml += `                <string>${val}</string>\n`;
                }
            }
            xml += `            </dict>\n`;
        }
        xml += "        </dict>";
        return xml;
    }

    getAudioLayout(hw) {
        if (!hw.Sound) return 1;
        const audio = super.generateAudioProperties(hw);
        return audio ? audio.layoutId : 1;
    }

    hexToBase64(hex) {
        if (!hex) return "";
        try {
            return btoa(hex.match(/\w{2}/g).map(function (a) {
                return String.fromCharCode(parseInt(a, 16));
            }).join(""));
        } catch (e) {
            console.error("HexToBase64 Error", e);
            return "";
        }
    }

    // Override downloadConfigPlist to handle XML string
    calculateFakeCPUID(hardwareData) {
        const cpuName = hardwareData.CPU["Processor Name"] || "";
        const codename = hardwareData.CPU.Codename || "";

        // Raptor Lake (13th/14th Gen)
        if (codename.includes("Raptor") || cpuName.match(/i\d-1[34]\d{3}/)) {
            return "0x0906EB"; // Spoof as Comet Lake (i9-10900K)
        }

        // Alder Lake (12th Gen)
        if (codename.includes("Alder") || cpuName.match(/i\d-12\d{3}/)) {
            return "0x0906EB"; // Spoof as Comet Lake
        }

        // Rocket Lake (11th Gen)
        if (codename.includes("Rocket") || cpuName.match(/i\d-11\d{3}/)) {
            return "0x0906EB"; // Spoof as Comet Lake
        }

        // Comet Lake (10th Gen)
        if (codename.includes("Comet") || cpuName.match(/i\d-10\d{3}/)) {
            return "0x0906EB"; // Native Comet Lake ID
        }

        // Coffee Lake (8th/9th Gen)
        if (codename.includes("Coffee") || cpuName.match(/i\d-[89]\d{3}/)) {
            return "0x0906EA"; // Coffee Lake ID
        }

        // Kaby Lake (7th Gen)
        if (codename.includes("Kaby") || cpuName.match(/i\d-7\d{3}/)) {
            if (cpuName.includes("Pentium") || cpuName.includes("Celeron")) {
                return "0x0306A9"; // Ivy Bridge Spoof
            }
            return "0x0506E3"; // Kaby Lake ID
        }

        return "0x000000"; // No FakeCPUID
    }

    downloadConfigPlist() {
        if (!this.generatedConfig) {
            alert("No config generated yet!");
            return;
        }
        const blob = new Blob([this.generatedConfig], { type: "text/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.plist';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

window.CloverConfigGenerator = CloverConfigGenerator;
