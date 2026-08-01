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

$path = Join-Path $repoRoot "vercel.json"
$content = [System.IO.File]::ReadAllText($path)

# --- Build the 24 redirect lines ---
$redirectLines = ""
foreach ($p in $products) {
    $redirectLines += "`n    { `"source`": `"/$($p.Old)`", `"destination`": `"/hospital-setup/$($p.New)/`", `"permanent`": true },"
}

# --- Anchor: insert redirects right after the icu-ventilator redirect line ---
$redirectAnchor = '{ "source": "/icu-ventilator.html", "destination": "/critical-care/icu-ventilator/", "permanent": true },'
$content = $content.Replace($redirectAnchor, $redirectAnchor + $redirectLines)

# --- Build the 48 rewrite lines (2 per product) ---
$rewriteLines = ""
foreach ($p in $products) {
    $rewriteLines += "`n    { `"source`": `"/hospital-setup/$($p.New)`", `"destination`": `"/hospital-setup/$($p.New).html`" },"
    $rewriteLines += "`n    { `"source`": `"/hospital-setup/$($p.New)/`", `"destination`": `"/hospital-setup/$($p.New).html`" },"
}

# --- Anchor: insert rewrites right after the icu-ventilator rewrite line ---
$rewriteAnchor = '{ "source": "/critical-care/icu-ventilator", "destination": "/critical-care/icu-ventilator.html" },'
$content = $content.Replace($rewriteAnchor, $rewriteAnchor + $rewriteLines)

[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated vercel.json - added 24 redirects + 48 rewrites" -ForegroundColor Green
