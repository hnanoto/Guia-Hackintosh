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

        // Hardware detection for dynamic Quirks (same logic as OpenCore)
        const chipset = hardwareData.Motherboard.Chipset || "";
        const firmware = hardwareData.BIOS["Firmware Type"] || "UEFI";
        const cpuMan = hardwareData.CPU.Manufacturer || "Intel";

        // Intel 12th Gen+ detection (Alder/Raptor/Arrow Lake)
        const isIntel12Plus = cpuCodename.includes("Alder") || cpuCodename.includes("Raptor") ||
            cpuCodename.includes("Meteor") || cpuCodename.includes("Arrow");

        // AMD 500+ series chipset detection
        const isAMDNewer = chipset.match(/X570|B550|A520|TRX40|B650|X670/) !== null;

        // Platform detection
        const platform = hardwareData.Motherboard.Platform || "Desktop";
        const isLaptop = platform === "Laptop" || platform === "NUC";

        // Dynamic config generation
        const dsdtFixes = this.generateDSDTFixes(hardwareData);
        const gfxConfig = this.generateGraphicsConfig(hardwareData);
        const kernelPatches = this.generateKernelPatches(hardwareData);

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
        <false/>
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
            <key>SuspendOverride?</key>
            <false/>
        </dict>
        <key>DisableASPM</key>
        <false/>
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
                <key>Length?</key>
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
        <key>ResetAddress?</key>
        <string>0x64</string>
        <key>ResetValue?</key>
        <string>0xFE</string>
        <key>SSDT</key>
        <dict>
            <key>C3Latency?</key>
            <string>0x03E7</string>
            <key>DoubleFirstState?</key>
            <true/>
            <key>DropOem?</key>
            <true/>
            <key>EnableC2?</key>
            <false/>
            <key>EnableC4?</key>
            <false/>
            <key>EnableC6?</key>
            <true/>
            <key>EnableC7?</key>
            <false/>
            <key>MaxMultiplier?</key>
            <integer>12</integer>
            <key>MinMultiplier?</key>
            <integer>8</integer>
            <key>NoDynamicExtract?</key>
            <false/>
            <key>NoOemTableId?</key>
            <false/>
            <key>PLimitDict?</key>
            <integer>1</integer>
            <key>UnderVoltStep?</key>
            <integer>1</integer>
            <key>UseSystemIO?</key>
            <false/>
            <key>Generate</key>
            <dict>
                <key>APLF?</key>
                <false/>
                <key>APSN?</key>
                <false/>
                <key>PluginType?</key>
                <false/>
                <key>CStates</key>
                <true/>
                <key>PStates</key>
                <true/>
            </dict>
        </dict>
        <key>SortedOrder?</key>
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
        <key>Arguments?</key>
        <string>${finalBootArgs}</string>
        <key>CustomLogo</key>
        <false/>
        <key>Debug</key>
        <false/>
        <key>DefaultLoader?</key>
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
        <false/>
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
        <key>XMPDetection?</key>
        <string>-1</string>
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
        <key>BusSpeedkHz?</key>
        <integer>133330</integer>
        <key>FrequencyMHz?</key>
        <integer>3140</integer>
        <key>HWPEnable?</key>
        <true/>
        <key>HWPValue?</key>
        <string>0x30002a01</string>
        <key>QPI?</key>
        <integer>4800</integer>
        <key>SavingMode?</key>
        <integer>7</integer>
        <key>TDP?</key>
        <integer>95</integer>
        <key>TurboDisable?</key>
        <false/>
        <key>Type?</key>
        <string>0x0201</string>
        <key>UseARTFrequency</key>
        <true/>
    </dict>
    <key>Devices</key>
    <dict>
        <key>Audio?</key>
        <dict>
            <key>AFGLowPowerState</key>
            <true/>
            <key>Inject?</key>
            <string>12</string>
            <key>ResetHDA</key>
            <true/>
        </dict>
        <key>DisableFunctions?</key>
        <string>0x18F6</string>
        <key>FakeID</key>
        <dict>
            <key>ATI?</key>
            <string>0x67501002</string>
            <key>IMEI?</key>
            <string>0x1e208086</string>
            <key>IntelGFX?</key>
            <string>0x59168086</string>
            <key>LAN?</key>
            <string>0x100E8086</string>
            <key>NVidia?</key>
            <string>0x11de10de</string>
            <key>SATA?</key>
            <string>0x26818086</string>
            <key>WIFI?</key>
            <string>0x0030168C</string>
            <key>XHCI?</key>
            <string>0xA12F8086</string>
        </dict>
        <key>ForceHPET?</key>
        <false/>
        <key>HDMIInjection?</key>
        <false/>
        <key>IntelMaxValue?</key>
        <string>0x710</string>
        <key>LANInjection?</key>
        <false/>
        <key>NoDefaultProperties?</key>
        <false/>
        <key>Properties?</key>
        <dict>
            <key>PciRoot(0x0)/Pci(0x14,0x0)</key>
            <dict>
                <key>AAPL,clock-id</key>
                <data>AA==</data>
                <key>AAPL,current-available</key>
                <data>sAQ=</data>
                <key>AAPL,current-extra</key>
                <data>vAI=</data>
                <key>AAPL,current-in-sleep</key>
                <data>6AM=</data>
                <key>Comment</key>
                <string>This is USB3.0</string>
                <key>built-in</key>
                <data>AA==</data>
                <key>device_type</key>
                <string>XHCI</string>
            </dict>
            <key>PciRoot(0x0)/Pci(0x19,0x0)</key>
            <dict>
                <key>built-in</key>
                <data>AQ==</data>
            </dict>
            <key>PciRoot(0x0)/Pci(0x1b,0x0)</key>
            <dict>
                <key>hda-gfx</key>
                <string>onboard-1</string>
            </dict>
        </dict>
        <key>SetIntelBacklight?</key>
        <false/>
        <key>SetIntelMaxBacklight?</key>
        <true/>
        <key>USB</key>
        <dict>
            <key>AddClockID?</key>
            <true/>
            <key>FixOwnership</key>
            <true/>
            <key>HighCurrent?</key>
            <false/>
            <key>Inject</key>
            <false/>
        </dict>
        <key>UseIntelHDMI</key>
        <false/>
    </dict>
    <key>DisableDrivers?</key>
    <array>
        <string>CsmVideoDxe</string>
        <string>VBoxExt2</string>
    </array>
    <key>GUI</key>
    <dict>
        <key>ConsoleMode</key>
        <string>0</string>
        <key>CustomIcons?</key>
        <false/>
        <key>EmbeddedThemeType</key>
        <string>Daytime</string>
        <key>Hide?</key>
        <array>
            <string>Windows</string>
            <string>BOOTX64.EFI</string>
        </array>
        <key>KbdPrevLang?</key>
        <false/>
        <key>Language?</key>
        <string>en:0</string>
        <key>Mouse?</key>
        <dict>
            <key>DoubleClickTime?</key>
            <integer>500</integer>
            <key>Enabled</key>
            <true/>
            <key>Mirror?</key>
            <false/>
            <key>Speed</key>
            <integer>2</integer>
        </dict>
        <key>PlayAsync</key>
        <false/>
        <key>ProvideConsoleGop</key>
        <true/>
        <key>Scan?</key>
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
        <key>ShowOptimus?</key>
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
        <key>DualLink?</key>
        <integer>0</integer>
        <key>EDID</key>
        <dict>
            <key>Custom?</key>
            <data>AP///////wAGECGSAAAAAAASAQOAIRV4CunVmVlTjigmUFQAAAABAQEBAQEBAQEBAQEBAQEB3iGgcFCEHzAgIFYAS88QAAAY3iGgcFCEHzAgIFYAS88QAAAAAAAA/gBXNjU3RwAxNTRXUDEKAAAA/gAjMz1IZYSq/wIBCiAgAJo=</data>
            <key>HorizontalSyncPulseWidth?</key>
            <string>0x11</string>
            <key>Inject?</key>
            <true/>
            <key>ProductID?</key>
            <string>0x9221</string>
            <key>VendorID?</key>
            <string>0x1006</string>
            <key>VideoInputSignal?</key>
            <string>0xA1</string>
        </dict>
        <key>FBName?</key>
        <string>Makakakakala</string>
        <key>Inject?</key>
        <dict>
            <key>ATI</key>
            <${gfxConfig.InjectATI}/>
            <key>Intel</key>
            <${gfxConfig.InjectIntel}/>
            <key>NVidia</key>
            <${gfxConfig.InjectNVidia}/>
        </dict>
        <key>LoadVBios?</key>
        <${gfxConfig.LoadVBios}/>
        <key>NVCAP?</key>
        <string>04000000000003000C0000000000000A00000000</string>
        <key>NvidiaGeneric?</key>
        <true/>
        <key>NvidiaNoEFI?</key>
        <false/>
        <key>NvidiaSingle?</key>
        <false/>
        <key>PatchVBios?</key>
        <false/>
        <key>PatchVBiosBytes?</key>
        <array>
            <dict>
                <key>Find</key>
                <data>gAeoAqAF</data>
                <key>Replace</key>
                <data>gAeoAjgE</data>
            </dict>
        </array>
        <key>RadeonDeInit?</key>
        <${gfxConfig.RadeonDeInit}/>
        <key>VRAM?</key>
        <integer>1024</integer>
        <key>VideoPorts?</key>
        <integer>2</integer>
        <key>display-cfg?</key>
        <string>03010300FFFF0001</string>
        <key>ig-platform-id?</key>
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
        <string>${this.calculateFakeCPUID(hardwareData)}</string>
        <key>KernelLapic</key>
        <${kernelPatches.KernelLapic}/>
        <key>KernelPm</key>
        <${kernelPatches.KernelPm}/>
        <key>KernelXCPM</key>
        <${kernelPatches.KernelXcpm}/>
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
        <${firmware === "UEFI" ? "true" : "false"}/>
        <key>ClearTaskSwitchBit</key>
        <false/>
        <key>DevirtualiseMmio</key>
        <${this.needsDevirtualiseMmio(chipset, cpuCodename) ? "true" : "false"}/>
        <key>DisableIoMapper</key>
        <true/>
        <key>DisableIoMapperMapping</key>
        <false/>
        <key>DisableLinkeditJettison</key>
        <true/>
        <key>DisableSingleUser</key>
        <false/>
        <key>DisableVariableWrite</key>
        <false/>
        <key>DiscardHibernateMap</key>
        <false/>
        <key>DummyPowerManagement</key>
        <${cpuMan === "AMD" ? "true" : "false"}/>
        <key>EnableSafeModeSlide</key>
        <${firmware === "UEFI" ? "true" : "false"}/>
        <key>EnableWriteUnprotector</key>
        <${this.needsWriteUnprotector(hardwareData) ? "true" : "false"}/>
        <key>ExtendBTFeatureFlags</key>
        <false/>
        <key>ExternalDiskIcons</key>
        <false/>
        <key>ForceAquantiaEthernet</key>
        <false/>
        <key>ForceExitBootServices</key>
        <false/>
        <key>ForceOcWriteFlash</key>
        <false/>
        <key>FuzzyMatch</key>
        <false/>
        <key>IncreasePciBarSize</key>
        <false/>
        <key>KernelCache</key>
        <string>Auto</string>
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
        <true/>
        <key>ProtectMemoryRegions</key>
        <false/>
        <key>ProtectSecureBoot</key>
        <false/>
        <key>ProtectUefiServices</key>
        <${this.needsProtectUefiServices(chipset) ? "true" : "false"}/>
        <key>ProvideCurrentCpuInfo</key>
        <${(cpuMan === "AMD" || isIntel12Plus) ? "true" : "false"}/>
        <key>AutoModernCPUQuirks</key>
        <false/>
        <key>ProvideCustomSlide</key>
        <${firmware === "UEFI" ? "true" : "false"}/>
        <key>ProvideMaxSlide</key>
        <integer>0</integer>
        <key>RebuildAppleMemoryMap</key>
        <${!this.needsWriteUnprotector(hardwareData) ? "true" : "false"}/>
        <key>ResizeAppleGpuBars</key>
        <integer>-1</integer>
        <key>ResizeGpuBars</key>
        <integer>-1</integer>
        <key>SetupVirtualMap</key>
        <${(firmware === "UEFI" && !isAMDNewer) ? "true" : "false"}/>
        <key>SignalAppleOS</key>
        <false/>
        <key>SyncRuntimePermissions</key>
        <${!this.needsWriteUnprotector(hardwareData) ? "true" : "false"}/>
        <key>ThirdPartyDrives</key>
        <false/>
        <key>TscSyncTimeout</key>
        <integer>0</integer>
        <key>XhciPortLimit</key>
        <false/>
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
        <string>0x68</string>
        <key>CsrActiveConfig</key>
        <string>0x0A87</string>
        <key>HWTarget?</key>
        <string>J160AP</string>
        <key>MLB</key>
        <string>C02032109R6DC771H</string>
        <key>ROM</key>
        <string>UseMacAddr0</string>
    </dict>
    <key>SMBIOS</key>
    <dict>
        <key>BiosReleaseDate?</key>
        <string>05/03/10</string>
        <key>BiosVendor?</key>
        <string>Apple Inc.</string>
        <key>BiosVersion?</key>
        <string>IM131.88Z.F000.B00.1907241303</string>
        <key>Board-ID?</key>
        <string>Mac-FC02E91DDD3FA6A4</string>
        <key>BoardManufacturer?</key>
        <string>Apple Inc.</string>
        <key>BoardSerialNumber?</key>
        <string>C0225060SAMF651AX</string>
        <key>BoardType?</key>
        <integer>10</integer>
        <key>BoardVersion?</key>
        <string>Proto1</string>
        <key>ChassisAssetTag?</key>
        <string>Desktop</string>
        <key>ChassisManufacturer?</key>
        <string>Apple Inc.</string>
        <key>ChassisType?</key>
        <integer>16</integer>
        <key>EfiVersion?</key>
        <string>288.0.0.0.0</string>
        <key>ExtendedFirmwareFeatures?</key>
        <string>0x8FE001403</string>
        <key>ExtendedFirmwareFeaturesMask?</key>
        <string>0xFFFFFFFFFF</string>
        <key>FakeCPUID</key>
        <string>0x0406E1</string>
        <key>Family?</key>
        <string>${smbiosModel.includes("MacPro") ? "Mac Pro" : smbiosModel.includes("MacBook") ? "MacBook Pro" : smbiosModel.includes("Macmini") ? "Mac mini" : smbiosModel.includes("iMacPro") ? "iMac Pro" : "iMac"}</string>
        <key>FirmwareFeatures?</key>
        <string>0xC0001403</string>
        <key>FirmwareFeaturesMask?</key>
        <string>0xFFFFFFFF</string>
        <key>LocationInChassis?</key>
        <string>Part Component</string>
        <key>Manufacturer?</key>
        <string>Apple Inc.</string>
        <key>Memory</key>
        <dict>
            <key>Channels</key>
            <integer>2</integer>
            <key>Modules?</key>
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
            <key>SlotCount?</key>
            <integer>4</integer>
        </dict>
        <key>MemoryRank?</key>
        <integer>2</integer>
        <key>Mobile?</key>
        <${isLaptop}/>
        <key>NoRomInfo</key>
        <false/>
        <key>PlatformFeature?</key>
        <string>0x00</string>
        <key>ProductName?</key>
        <string>${smbiosModel}</string>
        <key>SerialNumber?</key>
        <string>C02JBSAMDNCW</string>
        <key>Slots?</key>
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
        <key>SmUUID?</key>
        <string>00000000-0000-1000-8000-010203040506</string>
        <key>SmbiosVersion?</key>
        <string>0x0300</string>
        <key>Trust?</key>
        <true/>
        <key>Version?</key>
        <string>1.0</string>
    </dict>
    <key>SystemParameters</key>
    <dict>
        <key>BacklightLevel?</key>
        <string>0x0501</string>
        <key>CustomUUID?</key>
        <string>511CE201-1000-4000-9999-010203040506</string>
        <key>InjectKexts</key>
        <true/>
        <key>InjectSystemID</key>
        <true/>
        <key>NoCaches</key>
        <false/>
        <key>NvidiaWeb?</key>
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

    // Generate DSDT Fixes based on platform (Desktop/Laptop)
    generateDSDTFixes(hw) {
        const platform = hw.Motherboard.Platform || "Desktop";
        const isLaptop = platform === "Laptop" || platform === "NUC";
        const cpuMan = hw.CPU.Manufacturer || "Intel";

        return {
            AddDTGP: true,
            AddHDMI: !isLaptop,
            AddIMEI: false,
            AddMCHC: false,
            AddPNLF: isLaptop, // Backlight for laptops
            DeleteUnused: true,
            FakeLPC: false,
            FixACST: true,
            FixADP1: isLaptop, // Power adapter for laptops
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
    // END DYNAMIC CONFIG GENERATION HELPERS
    // ========================================================================

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
