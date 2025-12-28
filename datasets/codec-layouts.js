// ============================================================================
// Audio Codec Layouts Database - Realtek, Creative, Conexant, etc.
// Based on: AppleALC + OpCore Simplify
// ============================================================================

/**
 * Database de Layouts de Áudio por Codec
 * 
 * Estrutura:
 * - Key: Device ID do codec (ex: "10EC-0887")
 * - Value: Array de layouts disponíveis
 * - Cada layout tem: id (número) e comment (descrição/autor)
 * 
 * Layouts recomendados são geralmente de autores conhecidos:
 * - Mirone, Toleda, InsanelyDeepak, DalianSky, vusun123
 */

const codecLayouts = {
    // ========================================================================
    // Realtek ALC887 - Desktop comum
    // ========================================================================
    "10EC-0887": [
        { id: 1, comment: "Toleda - Realtek ALC887", recommended: true },
        { id: 2, comment: "Toleda - Realtek ALC887", recommended: true },
        { id: 3, comment: "Toleda - Realtek ALC887", recommended: true },
        { id: 7, comment: "Mirone - Realtek ALC887", recommended: true },
        { id: 11, comment: "Realtek ALC887" },
        { id: 12, comment: "Realtek ALC887 for MSI B450 Tomahawk" },
        { id: 13, comment: "Realtek ALC887 for Gigabyte" },
        { id: 17, comment: "Realtek ALC887" },
        { id: 18, comment: "Realtek ALC887" },
        { id: 33, comment: "Realtek ALC887" },
        { id: 40, comment: "Realtek ALC887" },
        { id: 52, comment: "Realtek ALC887" },
        { id: 53, comment: "Realtek ALC887 for Asus" },
        { id: 87, comment: "Realtek ALC887" },
        { id: 99, comment: "Realtek ALC887" }
    ],

    // ========================================================================
    // Realtek ALC892 - Desktop comum
    // ========================================================================
    "10EC-0892": [
        { id: 1, comment: "Toleda - Realtek ALC892", recommended: true },
        { id: 2, comment: "Toleda - Realtek ALC892", recommended: true },
        { id: 3, comment: "Toleda - Realtek ALC892", recommended: true },
        { id: 4, comment: "Mirone - Realtek ALC892", recommended: true },
        { id: 5, comment: "Mirone - Realtek ALC892", recommended: true },
        { id: 7, comment: "Mirone - Realtek ALC892", recommended: true },
        { id: 12, comment: "Realtek ALC892" },
        { id: 15, comment: "Realtek ALC892" },
        { id: 16, comment: "Realtek ALC892" },
        { id: 17, comment: "Realtek ALC892" },
        { id: 18, comment: "Realtek ALC892" },
        { id: 20, comment: "Realtek ALC892" },
        { id: 28, comment: "Realtek ALC892" },
        { id: 31, comment: "Realtek ALC892" },
        { id: 32, comment: "Realtek ALC892" },
        { id: 90, comment: "Realtek ALC892" },
        { id: 92, comment: "Realtek ALC892" },
        { id: 97, comment: "Realtek ALC892" }
    ],

    // ========================================================================
    // Realtek ALC1220 - Desktop high-end (Z390, Z490, Z590, Z690)
    // ========================================================================
    "10EC-1220": [
        { id: 1, comment: "Toleda - Realtek ALC1220", recommended: true },
        { id: 2, comment: "Toleda - Realtek ALC1220", recommended: true },
        { id: 3, comment: "Toleda - Realtek ALC1220", recommended: true },
        { id: 5, comment: "Mirone - Realtek ALC1220", recommended: true },
        { id: 7, comment: "Mirone - Realtek ALC1220", recommended: true },
        { id: 11, comment: "Realtek ALC1220 for Asus Z270G" },
        { id: 13, comment: "Realtek ALC1220 for Asus Z690" },
        { id: 15, comment: "Realtek ALC1220 for Asus ROG Strix X570-F" },
        { id: 16, comment: "Realtek ALC1220 for MSI" },
        { id: 17, comment: "Realtek ALC1220" },
        { id: 21, comment: "Realtek ALC1220 5.1 outputs" },
        { id: 27, comment: "Realtek ALC1220" },
        { id: 28, comment: "Realtek ALC1220" },
        { id: 29, comment: "Realtek ALC1220" },
        { id: 34, comment: "Realtek ALC1220" }
    ],

    // ========================================================================
    // Realtek S1220A - Desktop high-end (Z490, Z590, Z690)
    // ========================================================================
    "10EC-1168": [
        { id: 1, comment: "Toleda - Realtek ALC S1220A", recommended: true },
        { id: 2, comment: "Toleda - Realtek ALC S1220A", recommended: true },
        { id: 3, comment: "Toleda - Realtek ALC S1220A", recommended: true },
        { id: 5, comment: "Mirone - Realtek ALC S1220A", recommended: true },
        { id: 7, comment: "Mirone - Realtek ALC S1220A", recommended: true },
        { id: 8, comment: "Realtek ALC S1220P MSI Z490i UNIFY" },
        { id: 11, comment: "Realtek ALC S1220A for Asus Z270G" },
        { id: 13, comment: "Realtek ALC S1220A for Asus ProArt Z690-Creator WiFi", recommended: true },
        { id: 15, comment: "Realtek ALC S1220A for Asus ROG Strix X570-F" },
        { id: 20, comment: "Realtek ALC S1220A 2.0 outputs" },
        { id: 21, comment: "Realtek ALC S1220A 5.1 outputs" },
        { id: 99, comment: "Realtek ALC S1220A 7.1 outputs (MSI X470)" }
    ],

    // ========================================================================
    // Realtek ALC256 - Laptop comum
    // ========================================================================
    "10EC-0256": [
        { id: 5, comment: "Realtek ALC256", recommended: true },
        { id: 11, comment: "Realtek ALC256 for Dell 7559", recommended: true },
        { id: 13, comment: "InsanelyDeepak - Realtek ALC256 for Dell Series", recommended: true },
        { id: 14, comment: "InsanelyDeepak - Realtek ALC256 for Dell with subwoofer", recommended: true },
        { id: 16, comment: "Realtek ALC256 for Dell 7000 Series 2.1Ch" },
        { id: 17, comment: "Realtek ALC256 for Magicbook 2018" },
        { id: 19, comment: "Realtek ALC256 for MateBook X Pro 2019" },
        { id: 21, comment: "Realtek ALC256 for Dell 5570" },
        { id: 22, comment: "Realtek ALC256 for Asus VivoBook Pro 17" },
        { id: 23, comment: "Realtek ALC256 for Razer Blade 15" },
        { id: 28, comment: "vusun123 - Realtek ALC256 for Asus X555UJ", recommended: true },
        { id: 56, comment: "DalianSky - Realtek ALC256 for Dell 7000", recommended: true },
        { id: 66, comment: "Realtek ALC256 for ASUS Y5000U" },
        { id: 69, comment: "Realtek ALC256 for Xiaomi Pro Enhanced 2019" },
        { id: 97, comment: "DalianSky - Realtek ALC256 for MateBook X Pro 2019", recommended: true },
        { id: 99, comment: "Realtek ALC256 for XiaoMiPro 2020" }
    ],

    // ========================================================================
    // Realtek ALC295 - Laptop comum
    // ========================================================================
    "10EC-0295": [
        { id: 1, comment: "Realtek ALC295 for HP Envy x360" },
        { id: 3, comment: "Mirone - Realtek ALC295", recommended: true },
        { id: 11, comment: "Realtek ALC295 for ZenBook UX581" },
        { id: 13, comment: "DalianSky - Realtek ALC295 for Dell 7570", recommended: true },
        { id: 14, comment: "InsanelyDeepak - Realtek ALC295 for Asus UX430UA", recommended: true },
        { id: 15, comment: "InsanelyDeepak - Realtek ALC295", recommended: true },
        { id: 21, comment: "Realtek ALC295 for Acer Nitro 5 Spin" },
        { id: 22, comment: "Realtek ALC295" },
        { id: 23, comment: "Realtek ALC295 for HP OMEN 15" },
        { id: 28, comment: "vusun123 - Realtek ALC295 for HP Pavilion", recommended: true }
    ],

    // ========================================================================
    // Realtek ALC298 - Laptop comum (Dell XPS, Lenovo)
    // ========================================================================
    "10EC-0298": [
        { id: 3, comment: "Mirone - Realtek ALC298 SP4", recommended: true },
        { id: 11, comment: "Realtek ALC298 for Alienware 17 R4" },
        { id: 13, comment: "InsanelyDeepak - Realtek ALC298", recommended: true },
        { id: 15, comment: "Realtek ALC298 for Dell Precision 5540" },
        { id: 21, comment: "Realtek ALC298 for Lenovo 720S-15IKB" },
        { id: 22, comment: "Realtek ALC298 for Razer Blade 14 2017" },
        { id: 28, comment: "vusun123 - Realtek ALC298 for Dell XPS 9x50", recommended: true },
        { id: 29, comment: "vusun123 - Realtek ALC298 for Lenovo X270", recommended: true },
        { id: 30, comment: "Realtek ALC298 for Xiaomi Mi Notebook Air 13.3" },
        { id: 47, comment: "Daliansky - Realtek ALC298 for ThinkPad T470p", recommended: true },
        { id: 72, comment: "Realtek ALC298 for Dell XPS 9560" },
        { id: 99, comment: "Daliansky - Realtek ALC298 for XiaoMi Pro", recommended: true }
    ],

    // ========================================================================
    // Realtek ALC269 - Laptop comum (muito genérico)
    // ========================================================================
    "10EC-0269": [
        { id: 1, comment: "Mirone - Realtek ALC269 for Asus N53J", recommended: true },
        { id: 3, comment: "Realtek ALC269", recommended: true },
        { id: 7, comment: "Mirone - Realtek ALC269-VC v2", recommended: true },
        { id: 11, comment: "Realtek ALC269VB for Dell Precision T1600" },
        { id: 12, comment: "Realtek ALC269VB for Asus Vivobook S200CE" },
        { id: 13, comment: "InsanelyDeepak - Realtek ALC269VC for Samsung", recommended: true },
        { id: 15, comment: "Realtek ALC269VB for Dell Optiplex 790" },
        { id: 18, comment: "Realtek ALC269VC for ThinkPad X230" },
        { id: 20, comment: "Realtek ALC269" },
        { id: 21, comment: "Realtek ALC269VB for Dell Optiplex 7010" },
        { id: 23, comment: "Realtek ALC269VD for ThinkPad T430" },
        { id: 27, comment: "Realtek ALC269" },
        { id: 28, comment: "Realtek ALC269VC" },
        { id: 33, comment: "Realtek ALC269VC for Samsung NP530U3C" },
        { id: 40, comment: "vusun123 - Realtek ALC269VC for Lenovo W530", recommended: true },
        { id: 55, comment: "Realtek ALC269VC for ThinkPad X230 with Dock" }
    ],

    // ========================================================================
    // Realtek ALC282 - Laptop
    // ========================================================================
    "10EC-0282": [
        { id: 3, comment: "Mirone - Realtek ALC282 v1", recommended: true },
        { id: 4, comment: "Mirone - Realtek ALC282 v2", recommended: true },
        { id: 13, comment: "InsanelyDeepak - Realtek ALC282", recommended: true },
        { id: 21, comment: "DalianSky - Realtek ALC282 for TinyMonster ECO", recommended: true },
        { id: 27, comment: "Realtek ALC282 for Acer Aspire on IvyBridge" },
        { id: 28, comment: "Realtek ALC282 for Acer Aspire E1-572G" },
        { id: 30, comment: "Realtek ALC282 for Soarsea S210H" }
    ],

    // ========================================================================
    // Realtek ALC662 - Desktop budget
    // ========================================================================
    "10EC-0662": [
        { id: 5, comment: "Mirone - Realtek ALC662", recommended: true },
        { id: 7, comment: "Mirone - Realtek ALC662", recommended: true },
        { id: 11, comment: "Realtek ALC662" },
        { id: 12, comment: "Realtek ALC662" },
        { id: 13, comment: "Realtek ALC662" },
        { id: 15, comment: "Realtek ALC662" },
        { id: 16, comment: "Realtek ALC662" },
        { id: 17, comment: "Realtek ALC662" }
    ],

    // ========================================================================
    // Realtek ALC668 - Laptop
    // ========================================================================
    "10EC-0668": [
        { id: 3, comment: "Mirone - Realtek ALC668", recommended: true },
        { id: 11, comment: "Realtek ALC668" },
        { id: 12, comment: "Realtek ALC668" },
        { id: 13, comment: "InsanelyDeepak - Realtek ALC668", recommended: true },
        { id: 20, comment: "Realtek ALC668" },
        { id: 27, comment: "Realtek ALC668" },
        { id: 28, comment: "Realtek ALC668" },
        { id: 29, comment: "Realtek ALC668" }
    ],

    // ========================================================================
    // Realtek ALC671 - Desktop
    // ========================================================================
    "10EC-0671": [
        { id: 12, comment: "Realtek ALC671", recommended: true },
        { id: 15, comment: "Realtek ALC671" },
        { id: 16, comment: "Realtek ALC671" }
    ],

    // ========================================================================
    // Realtek ALC700 - Desktop high-end
    // ========================================================================
    "10EC-0700": [
        { id: 11, comment: "Realtek ALC700", recommended: true },
        { id: 12, comment: "Realtek ALC700" }
    ],

    // ========================================================================
    // Creative CA0132 - Desktop/Laptop (Alienware, Sound Blaster)
    // ========================================================================
    "1102-0011": [
        { id: 0, comment: "Creative CA0132 default" },
        { id: 1, comment: "Creative CA0132 for Alienware 15 R2", recommended: true },
        { id: 2, comment: "Creative CA0132 for Alienware 17 Desktop", recommended: true },
        { id: 3, comment: "Creative CA0132 2.0 + rear line-out" },
        { id: 5, comment: "Creative CA0132 2.0 front HP + Mic" },
        { id: 6, comment: "Creative CA0132 5.1 with front HP" },
        { id: 11, comment: "Creative CA0132 5.1 channel" },
        { id: 99, comment: "Creative CA0132 5.1 for Alienware M17X R4", recommended: true }
    ],

    // ========================================================================
    // Conexant CX20632 - Desktop/Laptop (HP)
    // ========================================================================
    "14F1-5098": [
        { id: 20, comment: "Conexant CX20632 for HP Elitedesk 800 G5", recommended: true },
        { id: 21, comment: "Conexant CX20632 for Axioo MyPC One Pro H5" },
        { id: 23, comment: "Conexant CX20632 for HP ProDesk 480 G4" },
        { id: 28, comment: "Conexant CX20632" }
    ],

    // ========================================================================
    // VIA VT2020/VT2021 - Desktop (raro)
    // ========================================================================
    "1106-0441": [
        { id: 13, comment: "VIA VT2020", recommended: true }
    ],
    "1106-0438": [
        { id: 13, comment: "VIA VT2021", recommended: true }
    ]
};

