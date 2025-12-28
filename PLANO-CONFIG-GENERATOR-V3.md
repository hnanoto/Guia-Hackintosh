# 🎯 Plano de Melhorias: Config Generator v3.0
## Baseado 100% no OpCore Simplify

---

## 📋 **Status Atual**

### ✅ **Funcionalidades Implementadas (v2.0)**
1. ✅ Parser AIDA64 HTML (com detecção de links)
2. ✅ Parser HardwareSniffer JSON
3. ✅ Seleção dinâmica de SMBIOS por versão do macOS
4. ✅ Detecção de CPU (Intel/AMD, todas as gerações)
5. ✅ Detecção de GPU (Intel iGPU, AMD, NVIDIA)
6. ✅ Detecção de Motherboard e Chipset
7. ✅ Quirks básicos por geração (Booter, Kernel, UEFI)
8. ✅ Boot-args essenciais (debug, agdpmod, alcid)
9. ✅ CPUID Spoofing (Alder/Raptor Lake)
10. ✅ macOS Tahoe 26.x suportado

---

## 🚀 **Melhorias Planejadas (v3.0)**

### **Fase 1: DeviceProperties Completos** (ALTA PRIORIDADE)

#### **1.1 iGPU Properties - Intel Integrated Graphics**
**Objetivo**: Configurar corretamente a iGPU Intel para todas as gerações

**Gerações Suportadas**:
- Sandy Bridge (2nd Gen) - HD 2000/3000
- Ivy Bridge (3rd Gen) - HD 4000
- Haswell (4th Gen) - HD 4600
- Broadwell (5th Gen) - HD 5500/6000
- Skylake (6th Gen) - HD 530
- Kaby Lake (7th Gen) - HD 630
- Coffee Lake (8th/9th Gen) - UHD 630
- Comet Lake (10th Gen) - UHD 630
- Ice Lake (10th Gen) - Iris Plus
- Tiger Lake (11th Gen) - Iris Xe

**Propriedades por Plataforma**:
```javascript
// Desktop Headless (sem monitor na iGPU)
{
  "AAPL,ig-platform-id": "07009B3E",
  "device-id": "9B3E0000"
}

// Desktop com Monitor
{
  "AAPL,ig-platform-id": "00009B3E",
  "framebuffer-patch-enable": "01000000",
  "framebuffer-stolenmem": "00003001",
  "framebuffer-fbmem": "00009000"
}

// Laptop
{
  "AAPL,ig-platform-id": "0900A53E",
  "framebuffer-patch-enable": "01000000",
  "framebuffer-stolenmem": "00003001"
}

// NUC
{
  "AAPL,ig-platform-id": "0000A53E"
}
```

**Complexidade**: ~300 linhas de código  
**Tempo estimado**: 1-2 horas

---

#### **1.2 Audio Codec Layouts**
**Objetivo**: Selecionar automaticamente o layout-id correto para cada codec de áudio

**Database de Codecs**:
- Realtek ALC: 200+ codecs (ALC887, ALC892, ALC1220, etc.)
- Creative CA: 20+ codecs
- VIA VT: 10+ codecs
- Conexant CX: 15+ codecs

**Exemplo de Layouts**:
```javascript
const codecLayouts = {
  "10EC-0887": [1, 2, 3, 7, 11, 13, 17, 18, 33, 40, 52, 53, 87, 99],
  "10EC-0892": [1, 2, 3, 4, 5, 7, 12, 15, 16, 17, 18, 20, 28, 31, 32, 90, 92, 97],
  "10EC-1220": [1, 2, 3, 5, 7, 11, 13, 15, 16, 17, 21, 27, 28, 29, 34],
  // ... 200+ codecs
};
```

**Seleção Automática**:
1. Detectar codec no hardware report
2. Buscar layouts disponíveis
3. Selecionar layout recomendado (baseado em autor: Mirone, Toleda, etc.)
4. Aplicar em DeviceProperties

