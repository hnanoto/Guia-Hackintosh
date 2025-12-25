# Script para adicionar melhorias ao guia
# Este arquivo contém as instruções para adicionar as novas seções

Write-Host "==================================="
Write-Host "ADICIONANDO MELHORIAS AO GUIA"
Write-Host "==================================="
Write-Host ""

# Ler o arquivo original
$originalFile = "c:\Users\rick_\Desktop\Guia-Hackintosh\hackintosh-guide.html"
$content = Get-Content $originalFile -Raw

Write-Host "✅ Arquivo original lido: $($content.Length) caracteres"

# Encontrar onde inserir (antes do fechamento do container)
$insertPoint = $content.IndexOf('    </div>

    <!-- Footer -->')

if ($insertPoint -eq -1) {
    Write-Host "❌ Ponto de inserção não encontrado!"
    exit
}

Write-Host "✅ Ponto de inserção encontrado na posição: $insertPoint"

# Preparar o conteúdo a ser inserido
$newSections = @"

        <!-- ========================================
             PÓS-INSTALAÇÃO - SEÇÃO COMPLETA
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

            <!-- Card de USB Mapping -->
            <div class="card">
                <div class="card-icon"><i class="fas fa-usb"></i></div>
                <h3 data-i18n="post-usb-title">1. Mapeamento USB (CRÍTICO)</h3>
                <p data-i18n="post-usb-desc">O mapeamento USB é ESSENCIAL para estabilidade, sleep e compatibilidade de dispositivos.</p>
                
                <h4 data-i18n="post-usb-why">Por que mapear USB?</h4>
                <ul>
                    <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-1">macOS tem limite de 15 portas USB</span></li>
                    <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-2">Previne problemas de sleep/wake</span></li>
                    <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-3">Melhora estabilidade geral do sistema</span></li>
                    <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-4">Corrige problemas com Bluetooth/WiFi</span></li>
                    <li><i class="fas fa-check-circle"></i> <span data-i18n="post-usb-reason-5">Necessário para iServices funcionarem</span></li>
                </ul>

                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong data-i18n="post-usb-warning">Importante:</strong>
                        <span data-i18n="post-usb-warning-desc">Remova XhciPortLimit quirk após mapear USB!</span>
                    </div>
                </div>
            </div>

            <!-- Card de Sleep/Wake -->
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
            </div>

            <!-- Card de iServices -->
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
                    <li><strong data-i18n="post-iservices-step-1-title">Gerar SMBIOS único</strong> - Use GenSMBIOS</li>
                    <li><strong data-i18n="post-iservices-step-2-title">Verificar serial</strong> - Acesse checkcoverage.apple.com</li>
                    <li><strong data-i18n="post-iservices-step-3-title">Configurar ROM</strong> - Use endereço MAC da Ethernet</li>
                    <li><strong data-i18n="post-iservices-step-4-title">Limpar NVRAM</strong> - Reset NVRAM no boot picker</li>
                    <li><strong data-i18n="post-iservices-step-5-title">Fazer login no iCloud</strong> - Aguarde 24-48h</li>
                </ol>
            </div>
        </section>

"@

Write-Host "✅ Conteúdo das novas seções preparado: $($newSections.Length) caracteres"

# Inserir o novo conteúdo
$before = $content.Substring(0, $insertPoint)
$after = $content.Substring($insertPoint)
$newContent = $before + $newSections + $after

Write-Host "✅ Novo conteúdo montado: $($newContent.Length) caracteres"

# Salvar o novo arquivo
$outputFile = "c:\Users\rick_\Desktop\Guia-Hackintosh\hackintosh-guide-MELHORADO.html"
$newContent | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host ""
Write-Host "==================================="
Write-Host "✅ CONCLUÍDO COM SUCESSO!"
Write-Host "==================================="
Write-Host ""
Write-Host "Arquivo salvo em: $outputFile"
Write-Host "Tamanho original: $($content.Length) caracteres"
Write-Host "Tamanho novo: $($newContent.Length) caracteres"
Write-Host "Adicionado: $($newContent.Length - $content.Length) caracteres"
Write-Host ""
Write-Host "Próximos passos:"
Write-Host "1. Abra o arquivo: hackintosh-guide-MELHORADO.html"
Write-Host "2. Teste no navegador"
Write-Host "3. Se estiver tudo OK, renomeie para hackintosh-guide.html"
Write-Host ""
