// ============================================================================
// CLOVER CONFIG GENERATOR - Extension for Legacy/Alternative Support
// Extends the main ConfigGenerator to produce Clover-compatible config.plist
// Uses templates based on Olarila EFIs for accurate configuration
// ============================================================================

console.log("Clover Generator v20 Loaded");

class CloverConfigGenerator extends ConfigGenerator {
    constructor() {
        super();
    }

    // Override generateConfig to produce Clover XML
    async generateConfig(hardwareData, macOSVersion) {
        this.hardwareData = hardwareData;
        this.selectedMacOS = macOSVersion;

        // Select appropriate template based on hardware
        const template = this.selectTemplate(hardwareData);
        console.log(`Selected Clover template: ${template ? template.platform : 'default'}`);

        // Use template SMBIOS if available, otherwise fall back to parent method
        const smbiosModel = template?.smbios || this.selectSMBIOS(hardwareData, macOSVersion);
        console.log(`Generating Clover config for ${smbiosModel}`);

        // Get boot args - merge template args with dynamic ones
        let bootArgs = template?.boot?.args || this.generateBootArgs(hardwareData, macOSVersion);

        // Helper for audio layout
        const audioLayout = this.getAudioLayout(hardwareData);

        // CPU and chipset detection
        const cpuName = hardwareData.CPU["Processor Name"] || "";
        const cpuCodename = hardwareData.CPU.Codename || "";
        const chipset = hardwareData.Motherboard.Chipset || "";
        const firmware = hardwareData.BIOS["Firmware Type"] || "UEFI";
        const cpuMan = hardwareData.CPU.Manufacturer || "Intel";
        const platform = hardwareData.Motherboard.Platform || "Desktop";
        const isLaptop = platform === "Laptop" || platform === "NUC";

        // Intel 12th Gen+ detection
        const isIntel12Plus = cpuCodename.includes("Alder") || cpuCodename.includes("Raptor") ||
            cpuCodename.includes("Meteor") || cpuCodename.includes("Arrow") ||
            cpuName.match(/i\d-1[2-5]\d{3}/) || cpuName.match(/Ultra\s*[579]/i);

        // AMD 500+ series chipset detection
        const isAMDNewer = chipset.match(/X570|B550|A520|TRX40|B650|X670/) !== null;

        // Add revcpu=1 for 12th Gen+ if not already present
        if (isIntel12Plus && !bootArgs.includes("revcpu=1")) {
            bootArgs += " revcpu=1 revcpuname=Intel®Core™Processor revpatch=cpuname,sbvmm,diskread,pci";
        }

        // Special configuration for MacPro7,1 and iMacPro1,1
        const isMacPro = smbiosModel.includes("MacPro") || smbiosModel.includes("iMacPro");

        // Generate dynamic configurations using template as base
        const dsdtFixes = this.generateDSDTFixesFromTemplate(hardwareData, template, isMacPro);
        const gfxConfig = this.generateGraphicsConfigFromTemplate(hardwareData, template);
        const kernelPatches = this.generateKernelPatchesFromTemplate(hardwareData, template);
        const quirksConfig = this.generateQuirksFromTemplate(hardwareData, template, macOSVersion);
        const rtVariables = this.generateRtVariablesFromTemplate(template, macOSVersion);

        // Specific Patches for Raptor Lake (13th Gen)
        let extraAcpiPatches = "";

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
        <${isMacPro}/>
        <key>DSDT</key>
        <dict>
            <key>Debug</key>
            <false/>
            <key>Fixes</key>
            <dict>
                <key>AddDTGP</key>
                <${dsdtFixes.AddDTGP}/>
                <key>AddHDMI</key>
                <${dsdtFixes.AddHDMI}/>
                <key>AddIMEI</key>
                <${dsdtFixes.AddIMEI}/>
                <key>AddMCHC</key>
                <${dsdtFixes.AddMCHC}/>
                <key>AddPNLF</key>
                <${dsdtFixes.AddPNLF}/>
                <key>DeleteUnused</key>
                <${dsdtFixes.DeleteUnused}/>
                <key>FakeLPC</key>
                <${dsdtFixes.FakeLPC}/>
                <key>FixACST</key>
                <${dsdtFixes.FixACST}/>
                <key>FixADP1</key>
                <${dsdtFixes.FixADP1}/>
                <key>FixAirport</key>
                <${dsdtFixes.FixAirport}/>
                <key>FixDarwin</key>
                <${dsdtFixes.FixDarwin}/>
                <key>FixDarwin7</key>
                <${dsdtFixes.FixDarwin7}/>
                <key>FixDisplay</key>
                <${dsdtFixes.FixDisplay}/>
                <key>FixFirewire</key>
                <${dsdtFixes.FixFirewire}/>
                <key>FixHDA</key>
                <${dsdtFixes.FixHDA}/>
                <key>FixHPET</key>
                <${dsdtFixes.FixHPET}/>
                <key>FixIDE</key>
                <${dsdtFixes.FixIDE}/>
                <key>FixIPIC</key>
                <${dsdtFixes.FixIPIC}/>
                <key>FixIntelGfx</key>
                <${dsdtFixes.FixIntelGfx}/>
                <key>FixLAN</key>
                <${dsdtFixes.FixLAN}/>
                <key>FixMutex</key>
                <${dsdtFixes.FixMutex}/>
                <key>FixRTC</key>
                <${dsdtFixes.FixRTC}/>
                <key>FixRegions</key>
                <${dsdtFixes.FixRegions}/>
                <key>FixS3D</key>
                <${dsdtFixes.FixS3D}/>
                <key>FixSATA</key>
                <${dsdtFixes.FixSATA}/>
                <key>FixSBUS</key>
                <${dsdtFixes.FixSBUS}/>
                <key>FixShutdown</key>
                <${dsdtFixes.FixShutdown}/>
                <key>FixTMR</key>
                <${dsdtFixes.FixTMR}/>
                <key>FixUSB</key>
                <${dsdtFixes.FixUSB}/>
                <key>FixWAK</key>
                <${dsdtFixes.FixWAK}/>
            </dict>
            <key>Name</key>
            <string>DSDT.aml</string>
            <key>PNLF_UID</key>
            <string>0x0A</string>
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
            <key>Rtc8Allowed</key>
            <true/>
            <key>SuspendOverride</key>
            <false/>
        </dict>
        <key>DisableASPM</key>
        <${isMacPro}/>
        <key>DisabledAML</key>
        <array>
            <string>SSDT-PLUG.aml</string>
            <string>SSDT-MINE.aml</string>
            <string>SSDT-OTHER.aml</string>
        </array>
        <key>DropTables</key>
        <array>
            <dict>
                <key>Signature</key>
                <string>DMAR</string>
            </dict>
            <dict>
                <key>Signature</key>
                <string>SSDT</string>
                <key>TableId</key>
                <string>CpuPm</string>
            </dict>
            <dict>
                <key>Length</key>
                <integer>720</integer>
                <key>Signature</key>
                <string>SSDT</string>
                <key>TableId</key>
                <string>Cpu0Ist</string>
            </dict>
            <dict>
                <key>DropForAllOS</key>
                <true/>
                <key>Signature</key>
                <string>BGRT</string>
            </dict>
        </array>
        <key>FixHeaders</key>
        <true/>
        <key>FixMCFG</key>
        <true/>
        <key>HaltEnabler</key>
        <true/>
        <key>PatchAPIC</key>
        <false/>
        <key>ResetAddress</key>
        <string>0x64</string>
        <key>ResetValue</key>
        <string>0xFE</string>
        <key>SSDT</key>
        <dict>
            <key>C3Latency</key>
            <string>0x03E7</string>
            <key>DoubleFirstState</key>
            <true/>
            <key>DropOem</key>
            <true/>
            <key>EnableC2</key>
            <false/>
            <key>EnableC4</key>
            <false/>
            <key>EnableC6</key>
            <true/>
            <key>EnableC7</key>
            <false/>
            <key>MaxMultiplier</key>
            <integer>12</integer>
            <key>MinMultiplier</key>
            <integer>8</integer>
            <key>NoDynamicExtract</key>
            <${isMacPro}/>
            <key>NoOemTableId</key>
            <${isMacPro}/>
            <key>PLimitDict</key>
            <integer>1</integer>
            <key>UnderVoltStep</key>
            <integer>1</integer>
            <key>UseSystemIO</key>
            <false/>
            <key>Generate</key>
            <dict>
                <key>APLF</key>
                <false/>
                <key>APSN</key>
                <false/>
                <key>PluginType</key>
                <false/>
                <key>CStates</key>
                <${!isMacPro}/>
                <key>PStates</key>
                <${!isMacPro}/>
            </dict>
        </dict>
        <key>SortedOrder</key>
        <array>
            <string>SSDT-3.aml</string>
            <string>SSDT-1.aml</string>
            <string>SSDT-2.aml</string>
        </array>
        <key>smartUPS</key>
        <false/>
    </dict>
    <key>Boot</key>
    <dict>
        <key>Arguments</key>
        <string>${bootArgs}</string>
        <key>CustomLogo</key>
        <false/>
        <key>Debug</key>
        <false/>
        <key>DefaultLoader</key>
        <string>boot.efi</string>
        <key>DefaultVolume</key>
        <string>LastBootedVolume</string>
        <key>DisableCloverHotkeys</key>
        <false/>
        <key>Fast</key>
        <false/>
        <key>Legacy</key>
        <string>PBR</string>
        <key>LegacyBiosDefaultEntry</key>
        <integer>0</integer>
        <key>NeverDoRecovery</key>
        <true/>
        <key>NeverHibernate</key>
        <${isMacPro}/>
        <key>NoEarlyProgress</key>
        <false/>
        <key>RtcHibernateAware</key>
        <false/>
        <key>SignatureFixup</key>
        <false/>
        <key>SkipHibernateTimeout</key>
        <false/>
        <key>StrictHibernate</key>
        <false/>
        <key>Timeout</key>
        <integer>5</integer>
        <key>XMPDetection</key>
        ${isMacPro ? "<integer>0</integer>" : "<string>-1</string>"}
    </dict>
    <key>BootGraphics</key>
    <dict>
        <key>DefaultBackgroundColor</key>
        <string>0xBFBFBF</string>
        <key>EFILoginHiDPI</key>
        <integer>1</integer>
        <key>UIScale</key>
        <integer>1</integer>
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
        <key>QPI</key>
        <integer>4800</integer>
        <key>SavingMode</key>
        <integer>7</integer>
        <key>TDP</key>
        <integer>95</integer>
        <key>TurboDisable</key>
        <false/>
        <key>Type</key>
        <string>0x0201</string>
        <key>UseARTFrequency</key>
        <true/>
    </dict>
    <key>Devices</key>
    <dict>
        <key>Audio</key>
        <dict>
            <key>AFGLowPowerState</key>
            <true/>
            <key>Inject</key>
            <string>${audioLayout}</string>
            <key>ResetHDA</key>
            <true/>
        </dict>
        <key>DisableFunctions</key>
        <string>0x18F6</string>
        <key>FakeID</key>
        <dict>
            <key>ATI</key>
            <string>0x67501002</string>
            <key>IMEI</key>
            <string>0x1e208086</string>
            <key>IntelGFX</key>
            <string>0x59168086</string>
            <key>LAN</key>
            <string>0x100E8086</string>
            <key>NVidia</key>
            <string>0x11de10de</string>
            <key>SATA</key>
            <string>0x26818086</string>
            <key>WIFI</key>
            <string>0x0030168C</string>
            <key>XHCI</key>
            <string>0xA12F8086</string>
        </dict>
        <key>ForceHPET</key>
        <false/>
        <key>HDMIInjection</key>
        <false/>
        <key>IntelMaxValue</key>
        <string>0x710</string>
        <key>LANInjection</key>
        <false/>
        <key>NoDefaultProperties</key>
        <false/>
        <key>Properties</key>
        ${this.generateDevicePropertiesFromTemplate(hardwareData, template, macOSVersion)}
        <key>SetIntelBacklight</key>
        <false/>
        <key>SetIntelMaxBacklight</key>
        <true/>
        <key>USB</key>
        <dict>
            <key>AddClockID</key>
            <true/>
            <key>FixOwnership</key>
            <true/>
            <key>HighCurrent</key>
            <false/>
            <key>Inject</key>
            <false/>
        </dict>
        <key>UseIntelHDMI</key>
        <false/>
    </dict>
    <key>DisableDrivers</key>
    <array>
        <string>CsmVideoDxe</string>
        <string>VBoxExt2</string>
    </array>
    <key>GUI</key>
    <dict>
        <key>ConsoleMode</key>
        <string>0</string>
        <key>CustomIcons</key>
        <false/>
        <key>EmbeddedThemeType</key>
        <string>Daytime</string>
        <key>Hide</key>
        <array>
            <string>Windows</string>
            <string>BOOTX64.EFI</string>
        </array>
        <key>KbdPrevLang</key>
        <false/>
        <key>Language</key>
        <string>en:0</string>
        <key>Mouse</key>
        <dict>
            <key>DoubleClickTime</key>
            <integer>500</integer>
            <key>Enabled</key>
            <true/>
            <key>Mirror</key>
            <false/>
            <key>Speed</key>
            <integer>2</integer>
        </dict>
        <key>PlayAsync</key>
        <false/>
        <key>ProvideConsoleGop</key>
        <true/>
        <key>Scan</key>
        <dict>
            <key>Entries</key>
            <true/>
            <key>Legacy</key>
            <false/>
            <key>Tool</key>
            <true/>
        </dict>
        <key>ScreenResolution</key>
        <string>1600x900</string>
        <key>ShowOptimus</key>
        <false/>
        <key>TextOnly</key>
        <false/>
        <key>Theme</key>
        <string>cesium</string>
        <key>Timezone</key>
        <integer>3</integer>
    </dict>
    <key>Graphics</key>
    <dict>
        <key>DualLink</key>
        <integer>0</integer>
        <key>EDID</key>
        <dict>
            <key>Custom</key>
            <data>AP///////wAGECGSAAAAAAASAQOAIRV4CunVmVlTjigmUFQAAAABAQEBAQEBAQEBAQEBAQEB3iGgcFCEHzAgIFYAS88QAAAY3iGgcFCEHzAgIFYAS88QAAAAAAAA/gBXNjU3RwAxNTRXUDEKAAAA/gAjMz1IZYSq/wIBCiAgAJo=</data>
            <key>HorizontalSyncPulseWidth</key>
            <string>0x11</string>
            <key>Inject</key>
            <true/>
            <key>ProductID</key>
            <string>0x9221</string>
            <key>VendorID</key>
            <string>0x1006</string>
            <key>VideoInputSignal</key>
            <string>0xA1</string>
        </dict>
        <key>FBName</key>
        <string>Makakakakala</string>
        <key>Inject</key>
        <dict>
            <key>ATI</key>
            <${isMacPro ? "false" : gfxConfig.InjectATI}/>
            <key>Intel</key>
            <${gfxConfig.InjectIntel}/>
            <key>NVidia</key>
            <${gfxConfig.InjectNVidia}/>
        </dict>
        <key>LoadVBios</key>
        <${gfxConfig.LoadVBios}/>
        <key>NVCAP</key>
        <string>04000000000003000C0000000000000A00000000</string>
        <key>NvidiaGeneric</key>
        <true/>
        <key>NvidiaNoEFI</key>
        <false/>
        <key>NvidiaSingle</key>
        <false/>
        <key>PatchVBios</key>
        <false/>
        <key>PatchVBiosBytes</key>
        <array>
            <dict>
                <key>Find</key>
                <data>gAeoAqAF</data>
                <key>Replace</key>
                <data>gAeoAjgE</data>
            </dict>
        </array>
        <key>RadeonDeInit</key>
        <${gfxConfig.RadeonDeInit}/>
        <key>VRAM</key>
        <integer>1024</integer>
        <key>VideoPorts</key>
        <integer>2</integer>
        <key>display-cfg</key>
        <string>03010300FFFF0001</string>
        <key>ig-platform-id</key>
        <string>${gfxConfig.igPlatformId || "0x00000000"}</string>
    </dict>
    <key>KernelAndKextPatches</key>
    <dict>
        <key>#ATIConnectorsController</key>
        <string>6000</string>
        <key>#ATIConnectorsData</key>
        <string>000400000403000000010000210302040400000014020000000100000000040310000000100000000001000000000001</string>
        <key>#ATIConnectorsPatch</key>
        <string>040000001402000000010000000004040004000004030000000100001102010500000000000000000000000000000000</string>
        <key>#BootPatches</key>
        <array>
            <dict>
                <key>Comment</key>
                <string>Example</string>
                <key>Disabled</key>
                <true/>
                <key>Find</key>
                <data>RXh0ZXJuYWw=</data>
                <key>MatchOS</key>
                <string>All</string>
                <key>Replace</key>
                <data>SW50ZXJuYWw=</data>
            </dict>
        </array>
        <key>#FakeCPUID</key>
        <string>0x010676</string>
        <key>#ForceKextsToLoad</key>
        <array>
            <string>\\System\\Library\\Extensions\\AMD6000Controller.kext</string>
            <string>\\System\\Library\\Extensions\\AMDFramebuffer.kext</string>
        </array>
        <key>AppleIntelCPUPM</key>
        <${kernelPatches.AppleIntelCPUPM}/>
        <key>AppleRTC</key>
        <${kernelPatches.AppleRTC}/>
        <key>BlockSkywalk</key>
        <${kernelPatches.BlockSkywalk}/>
        <key>Debug</key>
        <false/>
        <key>DellSMBIOSPatch</key>
        <${kernelPatches.DellSMBIOSPatch}/>
        <key>EightApple</key>
        <true/>
        <key>FakeCPUID</key>
        <string>${isMacPro ? "0x0706E5" : this.calculateFakeCPUID(hardwareData)}</string>
        <key>KernelLapic</key>
        <${kernelPatches.KernelLapic}/>
        <key>KernelPm</key>
        <${isMacPro ? "true" : kernelPatches.KernelPm}/>
        <key>KernelXCPM</key>
        <${isMacPro ? "false" : kernelPatches.KernelXcpm}/>
        <key>PanicNoKextDump</key>
        <${kernelPatches.PanicNoKextDump}/>
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
        <key>AppleXcpmExtraMsrs</key>
        <false/>
        <key>AppleXcpmForceBoost</key>
        <false/>
        <key>AvoidRuntimeDefrag</key>
        <${quirksConfig.AvoidRuntimeDefrag}/>
        <key>ClearTaskSwitchBit</key>
        <false/>
        <key>DevirtualiseMmio</key>
        <${quirksConfig.DevirtualiseMmio}/>
        <key>DisableIoMapper</key>
        <${quirksConfig.DisableIoMapper}/>
        <key>DisableIoMapperMapping</key>
        <false/>
        <key>DisableLinkeditJettison</key>
        <${quirksConfig.DisableLinkeditJettison}/>
        <key>DisableSingleUser</key>
        <${quirksConfig.DisableSingleUser}/>
        <key>DisableVariableWrite</key>
        <${quirksConfig.DisableVariableWrite}/>
        <key>DiscardHibernateMap</key>
        <${quirksConfig.DiscardHibernateMap}/>
        <key>DummyPowerManagement</key>
        <${quirksConfig.DummyPowerManagement}/>
        <key>EnableSafeModeSlide</key>
        <${quirksConfig.EnableSafeModeSlide}/>
        <key>EnableWriteUnprotector</key>
        <${quirksConfig.EnableWriteUnprotector}/>
        <key>ExtendBTFeatureFlags</key>
        <false/>
        <key>ExternalDiskIcons</key>
        <${quirksConfig.ExternalDiskIcons}/>
        <key>ForceAquantiaEthernet</key>
        <false/>
        <key>ForceExitBootServices</key>
        <${quirksConfig.ForceExitBootServices}/>
        <key>ForceOcWriteFlash</key>
        <${quirksConfig.ForceOcWriteFlash}/>
        <key>FuzzyMatch</key>
        <${quirksConfig.FuzzyMatch}/>
        <key>IncreasePciBarSize</key>
        <${quirksConfig.IncreasePciBarSize}/>
        <key>KernelCache</key>
        <string>${quirksConfig.KernelCache}</string>
        <key>MmioWhitelist</key>
        <array>
            <dict>
                <key>Address</key>
                <integer>4275159040</integer>
                <key>Comment</key>
                <string>Haswell: SB_RCBA is a 0x4 page memory region, containing SPI_BASE at 0x3800 (SPI_BASE_ADDRESS)</string>
                <key>Enabled</key>
                <false/>
            </dict>
            <dict>
                <key>Address</key>
                <integer>4278190080</integer>
                <key>Comment</key>
                <string>Generic: PCI root is a 0x1000 page memory region used by some firmwares</string>
                <key>Enabled</key>
                <false/>
            </dict>
        </array>
        <key>PowerTimeoutKernelPanic</key>
        <${quirksConfig.PowerTimeoutKernelPanic}/>
        <key>ProtectMemoryRegions</key>
        <${quirksConfig.ProtectMemoryRegions}/>
        <key>ProtectSecureBoot</key>
        <${quirksConfig.ProtectSecureBoot}/>
        <key>ProtectUefiServices</key>
        <${quirksConfig.ProtectUefiServices}/>
        <key>ProvideCurrentCpuInfo</key>
        <${quirksConfig.ProvideCurrentCpuInfo}/>
        <key>AutoModernCPUQuirks</key>
        <${isMacPro}/>
        <key>ProvideCustomSlide</key>
        <${quirksConfig.ProvideCustomSlide}/>
        <key>ProvideMaxSlide</key>
        <integer>${quirksConfig.ProvideMaxSlide}</integer>
        <key>RebuildAppleMemoryMap</key>
        <${quirksConfig.RebuildAppleMemoryMap}/>
        <key>ResizeAppleGpuBars</key>
        <integer>${quirksConfig.ResizeAppleGpuBars}</integer>
        <key>ResizeGpuBars</key>
        <integer>${isMacPro ? "0" : "-1"}</integer>
        <key>SetupVirtualMap</key>
        <${quirksConfig.SetupVirtualMap}/>
        <key>SignalAppleOS</key>
        <${quirksConfig.SignalAppleOS}/>
        <key>SyncRuntimePermissions</key>
        <${quirksConfig.SyncRuntimePermissions}/>
        <key>ThirdPartyDrives</key>
        <${quirksConfig.ThirdPartyDrives}/>
        <key>TscSyncTimeout</key>
        <integer>0</integer>
        <key>XhciPortLimit</key>
        <${quirksConfig.XhciPortLimit}/>
    </dict>
    <key>RtVariables</key>
    <dict>
        <key>Block</key>
        <array>
            <dict>
                <key>Comment</key>
                <string>Dell variables</string>
                <key>Disabled</key>
                <true/>
                <key>Guid</key>
                <string>FF2E9FC7-D16F-434A-A24E-C99519B7EB93</string>
                <key>Name</key>
                <string>*</string>
            </dict>
        </array>
        <key>BooterConfig</key>
        <string>${rtVariables.BooterConfig}</string>
        <key>CsrActiveConfig</key>
        <string>${rtVariables.CsrActiveConfig}</string>
        <key>HWTarget</key>
        <string>${this.getHWTarget(smbiosModel)}</string>
        <key>MLB</key>
        <string>${this.generateRandomMLB()}</string>
        <key>ROM</key>
        <string>${rtVariables.ROM}</string>
    </dict>
    <key>SMBIOS</key>
    <dict>
        <key>BiosReleaseDate</key>
        <string>05/03/10</string>
        <key>BiosVendor</key>
        <string>Apple Inc.</string>
        <key>BiosVersion</key>
        <string>IM131.88Z.F000.B00.1907241303</string>
        <key>Board-ID</key>
        <string>${this.getBoardId(smbiosModel)}</string>
        <key>BoardManufacturer</key>
        <string>Apple Inc.</string>
        <key>BoardSerialNumber</key>
        <string>${this.generateRandomBoardSerial()}</string>
        <key>BoardType</key>
        <integer>10</integer>
        <key>BoardVersion</key>
        <string>Proto1</string>
        <key>ChassisAssetTag</key>
        <string>Desktop</string>
        <key>ChassisManufacturer</key>
        <string>Apple Inc.</string>
        <key>ChassisType</key>
        <integer>16</integer>
        <key>EfiVersion</key>
        <string>288.0.0.0.0</string>
        <key>ExtendedFirmwareFeatures</key>
        <string>0x8FE001403</string>
        <key>ExtendedFirmwareFeaturesMask</key>
        <string>0xFFFFFFFFFF</string>
        <key>FakeCPUID</key>
        <string>0x0406E1</string>
        <key>Family</key>
        <string>${smbiosModel.includes("MacPro") ? "Mac Pro" : smbiosModel.includes("MacBook") ? "MacBook Pro" : smbiosModel.includes("Macmini") ? "Mac mini" : smbiosModel.includes("iMacPro") ? "iMac Pro" : "iMac"}</string>
        <key>FirmwareFeatures</key>
        <string>0xC0001403</string>
        <key>FirmwareFeaturesMask</key>
        <string>0xFFFFFFFF</string>
        <key>LocationInChassis</key>
        <string>Part Component</string>
        <key>Manufacturer</key>
        <string>Apple Inc.</string>
        <key>Memory</key>
        <dict>
            <key>Channels</key>
            <integer>2</integer>
            <key>Modules</key>
            <array>
                <dict>
                    <key>Frequency</key>
                    <integer>1333</integer>
                    <key>Part</key>
                    <string>C0001403</string>
                    <key>Serial</key>
                    <string>00001001</string>
                    <key>Size</key>
                    <integer>4096</integer>
                    <key>Slot</key>
                    <integer>0</integer>
                    <key>Type</key>
                    <string>DDR3</string>
                    <key>Vendor</key>
                    <string>Kingston</string>
                </dict>
                <dict>
                    <key>Frequency</key>
                    <integer>1333</integer>
                    <key>Part</key>
                    <string>C0001404</string>
                    <key>Serial</key>
                    <string>00001002</string>
                    <key>Size</key>
                    <integer>4096</integer>
                    <key>Slot</key>
                    <integer>2</integer>
                    <key>Type</key>
                    <string>DDR3</string>
                    <key>Vendor</key>
                    <string>Kingston</string>
                </dict>
            </array>
            <key>SlotCount</key>
            <integer>4</integer>
        </dict>
        <key>MemoryRank</key>
        <integer>2</integer>
        <key>Mobile</key>
        <${isLaptop}/>
        <key>NoRomInfo</key>
        <false/>
        <key>PlatformFeature</key>
        <string>0x00</string>
        <key>ProductName</key>
        <string>${smbiosModel}</string>
        <key>SerialNumber</key>
        <string>${this.generateRandomSerial(smbiosModel)}</string>
        <key>Slots</key>
        <array>
            <dict>
                <key>Device</key>
                <string>ATI</string>
                <key>ID</key>
                <integer>1</integer>
                <key>Name</key>
                <string>PCIe Slot 0</string>
                <key>Type</key>
                <integer>16</integer>
            </dict>
            <dict>
                <key>Device</key>
                <string>WIFI</string>
                <key>ID</key>
                <integer>0</integer>
                <key>Name</key>
                <string>Airport</string>
                <key>Type</key>
                <integer>1</integer>
            </dict>
        </array>
        <key>SmUUID</key>
        <string>${this.generateRandomUUID()}</string>
        <key>SmbiosVersion</key>
        <string>0x0300</string>
        <key>Trust</key>
        <true/>
        <key>Version</key>
        <string>1.0</string>
    </dict>
    <key>SystemParameters</key>
    <dict>
        <key>BacklightLevel</key>
        <string>0x0501</string>
        <key>CustomUUID</key>
        <string>${this.generateRandomUUID()}</string>
        <key>InjectKexts</key>
        <true/>
        <key>InjectSystemID</key>
        <true/>
        <key>NoCaches</key>
        <false/>
        <key>NvidiaWeb</key>
        <false/>
    </dict>
</dict>
</plist>`;

        this.generatedConfig = config;
        return config; // Return string, not object
    }

    generateDevicePropertiesXML(hw, macOS) {
        const props = super.generateDeviceProperties(hw, macOS);
        if (!props || Object.keys(props).length === 0) return "<dict/>";

        let xml = "<dict>\n";
        for (const [pciPath, devProps] of Object.entries(props)) {
            xml += "            <key>" + pciPath + "</key>\n";
            xml += "            <dict>\n";
            for (const [key, val] of Object.entries(devProps)) {
                xml += "                <key>" + key + "</key>\n";
                if (typeof val === 'object' && val._isData) {
                    xml += "                <data>" + this.hexToBase64(val.value) + "</data>\n";
                } else if (typeof val === 'number') {
                    xml += "                <integer>" + val + "</integer>\n";
                } else {
                    xml += "                <string>" + val + "</string>\n";
                }
            }
            xml += "            </dict>\n";
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

    // ========================================================================
    // CLOVER-SPECIFIC QUIRKS OVERRIDES
    // Note: Clover handles memory differently than OpenCore. User testing on
    // Gigabyte Z690 confirmed that EnableWriteUnprotector=true works better.
    // ========================================================================

    // Override: For Clover, Z690/Z790 needs EnableWriteUnprotector=TRUE
    // This is OPPOSITE to OpenCore where these chipsets use RebuildAppleMemoryMap
    needsWriteUnprotector(hw) {
        const cpuManufacturer = hw.CPU.Manufacturer;
        const chipset = hw.Motherboard.Chipset || "";

        // AMD uses RebuildAppleMemoryMap instead
        if (cpuManufacturer === "AMD") return false;

        // For Clover on Intel Z690/Z790, EnableWriteUnprotector works better
        // (Opposite of OpenCore logic - validated on Gigabyte Z690)
        if (chipset.match(/Z[6-7]90/)) return true; // Z690, Z790 for Clover
        if (chipset.match(/B[6-7]60/)) return true; // B660, B760 for Clover

        // Z390, Z490, Z590 follow standard Clover logic
        if (chipset.match(/Z[345]90/)) return false;
        if (chipset.match(/B[45]60/)) return false;

        // Default for older systems
        return true;
    }

    // Override: DevirtualiseMmio needed for Z490+ and AMD 500+
    needsDevirtualiseMmio(chipset, cpuCodename) {
        // Intel Z490+ and AMD X570/B550+ need DevirtualiseMmio
        if (chipset.match(/Z[4-7]90|B[4-7]60|X570|B550|A520|TRX40|B650|X670/)) {
            return true;
        }
        // Also for Alder Lake and newer
        if (cpuCodename.match(/Alder|Raptor|Meteor|Arrow/)) {
            return true;
        }
        return false;
    }

    // Override: ProtectUefiServices for Z390+
    needsProtectUefiServices(chipset) {
        return chipset.match(/Z[3-7]90|B[4-7]60/) !== null;
    }

    // ========================================================================
    // DYNAMIC CONFIG GENERATION HELPERS
    // ========================================================================

    // Generate DSDT Fixes based on platform (Desktop/Laptop) and SMBIOS
    generateDSDTFixes(hw, isMacPro = false) {
        const platform = hw.Motherboard.Platform || "Desktop";
        const isLaptop = platform === "Laptop" || platform === "NUC";

        // For MacPro7,1 and iMacPro1,1, use minimal fixes (validated working config)
        if (isMacPro) {
            return {
                AddDTGP: false,
                AddHDMI: false,
                AddIMEI: false,
                AddMCHC: false,
                AddPNLF: false,
                DeleteUnused: true,
                FakeLPC: false,
                FixACST: false,
                FixADP1: false,
                FixAirport: false,
                FixDarwin: false,
                FixDarwin7: false,
                FixDisplay: false,
                FixFirewire: false,
                FixHDA: false,
                FixHPET: false,
                FixIDE: false,
                FixIPIC: false,
                FixIntelGfx: false,
                FixLAN: false,
                FixMutex: true,
                FixRTC: false,
                FixRegions: false,
                FixS3D: false,
                FixSATA: false,
                FixSBUS: true,
                FixShutdown: true,
                FixTMR: false,
                FixUSB: false,
                FixWAK: false
            };
        }

        // Standard configuration for other SMBIOS models
        return {
            AddDTGP: true,
            AddHDMI: !isLaptop,
            AddIMEI: false,
            AddMCHC: false,
            AddPNLF: isLaptop,
            DeleteUnused: true,
            FakeLPC: false,
            FixACST: true,
            FixADP1: isLaptop,
            FixAirport: false,
            FixDarwin: false,
            FixDarwin7: true,
            FixDisplay: true,
            FixFirewire: false,
            FixHDA: true,
            FixHPET: true,
            FixIDE: false,
            FixIPIC: true,
            FixIntelGfx: false,
            FixLAN: true,
            FixMutex: false,
            FixRTC: true,
            FixRegions: true,
            FixS3D: !isLaptop,
            FixSATA: false,
            FixSBUS: true,
            FixShutdown: true,
            FixTMR: true,
            FixUSB: true,
            FixWAK: true
        };
    }

    // Generate Graphics config based on detected GPU
    generateGraphicsConfig(hw) {
        const gpu = Object.values(hw.GPU || {})[0] || {};
        const gpuName = gpu["Device Name"] || gpu.Manufacturer || "";
        const cpuCodename = hw.CPU.Codename || "";
        const platform = hw.Motherboard.Platform || "Desktop";
        const isLaptop = platform === "Laptop";

        let config = {
            InjectATI: false,
            InjectIntel: false,
            InjectNVidia: false,
            igPlatformId: "",
            RadeonDeInit: false,
            LoadVBios: false
        };

        // Detect GPU type
        if (gpuName.match(/Radeon|RX|AMD/i) || gpu.Manufacturer === "AMD") {
            config.InjectATI = true;
            config.RadeonDeInit = true;
            // Navi cards (RX 5000/6000/7000)
            if (gpuName.match(/RX\s*[567]\d{3}/i)) {
                config.RadeonDeInit = false; // Navi doesn't need DeInit
            }
        } else if (gpuName.match(/NVIDIA|GeForce|GTX|RTX/i) || gpu.Manufacturer === "NVIDIA") {
            config.InjectNVidia = true;
            config.LoadVBios = true;
        } else if (gpuName.match(/Intel|UHD|HD\s*\d{3}/i) || gpu["Device Type"] === "Integrated GPU") {
            config.InjectIntel = true;

            // ig-platform-id based on CPU generation
            if (cpuCodename.includes("Coffee") || cpuCodename.includes("Comet")) {
                config.igPlatformId = isLaptop ? "0x3EA50009" : "0x3E9B0007"; // UHD 630
            } else if (cpuCodename.includes("Kaby")) {
                config.igPlatformId = isLaptop ? "0x59160000" : "0x59120000"; // HD 630
            } else if (cpuCodename.includes("Skylake")) {
                config.igPlatformId = isLaptop ? "0x19160000" : "0x19120000"; // HD 530
            } else if (cpuCodename.includes("Haswell")) {
                config.igPlatformId = isLaptop ? "0x0A260006" : "0x0D220003"; // HD 4600
            } else if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor")) {
                config.igPlatformId = "0x46A60003"; // UHD 770 (usually headless)
                config.InjectIntel = false; // 12th+ gen iGPU usually disabled for dGPU
            }
        }

        return config;
    }

    // Generate KernelAndKextPatches based on CPU
    generateKernelPatches(hw) {
        const cpuMan = hw.CPU.Manufacturer || "Intel";
        const cpuCodename = hw.CPU.Codename || "";
        const cpuName = hw.CPU["Processor Name"] || "";

        return {
            AppleIntelCPUPM: cpuCodename.includes("Sandy") || cpuCodename.includes("Ivy"),
            AppleRTC: true,
            BlockSkywalk: true, // Sonoma+ needs this
            DellSMBIOSPatch: (hw.Motherboard.Name || "").includes("Dell"),
            KernelCpu: false,
            KernelLapic: cpuCodename.includes("Sandy") || cpuCodename.includes("Ivy"),
            KernelPm: cpuCodename.includes("Haswell") || cpuCodename.includes("Broadwell"),
            KernelXcpm: cpuMan === "Intel" && !cpuCodename.includes("Sandy") && !cpuCodename.includes("Ivy"),
            PanicNoKextDump: true
        };
    }

    // Generate ig-platform-id for Intel iGPU
    getIgPlatformId(hw) {
        const gfx = this.generateGraphicsConfig(hw);
        return gfx.igPlatformId || "0x00000000";
    }

    // Get Audio Layout ID
    getAudioLayout(hw) {
        if (!hw.Sound) return 1;

        const codecMap = {
            "10EC-1220": 1,  // Realtek ALC1220
            "10EC-1200": 1,  // Realtek ALC1200
            "10EC-0892": 1,  // Realtek ALC892
            "10EC-0887": 1,  // Realtek ALC887
            "10EC-0256": 11, // Realtek ALC256
            "10EC-0295": 3,  // Realtek ALC295
            "10EC-0298": 3,  // Realtek ALC298
            "10EC-0897": 66, // Realtek ALC897
            "10EC-0700": 11  // Realtek ALC700
        };

        for (const [name, props] of Object.entries(hw.Sound)) {
            const deviceId = props["Device ID"];
            if (deviceId && codecMap[deviceId]) {
                return codecMap[deviceId];
            }
        }
        return 1; // Default layout
    }

    // ========================================================================
    // SMBIOS & CSR HELPER FUNCTIONS
    // ========================================================================

    // CSR (SIP) values by macOS version
    getCsrActiveConfig(macOS) {
        if (!macOS) return "0x803"; // Safe default for Monterey+

        const darwinMajor = parseInt(macOS.darwin.split('.')[0]);

        // Catalina (10.15) and earlier: 0x67 (full SIP disable)
        if (darwinMajor < 20) return "0x67";

        // Big Sur (11.0) Darwin 20: 0x803
        if (darwinMajor < 21) return "0x803";

        // Monterey (12.0) Darwin 21: 0x803
        if (darwinMajor < 22) return "0x803";

        // Ventura (13.0) Darwin 22: 0xFEF (includes more flags)
        if (darwinMajor < 23) return "0xFEF";

        // Sonoma (14.0) Darwin 23+: 0xFEF
        // Sequoia (15.0) Darwin 24+: 0xFEF
        return "0xFEF";
    }

    // HWTarget based on SMBIOS model
    getHWTarget(smbiosModel) {
        const hwTargetMap = {
            "MacPro7,1": "J160",
            "iMacPro1,1": "J137",
            "iMac20,1": "J185",
            "iMac20,2": "J185F",
            "iMac19,1": "J132",
            "iMac19,2": "J133",
            "MacBookPro16,1": "J152F",
            "MacBookPro16,2": "J215",
            "MacBookPro15,1": "J132",
            "MacBookPro15,2": "J133",
            "Macmini8,1": "J174"
        };
        return hwTargetMap[smbiosModel] || "J160";
    }

    // Board-ID based on SMBIOS model
    getBoardId(smbiosModel) {
        const boardIdMap = {
            "MacPro7,1": "Mac-27AD2F918AE68F61",
            "iMacPro1,1": "Mac-7BA5B2D9E42DDD94",
            "iMac20,1": "Mac-CFF7D910A743CAAF",
            "iMac20,2": "Mac-AF89B6D9451A490B",
            "iMac19,1": "Mac-AA95B1DDAB278B95",
            "iMac19,2": "Mac-63001698E7A34814",
            "MacBookPro16,1": "Mac-E1008331FDC96864",
            "MacBookPro16,2": "Mac-5F9802EFE386AA28",
            "MacBookPro15,1": "Mac-937A206F2EE63C01",
            "MacBookPro15,2": "Mac-827FB448E656EC26",
            "Macmini8,1": "Mac-7BA5B2DFE22DDD8C"
        };
        return boardIdMap[smbiosModel] || "Mac-27AD2F918AE68F61";
    }

    // Generate random serial number (12 characters)
    generateRandomSerial(smbiosModel) {
        // Serial format: PPPPYWWSSSSS (PPP=model, Y=year, WW=week, SSSSS=random)
        const chars = "CDFGHJKLMNPQRSTVWXYZ0123456789";

        // Model prefixes
        const prefixMap = {
            "MacPro7,1": "F5K",
            "iMacPro1,1": "C02",
            "iMac20,1": "C02",
            "iMac20,2": "C02",
            "iMac19,1": "C02",
            "iMac19,2": "C02",
            "MacBookPro16,1": "C02",
            "MacBookPro16,2": "C02",
            "MacBookPro15,1": "C02",
            "MacBookPro15,2": "C02",
            "Macmini8,1": "C07"
        };

        const prefix = prefixMap[smbiosModel] || "C02";
        let serial = prefix;

        // Add random suffix (9 more chars for 12 total)
        for (let i = 0; i < 9; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return serial;
    }

    // Generate random board serial (17 characters)
    generateRandomBoardSerial() {
        const chars = "CDFGHJKLMNPQRSTVWXYZ0123456789";
        let serial = "C02";

        for (let i = 0; i < 14; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return serial;
    }

    // Generate random MLB (17 characters)
    generateRandomMLB() {
        const chars = "CDFGHJKLMNPQRSTVWXYZ0123456789";
        let mlb = "C02";

        for (let i = 0; i < 14; i++) {
            mlb += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return mlb;
    }

    // Generate random UUID (v4 format)
    generateRandomUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).toUpperCase();
        });
    }

    // ========================================================================
    // TEMPLATE-BASED CONFIG GENERATION
    // ========================================================================

    // Select the appropriate template based on hardware
    selectTemplate(hw) {
        // Use global selectCloverTemplate if available
        if (typeof selectCloverTemplate === 'function') {
            return selectCloverTemplate(hw);
        }
        return null; // Fall back to dynamic generation
    }

    // Generate DSDT fixes from template or fallback to dynamic
    generateDSDTFixesFromTemplate(hw, template, isMacPro) {
        if (!template?.acpi?.dsdt?.fixes) {
            return this.generateDSDTFixes(hw, isMacPro);
        }

        const templateFixes = template.acpi.dsdt.fixes;
        const platform = hw.Motherboard.Platform || "Desktop";
        const isLaptop = platform === "Laptop" || platform === "NUC";

        // Start with template fixes and merge with dynamic ones
        // IMPORTANT: All properties used in the XML template MUST be included here
        return {
            AddDTGP: templateFixes.AddDTGP || false,
            AddHDMI: templateFixes.AddHDMI || false,
            AddIMEI: templateFixes.AddIMEI || false,
            AddMCHC: templateFixes.AddMCHC || false,
            AddPNLF: templateFixes.AddPNLF || isLaptop,
            DeleteUnused: templateFixes.DeleteUnused || false,
            FakeLPC: templateFixes.FakeLPC || false,
            FixACST: templateFixes.FixACST || false,
            FixADP1: templateFixes.FixADP1 || isLaptop,
            FixAirport: templateFixes.FixAirport || false,
            FixDarwin: templateFixes.FixDarwin || false,
            FixDarwin7: templateFixes.FixDarwin7 || false,
            FixDisplay: templateFixes.FixDisplay || false,
            FixFirewire: templateFixes.FixFirewire || false,
            FixHDA: templateFixes.FixHDA || false,
            FixHPET: templateFixes.FixHPET || false,
            FixIDE: templateFixes.FixIDE || false,
            FixIPIC: templateFixes.FixIPIC || true,
            FixIntelGfx: templateFixes.FixIntelGfx || false,
            FixLAN: templateFixes.FixLAN || false,
            FixMutex: templateFixes.FixMutex || false,
            FixRTC: templateFixes.FixRTC || true,
            FixRegions: templateFixes.FixRegions || true,
            FixS3D: templateFixes.FixS3D || !isLaptop,
            FixSATA: templateFixes.FixSATA || false,
            FixSBUS: templateFixes.FixSBUS || false,
            FixShutdown: templateFixes.FixShutdown || false,
            FixTMR: templateFixes.FixTMR || true,
            FixUSB: templateFixes.FixUSB || false,
            FixWAK: templateFixes.FixWAK || false
        };
    }

    // Generate Graphics config from template or fallback to dynamic
    generateGraphicsConfigFromTemplate(hw, template) {
        if (!template?.graphics) {
            return this.generateGraphicsConfig(hw);
        }

        const tGfx = template.graphics;
        const dynamicGfx = this.generateGraphicsConfig(hw);

        return {
            InjectATI: tGfx.injectATI ?? dynamicGfx.InjectATI,
            InjectIntel: tGfx.injectIntel ?? dynamicGfx.InjectIntel,
            InjectNVidia: tGfx.injectNVidia ?? dynamicGfx.InjectNVidia,
            igPlatformId: tGfx.igPlatformId || dynamicGfx.igPlatformId,
            RadeonDeInit: tGfx.radeonDeInit ?? dynamicGfx.RadeonDeInit,
            LoadVBios: dynamicGfx.LoadVBios || false,
            EDID: { Inject: tGfx.backlight ?? false }
        };
    }

    // Generate Kernel patches from template or fallback to dynamic
    generateDevicePropertiesFromTemplate(hw, template, macOS) {
        if (!template?.deviceProperties) return "<dict/>";

        let xml = "<dict>\n";

        const reverseHex = (hex) => {
            if (!hex) return "";
            const clean = hex.replace(/^0x/, '');
            if (clean.length % 2 !== 0) return clean;
            const pairs = clean.match(/.{1,2}/g);
            return pairs ? pairs.reverse().join('') : clean;
        };

        const gfx = this.generateGraphicsConfig(hw);
        const audio = this.generateAudioProperties(hw);
        const layoutIdHex = audio?.properties?.["layout-id"]?.value || "01000000";

        for (const [pciPath, props] of Object.entries(template.deviceProperties)) {
            xml += `            <key>${pciPath}</key>\n`;
            xml += "            <dict>\n";

            for (const [key, val] of Object.entries(props)) {
                let finalVal = val;
                let isData = false;

                if (typeof val === 'string') {
                    if (val.includes("{{IG_PLATFORM_ID}}")) {
                        // Ensure we have a valid platform ID, fallback to template default if needed?
                        // Actually, gfx.igPlatformId comes from dynamic detection.
                        finalVal = reverseHex(gfx.igPlatformId || "00000000");
                        isData = true;
                    } else if (val.includes("{{DEVICE_ID}}")) {
                        finalVal = "00000000"; // Placeholder default
                        isData = true;
                    } else if (val.includes("{{LAYOUT_ID}}")) {
                        finalVal = layoutIdHex;
                        isData = true;
                    } else if (/^[0-9A-Fa-f]+$/.test(val)) {
                        // Heuristic for hex strings meant to be data
                        if (key.includes("AAPL") || key.includes("device") || key.includes("framebuffer") || key.includes("data") || key.startsWith("@")) {
                            isData = true;
                        }
                    }
                }

                xml += `                <key>${key}</key>\n`;
                if (typeof finalVal === 'number') {
                    xml += `                <integer>${finalVal}</integer>\n`;
                } else if (isData) {
                    // Check if already is hex string, convert to base64
                    // If it's already base64 (from ConfigGenerator parent), handle it?
                    // No, parent returns hex value object. We extracted value.
                    xml += `                <data>${this.hexToBase64(finalVal)}</data>\n`;
                } else {
                    xml += `                <string>${finalVal}</string>\n`;
                }
            }
            xml += "            </dict>\n";
        }
        xml += "        </dict>";
        return xml;
    }

    generateKernelPatchesFromTemplate(hw, template) {
        if (!template?.kernel) {
            return this.generateKernelPatches(hw);
        }

        const tKernel = template.kernel;
        const dynamicPatches = this.generateKernelPatches(hw);
        const cpuCodename = hw.CPU.Codename || "";
        const moboName = hw.Motherboard.Name || "";

        return {
            AppleIntelCPUPM: tKernel.appleIntelCPUPM ?? dynamicPatches.AppleIntelCPUPM,
            AppleRTC: tKernel.appleRTC ?? dynamicPatches.AppleRTC,
            BlockSkywalk: true, // Sonoma+ needs this
            DellSMBIOSPatch: moboName.includes("Dell"),
            KernelCpu: tKernel.kernelCpu ?? false,
            KernelLapic: tKernel.kernelLapic ?? dynamicPatches.KernelLapic,
            KernelPm: tKernel.kernelPm ?? dynamicPatches.KernelPm,
            KernelXcpm: tKernel.kernelXCPM ?? dynamicPatches.KernelXcpm,
            PanicNoKextDump: tKernel.panicNoKextDump ?? true,
            EightApple: tKernel.eightApple ?? false,
            FakeCPUID: tKernel.fakeCPUID || this.calculateFakeCPUID(hw)
        };
    }

    // Generate Quirks from template or fallback to dynamic
    generateQuirksFromTemplate(hw, template, macOS) {
        const chipset = hw.Motherboard.Chipset || "";
        const cpuCodename = hw.CPU.Codename || "";
        const cpuMan = hw.CPU.Manufacturer || "Intel";

        // Determine XhciPortLimit based on macOS version
        const darwinMajor = macOS ? parseInt(macOS.darwin.split('.')[0]) : 24;
        const needsXhciPortLimit = darwinMajor < 20 || (darwinMajor === 20 && parseInt(macOS.darwin.split('.')[1] || '0') < 4);

        if (!template?.quirks) {
            // Fallback to dynamic quirks
            const isIntel12Plus = cpuCodename.includes("Alder") || cpuCodename.includes("Raptor") ||
                cpuCodename.includes("Meteor") || cpuCodename.includes("Arrow");
            const isAMDNewer = chipset.match(/X570|B550|A520|TRX40|B650|X670/) !== null;

            return {
                AvoidRuntimeDefrag: true,
                DevirtualiseMmio: isIntel12Plus || isAMDNewer,
                DisableIoMapper: true,
                DisableLinkeditJettison: true,
                DisableSingleUser: false,
                DisableVariableWrite: false,
                DiscardHibernateMap: false,
                DummyPowerManagement: cpuMan === "AMD",
                EnableSafeModeSlide: true,
                EnableWriteUnprotector: !isIntel12Plus && !isAMDNewer,
                ExternalDiskIcons: false,
                ForceExitBootServices: false,
                ForceOcWriteFlash: false,
                FuzzyMatch: true,
                IncreasePciBarSize: false,
                KernelCache: "Auto",
                PowerTimeoutKernelPanic: true,
                ProtectMemoryRegions: isIntel12Plus,
                ProtectSecureBoot: false,
                ProtectUefiServices: isIntel12Plus || isAMDNewer,
                ProvideCurrentCpuInfo: isIntel12Plus || cpuMan === "AMD",
                ProvideCustomSlide: true,
                ProvideMaxSlide: 0,
                RebuildAppleMemoryMap: isIntel12Plus || isAMDNewer,
                ResizeAppleGpuBars: -1,
                SetupVirtualMap: cpuMan !== "AMD",
                SignalAppleOS: false,
                SyncRuntimePermissions: isIntel12Plus,
                ThirdPartyDrives: false,
                XhciPortLimit: needsXhciPortLimit
            };
        }

        const tQuirks = template.quirks;
        return {
            AvoidRuntimeDefrag: tQuirks.avoidRuntimeDefrag ?? true,
            DevirtualiseMmio: tQuirks.devirtualiseMmio ?? false,
            DisableIoMapper: tQuirks.disableIoMapper ?? true,
            DisableLinkeditJettison: tQuirks.disableLinkeditJettison ?? true,
            DisableSingleUser: tQuirks.disableSingleUser ?? false,
            DisableVariableWrite: tQuirks.disableVariableWrite ?? false,
            DiscardHibernateMap: tQuirks.discardHibernateMap ?? false,
            DummyPowerManagement: tQuirks.dummyPowerManagement ?? (cpuMan === "AMD"),
            EnableSafeModeSlide: tQuirks.enableSafeModeSlide ?? true,
            EnableWriteUnprotector: tQuirks.enableWriteUnprotector ?? false,
            ExternalDiskIcons: tQuirks.externalDiskIcons ?? false,
            ForceExitBootServices: tQuirks.forceExitBootServices ?? false,
            ForceOcWriteFlash: false,
            FuzzyMatch: tQuirks.fuzzyMatch ?? true,
            IncreasePciBarSize: tQuirks.increasePciBarSize ?? false,
            KernelCache: "Auto",
            PowerTimeoutKernelPanic: tQuirks.powerTimeoutKernelPanic ?? true,
            ProtectMemoryRegions: tQuirks.protectMemoryRegions ?? false,
            ProtectSecureBoot: tQuirks.protectSecureBoot ?? false,
            ProtectUefiServices: tQuirks.protectUefiServices ?? false,
            ProvideCurrentCpuInfo: tQuirks.provideCurrentCpuInfo ?? false,
            ProvideCustomSlide: tQuirks.provideCustomSlide ?? true,
            ProvideMaxSlide: tQuirks.provideMaxSlide ?? 0,
            RebuildAppleMemoryMap: tQuirks.rebuildAppleMemoryMap ?? false,
            ResizeAppleGpuBars: tQuirks.resizeAppleGpuBars ?? -1,
            SetupVirtualMap: tQuirks.setupVirtualMap ?? true,
            SignalAppleOS: tQuirks.signalAppleOS ?? false,
            SyncRuntimePermissions: tQuirks.syncRuntimePermissions ?? false,
            ThirdPartyDrives: tQuirks.thirdPartyDrives ?? false,
            XhciPortLimit: tQuirks.xhciPortLimit ?? needsXhciPortLimit
        };
    }

    // Generate RtVariables from template
    generateRtVariablesFromTemplate(template, macOS) {
        const csrActiveConfig = template?.rtVariables?.csrActiveConfig || this.getCsrActiveConfig(macOS);
        const booterConfig = template?.rtVariables?.booterConfig || "0x28";

        return {
            BooterConfig: booterConfig,
            CsrActiveConfig: csrActiveConfig,
            ROM: "UseMacAddr0"
        };
    }

    // ========================================================================
    // END TEMPLATE-BASED CONFIG GENERATION
    // ========================================================================

    // ========================================================================
    // END DYNAMIC CONFIG GENERATION HELPERS
    // ========================================================================

    // Override downloadConfigPlist to handle XML string
    calculateFakeCPUID(hardwareData) {
        const cpuName = hardwareData.CPU["Processor Name"] || "";
        const codename = hardwareData.CPU.Codename || "";

        // Arrow Lake (Core Ultra) - Spoof as Comet Lake
        if (codename.includes("Arrow") || cpuName.match(/Ultra\s*[579]/i)) {
            return "0x0906EB"; // Spoof as Comet Lake (i9-10900K)
        }

        // Meteor Lake - Spoof as Comet Lake
        if (codename.includes("Meteor") || cpuName.match(/i\d-1[56]\d{2}/)) {
            return "0x0906EB"; // Spoof as Comet Lake
        }

        // Raptor Lake Refresh (14th Gen) - Spoof as Comet Lake
        if (codename.includes("Raptor Lake Refresh") || cpuName.match(/i\d-14\d{3}/)) {
            return "0x0906EB"; // Spoof as Comet Lake (i9-10900K)
        }

        // Raptor Lake (13th Gen)
        if (codename.includes("Raptor") || cpuName.match(/i\d-13\d{3}/)) {
            return "0x0906EB"; // Spoof as Comet Lake (i9-10900K)
        }

        // Alder Lake (12th Gen)
        if (codename.includes("Alder") || cpuName.match(/i\d-12\d{3}/)) {
            return "0x0906EB"; // Spoof as Comet Lake
        }

        // Rocket Lake (11th Gen Desktop) - K/F suffix or 11x00 pattern
        if (codename.includes("Rocket") || cpuName.match(/i\d-11\d{2}[KFT]?$/i)) {
            return "0x0906EB"; // Spoof as Comet Lake
        }

        // Tiger Lake (11th Gen Mobile) - U/Y/H suffix
        if (codename.includes("Tiger") || cpuName.match(/i\d-11\d{2}[UHYP]/i)) {
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
