// ========================================
// TRADUÇÕES COMPLETAS - HACKINTOSH GUIDE
// ========================================
// Adicione estas chaves ao objeto translations existente no seu guia

const newTranslations = {
    'pt-BR': {
        // ===== PÓS-INSTALAÇÃO =====
        'post-install-title': 'Pós-Instalação',
        'post-install-desc': 'Configurações essenciais após instalar o macOS',
        'post-install-success': 'Parabéns! macOS instalado com sucesso!',
        'post-install-next': 'Agora vamos configurar funcionalidades essenciais para um Hackintosh perfeito.',
        
        // USB Mapping
        'post-usb-title': '1. Mapeamento USB (CRÍTICO)',
        'post-usb-desc': 'O mapeamento USB é ESSENCIAL para estabilidade, sleep e compatibilidade de dispositivos.',
        'post-usb-why': 'Por que mapear USB?',
        'post-usb-reason-1': 'macOS tem limite de 15 portas USB',
        'post-usb-reason-2': 'Previne problemas de sleep/wake',
        'post-usb-reason-3': 'Melhora estabilidade geral do sistema',
        'post-usb-reason-4': 'Corrige problemas com Bluetooth/WiFi',
        'post-usb-reason-5': 'Necessário para iServices funcionarem',
        'post-usb-tools': 'Ferramentas para Mapeamento',
        'post-usb-tool-1': 'USBToolBox (Recomendado)',
        'post-usb-tool-2': 'Hackintool',
        'post-usb-tool-3': 'USBMap',
        'post-usb-warning': 'Importante:',
        'post-usb-warning-desc': 'Remova XhciPortLimit quirk após mapear USB!',
        
        // Sleep/Wake
        'post-sleep-title': '2. Corrigindo Sleep/Wake',
        'post-sleep-desc': 'Configurações para sleep e wake funcionarem perfeitamente.',
        'post-sleep-pmset': 'Configurações pmset',
        'post-sleep-bios': 'Configurações BIOS para Sleep',
        'post-sleep-bios-1': 'Desabilitar Wake on LAN',
        'post-sleep-bios-2': 'Desabilitar USB Wake',
        'post-sleep-bios-3': 'Habilitar XHCI Hand-off',
        'post-sleep-bios-4': 'Desabilitar ErP (se disponível)',
        'post-sleep-ssdt': 'SSDTs para Sleep',
        
        // iServices
        'post-iservices-title': '3. Configurando iServices (iMessage, FaceTime)',
        'post-iservices-desc': 'Passos para fazer iMessage e FaceTime funcionarem.',
        'post-iservices-warning': 'ATENÇÃO:',
        'post-iservices-warning-desc': 'Use seriais ÚNICOS! Nunca use seriais de outras pessoas ou de EFIs prontas!',
        'post-iservices-steps': 'Passo a Passo',
        'post-iservices-step-1-title': 'Gerar SMBIOS único',
        'post-iservices-step-2-title': 'Verificar serial',
        'post-iservices-step-3-title': 'Configurar ROM',
        'post-iservices-step-4-title': 'Limpar NVRAM',
        'post-iservices-step-5-title': 'Fazer login no iCloud',
        'post-iservices-troubleshoot': 'Troubleshooting iServices',
        
        // Power Management
        'post-power-title': '4. Power Management (Gerenciamento de Energia)',
        'post-power-desc': 'Otimizar consumo de energia e performance da CPU.',
        'post-power-intel': 'Intel Power Management',
        'post-power-amd': 'AMD Power Management',
        
        // DRM
        'post-drm-title': '5. DRM (Netflix, Apple TV+, Amazon Prime)',
        'post-drm-desc': 'Configurar DRM para streaming funcionar.',
        'post-drm-tip': 'Dica:',
        'post-drm-tip-desc': 'Para testar DRM, use o site drm-test.appspot.com',
        
        // Dual Boot
        'post-dualboot-title': '6. Dual Boot (macOS + Windows/Linux)',
        'post-dualboot-desc': 'Configurar dual boot corretamente.',
        'post-dualboot-best': 'Melhores Práticas',
        'post-dualboot-time': 'Sincronizar Horário',
        
        // ===== ACPI/SSDTs =====
        'acpi-title': 'ACPI e SSDTs Explicados',
        'acpi-desc': 'Entenda o que cada SSDT faz e quando usar',
        'acpi-what': 'O que é ACPI?',
        'acpi-what-desc': 'ACPI (Advanced Configuration and Power Interface) é uma especificação que define tabelas de hardware para o sistema operacional. SSDTs são tabelas secundárias que adicionam ou modificam funcionalidades.',
        'acpi-essential-title': 'SSDTs Essenciais',
        'acpi-compile-title': 'Como Compilar SSDTs',
        'acpi-compile-desc': 'Métodos para compilar arquivos .dsl em .aml',
        'acpi-platform-title': 'SSDTs por Plataforma',
        
        // ===== CONFIG.PLIST =====
        'config-title': 'Config.plist Detalhado',
        'config-desc': 'Entenda cada seção e configuração do config.plist',
        'config-booter-title': 'Booter → Quirks',
        'config-kernel-title': 'Kernel → Quirks',
        'config-dp-title': 'DeviceProperties',
        'config-nvram-title': 'NVRAM',
        
        // ===== TROUBLESHOOTING =====
        'trouble-advanced-title': 'Troubleshooting Avançado',
        'trouble-advanced-desc': 'Soluções para problemas específicos',
        'trouble-kp-types': 'Tipos de Kernel Panic',
        'trouble-gpu-issues': 'Problemas de GPU',
        'trouble-audio-codec': 'Mapeamento de Codec de Áudio',
        'trouble-usb-issues': 'Problemas USB',
        'trouble-read-logs': 'Como Ler Logs',
        
        // ===== HARDWARE ESPECÍFICO =====
        'hardware-title': 'Hardware Específico',
        'hardware-desc': 'Configurações para hardware popular',
        'hardware-mobo-title': 'Placas-Mãe Populares',
        'hardware-gpu-title': 'GPUs Específicas',
        'hardware-laptop-title': 'Laptops Comuns',
        
        // ===== ATUALIZAÇÕES =====
        'updates-title': 'Atualizações e Segurança',
        'updates-desc': 'Como atualizar com segurança',
        'updates-oc-title': 'Atualizar OpenCore',
        'updates-macos-title': 'Atualizar macOS',
        'updates-backup-title': 'Backup e Recovery',
        
        // ===== PERFORMANCE =====
        'perf-title': 'Performance e Otimização',
        'perf-desc': 'Otimize seu Hackintosh',
        'perf-bench-title': 'Benchmarking',
        'perf-gpu-title': 'Otimização de GPU',
        'perf-cpu-title': 'Otimização de CPU',
        'perf-ssd-title': 'SSD TRIM',
        
        // ===== GLOSSÁRIO =====
        'glossary-title': 'Glossário de Termos',
        'glossary-desc': 'Definições de termos técnicos',
        'glossary-acpi': 'ACPI',
        'glossary-acpi-def': 'Advanced Configuration and Power Interface - Interface padrão para gerenciamento de energia e configuração de hardware',
        'glossary-smbios': 'SMBIOS',
        'glossary-smbios-def': 'System Management BIOS - Define qual modelo de Mac seu Hackintosh vai emular',
        'glossary-kext': 'Kext',
        'glossary-kext-def': 'Kernel Extension - Drivers do macOS que estendem funcionalidades do kernel',
        'glossary-nvram': 'NVRAM',
        'glossary-nvram-def': 'Non-Volatile Random Access Memory - Memória que armazena configurações do sistema',
        'glossary-quirk': 'Quirk',
        'glossary-quirk-def': 'Correção ou patch específico para resolver incompatibilidades de hardware',
        
        // ===== NAVEGAÇÃO =====
        'nav-acpi': 'ACPI',
        'nav-config': 'Config.plist',
        'nav-post': 'Pós-Instalação',
        'nav-trouble': 'Troubleshooting',
        
        // ===== ÍNDICE =====
        'toc-title': 'Índice',
        'toc-req': '1. Requisitos do Sistema',
        'toc-kexts': '2. Kexts Essenciais',
        'toc-acpi': '3. ACPI e SSDTs',
        'toc-config': '4. Configuração do Config.plist',
        'toc-smbios': '5. SMBIOS',
        'toc-install': '6. Instalação',
        'toc-post': '7. Pós-Instalação',
        'toc-trouble': '8. Troubleshooting',
        'toc-updates': '9. Atualizações',
        'toc-glossary': '10. Glossário',
        
        // ===== STATS =====
        'stat-oc': 'Versão OpenCore',
        'stat-macos': 'macOS Sequoia',
        'stat-kexts': 'Kexts Suportados',
        'stat-compat': 'Compatibilidade',
        
        // ===== SEARCH =====
        'search-placeholder': 'Buscar no guia...',
    },
    
    'en': {
        // ===== POST-INSTALL =====
        'post-install-title': 'Post-Installation',
        'post-install-desc': 'Essential configurations after installing macOS',
        'post-install-success': 'Congratulations! macOS installed successfully!',
        'post-install-next': 'Now let\'s configure essential features for a perfect Hackintosh.',
        
        // USB Mapping
        'post-usb-title': '1. USB Mapping (CRITICAL)',
        'post-usb-desc': 'USB mapping is ESSENTIAL for stability, sleep, and device compatibility.',
        'post-usb-why': 'Why map USB?',
        'post-usb-reason-1': 'macOS has a 15 port USB limit',
        'post-usb-reason-2': 'Prevents sleep/wake issues',
        'post-usb-reason-3': 'Improves overall system stability',
        'post-usb-reason-4': 'Fixes Bluetooth/WiFi issues',
        'post-usb-reason-5': 'Required for iServices to work',
        'post-usb-tools': 'Mapping Tools',
        'post-usb-tool-1': 'USBToolBox (Recommended)',
        'post-usb-tool-2': 'Hackintool',
        'post-usb-tool-3': 'USBMap',
        'post-usb-warning': 'Important:',
        'post-usb-warning-desc': 'Remove XhciPortLimit quirk after mapping USB!',
        
        // Sleep/Wake
        'post-sleep-title': '2. Fixing Sleep/Wake',
        'post-sleep-desc': 'Settings for sleep and wake to work perfectly.',
        'post-sleep-pmset': 'pmset Settings',
        'post-sleep-bios': 'BIOS Settings for Sleep',
        'post-sleep-bios-1': 'Disable Wake on LAN',
        'post-sleep-bios-2': 'Disable USB Wake',
        'post-sleep-bios-3': 'Enable XHCI Hand-off',
        'post-sleep-bios-4': 'Disable ErP (if available)',
        'post-sleep-ssdt': 'SSDTs for Sleep',
        
        // iServices
        'post-iservices-title': '3. Configuring iServices (iMessage, FaceTime)',
        'post-iservices-desc': 'Steps to make iMessage and FaceTime work.',
        'post-iservices-warning': 'WARNING:',
        'post-iservices-warning-desc': 'Use UNIQUE serials! Never use serials from others or ready-made EFIs!',
        'post-iservices-steps': 'Step by Step',
        'post-iservices-step-1-title': 'Generate unique SMBIOS',
        'post-iservices-step-2-title': 'Verify serial',
        'post-iservices-step-3-title': 'Configure ROM',
        'post-iservices-step-4-title': 'Clear NVRAM',
        'post-iservices-step-5-title': 'Login to iCloud',
        'post-iservices-troubleshoot': 'iServices Troubleshooting',
        
        // Power Management
        'post-power-title': '4. Power Management',
        'post-power-desc': 'Optimize power consumption and CPU performance.',
        'post-power-intel': 'Intel Power Management',
        'post-power-amd': 'AMD Power Management',
        
        // DRM
        'post-drm-title': '5. DRM (Netflix, Apple TV+, Amazon Prime)',
        'post-drm-desc': 'Configure DRM for streaming to work.',
        'post-drm-tip': 'Tip:',
        'post-drm-tip-desc': 'To test DRM, use drm-test.appspot.com',
        
        // Dual Boot
        'post-dualboot-title': '6. Dual Boot (macOS + Windows/Linux)',
        'post-dualboot-desc': 'Configure dual boot correctly.',
        'post-dualboot-best': 'Best Practices',
        'post-dualboot-time': 'Sync Time',
        
        // ===== ACPI/SSDTs =====
        'acpi-title': 'ACPI and SSDTs Explained',
        'acpi-desc': 'Understand what each SSDT does and when to use',
        'acpi-what': 'What is ACPI?',
        'acpi-what-desc': 'ACPI (Advanced Configuration and Power Interface) is a specification that defines hardware tables for the operating system. SSDTs are secondary tables that add or modify functionalities.',
        'acpi-essential-title': 'Essential SSDTs',
        'acpi-compile-title': 'How to Compile SSDTs',
        'acpi-compile-desc': 'Methods to compile .dsl files to .aml',
        'acpi-platform-title': 'SSDTs by Platform',
        
        // ===== CONFIG.PLIST =====
        'config-title': 'Detailed Config.plist',
        'config-desc': 'Understand each section and configuration of config.plist',
        'config-booter-title': 'Booter → Quirks',
        'config-kernel-title': 'Kernel → Quirks',
        'config-dp-title': 'DeviceProperties',
        'config-nvram-title': 'NVRAM',
        
        // ===== TROUBLESHOOTING =====
        'trouble-advanced-title': 'Advanced Troubleshooting',
        'trouble-advanced-desc': 'Solutions for specific problems',
        'trouble-kp-types': 'Kernel Panic Types',
        'trouble-gpu-issues': 'GPU Issues',
        'trouble-audio-codec': 'Audio Codec Mapping',
        'trouble-usb-issues': 'USB Issues',
        'trouble-read-logs': 'How to Read Logs',
        
        // ===== SPECIFIC HARDWARE =====
        'hardware-title': 'Specific Hardware',
        'hardware-desc': 'Configurations for popular hardware',
        'hardware-mobo-title': 'Popular Motherboards',
        'hardware-gpu-title': 'Specific GPUs',
        'hardware-laptop-title': 'Common Laptops',
        
        // ===== UPDATES =====
        'updates-title': 'Updates and Security',
        'updates-desc': 'How to update safely',
        'updates-oc-title': 'Update OpenCore',
        'updates-macos-title': 'Update macOS',
        'updates-backup-title': 'Backup and Recovery',
        
        // ===== PERFORMANCE =====
        'perf-title': 'Performance and Optimization',
        'perf-desc': 'Optimize your Hackintosh',
        'perf-bench-title': 'Benchmarking',
        'perf-gpu-title': 'GPU Optimization',
        'perf-cpu-title': 'CPU Optimization',
        'perf-ssd-title': 'SSD TRIM',
        
        // ===== GLOSSARY =====
        'glossary-title': 'Glossary of Terms',
        'glossary-desc': 'Definitions of technical terms',
        'glossary-acpi': 'ACPI',
        'glossary-acpi-def': 'Advanced Configuration and Power Interface - Standard interface for power management and hardware configuration',
        'glossary-smbios': 'SMBIOS',
        'glossary-smbios-def': 'System Management BIOS - Defines which Mac model your Hackintosh will emulate',
        'glossary-kext': 'Kext',
        'glossary-kext-def': 'Kernel Extension - macOS drivers that extend kernel functionalities',
        'glossary-nvram': 'NVRAM',
        'glossary-nvram-def': 'Non-Volatile Random Access Memory - Memory that stores system settings',
        'glossary-quirk': 'Quirk',
        'glossary-quirk-def': 'Specific fix or patch to resolve hardware incompatibilities',
        
        // ===== NAVIGATION =====
        'nav-acpi': 'ACPI',
        'nav-config': 'Config.plist',
        'nav-post': 'Post-Install',
        'nav-trouble': 'Troubleshooting',
        
        // ===== INDEX =====
        'toc-title': 'Table of Contents',
        'toc-req': '1. System Requirements',
        'toc-kexts': '2. Essential Kexts',
        'toc-acpi': '3. ACPI and SSDTs',
        'toc-config': '4. Config.plist Configuration',
        'toc-smbios': '5. SMBIOS',
        'toc-install': '6. Installation',
        'toc-post': '7. Post-Installation',
        'toc-trouble': '8. Troubleshooting',
        'toc-updates': '9. Updates',
        'toc-glossary': '10. Glossary',
        
        // ===== STATS =====
        'stat-oc': 'OpenCore Version',
        'stat-macos': 'macOS Sequoia',
        'stat-kexts': 'Supported Kexts',
        'stat-compat': 'Compatibility',
        
        // ===== SEARCH =====
        'search-placeholder': 'Search in guide...',
    },
    
    'es': {
        // ===== POST-INSTALACIÓN =====
        'post-install-title': 'Post-Instalación',
        'post-install-desc': 'Configuraciones esenciales después de instalar macOS',
        'post-install-success': '¡Felicitaciones! ¡macOS instalado con éxito!',
        'post-install-next': 'Ahora vamos a configurar funcionalidades esenciales para un Hackintosh perfecto.',
        
        // USB Mapping
        'post-usb-title': '1. Mapeo USB (CRÍTICO)',
        'post-usb-desc': 'El mapeo USB es ESENCIAL para estabilidad, sleep y compatibilidad de dispositivos.',
        'post-usb-why': '¿Por qué mapear USB?',
        'post-usb-reason-1': 'macOS tiene límite de 15 puertos USB',
        'post-usb-reason-2': 'Previene problemas de sleep/wake',
        'post-usb-reason-3': 'Mejora estabilidad general del sistema',
        'post-usb-reason-4': 'Corrige problemas con Bluetooth/WiFi',
        'post-usb-reason-5': 'Necesario para que iServices funcionen',
        'post-usb-tools': 'Herramientas de Mapeo',
        'post-usb-tool-1': 'USBToolBox (Recomendado)',
        'post-usb-tool-2': 'Hackintool',
        'post-usb-tool-3': 'USBMap',
        'post-usb-warning': 'Importante:',
        'post-usb-warning-desc': '¡Elimine XhciPortLimit quirk después de mapear USB!',
        
        // Sleep/Wake
        'post-sleep-title': '2. Corrigiendo Sleep/Wake',
        'post-sleep-desc': 'Configuraciones para que sleep y wake funcionen perfectamente.',
        'post-sleep-pmset': 'Configuraciones pmset',
        'post-sleep-bios': 'Configuraciones BIOS para Sleep',
        'post-sleep-bios-1': 'Desactivar Wake on LAN',
        'post-sleep-bios-2': 'Desactivar USB Wake',
        'post-sleep-bios-3': 'Activar XHCI Hand-off',
        'post-sleep-bios-4': 'Desactivar ErP (si disponible)',
        'post-sleep-ssdt': 'SSDTs para Sleep',
        
        // iServices
        'post-iservices-title': '3. Configurando iServices (iMessage, FaceTime)',
        'post-iservices-desc': 'Pasos para hacer que iMessage y FaceTime funcionen.',
        'post-iservices-warning': 'ATENCIÓN:',
        'post-iservices-warning-desc': '¡Use seriales ÚNICOS! ¡Nunca use seriales de otras personas o de EFIs listas!',
        'post-iservices-steps': 'Paso a Paso',
        'post-iservices-step-1-title': 'Generar SMBIOS único',
        'post-iservices-step-2-title': 'Verificar serial',
        'post-iservices-step-3-title': 'Configurar ROM',
        'post-iservices-step-4-title': 'Limpiar NVRAM',
        'post-iservices-step-5-title': 'Iniciar sesión en iCloud',
        'post-iservices-troubleshoot': 'Solución de Problemas iServices',
        
        // Power Management
        'post-power-title': '4. Power Management (Gestión de Energía)',
        'post-power-desc': 'Optimizar consumo de energía y rendimiento de CPU.',
        'post-power-intel': 'Intel Power Management',
        'post-power-amd': 'AMD Power Management',
        
        // DRM
        'post-drm-title': '5. DRM (Netflix, Apple TV+, Amazon Prime)',
        'post-drm-desc': 'Configurar DRM para que streaming funcione.',
        'post-drm-tip': 'Consejo:',
        'post-drm-tip-desc': 'Para probar DRM, use drm-test.appspot.com',
        
        // Dual Boot
        'post-dualboot-title': '6. Dual Boot (macOS + Windows/Linux)',
        'post-dualboot-desc': 'Configurar dual boot correctamente.',
        'post-dualboot-best': 'Mejores Prácticas',
        'post-dualboot-time': 'Sincronizar Hora',
        
        // ===== ACPI/SSDTs =====
        'acpi-title': 'ACPI y SSDTs Explicados',
        'acpi-desc': 'Entienda qué hace cada SSDT y cuándo usar',
        'acpi-what': '¿Qué es ACPI?',
        'acpi-what-desc': 'ACPI (Advanced Configuration and Power Interface) es una especificación que define tablas de hardware para el sistema operativo. SSDTs son tablas secundarias que agregan o modifican funcionalidades.',
        'acpi-essential-title': 'SSDTs Esenciales',
        'acpi-compile-title': 'Cómo Compilar SSDTs',
        'acpi-compile-desc': 'Métodos para compilar archivos .dsl a .aml',
        'acpi-platform-title': 'SSDTs por Plataforma',
        
        // ===== CONFIG.PLIST =====
        'config-title': 'Config.plist Detallado',
        'config-desc': 'Entienda cada sección y configuración de config.plist',
        'config-booter-title': 'Booter → Quirks',
        'config-kernel-title': 'Kernel → Quirks',
        'config-dp-title': 'DeviceProperties',
        'config-nvram-title': 'NVRAM',
        
        // ===== TROUBLESHOOTING =====
        'trouble-advanced-title': 'Solución de Problemas Avanzada',
        'trouble-advanced-desc': 'Soluciones para problemas específicos',
        'trouble-kp-types': 'Tipos de Kernel Panic',
        'trouble-gpu-issues': 'Problemas de GPU',
        'trouble-audio-codec': 'Mapeo de Codec de Audio',
        'trouble-usb-issues': 'Problemas USB',
        'trouble-read-logs': 'Cómo Leer Logs',
        
        // ===== HARDWARE ESPECÍFICO =====
        'hardware-title': 'Hardware Específico',
        'hardware-desc': 'Configuraciones para hardware popular',
        'hardware-mobo-title': 'Placas Madre Populares',
        'hardware-gpu-title': 'GPUs Específicas',
        'hardware-laptop-title': 'Laptops Comunes',
        
        // ===== ACTUALIZACIONES =====
        'updates-title': 'Actualizaciones y Seguridad',
        'updates-desc': 'Cómo actualizar con seguridad',
        'updates-oc-title': 'Actualizar OpenCore',
        'updates-macos-title': 'Actualizar macOS',
        'updates-backup-title': 'Backup y Recovery',
        
        // ===== RENDIMIENTO =====
        'perf-title': 'Rendimiento y Optimización',
        'perf-desc': 'Optimice su Hackintosh',
        'perf-bench-title': 'Benchmarking',
        'perf-gpu-title': 'Optimización de GPU',
        'perf-cpu-title': 'Optimización de CPU',
        'perf-ssd-title': 'SSD TRIM',
        
        // ===== GLOSARIO =====
        'glossary-title': 'Glosario de Términos',
        'glossary-desc': 'Definiciones de términos técnicos',
        'glossary-acpi': 'ACPI',
        'glossary-acpi-def': 'Advanced Configuration and Power Interface - Interfaz estándar para gestión de energía y configuración de hardware',
        'glossary-smbios': 'SMBIOS',
        'glossary-smbios-def': 'System Management BIOS - Define qué modelo de Mac emulará su Hackintosh',
        'glossary-kext': 'Kext',
        'glossary-kext-def': 'Kernel Extension - Drivers de macOS que extienden funcionalidades del kernel',
        'glossary-nvram': 'NVRAM',
        'glossary-nvram-def': 'Non-Volatile Random Access Memory - Memoria que almacena configuraciones del sistema',
        'glossary-quirk': 'Quirk',
        'glossary-quirk-def': 'Corrección o parche específico para resolver incompatibilidades de hardware',
        
        // ===== NAVEGACIÓN =====
        'nav-acpi': 'ACPI',
        'nav-config': 'Config.plist',
        'nav-post': 'Post-Instalación',
        'nav-trouble': 'Solución de Problemas',
        
        // ===== ÍNDICE =====
        'toc-title': 'Índice',
        'toc-req': '1. Requisitos del Sistema',
        'toc-kexts': '2. Kexts Esenciales',
        'toc-acpi': '3. ACPI y SSDTs',
        'toc-config': '4. Configuración de Config.plist',
        'toc-smbios': '5. SMBIOS',
        'toc-install': '6. Instalación',
        'toc-post': '7. Post-Instalación',
        'toc-trouble': '8. Solución de Problemas',
        'toc-updates': '9. Actualizaciones',
        'toc-glossary': '10. Glosario',
        
        // ===== ESTADÍSTICAS =====
        'stat-oc': 'Versión OpenCore',
        'stat-macos': 'macOS Sequoia',
        'stat-kexts': 'Kexts Soportados',
        'stat-compat': 'Compatibilidad',
        
        // ===== BÚSQUEDA =====
        'search-placeholder': 'Buscar en la guía...',
    }
};

// ========================================
// INSTRUÇÕES DE USO
// ========================================
/*
Para adicionar estas traduções ao seu guia:

1. Abra seu arquivo hackintosh-guide.html
2. Encontre o objeto 'translations' no JavaScript
3. Adicione as novas chaves de cada idioma ao objeto existente

Exemplo:
const translations = {
    'pt-BR': {
        // Suas traduções existentes...
        ...newTranslations['pt-BR']  // Adicione as novas
    },
    'en': {
        // Suas traduções existentes...
        ...newTranslations['en']  // Adicione as novas
    },
    'es': {
        // Suas traduções existentes...
        ...newTranslations['es']  // Adicione as novas
    }
};
*/
