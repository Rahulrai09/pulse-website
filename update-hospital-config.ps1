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

# --- 1. js/header.js: mega-menu href (6 entries) + searchMap url (24 entries) ---
$path = Join-Path $repoRoot "js\header.js"
$content = [System.IO.File]::ReadAllText($path)
foreach ($p in $products) {
    $content = $content.Replace('"href": "' + $p.Old + '"', '"href": "/hospital-setup/' + $p.New + '/"')
    $content = $content.Replace("url: '" + $p.Old + "'", "url: '/hospital-setup/" + $p.New + "/'")
}
[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated js/header.js" -ForegroundColor Green

# --- 2. sitemap.xml: loc entries (24 entries) ---
$path = Join-Path $repoRoot "sitemap.xml"
$content = [System.IO.File]::ReadAllText($path)
foreach ($p in $products) {
    $oldLoc = "<loc>https://www.pulseio.in/" + $p.Old + "</loc>"
    $newLoc = "<loc>https://www.pulseio.in/hospital-setup/" + $p.New + "/</loc>"
    $content = $content.Replace($oldLoc, $newLoc)
}
[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated sitemap.xml" -ForegroundColor Green

Write-Host ""
Write-Host "=== DONE - 2 files updated ==="
