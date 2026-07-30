# ============================================================
# Aesthetics URL Migration Script
# Follows the same method used for Critical Care / Renal Care / Cardiac Care
# ALWAYS run from repo root. ALWAYS review git diff before deploying.
# ============================================================

cd C:\Users\DELL\Desktop\pulse-website

# ------------------------------------------------------------
# 1. Product map: old root file -> new slug inside aesthetics/
# ------------------------------------------------------------
$products = @(
    @{ Old = "aesthetics-nodd.html";             New = "nodd" },
    @{ Old = "aesthetics-em-ma.html";             New = "em-ma" },
    @{ Old = "aesthetics-visage.html";            New = "visage" },
    @{ Old = "aesthetics-pi-code.html";           New = "pi-code" },
    @{ Old = "aesthetics-hydrafrac.html";         New = "hydrafrac" },
    @{ Old = "aesthetics-cool-shape.html";        New = "cool-shape" },
    @{ Old = "aesthetics-code-factor.html";       New = "code-factor" },
    @{ Old = "aesthetics-excimer.html";           New = "excimer" },
    @{ Old = "aesthetics-wavelength-pro-x.html";  New = "wavelength-pro-x" },
    @{ Old = "aesthetics-skin-analyzer.html";     New = "skin-analyzer" },
    @{ Old = "aesthetics-bbl-super-ipl-dpl.html"; New = "bbl-super-ipl-dpl" },
    @{ Old = "aesthetics-em-code.html";           New = "em-code" }
)

# ------------------------------------------------------------
# 2. Create the subfolder if it doesn't exist
# ------------------------------------------------------------
if (-not (Test-Path "aesthetics")) {
    New-Item -ItemType Directory -Path "aesthetics" | Out-Null
    Write-Host "Created aesthetics/ folder"
}

# ------------------------------------------------------------
# 3. git mv each product into the subfolder (preserves history)
# ------------------------------------------------------------
foreach ($p in $products) {
    $dest = "aesthetics\$($p.New).html"
    Write-Host "Moving $($p.Old) -> $dest"
    .\.mingit\cmd\git.exe mv $p.Old $dest
}

# ------------------------------------------------------------
# 4. Fix internal paths inside each moved file
#    - root-relativize asset paths (css/, js/, image/)
#    - root-relativize HOME and category-page links
#    - update cross-links between sibling products to new nested paths
#    - update canonical tag + schema url to new nested trailing-slash URL
# ------------------------------------------------------------
foreach ($p in $products) {
    $path = "aesthetics\$($p.New).html"
    $content = [System.IO.File]::ReadAllText($path)

    # --- Root-relativize shared assets ---
    $content = $content.Replace('href="css/', 'href="/css/')
    $content = $content.Replace('src="js/', 'src="/js/')
    $content = $content.Replace('src="image/', 'src="/image/')
    $content = $content.Replace('href="image/', 'href="/image/')

    # --- Root-relativize HOME and category grid links ---
    $content = $content.Replace('href="index.html"', 'href="/index.html"')
    $content = $content.Replace('href="aesthetics.html"', 'href="/aesthetics.html"')

    # --- Update cross-links to sibling products (new nested trailing-slash paths) ---
    foreach ($sibling in $products) {
        $oldRef = 'href="' + $sibling.Old + '"'
        $newRef = 'href="/aesthetics/' + $sibling.New + '/"'
        $content = $content.Replace($oldRef, $newRef)
    }

    # --- Update canonical tag ---
    $oldCanonical = 'https://www.pulseio.in/' + $p.Old
    $newCanonical = 'https://www.pulseio.in/aesthetics/' + $p.New + '/'
    $content = $content.Replace($oldCanonical, $newCanonical)

    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "Fixed internal paths in $path"
}

Write-Host ""
Write-Host "=== DONE. Now run: .\.mingit\cmd\git.exe status ==="
Write-Host "=== Then: .\.mingit\cmd\git.exe diff --stat ==="
Write-Host "=== Paste both outputs back before we touch vercel.json / header.js / sitemap.xml ==="
