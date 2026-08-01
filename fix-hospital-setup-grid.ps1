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
    @{ Old = "hospital-modular-ot.html";                     New = "modular-ot" }
)

$path = Join-Path $repoRoot "hospital-setup.html"
$content = [System.IO.File]::ReadAllText($path)

# --- Standard fix: 20 slugs that already had the hospital- prefix ---
foreach ($p in $products) {
    $oldSlug = 'slug: "' + $p.Old + '"'
    $newSlug = 'slug: "/hospital-setup/' + $p.New + '/"'
    $content = $content.Replace($oldSlug, $newSlug)
}

# --- Repair the 3 broken slugs (missing hospital- prefix / wrong filename) ---
$content = $content.Replace('slug: "ot-light-four-reflector.html"', 'slug: "/hospital-setup/ot-light-four-reflector/"')
$content = $content.Replace('slug: "ot-light-premium-globus-dome.html"', 'slug: "/hospital-setup/ot-light-globus-dome/"')
$content = $content.Replace('slug: "ot-examination-light.html"', 'slug: "/hospital-setup/ot-examination-light/"')

[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated hospital-setup.html PRODUCTS array (24 slugs total: 20 standard + 3 repaired)" -ForegroundColor Green

Write-Host ""
Write-Host "=== Verification: any remaining flat hospital- slugs? (should be empty) ==="
Select-String -Path $path -Pattern 'slug: "hospital-'
Write-Host ""
Write-Host "=== Verification: all 3 previously-broken slugs now fixed? ==="
Select-String -Path $path -Pattern 'slug: "/hospital-setup/(ot-light-four-reflector|ot-light-globus-dome|ot-examination-light)/"'
