// ============================================================================
// iGPU Properties Database - Intel Integrated Graphics
// Based on: Dortania OpenCore Install Guide + WhateverGreen Documentation
// ============================================================================

/**
 * Intel iGPU Properties por Geração e Plataforma
 * 
 * Estrutura:
 * - deviceId: ID do dispositivo Intel (últimos 4 dígitos do Device ID)
 * - generation: Nome da geração (Sandy Bridge, Ivy Bridge, etc.)
 * - properties: Objeto com propriedades por plataforma (desktop, laptop, nuc)
 */

const iGPUDatabase = {
    // ========================================================================
    // Sandy Bridge (2nd Gen) - HD 2000/3000
    // Device IDs: 0102, 0106, 0116, 0126, 0112, 0122
    // ========================================================================
    "0102": {
        generation: "Sandy Bridge",
        desktop: {
            headless: {
                "AAPL,snb-platform-id": "00000500",
                "device-id": "02010000"
            },
            display: {
                "AAPL,snb-platform-id": "10000300"
            }
        },
        laptop: {
            "AAPL,snb-platform-id": "00000100"
        }
    },
    "0106": {
        generation: "Sandy Bridge",
        desktop: {
            "AAPL,snb-platform-id": "10000300"
        },
        laptop: {
            "AAPL,snb-platform-id": "00000100"
        }
    },
    "0116": {
        generation: "Sandy Bridge",
        desktop: {
            "AAPL,snb-platform-id": "10000300"
        },
        laptop: {
            "AAPL,snb-platform-id": "00000100"
        }
    },

    // ========================================================================
    // Ivy Bridge (3rd Gen) - HD 4000
    // Device IDs: 0152, 0156, 0162, 0166
    // ========================================================================
    "0152": {
        generation: "Ivy Bridge",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "07006201"
            },
            display: {
                "AAPL,ig-platform-id": "0A006601"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "03006601"
        },
        nuc: {
            "AAPL,ig-platform-id": "0B006601"
        }
    },
    "0156": {
        generation: "Ivy Bridge",
        desktop: {
            "AAPL,ig-platform-id": "0A006601"
        },
        laptop: {
            "AAPL,ig-platform-id": "04006601",
            "framebuffer-memorycount": "02000000",
            "framebuffer-pipecount": "02000000",
            "framebuffer-portcount": "04000000",
            "framebuffer-stolenmem": "00000004"
        }
    },
    "0162": {
        generation: "Ivy Bridge",
        desktop: {
            "AAPL,ig-platform-id": "0A006601"
        },
        laptop: {
            "AAPL,ig-platform-id": "03006601"
        }
    },
    "0166": {
        generation: "Ivy Bridge",
        desktop: {
            "AAPL,ig-platform-id": "0A006601"
        },
        laptop: {
            "AAPL,ig-platform-id": "04006601"
        }
    },

    // ========================================================================
    // Haswell (4th Gen) - HD 4600
    // Device IDs: 0412, 0416, 041E, 0A16, 0A1E, 0A26, 0A2E, 0D22, 0D26
    // ========================================================================
    "0412": {
        generation: "Haswell",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "04001204"
            },
            display: {
                "AAPL,ig-platform-id": "0300220D",
                "framebuffer-stolenmem": "00003001",
                "framebuffer-fbmem": "00009000"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "0600260A",
            "framebuffer-cursormem": "00009000"
        },
        nuc: {
            "AAPL,ig-platform-id": "0300220D",
            "framebuffer-cursormem": "00009000"
        }
    },
    "0416": {
        generation: "Haswell",
        desktop: {
            "AAPL,ig-platform-id": "0300220D",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        },
        laptop: {
            "AAPL,ig-platform-id": "0600260A",
            "framebuffer-cursormem": "00009000"
        }
    },
    "0A26": {
        generation: "Haswell",
        desktop: {
            "AAPL,ig-platform-id": "0300220D"
        },
        laptop: {
            "AAPL,ig-platform-id": "0500260A",
            "framebuffer-cursormem": "00009000"
        }
    },
    "0D22": {
        generation: "Haswell",
        desktop: {
            "AAPL,ig-platform-id": "0300220D",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "0D26": {
        generation: "Haswell",
        laptop: {
            "AAPL,ig-platform-id": "0500260A"
        }
    },

    // ========================================================================
    // Broadwell (5th Gen) - HD 5500/6000
    // Device IDs: 0BD1, 0BD2, 0BD3, 1606, 160E, 161E, 1612, 1616, 161B, 1622, 1626, 162B
    // ========================================================================
    "1612": {
        generation: "Broadwell",
        desktop: {
            "AAPL,ig-platform-id": "07002216",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        },
        laptop: {
            "AAPL,ig-platform-id": "06002616",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        },
        nuc: {
            "AAPL,ig-platform-id": "02001616",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "1616": {
        generation: "Broadwell",
        desktop: {
            "AAPL,ig-platform-id": "07002216",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        },
        laptop: {
            "AAPL,ig-platform-id": "06002616",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "1622": {
        generation: "Broadwell",
        desktop: {
            "AAPL,ig-platform-id": "07002216"
        },
        laptop: {
            "AAPL,ig-platform-id": "06002616"
        }
    },
    "1626": {
        generation: "Broadwell",
        laptop: {
            "AAPL,ig-platform-id": "06002616",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },

    // ========================================================================
    // Skylake (6th Gen) - HD 530
    // Device IDs: 1912, 1916, 191B, 191E, 1926, 1927, 1932, 193B
    // ========================================================================
    "1912": {
        generation: "Skylake",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "01001219"
            },
            display: {
                "AAPL,ig-platform-id": "00001219",
                "framebuffer-stolenmem": "00003001",
                "framebuffer-fbmem": "00009000"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "00001619",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "1916": {
        generation: "Skylake",
        desktop: {
            "AAPL,ig-platform-id": "00001219"
        },
        laptop: {
            "AAPL,ig-platform-id": "00001619",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "191B": {
        generation: "Skylake",
        desktop: {
            "AAPL,ig-platform-id": "00001219"
        },
        laptop: {
            "AAPL,ig-platform-id": "00001619"
        }
    },
    "191E": {
        generation: "Skylake",
        laptop: {
            "AAPL,ig-platform-id": "00001619"
        }
    },
    "1926": {
        generation: "Skylake",
        laptop: {
            "AAPL,ig-platform-id": "00001619"
        }
    },
    "1927": {
        generation: "Skylake",
        laptop: {
            "AAPL,ig-platform-id": "00001619"
        }
    },

    // ========================================================================
    // Kaby Lake (7th Gen) - HD 630
    // Device IDs: 5912, 5916, 591B, 591E, 5926, 5927
    // ========================================================================
    "5912": {
        generation: "Kaby Lake",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "03001259"
            },
            display: {
                "AAPL,ig-platform-id": "00001259",
                "framebuffer-stolenmem": "00003001",
                "framebuffer-fbmem": "00009000"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "00001659",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "5916": {
        generation: "Kaby Lake",
        desktop: {
            "AAPL,ig-platform-id": "00001259"
        },
        laptop: {
            "AAPL,ig-platform-id": "00001659"
        }
    },
    "591B": {
        generation: "Kaby Lake",
        desktop: {
            "AAPL,ig-platform-id": "00001259"
        },
        laptop: {
            "AAPL,ig-platform-id": "00001659"
        }
    },
    "591E": {
        generation: "Kaby Lake",
        laptop: {
            "AAPL,ig-platform-id": "00001659"
        }
    },

    // ========================================================================
    // Coffee Lake (8th/9th Gen) - UHD 630
    // Device IDs: 3E91, 3E92, 3E98, 3E9B, 3EA5
    // ========================================================================
    "3E91": {
        generation: "Coffee Lake",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "0300913E",
                "device-id": "923E0000"
            },
            display: {
                "AAPL,ig-platform-id": "00009B3E",
                "device-id": "9B3E0000",
                "framebuffer-patch-enable": "01000000",
                "framebuffer-stolenmem": "00003001",
                "framebuffer-fbmem": "00009000"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "device-id": "A53E0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },
    "3E92": {
        generation: "Coffee Lake",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "0300923E"
            },
            display: {
                "AAPL,ig-platform-id": "00009B3E",
                "device-id": "9B3E0000",
                "framebuffer-patch-enable": "01000000",
                "framebuffer-stolenmem": "00003001",
                "framebuffer-fbmem": "00009000"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },
    "3E98": {
        generation: "Coffee Lake",
        desktop: {
            "AAPL,ig-platform-id": "00009B3E",
            "device-id": "9B3E0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        },
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },
    "3E9B": {
        generation: "Coffee Lake",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "07009B3E",
                "device-id": "9B3E0000"
            },
            display: {
                "AAPL,ig-platform-id": "00009B3E",
                "device-id": "9B3E0000",
                "framebuffer-patch-enable": "01000000",
                "framebuffer-stolenmem": "00003001",
                "framebuffer-fbmem": "00009000"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },
    "3EA5": {
        generation: "Coffee Lake",
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },

    // ========================================================================
    // Comet Lake (10th Gen) - UHD 630
    // Device IDs: 9BC4, 9BC5, 9BC8, 9BCA
    // ========================================================================
    "9BC4": {
        generation: "Comet Lake",
        desktop: {
            headless: {
                "AAPL,ig-platform-id": "0300C89B"
            },
            display: {
                "AAPL,ig-platform-id": "00009B3E",
                "device-id": "9B3E0000",
                "framebuffer-patch-enable": "01000000",
                "framebuffer-stolenmem": "00003001",
                "framebuffer-fbmem": "00009000"
            }
        },
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "device-id": "A53E0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },
    "9BC5": {
        generation: "Comet Lake",
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "device-id": "A53E0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },
    "9BC8": {
        generation: "Comet Lake",
        desktop: {
            "AAPL,ig-platform-id": "00009B3E",
            "device-id": "9B3E0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        },
        laptop: {
            "AAPL,ig-platform-id": "0900A53E",
            "device-id": "A53E0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001"
        }
    },

    // ========================================================================
    // Ice Lake (10th Gen) - Iris Plus
    // Device IDs: 8A51, 8A52, 8A53, 8A5A, 8A5C
    // ========================================================================
    "8A51": {
        generation: "Ice Lake",
        laptop: {
            "AAPL,ig-platform-id": "00008A52",
            "device-id": "528A0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "8A52": {
        generation: "Ice Lake",
        laptop: {
            "AAPL,ig-platform-id": "00008A52",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "8A53": {
        generation: "Ice Lake",
        laptop: {
            "AAPL,ig-platform-id": "00008A52",
            "device-id": "528A0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },

    // ========================================================================
    // Tiger Lake (11th Gen) - Iris Xe
    // Device IDs: 9A49, 9A40, 9A60, 9A68, 9A70, 9A78
    // Nota: Suporte limitado no macOS (apenas Monterey+)
    // ========================================================================
    "9A49": {
        generation: "Tiger Lake",
        laptop: {
            "AAPL,ig-platform-id": "00009A49",
            "device-id": "499A0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "9A40": {
        generation: "Tiger Lake",
        laptop: {
            "AAPL,ig-platform-id": "00009A49",
            "device-id": "499A0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    },
    "9A60": {
        generation: "Tiger Lake",
        laptop: {
            "AAPL,ig-platform-id": "00009A49",
            "device-id": "499A0000",
            "framebuffer-patch-enable": "01000000",
            "framebuffer-stolenmem": "00003001",
            "framebuffer-fbmem": "00009000"
        }
    }
};

/**
 * Função auxiliar para obter propriedades de iGPU
 * @param {string} deviceId - Device ID da iGPU (ex: "3E9B")
 * @param {string} platform - Plataforma (Desktop, Laptop, NUC)
 * @param {boolean} hasMonitor - Se há monitor conectado na iGPU
 * @returns {object} Propriedades da iGPU
 */
function getIGPUProperties(deviceId, platform = "Desktop", hasMonitor = true) {
    const normalizedDeviceId = deviceId.toUpperCase().replace(/^8086-/, '');
    const igpu = iGPUDatabase[normalizedDeviceId];

    if (!igpu) {
        console.warn(`iGPU Device ID ${deviceId} not found in database`);
        return null;
    }

    const platformKey = platform.toLowerCase();
    let properties = null;

    // Desktop pode ter headless ou display
    if (platformKey === "desktop" && igpu.desktop) {
        if (!hasMonitor && igpu.desktop.headless) {
            properties = igpu.desktop.headless;
        } else if (igpu.desktop.display) {
            properties = igpu.desktop.display;
        } else {
            properties = igpu.desktop;
        }
    }
    // Laptop
    else if (platformKey === "laptop" && igpu.laptop) {
        properties = igpu.laptop;
    }
    // NUC
    else if (platformKey === "nuc" && igpu.nuc) {
        properties = igpu.nuc;
    }
    // Fallback para desktop se não houver plataforma específica
    else if (igpu.desktop) {
        properties = igpu.desktop.display || igpu.desktop;
    }

    return properties ? { ...properties } : null;
}

// Export para uso no config-generator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { iGPUDatabase, getIGPUProperties };
}