/**
 * Função auxiliar para obter layouts de um codec
 * @param {string} codecId - Device ID do codec (ex: "10EC-1220")
 * @returns {array} Array de layouts disponíveis
 */
function getCodecLayouts(codecId) {
    const normalizedId = codecId.toUpperCase();
    return codecLayouts[normalizedId] || [];
}

/**
 * Função para selecionar o melhor layout automaticamente
 * @param {string} codecId - Device ID do codec
 * @returns {number} Layout ID recomendado
 */
function getRecommendedLayout(codecId) {
    const layouts = getCodecLayouts(codecId);

    if (layouts.length === 0) {
        console.warn(`Codec ${codecId} not found in database`);
        return 1; // Fallback para layout 1
    }

    // Procurar por layout recomendado
    const recommended = layouts.find(layout => layout.recommended);
    if (recommended) {
        return recommended.id;
    }

    // Procurar por autores conhecidos
    const knownAuthors = ['Mirone', 'Toleda', 'InsanelyDeepak', 'DalianSky', 'vusun123'];
    for (const author of knownAuthors) {
        const authorLayout = layouts.find(layout =>
            layout.comment.toLowerCase().includes(author.toLowerCase())
        );
        if (authorLayout) {
            return authorLayout.id;
        }
    }

    // Fallback para o primeiro layout
    return layouts[0].id;
}

/**
 * Função para converter layout ID para bytes (little-endian)
 * @param {number} layoutId - Layout ID (ex: 1, 7, 11)
 * @returns {string} Bytes em formato hexadecimal (ex: "01000000")
 */
function layoutIdToBytes(layoutId) {
    const bytes = new Uint8Array(4);
    bytes[0] = layoutId & 0xFF;
    bytes[1] = (layoutId >> 8) & 0xFF;
    bytes[2] = (layoutId >> 16) & 0xFF;
    bytes[3] = (layoutId >> 24) & 0xFF;
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Export para uso no config-generator.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        codecLayouts,
        getCodecLayouts,
        getRecommendedLayout,
        layoutIdToBytes
    };
}
