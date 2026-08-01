# ============================================================
# Hospital Setup URL Migration Script - 24 confirmed products
# Same method as Critical Care / Renal Care / Cardiac Care / Aesthetics / Rehabilitation
# ============================================================

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
cd $repoRoot

$products = @(
    @{ Old = "hospital-icu-bed-5func-electric-premium.html"; New = "icu-bed-5func-electric-premium" },
    @{ Old = "hospital-icu-bed-5func-electric-deluxe.html";  New = "icu-bed-5func-electric-deluxe" },
    @{ Old = "hospital-icu-bed-5func-manual-deluxe.html";    New = "icu-bed-5func-manual-deluxe" },
    @{ Old = "hospital-icu-bed-3func-electric.html";         New = "icu-bed-3func-electric" },
    @{ Old = "hospital-fowler-bed-electric.html";            New = "fowler-bed-electric" },
    @{ Old = "hospital-semi-fowler-electric.html";           New = "semi-fowler-electric" },
    @{ Old = "hospital-ot-table-electric-manual-deluxe.html"; New = "ot-table-electric-manual-deluxe" },
    @{ Old = "hospital-ot-table-carm-hydraulic.html";        New = "ot-table-carm-hydraulic" },
    @{ Old = "hospital-ot-table-general-hydraulic.html";     New = "ot-table-general-hydraulic" },
    @{ Old = "hospital-delivery-table-electric-manual.html"; New = "delivery-table-electric-manual" },
    @{ Old = "hospital-delivery-table-hydraulic.html";       New = "delivery-table-hydraulic" },
    @{ Old = "hospital-stretcher-trolley-ms-ss.html";        New = "stretcher-trolley-ms-ss" },
    @{ Old = "hospital-emergency-trolley-hydraulic.html";    New = "emergency-trolley-hydraulic" },
    @{ Old = "hospital-wheelchair.html";                     New = "wheelchair" },
    @{ Old = "hospital-ss-instrument-trolleys.html";         New = "ss-instrument-trolleys" },
    @{ Old = "hospital-crash-cart.html";                     New = "crash-cart" },
    @{ Old = "hospital-autoclaves-sterilizers.html";         New = "autoclaves-sterilizers" },
    @{ Old = "hospital-baby-warmer.html";                    New = "baby-warmer" },
    @{ Old = "hospital-medical-gas-pipeline.html";           New = "medical-gas-pipeline" },
    @{ Old = "hospital-modular-ot.html";                     New = "modular-ot" },
    @{ Old = "hospital-ot-light-four-reflector.html";        New = "ot-light-four-reflector" },
    @{ Old = "hospital-ot-light-globus-dome.html";           New = "ot-light-globus-dome" },
    @{ Old = "hospital-ot-examination-light.html";           New = "ot-examination-light" },
    @{ Old = "hospital-ot-light-premium-camera.html";        New = "ot-light-premium-camera" }
)

# 1. Create folder
if (-not (Test-Path "hospital-setup")) {
    New-Item -ItemType Directory -Path "hospital-setup" | Out-Null
    Write-Host "Created hospital-setup/ folder"
}

# 2. git mv each product
foreach ($p in $products) {
    $dest = "hospital-setup\$($p.New).html"
    Write-Host "Moving $($p.Old) -> $dest"
    .\.mingit\cmd\git.exe mv $p.Old $dest
}

# 3. Fix internal paths inside each moved file
foreach ($p in $products) {
    $path = Join-Path $repoRoot "hospital-setup\$($p.New).html"
    if (-not (Test-Path $path)) { Write-Host "SKIPPING - not found: $path" -ForegroundColor Red; continue }

    $content = [System.IO.File]::ReadAllText($path)

    # Root-relativize shared assets
    $content = $content.Replace('href="css/', 'href="/css/')
    $content = $content.Replace('src="js/', 'src="/js/')
    $content = $content.Replace('src="image/', 'src="/image/')
    $content = $content.Replace('href="image/', 'href="/image/')

    # Root-relativize HOME and category grid links
    $content = $content.Replace('href="index.html"', 'href="/index.html"')
    $content = $content.Replace('href="hospital-setup.html"', 'href="/hospital-setup.html"')

    # Update cross-links to sibling products (new nested trailing-slash paths)
    foreach ($sibling in $products) {
        $oldRef = 'href="' + $sibling.Old + '"'
        $newRef = 'href="/hospital-setup/' + $sibling.New + '/"'
        $content = $content.Replace($oldRef, $newRef)
    }

    # Update canonical tag
    $oldCanonical = 'https://www.pulseio.in/' + $p.Old
    $newCanonical = 'https://www.pulseio.in/hospital-setup/' + $p.New + '/'
    $content = $content.Replace($oldCanonical, $newCanonical)

    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "Fixed internal paths in hospital-setup\$($p.New).html" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== DONE. Now run: .\.mingit\cmd\git.exe status ==="
Write-Host "=== Then: .\.mingit\cmd\git.exe diff --stat ==="
