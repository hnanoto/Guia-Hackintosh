// ============================================================================
// Ethernet Device IDs Database - Intel, Realtek, Broadcom, Aquantia
// Based on: Dortania OpenCore Install Guide + Kext Documentation
// ============================================================================

/**
 * Database de IDs de dispositivos Ethernet e suas configurações
 * 
 * Estrutura:
 * - manufacturer: Fabricante (Intel, Realtek, Broadcom, Aquantia)
 * - kext: Kext necessário
 * - properties: DeviceProperties necessárias (se houver)
 */

const ethernetDatabase = {
    // ========================================================================
    // Intel Ethernet
    // ========================================================================

    // Intel I225-V/I225-LM (2.5GbE) - Z490, Z590, Z690, B660
    "8086-15F2": {
        manufacturer: "Intel",
        model: "I225-V",
        speed: "2.5GbE",
        kext: "AppleIGC.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-15F3": {
        manufacturer: "Intel",
        model: "I225-LM",
        speed: "2.5GbE",
        kext: "AppleIGC.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-0D4C": {
        manufacturer: "Intel",
        model: "I225-IT",
        speed: "2.5GbE",
        kext: "AppleIGC.kext",
        properties: {
            "built-in": "01"
        }
    },

    // Intel I226-V/I226-LM (2.5GbE) - Z690, B660, H610
    "8086-125B": {
        manufacturer: "Intel",
        model: "I226-V",
        speed: "2.5GbE",
        kext: "AppleIGC.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-125C": {
        manufacturer: "Intel",
        model: "I226-LM",
        speed: "2.5GbE",
        kext: "AppleIGC.kext",
        properties: {
            "built-in": "01"
        }
    },

    // Intel I219-V/I219-LM (1GbE) - Z170-Z590
    "8086-15B7": {
        manufacturer: "Intel",
        model: "I219-LM",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-15B8": {
        manufacturer: "Intel",
        model: "I219-V",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-15D7": {
        manufacturer: "Intel",
        model: "I219-LM",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-15D8": {
        manufacturer: "Intel",
        model: "I219-V",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-15E3": {
        manufacturer: "Intel",
        model: "I219-LM",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-15F9": {
        manufacturer: "Intel",
        model: "I219-LM",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-15FA": {
        manufacturer: "Intel",
        model: "I219-V",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-0D4D": {
        manufacturer: "Intel",
        model: "I219-LM",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-0D4E": {
        manufacturer: "Intel",
        model: "I219-V",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },
    "8086-0D4F": {
        manufacturer: "Intel",
        model: "I219-LM",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },

    // Intel I211 (1GbE) - Comum em placas AMD
    "8086-1539": {
        manufacturer: "Intel",
        model: "I211",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },

    // Intel I210 (1GbE)
    "8086-1533": {
        manufacturer: "Intel",
        model: "I210",
        speed: "1GbE",
        kext: "IntelMausi.kext",
        properties: {
            "built-in": "01"
        }
    },

    // ========================================================================
    // Realtek Ethernet
    // ========================================================================

    // Realtek RTL8111 (1GbE) - Muito comum
    "10EC-8168": {
        manufacturer: "Realtek",
        model: "RTL8111",
        speed: "1GbE",
        kext: "RealtekRTL8111.kext",
        properties: {
            "built-in": "01"
        }
    },

    // Realtek RTL8125 (2.5GbE) - Comum em placas AMD B550/X570
    "10EC-8125": {
        manufacturer: "Realtek",
        model: "RTL8125",
        speed: "2.5GbE",
        kext: "LucyRTL8125Ethernet.kext",
        properties: {
            "built-in": "01"
        }
    },
    "10EC-8126": {
        manufacturer: "Realtek",
        model: "RTL8126",
        speed: "5GbE",
        kext: "LucyRTL8125Ethernet.kext",
        properties: {
            "built-in": "01"
        }
    },

    // Realtek RTL8100 (100Mbps) - Antigo
    "10EC-8136": {
        manufacturer: "Realtek",
        model: "RTL8100",
        speed: "100Mbps",
        kext: "RealtekRTL8111.kext",
        properties: {
            "built-in": "01"
        }
    },

    // ========================================================================
    // Broadcom Ethernet
    // ========================================================================

    // Broadcom BCM57XX (1GbE) - Comum em Macs reais
    "14E4-16B0": {
        manufacturer: "Broadcom",
        model: "BCM57761",
        speed: "1GbE",
        kext: "Native", // Suportado nativamente
        properties: {
            "built-in": "01"
        }
    },
    "14E4-16B1": {
        manufacturer: "Broadcom",
        model: "BCM57762",
        speed: "1GbE",
        kext: "Native",
        properties: {
            "built-in": "01"
        }
    },
    "14E4-16B4": {
        manufacturer: "Broadcom",
        model: "BCM57765",
        speed: "1GbE",
        kext: "Native",
        properties: {
            "built-in": "01"
        }
    },
    "14E4-16B5": {
        manufacturer: "Broadcom",
        model: "BCM57766",
        speed: "1GbE",
        kext: "Native",
        properties: {
            "built-in": "01"
        }
    },
    "14E4-1684": {
        manufacturer: "Broadcom",
        model: "BCM5764M",
        speed: "1GbE",
        kext: "Native",
        properties: {
            "built-in": "01"
        }
    },

    // Broadcom que precisa spoofing
    "14E4-1686": {
        manufacturer: "Broadcom",
        model: "BCM57766",
        speed: "1GbE",
        kext: "Native",
        properties: {
            "IOName": "pci14e4,16b4",
            "device-id": "B4160000",
            "built-in": "01"
        }
    },

    // ========================================================================
    // Aquantia AQtion (5GbE/10GbE)
    // ========================================================================

    // Aquantia AQC107 (10GbE)
    "1D6A-07B1": {
        manufacturer: "Aquantia",
        model: "AQC107",
        speed: "10GbE",
        kext: "AquantiaAQtion.kext",
        properties: {
            "IOName": "1D6A-91B1",
            "built-in": "01"
        }
    },
    "1D6A-D107": {
        manufacturer: "Aquantia",
        model: "AQC107",
        speed: "10GbE",
        kext: "AquantiaAQtion.kext",
        properties: {
            "IOName": "1D6A-91B1",
            "built-in": "01"
        }
    },
    "1D6A-87B1": {
        manufacturer: "Aquantia",
        model: "AQC107",
        speed: "10GbE",
        kext: "AquantiaAQtion.kext",
        properties: {
            "IOName": "1D6A-91B1",
            "built-in": "01"
        }
    },

    // Aquantia AQC108 (5GbE)
    "1D6A-08B1": {
        manufacturer: "Aquantia",
        model: "AQC108",
        speed: "5GbE",
        kext: "AquantiaAQtion.kext",
        properties: {
            "IOName": "1D6A-91B1",
            "built-in": "01"
        }
    },
    "1D6A-11B1": {
        manufacturer: "Aquantia",
        model: "AQC111",
        speed: "5GbE",
        kext: "AquantiaAQtion.kext",
        properties: {
            "IOName": "1D6A-91B1",
            "built-in": "01"
        }
    },

    // ========================================================================
    // Marvell Yukon (antigo, raro)
    // ========================================================================
    "11AB-4364": {
        manufacturer: "Marvell",
        model: "Yukon 88E8056",
        speed: "1GbE",
        kext: "MarvelYukonEthernet.kext",
        properties: {
            "built-in": "01"
        }
    }
};

/**
 * Função auxiliar para obter informações de Ethernet
 * @param {string} deviceId - Device ID (ex: "8086-15F2")
 * @returns {object} Informações do dispositivo
 */
function getEthernetInfo(deviceId) {
    const normalizedId = deviceId.toUpperCase();
    return ethernetDatabase[normalizedId] || null;
}

/**
 * Função para gerar DeviceProperties de Ethernet
 * @param {string} deviceId - Device ID
 * @param {string} pciPath - PCI Path do dispositivo
 * @returns {object} DeviceProperties
 */
function generateEthernetProperties(deviceId, pciPath = null) {
    const info = getEthernetInfo(deviceId);

    if (!info) {
        console.warn(`Ethernet device ${deviceId} not found in database`);
        // Fallback: apenas marcar como built-in
        return {
            "built-in": "01"
        };
    }

    // Retornar propriedades do database
    return { ...info.properties };
}

/**
 * Função para recomendar kext de Ethernet
 * @param {string} deviceId - Device ID
 * @returns {string} Nome do kext recomendado
 */
function getRecommendedEthernetKext(deviceId) {
    const info = getEthernetInfo(deviceId);

    if (!info) {
        return null;
    }

    return info.kext === "Native" ? null : info.kext;
}

// Export para uso no config-generator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ethernetDatabase,
        getEthernetInfo,
        generateEthernetProperties,
        getRecommendedEthernetKext
    };
}
