$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
cd $repoRoot

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

# --- 1. js/header.js: mega-menu href + searchMap url ---
$path = Join-Path $repoRoot "js\header.js"
$content = [System.IO.File]::ReadAllText($path)
foreach ($p in $products) {
    $content = $content.Replace('"href": "' + $p.Old + '"', '"href": "/aesthetics/' + $p.New + '/"')
    $content = $content.Replace("url: '" + $p.Old + "'", "url: '/aesthetics/" + $p.New + "/'")
}
[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated js/header.js" -ForegroundColor Green

# --- 2. aesthetics.html: PRODUCTS array slug field ---
$path = Join-Path $repoRoot "aesthetics.html"
$content = [System.IO.File]::ReadAllText($path)
foreach ($p in $products) {
    $content = $content.Replace('slug: "' + $p.Old + '"', 'slug: "/aesthetics/' + $p.New + '/"')
}
[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated aesthetics.html PRODUCTS array" -ForegroundColor Green

# --- 3. sitemap.xml: loc entries ---
$path = Join-Path $repoRoot "sitemap.xml"
$content = [System.IO.File]::ReadAllText($path)
foreach ($p in $products) {
    $oldLoc = "<loc>https://www.pulseio.in/" + $p.Old + "</loc>"
    $newLoc = "<loc>https://www.pulseio.in/aesthetics/" + $p.New + "/</loc>"
    $content = $content.Replace($oldLoc, $newLoc)
}
[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated sitemap.xml" -ForegroundColor Green

Write-Host ""
Write-Host "=== DONE - 3 files updated ==="
