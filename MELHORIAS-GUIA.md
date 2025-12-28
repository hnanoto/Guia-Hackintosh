# 📋 MELHORIAS PARA O GUIA DE HACKINTOSH

Este documento contém todas as melhorias sugeridas organizadas por seção.
Você pode copiar e colar cada seção HTML no seu guia existente.

---

## 📑 ÍNDICE DE MELHORIAS

1. [Seção de Pós-Instalação](#pós-instalação)
2. [ACPI/SSDTs Explicados](#acpi-ssdts)
3. [Config.plist Detalhado](#config-plist-detalhado)
4. [Troubleshooting Avançado](#troubleshooting-avançado)
5. [Hardware Específico](#hardware-específico)
6. [Atualizações e Segurança](#atualizações)
7. [Performance e Otimização](#performance)
8. [Glossário de Termos](#glossário)
9. [Traduções Completas](#traduções)

---

## 🔧 1. PÓS-INSTALAÇÃO

### HTML para inserir no guia:

```html
<!-- ========================================
     PÓS-INSTALAÇÃO
     ======================================== -->
<section id="pos-instalacao">
    <div class="section-header">
        <h2 data-i18n="post-install-title">Pós-Instalação</h2>
        <p data-i18n="post-install-desc">Configurações essenciais após instalar o macOS</p>
    </div>

    <div class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        <div>
            <strong data-i18n="post-install-success">Parabéns! macOS instalado com sucesso!</strong><br>
            <span data-i18n="post-install-next">Agora vamos configurar funcionalidades essenciais para um Hackintosh perfeito.</span>
        </div>
    </div>

    <!-- USB Mapping -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-usb"></i></div>
        <h3 data-i18n="post-usb-title">1. Mapeamento USB (CRÍTICO)</h3>
        <p data-i18n="post-usb-desc">O mapeamento USB é ESSENCIAL para estabilidade, sleep e compatibilidade de dispositivos.</p>
        
        <div class="accordion">
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4 data-i18n="post-usb-why">Por que mapear USB?</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <ul>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-1">macOS tem limite de 15 portas USB</span></li>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-2">Previne problemas de sleep/wake</span></li>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-3">Melhora estabilidade geral do sistema</span></li>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-4">Corrige problemas com Bluetooth/WiFi</span></li>
                            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-5">Necessário para iServices funcionarem</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4 data-i18n="post-usb-tools">Ferramentas para Mapeamento</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <div class="tabs">
                            <div class="tab-buttons">
                                <button class="tab-btn active" onclick="switchTab(event, 'usbtoolbox')" data-i18n="post-usb-tool-1">USBToolBox (Recomendado)</button>
                                <button class="tab-btn" onclick="switchTab(event, 'hackintool')" data-i18n="post-usb-tool-2">Hackintool</button>
                                <button class="tab-btn" onclick="switchTab(event, 'usbmap')" data-i18n="post-usb-tool-3">USBMap</button>
                            </div>

                            <div id="usbtoolbox" class="tab-content active">
                                <h4>USBToolBox</h4>
                                <p data-i18n="post-usb-usbtoolbox-desc">Método mais moderno e fácil. Funciona no Windows e macOS.</p>
                                <div class="code-block">
                                    <button class="copy-btn" onclick="copyCode(this)" data-i18n="btn-copy">Copiar</button>
                                    <code># Download USBToolBox
git clone https://github.com/USBToolBox/tool
cd tool
# No Windows: execute Windows.exe
# No macOS: python3 USBToolBox.py</code>
                                </div>
                                <ol>
                                    <li data-i18n="post-usb-usbtoolbox-step-1">Execute a ferramenta</li>
                                    <li data-i18n="post-usb-usbtoolbox-step-2">Escolha opção "D" para descobrir portas</li>
                                    <li data-i18n="post-usb-usbtoolbox-step-3">Conecte dispositivos USB em cada porta</li>
                                    <li data-i18n="post-usb-usbtoolbox-step-4">Escolha opção "S" para selecionar portas</li>
                                    <li data-i18n="post-usb-usbtoolbox-step-5">Escolha opção "K" para gerar kext</li>
                                    <li data-i18n="post-usb-usbtoolbox-step-6">Copie UTBMap.kext para EFI/OC/Kexts/</li>
                                    <li data-i18n="post-usb-usbtoolbox-step-7">Adicione ao config.plist</li>
                                </ol>
                            </div>

                            <div id="hackintool" class="tab-content">
                                <h4>Hackintool</h4>
                                <p data-i18n="post-usb-hackintool-desc">Ferramenta gráfica completa para macOS.</p>
                                <ol>
                                    <li data-i18n="post-usb-hackintool-step-1">Baixe Hackintool do GitHub</li>
                                    <li data-i18n="post-usb-hackintool-step-2">Vá para aba USB</li>
                                    <li data-i18n="post-usb-hackintool-step-3">Clique em "Clear All" e depois "Refresh"</li>
                                    <li data-i18n="post-usb-hackintool-step-4">Conecte dispositivos em cada porta USB</li>
                                    <li data-i18n="post-usb-hackintool-step-5">Marque apenas as portas que você usa</li>
                                    <li data-i18n="post-usb-hackintool-step-6">Clique em "Export" para gerar USBPorts.kext</li>
                                    <li data-i18n="post-usb-hackintool-step-7">Copie para EFI/OC/Kexts/</li>
                                </ol>
                            </div>

                            <div id="usbmap" class="tab-content">
                                <h4>USBMap (CorpNewt)</h4>
                                <p data-i18n="post-usb-usbmap-desc">Script Python avançado.</p>
                                <div class="code-block">
                                    <button class="copy-btn" onclick="copyCode(this)" data-i18n="btn-copy">Copiar</button>
                                    <code>git clone https://github.com/corpnewt/USBMap
cd USBMap
python3 USBMap.command</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong data-i18n="post-usb-warning">Importante:</strong>
                <span data-i18n="post-usb-warning-desc">Remova XhciPortLimit quirk após mapear USB!</span>
            </div>
        </div>
    </div>

    <!-- Sleep/Wake -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-moon"></i></div>
        <h3 data-i18n="post-sleep-title">2. Corrigindo Sleep/Wake</h3>
        <p data-i18n="post-sleep-desc">Configurações para sleep e wake funcionarem perfeitamente.</p>

        <h4 data-i18n="post-sleep-pmset">Configurações pmset</h4>
        <div class="code-block">
            <button class="copy-btn" onclick="copyCode(this)" data-i18n="btn-copy">Copiar</button>
            <code># Desabilitar hibernação
sudo pmset -a hibernatemode 0
sudo rm /var/vm/sleepimage
sudo mkdir /var/vm/sleepimage

# Desabilitar Power Nap
sudo pmset -a powernap 0

# Desabilitar wake on LAN
sudo pmset -a womp 0

# Configurar darkwake
sudo pmset -a darkwake 0

# Verificar configurações
pmset -g</code>
        </div>

        <h4 data-i18n="post-sleep-bios">Configurações BIOS para Sleep</h4>
        <ul>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-sleep-bios-1">Desabilitar Wake on LAN</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-sleep-bios-2">Desabilitar USB Wake</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-sleep-bios-3">Habilitar XHCI Hand-off</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-sleep-bios-4">Desabilitar ErP (se disponível)</span></li>
        </ul>

        <h4 data-i18n="post-sleep-ssdt">SSDTs para Sleep</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>SSDT</th>
                        <th data-i18n="th-function">Função</th>
                        <th data-i18n="th-required">Necessário</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>SSDT-PMC</strong></td>
                        <td data-i18n="post-sleep-ssdt-pmc">Fix NVRAM em 300 series</td>
                        <td data-i18n="post-sleep-ssdt-pmc-req">300 series Intel</td>
                    </tr>
                    <tr>
                        <td><strong>SSDT-GPRW</strong></td>
                        <td data-i18n="post-sleep-ssdt-gprw">Previne wake instantâneo</td>
                        <td data-i18n="post-sleep-ssdt-gprw-req">Se tiver problema</td>
                    </tr>
                    <tr>
                        <td><strong>SSDT-PTSWAK</strong></td>
                        <td data-i18n="post-sleep-ssdt-ptswak">Fix sleep/wake geral</td>
                        <td data-i18n="post-sleep-ssdt-ptswak-req">Opcional</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- iServices -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-comments"></i></div>
        <h3 data-i18n="post-iservices-title">3. Configurando iServices (iMessage, FaceTime)</h3>
        <p data-i18n="post-iservices-desc">Passos para fazer iMessage e FaceTime funcionarem.</p>

        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <strong data-i18n="post-iservices-warning">ATENÇÃO:</strong>
                <span data-i18n="post-iservices-warning-desc">Use seriais ÚNICOS! Nunca use seriais de outras pessoas ou de EFIs prontas!</span>
            </div>
        </div>

        <h4 data-i18n="post-iservices-steps">Passo a Passo</h4>
        <ol>
            <li>
                <strong data-i18n="post-iservices-step-1-title">Gerar SMBIOS único</strong>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)" data-i18n="btn-copy">Copiar</button>
                    <code># Usar GenSMBIOS
python3 GenSMBIOS.command
# Escolha opção 1 para baixar MacSerial
# Escolha opção 2 para selecionar SMBIOS
# Escolha opção 3 para gerar serial
# Use MacPro7,1 ou iMac20,1</code>
                </div>
            </li>
            <li>
                <strong data-i18n="post-iservices-step-2-title">Verificar serial</strong>
                <p data-i18n="post-iservices-step-2-desc">Acesse <a href="https://checkcoverage.apple.com" target="_blank">checkcoverage.apple.com</a> e verifique o serial. Deve mostrar "Não é possível verificar" (serial não registrado).</p>
            </li>
            <li>
                <strong data-i18n="post-iservices-step-3-title">Configurar ROM</strong>
                <p data-i18n="post-iservices-step-3-desc">Use o endereço MAC da sua placa de rede Ethernet (sem os dois pontos). Exemplo: se MAC é AA:BB:CC:DD:EE:FF, use AABBCCDDEEFF</p>
            </li>
            <li>
                <strong data-i18n="post-iservices-step-4-title">Limpar NVRAM</strong>
                <p data-i18n="post-iservices-step-4-desc">Reinicie e escolha "Reset NVRAM" no boot picker do OpenCore</p>
            </li>
            <li>
                <strong data-i18n="post-iservices-step-5-title">Fazer login no iCloud</strong>
                <p data-i18n="post-iservices-step-5-desc">Aguarde 24-48h para ativação completa dos serviços</p>
            </li>
        </ol>

        <h4 data-i18n="post-iservices-troubleshoot">Troubleshooting iServices</h4>
        <div class="code-block">
            <button class="copy-btn" onclick="copyCode(this)" data-i18n="btn-copy">Copiar</button>
            <code># Verificar status dos serviços
# Abra Terminal e execute:
defaults read com.apple.icloud.fmip.voiceassistantsync.cloudkit.container.encrypteddata.metadata

# Se retornar erro, iServices não estão funcionando</code>
        </div>
    </div>

    <!-- Power Management -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-bolt"></i></div>
        <h3 data-i18n="post-power-title">4. Power Management (Gerenciamento de Energia)</h3>
        <p data-i18n="post-power-desc">Otimizar consumo de energia e performance da CPU.</p>

        <h4 data-i18n="post-power-intel">Intel Power Management</h4>
        <ul>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-power-intel-1">Use SSDT-PLUG.aml (obrigatório)</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-power-intel-2">CPUFriend.kext para ajuste fino</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-power-intel-3">CPUFriendDataProvider.kext (gerado)</span></li>
        </ul>

        <div class="code-block">
            <button class="copy-btn" onclick="copyCode(this)" data-i18n="btn-copy">Copiar</button>
            <code># Gerar CPUFriendDataProvider
git clone https://github.com/corpnewt/CPUFriendFriend
cd CPUFriendFriend
python3 CPUFriendFriend.command

# Escolha LFM (Low Frequency Mode):
# - 800 MHz para melhor economia
# - 1200 MHz para balanced
# - Frequência base para performance

# Copie CPUFriendDataProvider.kext para EFI/OC/Kexts/</code>
        </div>

        <h4 data-i18n="post-power-amd">AMD Power Management</h4>
        <ul>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-power-amd-1">Use DummyPowerManagement = True</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-power-amd-2">AMDRyzenCPUPowerManagement.kext (opcional)</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-power-amd-3">SMCAMDProcessor.kext para sensores</span></li>
        </ul>
    </div>

    <!-- DRM -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-film"></i></div>
        <h3 data-i18n="post-drm-title">5. DRM (Netflix, Apple TV+, Amazon Prime)</h3>
        <p data-i18n="post-drm-desc">Configurar DRM para streaming funcionar.</p>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th data-i18n="post-drm-th-service">Serviço</th>
                        <th data-i18n="post-drm-th-requirement">Requisito</th>
                        <th data-i18n="post-drm-th-solution">Solução</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Netflix (Safari)</strong></td>
                        <td data-i18n="post-drm-netflix-req">DRM nativo</td>
                        <td data-i18n="post-drm-netflix-sol">Funciona com iGPU ou AMD GPU</td>
                    </tr>
                    <tr>
                        <td><strong>Apple TV+</strong></td>
                        <td data-i18n="post-drm-appletv-req">FairPlay DRM</td>
                        <td data-i18n="post-drm-appletv-sol">Requer iGPU ou AMD Polaris+</td>
                    </tr>
                    <tr>
                        <td><strong>Amazon Prime</strong></td>
                        <td data-i18n="post-drm-prime-req">Widevine</td>
                        <td data-i18n="post-drm-prime-sol">Funciona em qualquer GPU</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong data-i18n="post-drm-tip">Dica:</strong>
                <span data-i18n="post-drm-tip-desc">Para testar DRM, use o site <a href="https://drm-test.appspot.com" target="_blank">drm-test.appspot.com</a></span>
            </div>
        </div>
    </div>

    <!-- Dual Boot -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-exchange-alt"></i></div>
        <h3 data-i18n="post-dualboot-title">6. Dual Boot (macOS + Windows/Linux)</h3>
        <p data-i18n="post-dualboot-desc">Configurar dual boot corretamente.</p>

        <h4 data-i18n="post-dualboot-best">Melhores Práticas</h4>
        <ul>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-dualboot-1">Instale cada OS em discos separados (recomendado)</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-dualboot-2">Use OpenCore como bootloader principal</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-dualboot-3">Configure LauncherOption = Full em config.plist</span></li>
            <li><i class="fas fa-check-circle"></i> <span data-i18n="post-dualboot-4">Adicione OpenShell.efi para debug</span></li>
        </ul>

        <h4 data-i18n="post-dualboot-time">Sincronizar Horário</h4>
        <div class="code-block">
            <button class="copy-btn" onclick="copyCode(this)" data-i18n="btn-copy">Copiar</button>
            <code># No Windows (como Administrador):
reg add "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /d 1 /t REG_DWORD /f

# Ou no macOS:
sudo systemsetup -setusingnetworktime on</code>
        </div>
    </div>
</section>
```

---

## 🔬 2. ACPI/SSDTs EXPLICADOS

### HTML para inserir:

```html
<!-- ========================================
     ACPI E SSDTs
     ======================================== -->
<section id="acpi">
    <div class="section-header">
        <h2 data-i18n="acpi-title">ACPI e SSDTs Explicados</h2>
        <p data-i18n="acpi-desc">Entenda o que cada SSDT faz e quando usar</p>
    </div>

    <div class="alert alert-info">
        <i class="fas fa-info-circle"></i>
        <div>
            <strong data-i18n="acpi-what">O que é ACPI?</strong><br>
            <span data-i18n="acpi-what-desc">ACPI (Advanced Configuration and Power Interface) é uma especificação que define tabelas de hardware para o sistema operacional. SSDTs são tabelas secundárias que adicionam ou modificam funcionalidades.</span>
        </div>
    </div>

    <!-- SSDT Essenciais -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-microchip"></i></div>
        <h3 data-i18n="acpi-essential-title">SSDTs Essenciais</h3>

        <div class="accordion">
            <!-- SSDT-EC-USBX -->
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4>SSDT-EC-USBX</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <p><strong data-i18n="acpi-ec-what">O que faz:</strong></p>
                        <ul>
                            <li data-i18n="acpi-ec-1">Cria um Embedded Controller (EC) fake</li>
                            <li data-i18n="acpi-ec-2">Injeta propriedades USB power</li>
                            <li data-i18n="acpi-ec-3">Necessário para boot no Catalina+</li>
                        </ul>
                        <p><strong data-i18n="acpi-ec-when">Quando usar:</strong></p>
                        <ul>
                            <li data-i18n="acpi-ec-when-1">Desktop: SEMPRE (obrigatório)</li>
                            <li data-i18n="acpi-ec-when-2">Laptop: Use SSDT-EC-LAPTOP</li>
                        </ul>
                        <div class="code-block">
                            <button class="copy-btn" onclick="copyCode(this)">Copiar</button>
                            <code>// Exemplo de SSDT-EC-USBX
DefinitionBlock ("", "SSDT", 2, "HACK", "EC-USBX", 0x00001000)
{
    External (_SB.PCI0.LPCB, DeviceObj)
    
    Scope (_SB.PCI0.LPCB)
    {
        Device (EC)
        {
            Name (_HID, "ACID0001")
            Method (_STA, 0, NotSerialized)
            {
                If (_OSI ("Darwin"))
                {
                    Return (0x0F)
                }
                Else
                {
                    Return (Zero)
                }
            }
        }
    }
}</code>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SSDT-PLUG -->
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4>SSDT-PLUG</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <p><strong data-i18n="acpi-plug-what">O que faz:</strong></p>
                        <ul>
                            <li data-i18n="acpi-plug-1">Habilita XCPM (XNU CPU Power Management)</li>
                            <li data-i18n="acpi-plug-2">Permite gerenciamento nativo de energia da CPU</li>
                            <li data-i18n="acpi-plug-3">Melhora performance e economia de energia</li>
                        </ul>
                        <p><strong data-i18n="acpi-plug-when">Quando usar:</strong></p>
                        <ul>
                            <li data-i18n="acpi-plug-when-1">Intel Haswell (4ª gen) ou superior</li>
                            <li data-i18n="acpi-plug-when-2">NÃO usar em AMD (use DummyPowerManagement)</li>
                            <li data-i18n="acpi-plug-when-3">Para Alder/Raptor Lake: use SSDT-PLUG-ALT</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- SSDT-AWAC -->
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4>SSDT-AWAC</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <p><strong data-i18n="acpi-awac-what">O que faz:</strong></p>
                        <ul>
                            <li data-i18n="acpi-awac-1">Força uso do RTC (Real Time Clock) legado</li>
                            <li data-i18n="acpi-awac-2">Desabilita AWAC (novo clock do firmware)</li>
                            <li data-i18n="acpi-awac-3">Previne kernel panic no boot</li>
                        </ul>
                        <p><strong data-i18n="acpi-awac-when">Quando usar:</strong></p>
                        <ul>
                            <li data-i18n="acpi-awac-when-1">Intel 300 series (Z390, B360, H370)</li>
                            <li data-i18n="acpi-awac-when-2">Intel 400/500/600 series</li>
                            <li data-i18n="acpi-awac-when-3">Se tiver kernel panic relacionado a RTC</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- SSDT-PMC -->
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4>SSDT-PMC</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <p><strong data-i18n="acpi-pmc-what">O que faz:</strong></p>
                        <ul>
                            <li data-i18n="acpi-pmc-1">Adiciona device PMCR ao ACPI</li>
                            <li data-i18n="acpi-pmc-2">Corrige NVRAM nativo em 300 series</li>
                            <li data-i18n="acpi-pmc-3">Melhora compatibilidade de sleep</li>
                        </ul>
                        <p><strong data-i18n="acpi-pmc-when">Quando usar:</strong></p>
                        <ul>
                            <li data-i18n="acpi-pmc-when-1">Intel 300 series (Z390, B360, H370)</li>
                            <li data-i18n="acpi-pmc-when-2">Se NVRAM não funcionar nativamente</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- SSDT-RHUB -->
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4>SSDT-RHUB</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <p><strong data-i18n="acpi-rhub-what">O que faz:</strong></p>
                        <ul>
                            <li data-i18n="acpi-rhub-1">Reseta USB root hub</li>
                            <li data-i18n="acpi-rhub-2">Corrige problemas de USB em algumas placas</li>
                            <li data-i18n="acpi-rhub-3">Necessário para algumas placas-mãe específicas</li>
                        </ul>
                        <p><strong data-i18n="acpi-rhub-when">Quando usar:</strong></p>
                        <ul>
                            <li data-i18n="acpi-rhub-when-1">Algumas placas Intel 400/500 series</li>
                            <li data-i18n="acpi-rhub-when-2">Se USB não funcionar após mapeamento</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- SSDT-SBUS-MCHC -->
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">
                    <h4>SSDT-SBUS-MCHC</h4>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        <p><strong data-i18n="acpi-sbus-what">O que faz:</strong></p>
                        <ul>
                            <li data-i18n="acpi-sbus-1">Corrige SMBus (System Management Bus)</li>
                            <li data-i18n="acpi-sbus-2">Adiciona device MCHC (Memory Controller)</li>
                            <li data-i18n="acpi-sbus-3">Melhora compatibilidade geral</li>
                        </ul>
                        <p><strong data-i18n="acpi-sbus-when">Quando usar:</strong></p>
                        <ul>
                            <li data-i18n="acpi-sbus-when-1">Opcional mas recomendado para todos</li>
                            <li data-i18n="acpi-sbus-when-2">Melhora estabilidade do sistema</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Como Compilar SSDTs -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-code"></i></div>
        <h3 data-i18n="acpi-compile-title">Como Compilar SSDTs</h3>
        <p data-i18n="acpi-compile-desc">Métodos para compilar arquivos .dsl em .aml</p>

        <div class="tabs">
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="switchTab(event, 'ssdttime')" data-i18n="acpi-tool-ssdttime">SSDTTime (Automático)</button>
                <button class="tab-btn" onclick="switchTab(event, 'maciasl')" data-i18n="acpi-tool-maciasl">MaciASL (Manual)</button>
            </div>

            <div id="ssdttime" class="tab-content active">
                <h4>SSDTTime - Geração Automática</h4>
                <p data-i18n="acpi-ssdttime-desc">Ferramenta que gera SSDTs automaticamente baseado no seu hardware.</p>
                <div class="code-block">
                    <button class="copy-btn" onclick="copyCode(this)">Copiar</button>
                    <code># Download e execução
git clone https://github.com/corpnewt/SSDTTime
cd SSDTTime
python3 SSDTTime.command

# Opções disponíveis:
# 1. FixHPET - Fix HPET IRQ conflicts
# 2. FakeEC - Cria fake EC
# 3. PluginType - Gera SSDT-PLUG
# 4. PMC - Gera SSDT-PMC
# 5. AWAC - Gera SSDT-AWAC
# 6. USB Reset - Gera SSDT-RHUB
# 7. PCI Bridge - Fix PCI bridges
# 8. Dump DSDT - Extrai DSDT do sistema</code>
                </div>
            </div>

            <div id="maciasl" class="tab-content">
                <h4>MaciASL - Compilação Manual</h4>
                <ol>
                    <li data-i18n="acpi-maciasl-step-1">Baixe MaciASL do GitHub</li>
                    <li data-i18n="acpi-maciasl-step-2">Abra o arquivo .dsl no MaciASL</li>
                    <li data-i18n="acpi-maciasl-step-3">Clique em "Compile" para verificar erros</li>
                    <li data-i18n="acpi-maciasl-step-4">File → Save As → Format: ACPI Machine Language Binary</li>
                    <li data-i18n="acpi-maciasl-step-5">Salve como .aml</li>
                </ol>
            </div>
        </div>
    </div>

    <!-- Tabela de SSDTs por Plataforma -->
    <div class="card">
        <div class="card-icon"><i class="fas fa-table"></i></div>
        <h3 data-i18n="acpi-platform-title">SSDTs por Plataforma</h3>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th data-i18n="acpi-platform-th-platform">Plataforma</th>
                        <th data-i18n="acpi-platform-th-ssdts">SSDTs Necessários</th>
                        <th data-i18n="acpi-platform-th-optional">Opcionais</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Intel 8ª-10ª Gen (Desktop)</strong></td>
                        <td>
                            • SSDT-PLUG<br>
                            • SSDT-EC-USBX<br>
                            • SSDT-AWAC (300 series)
                        </td>
                        <td>
                            • SSDT-PMC (300 series)<br>
                            • SSDT-SBUS-MCHC
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Intel 12ª-14ª Gen (Desktop)</strong></td>
                        <td>
                            • SSDT-PLUG-ALT<br>
                            • SSDT-EC-USBX<br>
                            • SSDT-AWAC
                        </td>
                        <td>
                            • SSDT-RHUB<br>
                            • SSDT-SBUS-MCHC
                        </td>
                    </tr>
                    <tr>
                        <td><strong>AMD Ryzen (Desktop)</strong></td>
                        <td>
                            • SSDT-EC-USBX-DESKTOP<br>
                            • SSDT-CPUR (B550/A520)
                        </td>
                        <td>
                            • SSDT-SBUS-MCHC
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Laptop (Intel)</strong></td>
                        <td>
                            • SSDT-PLUG<br>
                            • SSDT-EC-LAPTOP<br>
                            • SSDT-PNLF (backlight)<br>
                            • SSDT-XOSI (se necessário)
                        </td>
                        <td>
                            • SSDT-GPI0 (touchpad)<br>
                            • SSDT-SBUS-MCHC
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>
```

Devido ao limite de caracteres, vou criar um arquivo separado com TODAS as melhorias completas. Vou continuar...

