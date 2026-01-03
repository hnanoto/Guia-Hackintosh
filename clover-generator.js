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

        // Build XML String directly
        // Note: Clover uses a different structure than OpenCore
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
                <true/>
                <key>AddHDMI</key>
                <true/>
                <key>AddIMEI</key>
                <false/>
                <key>AddMCHC</key>
                <false/>
                <key>AddPNLF</key>
                <true/>
                <key>DeleteUnused</key>
                <true/>
                <key>FakeLPC</key>
                <false/>
                <key>FixACST</key>
                <true/>
                <key>FixADP1</key>
                <true/>
                <key>FixAirport</key>
                <false/>
                <key>FixDarwin</key>
                <false/>
                <key>FixDarwin7</key>
                <true/>
                <key>FixDisplay</key>
                <true/>
                <key>FixFirewire</key>
                <false/>
                <key>FixHDA</key>
                <true/>
                <key>FixHPET</key>
                <true/>
                <key>FixIDE</key>
                <false/>
                <key>FixIPIC</key>
                <true/>
                <key>FixIntelGfx</key>
                <false/>
                <key>FixLAN</key>
                <true/>
                <key>FixMutex</key>
                <false/>
                <key>FixRTC</key>
                <true/>
                <key>FixRegions</key>
                <true/>
                <key>FixS3D</key>
                <true/>
                <key>FixSATA</key>
                <false/>
                <key>FixSBUS</key>
                <true/>
                <key>FixShutdown</key>
                <true/>
                <key>FixTMR</key>
                <true/>
                <key>FixUSB</key>
                <true/>
                <key>FixWAK</key>
                <true/>
            </dict>
            <key>Name</key>
            <string>DSDT.aml</string>
            <key>Modded</key>
            <false/>
            <key>Patches</key>
            <array>
                <dict>
                    <key>Comment</key>
                    <string>Rename GFX0 to IGPU</string>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>R0ZYMA==</data>
                    <key>Replace</key>
                    <data>SUdQVQ==</data>
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>Rename AZAL to HDAS</string>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>QVpBTA==</data>
                    <key>Replace</key>
                    <data>SERBUw==</data>
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
                </dict>
                <dict>
                    <key>Comment</key>
                    <string>Rename SAT0 to SATA</string>
                    <key>Disabled</key>
                    <false/>
                    <key>Find</key>
                    <data>U0FUMA==</data>
                    <key>Replace</key>
                    <data>U0FUQQ==</data>
                </dict>
            </array>
            <key>ReuseFFFF</key>
            <false/>
        </dict>
        <key>DisableASPM</key>
        <false/>
        <key>DropTables</key>
        <array>
            <dict>
                <key>Signature</key>
                <string>DMAR</string>
            </dict>
        </array>
        <key>FixHeaders</key>
        <true/>
        <key>FixMCFG</key>
        <true/>
        <key>HaltEnabler</key>
        <true/>
        <key>SSDT</key>
        <dict>
            <key>DoubleFirstState</key>
            <true/>
            <key>DropOem</key>
            <false/>
            <key>Generate</key>
            <dict>
                <key>CStates</key>
                <true/>
                <key>PStates</key>
                <true/>
                <key>PluginType</key>
                <true/>
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
        <string>${bootArgs}</string>
        <key>DefaultVolume</key>
        <string>LastBootedVolume</string>
        <key>Timeout</key>
        <integer>5</integer>
        <key>XMPDetection</key>
        <string>Yes</string>
        <key>Legacy</key>
        <string>PBR</string>
        <key>NeverHibernate</key>
        <true/>
        <key>Secure</key>
        <false/>
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
    </dict>
    <key>GUI</key>
    <dict>
        <key>Hide</key>
        <array>
            <string>Preboot</string>
            <string>Recovery</string>
        </array>
        <key>Scan</key>
        <dict>
            <key>Entries</key>
            <true/>
            <key>Tool</key>
            <true/>
            <key>Legacy</key>
            <false/>
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
                <string>USB Port Limit Patch 1</string>
                <key>Disabled</key>
                <false/>
                <key>Find</key>
                <data>g/sPDw==</data>
                <key>MatchOS</key>
                <string>10.15.x</string>
                <key>Name</key>
                <string>com.apple.iokit.IOUSBHostFamily</string>
                <key>Replace</key>
                <data>g/s/Dw==</data>
            </dict>
            <dict>
                <key>Comment</key>
                <string>USB Port Limit Patch 2</string>
                <key>Disabled</key>
                <false/>
                <key>Find</key>
                <data>g/kPDw==</data>
                <key>MatchOS</key>
                <string>10.15.x</string>
                <key>Name</key>
                <string>com.apple.driver.usb.AppleUSBXHCI</string>
                <key>Replace</key>
                <data>g/k/Dw==</data>
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
        <key>SetupVirtualMap</key>
        <true/>
        <key>SyncRuntimePermissions</key>
        <true/>
        <key>XhciPortLimit</key>
        <true/>
        <key>ProvideCurrentCpuInfo</key>
        <true/>
        <key>ProtectUefiServices</key>
        <true/>
        <key>CustomSMBIOSGuid</key>
        <true/>
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

        // Comet Lake (10th Gen) - Common Spoof for macOS compatibility
        if (codename.includes("Comet Lake") || cpuName.includes("10900") || cpuName.includes("10850") || cpuName.includes("10700") || cpuName.includes("10500") || cpuName.includes("10400")) {
            return "0x0706E5"; // Matches user's working config for Comet Lake
        }

        // Rocket Lake (11th Gen) - Needs Comet Lake Spoof
        if (codename.includes("Rocket Lake") || cpuName.includes("11900") || cpuName.includes("11700") || cpuName.includes("11400")) {
            return "0x0A0655"; // Or use Comet Lake 0x0906EB / 0x0706E5 depending on mobo
        }

        // Kaby Lake (7th Gen) - If spoofing is needed for Pentium/Celeron
        if (cpuName.includes("Pentium") || cpuName.includes("Celeron")) {
            return "0x0506E3"; // Skylake Spoof
        }

        return "0x000000"; // Disabled by default
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
