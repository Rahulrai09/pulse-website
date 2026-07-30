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

$path = Join-Path $repoRoot "vercel.json"
$content = [System.IO.File]::ReadAllText($path)

# --- Build the 12 redirect lines ---
$redirectLines = ""
foreach ($p in $products) {
    $redirectLines += "`n    { `"source`": `"/$($p.Old)`", `"destination`": `"/aesthetics/$($p.New)/`", `"permanent`": true },"
}

# --- Anchor: insert redirects right after the icu-ventilator redirect line ---
$redirectAnchor = '{ "source": "/icu-ventilator.html", "destination": "/critical-care/icu-ventilator/", "permanent": true },'
$content = $content.Replace($redirectAnchor, $redirectAnchor + $redirectLines)

# --- Build the 24 rewrite lines (2 per product) ---
$rewriteLines = ""
foreach ($p in $products) {
    $rewriteLines += "`n    { `"source`": `"/aesthetics/$($p.New)`", `"destination`": `"/aesthetics/$($p.New).html`" },"
    $rewriteLines += "`n    { `"source`": `"/aesthetics/$($p.New)/`", `"destination`": `"/aesthetics/$($p.New).html`" },"
}

# --- Anchor: insert rewrites right after the icu-ventilator rewrite pair ---
$rewriteAnchor = '{ "source": "/critical-care/icu-ventilator/", "destination": "/critical-care/icu-ventilator.html" },'
$content = $content.Replace($rewriteAnchor, $rewriteAnchor + $rewriteLines)

[System.IO.File]::WriteAllText($path, $content)
Write-Host "Updated vercel.json - added 12 redirects + 24 rewrites" -ForegroundColor Green
