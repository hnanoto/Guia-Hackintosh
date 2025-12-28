# 🍎 Guia Completo de Hackintosh - OpenCore 2025-2026

[![OpenCore](https://img.shields.io/badge/OpenCore-1.0.3-blue.svg)](https://github.com/acidanthera/OpenCorePkg)
[![macOS](https://img.shields.io/badge/macOS-Sequoia%2015.x-brightgreen.svg)](https://www.apple.com/macos/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Guia completo em português brasileiro para instalação de macOS em PCs usando OpenCore**

---

## 📖 Sobre

Este é um guia completo e atualizado para criar um Hackintosh usando **OpenCore**, com suporte para as versões mais recentes do macOS (Sequoia, Sonoma, Ventura) e hardware moderno (Intel 12ª/13ª/14ª geração, AMD Ryzen).

### ✨ Características

- 🌐 **Trilíngue**: Português (BR), Inglês (US) e Espanhol
- 🔧 **Hardware Analyzer**: Ferramenta integrada para análise de hardware
- 📝 **Config Generator**: Gerador automático de `config.plist`
- 🎯 **Suporte Moderno**: Intel Alder Lake, Raptor Lake, AMD Ryzen
- 📱 **Responsivo**: Interface adaptável para desktop e mobile

---

## 🚀 Acesso Rápido

### 🌐 Guia Online
**Acesse o guia completo**: [https://hnanoto.github.io/Guia-Hackintosh/](https://hnanoto.github.io/Guia-Hackintosh/)

### 📥 Uso Local
1. Clone o repositório:
   ```bash
   git clone https://github.com/hnanoto/Guia-Hackintosh.git
   ```
2. Abra `index.html` no navegador

---

## 🛠️ Ferramentas Incluídas

### 1. **Hardware Analyzer** 🔍
Analisa automaticamente seu hardware e recomenda configurações:
- Suporta relatórios **AIDA64** (HTML) e **HardwareSniffer** (JSON)
- Detecta CPU, GPU, Motherboard, Áudio, Rede
- Recomenda SMBIOS baseado no macOS alvo

### 2. **Config Generator** ⚙️
Gera `config.plist` personalizado automaticamente:
- **iGPU Properties**: Todas as gerações Intel (Sandy Bridge até Tiger Lake)
- **Audio Codecs**: 50+ codecs com layouts recomendados
- **Ethernet**: Intel, Realtek, Broadcom, Aquantia
- **Quirks**: Configurações precisas por geração de CPU/Chipset

---

## 📋 Conteúdo do Guia

### 🔰 Básico
- Requisitos de hardware
- Compatibilidade de CPU/GPU
- Limitações conhecidas

### 🔧 Instalação
- Criação de USB bootável
- Configuração de BIOS/UEFI
- Instalação do macOS
- Configuração pós-instalação

### 📚 Avançado
- ACPI e SSDTs explicados
- DeviceProperties detalhadas
- Kexts recomendados
- Troubleshooting

### 🎨 Pós-Instalação
- Configuração de DRM
- Áudio funcional
- iMessage e FaceTime
- Otimizações de performance

---

## 🖥️ Hardware Suportado

### CPU
- ✅ Intel: 2ª até 14ª geração (Sandy Bridge até Raptor Lake)
- ✅ AMD: Ryzen (Zen, Zen+, Zen 2, Zen 3, Zen 4)

### GPU
- ✅ Intel iGPU: HD 2000 até Iris Xe
- ✅ AMD: Polaris, Vega, Navi (RX 400-7000)
- ⚠️ NVIDIA: Apenas até macOS High Sierra (10.13)

### Motherboard
- ✅ Intel: Z170-Z790, B150-B760, H110-H770
- ✅ AMD: B350-B650, X370-X670

---

## 📦 Datasets Incluídos

O Config Generator v3.0 inclui databases completos:

### `datasets/igpu-properties.js`
- 60+ Device IDs de iGPU Intel
- Configurações por plataforma (Desktop/Laptop/NUC)
- Modos Headless e Display

### `datasets/codec-layouts.js`
- 50+ codecs de áudio (Realtek, Creative, Conexant, VIA)
- 200+ layouts com autores recomendados
- Seleção automática do melhor layout

### `datasets/ethernet-ids.js`
- Intel (I225/I226/I219/I211)
- Realtek (RTL8111/RTL8125)
- Broadcom (BCM57XX)
- Aquantia (AQC107/AQC108)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrou um erro ou tem uma sugestão:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adicionar MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Créditos

Este guia foi criado com base em:
- [Dortania OpenCore Install Guide](https://dortania.github.io/OpenCore-Install-Guide/)
- [OpCore-Simplify](https://github.com/luchina-gabriel/OpCore-Simplify)
- [Acidanthera](https://github.com/acidanthera) - OpenCore e Kexts
- Comunidade Hackintosh Brasil

### Ferramentas Utilizadas
- [OpenCore](https://github.com/acidanthera/OpenCorePkg)
- [ProperTree](https://github.com/corpnewt/ProperTree)
- [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS)
- [MountEFI](https://github.com/corpnewt/MountEFI)

---

## ⚠️ Aviso Legal

Este guia é apenas para fins educacionais. A instalação de macOS em hardware não-Apple pode violar os Termos de Serviço da Apple. Use por sua conta e risco.

**Não nos responsabilizamos por:**
- Perda de dados
- Danos ao hardware
- Violação de garantias
- Problemas legais

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 💬 Suporte

- **Issues**: [GitHub Issues](https://github.com/hnanoto/Guia-Hackintosh/issues)
- **Discussões**: [GitHub Discussions](https://github.com/hnanoto/Guia-Hackintosh/discussions)
- **Fórum**: [InsanelyMac](https://www.insanelymac.com/)

---

<div align="center">

**Feito com ❤️ pela comunidade Hackintosh Brasil**

[⬆ Voltar ao topo](#-guia-completo-de-hackintosh---opencore-2025-2026)

</div>