**Complexidade**: ~500 linhas (dataset) + ~100 linhas (lógica)  
**Tempo estimado**: 2-3 horas

---

#### **1.3 Ethernet Properties**
**Objetivo**: Configurar propriedades para placas de rede Ethernet

**Fabricantes Suportados**:
- Intel (I225, I226, I219, I211)
- Realtek (RTL8111, RTL8125)
- Broadcom (BCM57XX)
- Aquantia (AQtion)

**Propriedades**:
```javascript
// Intel Ethernet
{
  "built-in": "01"
}

// Broadcom BCM57XX
{
  "IOName": "pci14e4,16b4",
  "device-id": "B4160000"
}

// Aquantia AQtion
{
  "IOName": "1D6A-91B1"
}
```

**Complexidade**: ~100 linhas  
**Tempo estimado**: 30 minutos

---

### **Fase 2: Suporte a Notebooks** (MÉDIA PRIORIDADE)

#### **2.1 Detecção de Plataforma**
**Objetivo**: Detectar automaticamente se é Desktop, Laptop ou NUC

**Métodos de Detecção**:
1. Verificar "Platform" no hardware report
2. Verificar nome da motherboard (contém "NUC"?)
3. Verificar presença de bateria
4. Verificar tipo de chassis (DMI)

**Complexidade**: ~50 linhas  
**Tempo estimado**: 30 minutos

---

#### **2.2 SSDTs para Notebooks**
**Objetivo**: Recomendar SSDTs específicos para notebooks

**SSDTs Essenciais**:
- SSDT-PLUG.aml - CPU Power Management
- SSDT-EC.aml - Embedded Controller
- SSDT-PNLF.aml - Backlight Control
- SSDT-XOSI.aml - OS Check Patches
- SSDT-GPI0.aml - I2C Trackpad (se aplicável)

**Complexidade**: ~100 linhas  
**Tempo estimado**: 1 hora

---

#### **2.3 Quirks para Notebooks**
**Objetivo**: Aplicar quirks específicos para notebooks

**Quirks Adicionais**:
```javascript
{
  Kernel: {
    LapicKernelPanic: true, // Para alguns HP/Dell
    PanicNoKextDump: true
  },
  UEFI: {
    UnblockFsConnect: true // Para alguns HP
  }
}
```

**Complexidade**: ~50 linhas  
**Tempo estimado**: 30 minutos

---

### **Fase 3: Kexts Inteligentes** (MÉDIA PRIORIDADE)

#### **3.1 Seleção Automática de Kexts**
**Objetivo**: Recomendar kexts baseado no hardware detectado

**Kexts por Hardware**:

**Ethernet**:
- Intel I225/I226 → AppleIGC.kext
- Intel I219/I211 → IntelMausi.kext
- Realtek RTL8111 → RealtekRTL8111.kext
- Realtek RTL8125 → LucyRTL8125Ethernet.kext
- Aquantia AQtion → AquantiaAQtion.kext

**Wi-Fi**:
- Intel AX200/AX201/AX210 → AirportItlwm.kext + IntelBluetoothFirmware.kext
- Broadcom BCM94360/BCM943602 → AirportBrcmFixup.kext + BrcmPatchRAM3.kext
- Atheros AR9285/AR9287 → AirPortAtheros40.kext

**CPU**:
- AMD Ryzen → AMDRyzenCPUPowerManagement.kext + SMCAMDProcessor.kext

**Sensors**:
- Notebooks → SMCBatteryManager.kext + SMCLightSensor.kext
- Desktops → SMCSuperIO.kext

**Complexidade**: ~300 linhas  
**Tempo estimado**: 2 horas

---

### **Fase 4: Melhorias Avançadas** (BAIXA PRIORIDADE)

#### **4.1 Kernel Patches**
**Objetivo**: Aplicar patches de kernel específicos

**Patches Comuns**:
- AMD Ryzen: Patches de kernel para suporte AMD
- Intel 12th/13th Gen: Patches para E-cores
- Ethernet: Patches para placas não suportadas

