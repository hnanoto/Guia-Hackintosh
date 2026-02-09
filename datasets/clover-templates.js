// ============================================================================
// Clover Config Templates Database - Based on Olarila EFIs
// Templates for different platforms to generate accurate config.plist
// ============================================================================

const CloverTemplates = {
    // ========================================================================
    // DESKTOP TEMPLATES BY CHIPSET SERIES
    // ========================================================================

    // Intel 600/700 Series (Alder Lake / Raptor Lake)
    "desktop_600_700": {
        platform: "Desktop",
        chipsets: ["Z690", "B660", "H670", "Z790", "B760", "H770"],
        cpuGenerations: ["Alder Lake", "Raptor Lake", "Raptor Lake Refresh"],
        smbios: "MacPro7,1",
        boot: {
            args: "alcid=12 agdpmod=pikera watchdog=0 npci=0x3000 -wegnoigpu dk.e1000=0 e1000=0 ctrsmt=full revcpu=1 revcpuname=Intel®Core™Processor revpatch=cpuname,sbvmm,diskread,pci",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            fixMCFG: true,
            haltEnabler: true,
            disableASPM: true,
            dsdt: {
                fixes: {
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true
                }
            },
            ssdt: {
                noDynamicExtract: true,
                noOemTableId: true,
                generate: { CStates: false, PStates: false }
            }
        },
        cpu: {
            type: "0x0F01",
            fakeCPUID: "0x0A0655" // Comet Lake spoof
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            kernelXCPM: false,
            fakeCPUID: "0x0A0655",
            eightApple: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            disableLinkeditJettison: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: false,
            fuzzyMatch: true,
            powerTimeoutKernelPanic: true,
            protectMemoryRegions: true,
            protectUefiServices: true,
            provideCurrentCpuInfo: true,
            provideCustomSlide: true,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: true,
            syncRuntimePermissions: true,
            xhciPortLimit: false
        },
        graphics: {
            injectATI: false,
            injectIntel: false,
            injectNVidia: false,
            radeonDeInit: false
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x0" // SIP enabled for Sequoia? Usually disabled 0x67 for older macOS
        },
        deviceProperties: {
            "PciRoot(0x0)/Pci(0x2,0x0)": {
                "AAPL,ig-platform-id": "07009B3E",
                "device-id": "9B3E0000",
                "framebuffer-patch-enable": 1,
                "framebuffer-stolenmem": "00003001"
            },
            "PciRoot(0x0)/Pci(0x1F,0x3)": {
                "layout-id": 1
            },
            "PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)": {
                "@0,name": "ATY,Adder",
                "@1,name": "ATY,Adder",
                "@2,name": "ATY,Adder",
                "@3,name": "ATY,Adder",
                "device_type": "ATY,AdderParent",
                "model": "AMD Radeon VII"
            }
        }
    },

    // Intel 500 Series (Rocket Lake)
    "desktop_500": {
        platform: "Desktop",
        chipsets: ["Z590", "B560", "H570", "H510"],
        cpuGenerations: ["Rocket Lake"],
        smbios: "iMac20,1",
        boot: {
            args: "alcid=1 agdpmod=pikera watchdog=0 -wegnoigpu",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            fixMCFG: true,
            haltEnabler: true,
            disableASPM: false,
            dsdt: {
                fixes: {
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true
                }
            },
            ssdt: {
                noDynamicExtract: true,
                noOemTableId: true,
                generate: { CStates: false, PStates: false }
            }
        },
        cpu: {
            type: "0x0604"
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            kernelXCPM: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            disableLinkeditJettison: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: false,
            powerTimeoutKernelPanic: true,
            protectUefiServices: true,
            provideCurrentCpuInfo: true,
            provideCustomSlide: true,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: true,
            syncRuntimePermissions: true,
            xhciPortLimit: false
        },
        graphics: {
            injectATI: false,
            injectIntel: false,
            injectNVidia: false
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x803"
        }
    },

    // Intel 300/400 Series (Coffee Lake / Comet Lake)
    "desktop_300_400": {
        platform: "Desktop",
        chipsets: ["Z390", "Z370", "B365", "B360", "H370", "Z490", "B460", "H470"],
        cpuGenerations: ["Coffee Lake", "Coffee Lake Refresh", "Comet Lake"],
        smbios: "iMac19,1",
        boot: {
            args: "alcid=1 agdpmod=pikera -wegnoigpu",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            fixMCFG: true,
            haltEnabler: true,
            disableASPM: false,
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true,
                    FixHDA: true,
                    FixShutdown: true
                }
            },
            ssdt: {
                noDynamicExtract: false,
                noOemTableId: false,
                generate: { CStates: true, PStates: true, PluginType: true }
            }
        },
        cpu: {
            type: "0x0604"
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            kernelXCPM: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: false,
            disableIoMapper: true,
            disableLinkeditJettison: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: true,
            powerTimeoutKernelPanic: true,
            protectUefiServices: true,
            provideCustomSlide: true,
            rebuildAppleMemoryMap: false,
            setupVirtualMap: true,
            syncRuntimePermissions: false,
            xhciPortLimit: false
        },
        graphics: {
            igPlatformId: "0x3E9B0007",
            injectIntel: true
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x67"
        },
        deviceProperties: {
            "PciRoot(0x0)/Pci(0x2,0x0)": {
                "AAPL,ig-platform-id": "{{IG_PLATFORM_ID}}",
                "device-id": "{{DEVICE_ID}}",
                "framebuffer-patch-enable": 1,
                "framebuffer-stolenmem": "00003001"
            },
            "PciRoot(0x0)/Pci(0x1F,0x3)": {
                "layout-id": "{{LAYOUT_ID}}"
            }
        }
    },

    // Intel 100/200 Series (Skylake / Kaby Lake)
    "desktop_100_200": {
        platform: "Desktop",
        chipsets: ["Z170", "Z270", "B150", "B250", "H110", "H170", "H270"],
        cpuGenerations: ["Skylake", "Kaby Lake"],
        smbios: "iMac18,3",
        boot: {
            args: "alcid=1",
            timeout: 5
        },
        acpi: {
            autoMerge: false,
            fixHeaders: true,
            fixMCFG: true,
            haltEnabler: true,
            disableASPM: false,
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    AddHDMI: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true,
                    FixHDA: true,
                    FixUSB: true,
                    FixShutdown: true,
                    FixSBUS: true
                }
            },
            ssdt: {
                generate: { CStates: true, PStates: true, PluginType: true }
            }
        },
        cpu: {
            type: "0x0604"
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: false,
            kernelXCPM: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: false,
            disableIoMapper: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: true,
            provideCustomSlide: true,
            rebuildAppleMemoryMap: false,
            setupVirtualMap: true,
            xhciPortLimit: false
        },
        graphics: {
            igPlatformId: "0x19120000",
            injectIntel: true
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x67"
        },
        deviceProperties: {
            "PciRoot(0x0)/Pci(0x2,0x0)": {
                "AAPL,ig-platform-id": "{{IG_PLATFORM_ID}}",
                "device-id": "{{DEVICE_ID}}",
                "framebuffer-patch-enable": 1,
                "framebuffer-stolenmem": "00003001"
            },
            "PciRoot(0x0)/Pci(0x1F,0x3)": {
                "layout-id": "{{LAYOUT_ID}}"
            }
        }
    },

    // Intel 4th/5th Gen (Haswell / Broadwell)
    "desktop_haswell_broadwell": {
        platform: "Desktop",
        chipsets: ["Z97", "H97", "Z87", "H87", "B85", "H81"],
        cpuGenerations: ["Haswell", "Broadwell"],
        smbios: "iMac14,2",
        boot: {
            args: "alcid=1",
            timeout: 5
        },
        acpi: {
            autoMerge: false,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    FixRTC: true,
                    FixIPIC: true,
                    FixHPET: true,
                    FixTMR: true,
                    FixSBUS: true
                }
            },
            ssdt: {
                generate: { PStates: true, CStates: true, PluginType: true }
            }
        },
        kernel: {
            appleIntelCPUPM: true,
            appleRTC: true,
            kernelPm: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            enableWriteUnprotector: true,
            setupVirtualMap: true
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x67"
        },
        deviceProperties: {
            "PciRoot(0x0)/Pci(0x2,0x0)": {
                "AAPL,ig-platform-id": "0300220D",
                "device-id": "12040000",
                "framebuffer-patch-enable": 1,
                "framebuffer-stolenmem": "00003001"
            },
            "PciRoot(0x0)/Pci(0x1B,0x0)": {
                "layout-id": "{{LAYOUT_ID}}"
            }
        }
    },

    // Intel 2nd/3rd Gen (Sandy Bridge / Ivy Bridge)
    "desktop_sandy_ivy": {
        platform: "Desktop",
        chipsets: ["Z77", "H77", "Z68", "P67", "H67", "H61"],
        cpuGenerations: ["Sandy Bridge", "Ivy Bridge"],
        smbios: "iMac13,2",
        boot: {
            args: "alcid=1",
            timeout: 5
        },
        acpi: {
            dsdt: {
                fixes: {
                    FixRTC: true,
                    FixIPIC: true,
                    FixHPET: true,
                    FixTMR: true,
                    FixSBUS: true
                }
            },
            ssdt: {
                generate: { PStates: true, CStates: true }
            }
        },
        kernel: {
            appleIntelCPUPM: true,
            appleRTC: true,
            kernelPm: true
        },
        quirks: {
            enableWriteUnprotector: true,
            setupVirtualMap: true
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x67"
        },
        deviceProperties: {
            "PciRoot(0x0)/Pci(0x2,0x0)": {
                "AAPL,snb-platform-id": "10000300",
                "AAPL,ig-platform-id": "0A006601",
                "framebuffer-patch-enable": 1
            },
            "PciRoot(0x0)/Pci(0x1B,0x0)": {
                "layout-id": "{{LAYOUT_ID}}"
            }
        }
    },

    // ========================================================================
    // HEDT TEMPLATES (X99, X299, X79, X58)
    // ========================================================================

    "hedt_x299": {
        platform: "HEDT",
        chipsets: ["X299"],
        cpuGenerations: ["Skylake-X", "Cascade Lake-X"],
        smbios: "iMacPro1,1",
        boot: {
            args: "alcid=1 npci=0x3000",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            disableASPM: true,
            dsdt: {
                fixes: {
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            kernelXCPM: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            enableWriteUnprotector: false,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: true,
            syncRuntimePermissions: true
        },
        rtVariables: {
            csrActiveConfig: "0x803"
        }
    },

    "hedt_x99": {
        platform: "HEDT",
        chipsets: ["X99"],
        cpuGenerations: ["Haswell-E", "Broadwell-E"],
        smbios: "iMacPro1,1",
        boot: {
            args: "alcid=1 npci=0x2000",
            timeout: 5
        },
        acpi: {
            autoMerge: false,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true,
                    FixUSB: true
                }
            },
            ssdt: {
                generate: { CStates: true, PStates: true }
            }
        },
        kernel: {
            appleIntelCPUPM: true,
            appleRTC: true,
            kernelPm: false,
            kernelXCPM: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            enableWriteUnprotector: true,
            rebuildAppleMemoryMap: false,
            setupVirtualMap: true
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    },

    "hedt_x79": {
        platform: "HEDT",
        chipsets: ["X79"],
        cpuGenerations: ["Sandy Bridge-E", "Ivy Bridge-E"],
        smbios: "MacPro6,1",
        boot: {
            args: "alcid=1 npci=0x2000",
            timeout: 5
        },
        acpi: {
            autoMerge: false,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true,
                    FixUSB: true,
                    FixLAN: true,
                    FixSATA: true
                }
            },
            ssdt: {
                dropOem: true,
                generate: { CStates: true, PStates: true }
            }
        },
        kernel: {
            appleIntelCPUPM: true,
            appleRTC: true,
            kernelLapic: true,
            kernelPm: false
        },
        quirks: {
            enableWriteUnprotector: true,
            setupVirtualMap: true
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    },

    // ========================================================================
    // LEGACY DESKTOP (LGA775, LGA1366)
    // ========================================================================

    "legacy_lga1366": {
        platform: "Desktop",
        chipsets: ["X58"],
        cpuGenerations: ["Nehalem", "Westmere"],
        smbios: "MacPro5,1",
        boot: {
            args: "alcid=1 npci=0x2000",
            timeout: 5
        },
        acpi: {
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixHPET: true,
                    FixUSB: true,
                    FixLAN: true,
                    FixSATA: true
                }
            },
            ssdt: {
                dropOem: true,
                generate: { CStates: true, PStates: true }
            }
        },
        kernel: {
            appleIntelCPUPM: true,
            appleRTC: true,
            kernelLapic: true
        },
        quirks: {
            enableWriteUnprotector: true
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    },

    "legacy_lga775": {
        platform: "Desktop",
        chipsets: ["P45", "P43", "P35", "G45", "G43", "G41", "G35", "G33", "G31"],
        cpuGenerations: ["Core 2 Duo", "Core 2 Quad", "Pentium"],
        smbios: "iMac10,1",
        boot: {
            args: "alcid=1 npci=0x2000 -no_compat_check",
            timeout: 5
        },
        acpi: {
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    FakeLPC: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixHPET: true,
                    FixUSB: true,
                    FixLAN: true,
                    FixSATA: true,
                    FixIDE: true
                }
            },
            ssdt: {
                dropOem: true,
                generate: { CStates: true, PStates: true }
            }
        },
        kernel: {
            appleIntelCPUPM: true,
            appleRTC: true,
            kernelLapic: true
        },
        quirks: {
            enableWriteUnprotector: true
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    },

    // ========================================================================
    // AMD TEMPLATES (Ryzen AM4/AM5, Threadripper)
    // ========================================================================

    // AMD Ryzen 7000 Series (AM5 - Zen 4)
    "amd_am5_zen4": {
        platform: "Desktop",
        chipsets: ["X670", "X670E", "B650", "B650E"],
        cpuGenerations: ["Zen 4", "Raphael"],
        smbios: "MacPro7,1",
        boot: {
            args: "alcid=1 npci=0x3000 agdpmod=pikera",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            fixMCFG: true,
            dsdt: {
                fixes: {
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: false,
            kernelXCPM: false,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            disableLinkeditJettison: true,
            dummyPowerManagement: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: false,
            powerTimeoutKernelPanic: true,
            protectUefiServices: true,
            provideCurrentCpuInfo: true,
            provideCustomSlide: true,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: false,
            syncRuntimePermissions: true,
            xhciPortLimit: false
        },
        graphics: {
            injectATI: false,
            injectIntel: false,
            injectNVidia: false
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x803"
        }
    },

    // AMD Ryzen 5000/3000/2000/1000 Series (AM4 - Zen 3/2/1)
    "amd_am4_zen": {
        platform: "Desktop",
        chipsets: ["X570", "B550", "A520", "X470", "B450", "X370", "B350", "A320"],
        cpuGenerations: ["Zen 3", "Zen 2", "Zen+", "Zen", "Vermeer", "Matisse", "Pinnacle Ridge", "Summit Ridge"],
        smbios: "MacPro7,1",
        boot: {
            args: "alcid=1 npci=0x2000 agdpmod=pikera",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: false,
            kernelXCPM: false,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            disableLinkeditJettison: true,
            dummyPowerManagement: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: false,
            powerTimeoutKernelPanic: true,
            protectUefiServices: true,
            provideCurrentCpuInfo: true,
            provideCustomSlide: true,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: false, // AMD needs false
            syncRuntimePermissions: true,
            xhciPortLimit: false
        },
        graphics: {
            injectATI: false,
            injectIntel: false,
            injectNVidia: false
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x803"
        }
    },

    // AMD Threadripper (TRX40 / WRX80)
    "amd_threadripper": {
        platform: "HEDT",
        chipsets: ["TRX40", "WRX80", "TRX50", "WRX90"],
        cpuGenerations: ["Threadripper", "Threadripper PRO"],
        smbios: "MacPro7,1",
        boot: {
            args: "alcid=1 npci=0x3000 agdpmod=pikera",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: false,
            kernelXCPM: false,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            disableLinkeditJettison: true,
            dummyPowerManagement: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: false,
            powerTimeoutKernelPanic: true,
            protectUefiServices: true,
            provideCurrentCpuInfo: true,
            provideCustomSlide: true,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: false,
            syncRuntimePermissions: true,
            xhciPortLimit: false
        },
        graphics: {
            injectATI: false,
            injectIntel: false,
            injectNVidia: false
        },
        rtVariables: {
            booterConfig: "0x28",
            csrActiveConfig: "0x803"
        }
    },

    // AMD FX Series (AM3+ - Bulldozer/Piledriver)
    "amd_fx": {
        platform: "Desktop",
        chipsets: ["990FX", "990X", "970"],
        cpuGenerations: ["Bulldozer", "Piledriver", "Vishera", "Zambezi"],
        smbios: "MacPro6,1",
        boot: {
            args: "alcid=1 npci=0x2000 -no_compat_check",
            timeout: 5
        },
        acpi: {
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixHPET: true,
                    FixUSB: true,
                    FixLAN: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: false,
            kernelXCPM: false,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            dummyPowerManagement: true,
            enableWriteUnprotector: true,
            setupVirtualMap: true
        },
        graphics: {
            injectATI: false,
            injectIntel: false,
            injectNVidia: false
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    },

    // ========================================================================
    // NOTEBOOK TEMPLATES
    // ========================================================================

    // Notebook Tiger Lake (11th Gen)
    "notebook_tigerlake": {
        platform: "Laptop",
        cpuGenerations: ["Tiger Lake"],
        smbios: "MacBookPro16,2",
        boot: {
            args: "alcid=1 igfxonln=1 -igfxblr",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddPNLF: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixADP1: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            disableLinkeditJettison: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: false,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: true,
            syncRuntimePermissions: true
        },
        graphics: {
            igPlatformId: "0x9A490000",
            deviceId: "0x9A49",
            injectIntel: true,
            backlight: true
        },
        rtVariables: {
            csrActiveConfig: "0x803"
        }
    },

    // Notebook Ice Lake (10th Gen)
    "notebook_icelake": {
        platform: "Laptop",
        cpuGenerations: ["Ice Lake"],
        smbios: "MacBookAir9,1",
        boot: {
            args: "alcid=1 igfxonln=1 -igfxblr",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddPNLF: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixADP1: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: true,
            disableIoMapper: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: false,
            rebuildAppleMemoryMap: true,
            setupVirtualMap: true
        },
        graphics: {
            igPlatformId: "0x8A520000",
            deviceId: "0x8A52",
            injectIntel: true,
            backlight: true
        },
        rtVariables: {
            csrActiveConfig: "0x803"
        }
    },

    // Notebook 5th-9th Gen (Broadwell to Coffee Lake)
    "notebook_5_9_gen": {
        platform: "Laptop",
        cpuGenerations: ["Broadwell", "Skylake", "Kaby Lake", "Kaby Lake Refresh", "Coffee Lake", "Coffee Lake Refresh"],
        smbios: "MacBookPro15,2",
        boot: {
            args: "alcid=1",
            timeout: 5
        },
        acpi: {
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    AddPNLF: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true,
                    FixADP1: true,
                    FixACST: true
                }
            },
            ssdt: {
                generate: { PluginType: true }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            kernelXCPM: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            disableIoMapper: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: true,
            provideCustomSlide: true,
            setupVirtualMap: true
        },
        graphics: {
            igPlatformId: "0x3EA50009",
            injectIntel: true,
            backlight: true
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    },

    // Notebook 100/200 Series (Skylake/Kaby Lake specific)
    "notebook_100_200": {
        platform: "Laptop",
        chipsets: ["100 Series", "200 Series"],
        cpuGenerations: ["Skylake", "Kaby Lake"],
        smbios: "MacBookPro14,1",
        boot: {
            args: "alcid=1",
            timeout: 5
        },
        acpi: {
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddDTGP: true,
                    AddPNLF: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixHPET: true,
                    FixADP1: true,
                    FixACST: true,
                    FixUSB: true
                }
            },
            ssdt: {
                generate: { PluginType: true }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: false,
            kernelXCPM: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            disableIoMapper: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: true,
            provideCustomSlide: true,
            setupVirtualMap: true
        },
        graphics: {
            igPlatformId: "0x19160000",
            injectIntel: true,
            backlight: true
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    },

    // Notebook 300 Series (Coffee Lake)
    "notebook_300": {
        platform: "Laptop",
        chipsets: ["300 Series"],
        cpuGenerations: ["Coffee Lake", "Coffee Lake Refresh", "Comet Lake"],
        smbios: "MacBookPro15,2",
        boot: {
            args: "alcid=1",
            timeout: 5
        },
        acpi: {
            autoMerge: true,
            fixHeaders: true,
            dsdt: {
                fixes: {
                    AddPNLF: true,
                    FixIPIC: true,
                    FixRTC: true,
                    FixTMR: true,
                    FixADP1: true
                }
            }
        },
        kernel: {
            appleIntelCPUPM: false,
            appleRTC: true,
            kernelPm: true,
            kernelXCPM: true,
            panicNoKextDump: true
        },
        quirks: {
            avoidRuntimeDefrag: true,
            devirtualiseMmio: false,
            disableIoMapper: true,
            enableSafeModeSlide: true,
            enableWriteUnprotector: true,
            provideCustomSlide: true,
            setupVirtualMap: true
        },
        graphics: {
            igPlatformId: "0x3EA50009",
            injectIntel: true,
            backlight: true
        },
        rtVariables: {
            csrActiveConfig: "0x67"
        }
    }
};

// Helper function to select template based on hardware
function selectCloverTemplate(hardwareData) {
    const cpuCodename = hardwareData.CPU.Codename || "";
    const cpuName = hardwareData.CPU["Processor Name"] || "";
    const cpuMan = hardwareData.CPU.Manufacturer || "";
    const platform = hardwareData.Motherboard.Platform || "Desktop";
    const chipset = hardwareData.Motherboard.Chipset || "";

    // Laptop detection
    if (platform === "Laptop" || platform === "NUC") {
        if (cpuCodename.includes("Tiger Lake")) return CloverTemplates["notebook_tigerlake"];
        if (cpuCodename.includes("Ice Lake")) return CloverTemplates["notebook_icelake"];
        if (cpuCodename.includes("Comet Lake") || cpuCodename.includes("Coffee Lake")) {
            return CloverTemplates["notebook_300"];
        }
        if (cpuCodename.includes("Kaby Lake") || cpuCodename.includes("Skylake")) {
            return CloverTemplates["notebook_100_200"];
        }
        return CloverTemplates["notebook_5_9_gen"];
    }

    // AMD detection - check manufacturer and CPU name
    const isAMD = cpuMan === "AMD" || cpuName.match(/Ryzen|Threadripper|FX-|Phenom/i);

    if (isAMD) {
        // AMD Threadripper detection
        if (cpuName.match(/Threadripper/i) || chipset.match(/TRX40|WRX80|TRX50|WRX90/)) {
            return CloverTemplates["amd_threadripper"];
        }

        // AMD AM5 (Zen 4 - Ryzen 7000+)
        if (chipset.match(/X670|B650/) || cpuName.match(/Ryzen\s*[579]\s*7[0-9]{3}/i) ||
            cpuCodename.includes("Zen 4") || cpuCodename.includes("Raphael")) {
            return CloverTemplates["amd_am5_zen4"];
        }

        // AMD AM4 (Zen 1-3 - Ryzen 1000-5000)
        if (chipset.match(/X570|B550|A520|X470|B450|X370|B350|A320/) ||
            cpuName.match(/Ryzen\s*[3579]\s*[1-5][0-9]{3}/i) ||
            cpuCodename.match(/Zen\s*[123+]|Vermeer|Matisse|Summit|Pinnacle/i)) {
            return CloverTemplates["amd_am4_zen"];
        }

        // AMD FX (AM3+ legacy)
        if (cpuName.match(/FX-|Vishera|Bulldozer|Piledriver/i) ||
            chipset.match(/990FX|990X|970/)) {
            return CloverTemplates["amd_fx"];
        }

        // Default AMD to AM4 template
        return CloverTemplates["amd_am4_zen"];
    }

    // Intel HEDT detection
    if (chipset.includes("X299")) return CloverTemplates["hedt_x299"];
    if (chipset.includes("X99")) return CloverTemplates["hedt_x99"];
    if (chipset.includes("X79")) return CloverTemplates["hedt_x79"];
    if (chipset.includes("X58")) return CloverTemplates["legacy_lga1366"];

    // Intel Desktop by chipset
    if (chipset.match(/Z[67]90|B[67]60|H[67]70/)) return CloverTemplates["desktop_600_700"];
    if (chipset.match(/Z590|B560|H570|H510/)) return CloverTemplates["desktop_500"];
    if (chipset.match(/Z[34]90|Z370|B[34]60|B365|H[34]70/)) return CloverTemplates["desktop_300_400"];
    if (chipset.match(/Z[12]70|B[12]50|H[12][17]0/)) return CloverTemplates["desktop_100_200"];

    // Intel Desktop by CPU generation fallback
    if (cpuCodename.includes("Alder") || cpuCodename.includes("Raptor") ||
        cpuCodename.includes("Arrow") || cpuCodename.includes("Meteor")) {
        return CloverTemplates["desktop_600_700"];
    }
    if (cpuCodename.includes("Rocket")) return CloverTemplates["desktop_500"];
    if (cpuCodename.includes("Coffee") || cpuCodename.includes("Comet")) return CloverTemplates["desktop_300_400"];
    if (cpuCodename.includes("Kaby") || cpuCodename.includes("Skylake")) return CloverTemplates["desktop_100_200"];
    if (cpuCodename.includes("Haswell") || cpuCodename.includes("Broadwell")) return CloverTemplates["desktop_haswell_broadwell"];
    if (cpuCodename.includes("Ivy") || cpuCodename.includes("Sandy")) return CloverTemplates["desktop_sandy_ivy"];

    // Legacy fallback
    if (cpuCodename.includes("Core 2") || cpuCodename.includes("Pentium")) {
        return CloverTemplates["legacy_lga775"];
    }

    // Default to 300/400 series
    return CloverTemplates["desktop_300_400"];
}

// Export for use in clover-generator.js
if (typeof window !== 'undefined') {
    window.CloverTemplates = CloverTemplates;
    window.selectCloverTemplate = selectCloverTemplate;
}