**Complexidade**: ~200 linhas  
**Tempo estimado**: 2 horas

---

#### **4.2 ACPI Patches**
**Objetivo**: Recomendar patches ACPI necessários

**Patches Comuns**:
- _OSI → XOSI (para SSDT-XOSI)
- EC0 → EC (para SSDT-EC)
- GPI0 → XGPI (para SSDT-GPI0)

**Complexidade**: ~100 linhas  
**Tempo estimado**: 1 hora

---

## 📊 **Resumo de Complexidade**

| Fase | Funcionalidade | Linhas de Código | Tempo Estimado |
|------|----------------|------------------|----------------|
| 1.1 | iGPU Properties | ~300 | 1-2h |
| 1.2 | Audio Layouts | ~600 | 2-3h |
| 1.3 | Ethernet Properties | ~100 | 30min |
| 2.1 | Detecção de Plataforma | ~50 | 30min |
| 2.2 | SSDTs Notebooks | ~100 | 1h |
| 2.3 | Quirks Notebooks | ~50 | 30min |
| 3.1 | Kexts Inteligentes | ~300 | 2h |
| 4.1 | Kernel Patches | ~200 | 2h |
| 4.2 | ACPI Patches | ~100 | 1h |
| **TOTAL** | | **~1800 linhas** | **10-13 horas** |

---

## 🎯 **Recomendação**

### **Implementação Incremental (RECOMENDADO)**

**Prioridade 1 (CRÍTICA)** - Implementar AGORA:
- ✅ iGPU Properties (1-2h)
- ✅ Audio Layouts (2-3h)
- ✅ Ethernet Properties (30min)

**Total**: ~1000 linhas, 4-6 horas

**Prioridade 2 (ALTA)** - Implementar em seguida:
- 🔲 Detecção de Plataforma
- 🔲 SSDTs Notebooks
- 🔲 Kexts Inteligentes

**Prioridade 3 (MÉDIA)** - Implementar depois:
- 🔲 Quirks Notebooks
- 🔲 Kernel Patches
- 🔲 ACPI Patches

---

## ⚠️ **Limitações Conhecidas**

1. **Não gera SSDTs automaticamente** - Usuário precisa baixar do Dortania
2. **Não baixa kexts automaticamente** - Apenas recomenda
3. **Não gera serial numbers** - Usuário precisa usar GenSMBIOS
4. **Não valida hardware incompatível** - Ex: NVIDIA em Monterey+

---

## 📝 **Arquivos a Criar**

### **Datasets** (JavaScript puro):
1. `datasets/igpu-properties.js` - Propriedades de iGPU por geração
2. `datasets/codec-layouts.js` - Layouts de áudio (200+ codecs)
3. `datasets/ethernet-ids.js` - IDs de placas Ethernet
4. `datasets/kext-database.js` - Database de kexts e regras
5. `datasets/pci-ids.js` - IDs de dispositivos PCI

### **Funções** (em config-generator.js):
1. `generateIGPUProperties()` - Gera propriedades de iGPU
2. `selectAudioLayout()` - Seleciona layout de áudio
3. `generateEthernetProperties()` - Gera propriedades Ethernet
4. `detectPlatform()` - Detecta Desktop/Laptop/NUC
5. `recommendKexts()` - Recomenda kexts por hardware
6. `recommendSSDTs()` - Recomenda SSDTs necessários

---

## 🚀 **Próximos Passos**

1. ✅ Desbloquear `.gitignore` para arquivos `.md`
2. ✅ Criar datasets JavaScript
3. ✅ Implementar Fase 1 (DeviceProperties)
4. ✅ Testar com hardware real
5. ✅ Validar config.plist gerado
6. ✅ Documentar uso

---

**Criado em**: 2025-12-28  
**Versão**: 1.0  
**Autor**: Antigravity AI + Rick (hnanoto)
