$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
cd $repoRoot

$products = @(
    @{ File = "aerodrive-1.html";  Old = "Buy Aerodrive — Model 6019 from Pulse — India's trusted medical equipment manufacturer. Rehabilitation product engineered and serviced from our facilities...."; New = "Pulse Aerodrive 1 electric wheelchair with lightweight aluminium frame, dual motors and smart joystick for smooth indoor-outdoor mobility." },
    @{ File = "aerodrive-2.html";  Old = "Aerodrive 2 from Pulse — India's trusted medical equipment manufacturer. Rehabilitation mobility aid engineered and serviced from our facilities. Contact us for full specifications and pricing."; New = "Pulse Aerodrive 2 power-assist wheelchair, 36kg lightweight build, 24V 10Ah battery for 15-20km range per charge." },
    @{ File = "cruza.html";        Old = "Cruza from Pulse — India's trusted medical equipment manufacturer. Rehabilitation mobility aid engineered and serviced from our facilities. Contact us for full specifications and pricing."; New = "Pulse Cruza reclining power wheelchair with electric recline up to 160 degrees, controlled via one-hand 360 degree joystick." },
    @{ File = "innovax.html";      Old = "Buy Innovax — Model 6016A from Pulse — India's trusted medical equipment manufacturer. Rehabilitation product engineered and serviced from our facilities. ..."; New = "Pulse Innovax power wheelchair with high-torque motors, anti-tip wheels and adjustable armrests for enhanced patient safety." },
    @{ File = "joylite-1.html";    Old = "Buy Joylite — Model 9005 from Pulse — India's trusted medical equipment manufacturer. Rehabilitation product engineered and serviced from our facilities. G..."; New = "Pulse Joylite 1 ultra-lightweight electric wheelchair with foldable frame and extended battery for daily mobility." },
    @{ File = "joylite-2.html";    Old = "Buy Joylite — Model 9006 from Pulse — India's trusted medical equipment manufacturer. Rehabilitation product engineered and serviced from our facilities. G..."; New = "Pulse Joylite 2 electric wheelchair with upgraded battery capacity, improved seat comfort and intuitive joystick control." },
    @{ File = "motion-pro-1.html"; Old = "Buy Motion Pro — Model 6001 from Pulse — India's trusted medical equipment manufacturer. Rehabilitation product engineered and serviced from our facilities..."; New = "Pulse Motion Pro 1 heavy-duty foldable power wheelchair with long-range battery and all-terrain joystick control." },
    @{ File = "motion-pro-2.html"; Old = "Motion Pro 2 from Pulse — India's trusted medical equipment manufacturer. Rehabilitation mobility aid engineered and serviced from our facilities. Contact us for full specifications and pricing."; New = "Pulse Motion Pro 2 power wheelchair, 24V 20Ah lithium-ion battery for 15-20km range, 24-inch aluminium alloy rear wheel." },
    @{ File = "smartride-1.html";  Old = "Smartride 1 from Pulse — India's trusted medical equipment manufacturer. Rehabilitation mobility aid engineered and serviced from our facilities. Contact us for full specifications and pricing."; New = "Pulse Smartride 1 compact autofold wheelchair, 26kg carbon fiber frame, 24V 10Ah battery for 15-20km range per charge." },
    @{ File = "smartride-2.html";  Old = "Buy Autofold Smartride from Pulse — India's trusted medical equipment manufacturer. Rehabilitation product engineered and serviced from our facilities. Get a..."; New = "Pulse Smartride 2 auto-folding wheelchair with one-touch fold mechanism, travel-friendly compact design." },
    @{ File = "xtrion.html";       Old = "Buy Xtrion — Model 6013A from Pulse — India's trusted medical equipment manufacturer. Rehabilitation product engineered and serviced from our facilities. G..."; New = "Pulse Xtrion compact electric wheelchair with mid-wheel drive, ergonomic seating and intelligent joystick controller." }
)

foreach ($p in $products) {
    $path = Join-Path $repoRoot "rehabilitation\$($p.File)"
    $content = [System.IO.File]::ReadAllText($path)

    $oldTag = '<meta name="description" content="' + $p.Old + '">'
    $newTag = '<meta name="description" content="' + $p.New + '">'

    if ($content.Contains($oldTag)) {
        $content = $content.Replace($oldTag, $newTag)
        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "$($p.File): updated ($($p.New.Length) chars)" -ForegroundColor Green
    } else {
        Write-Host "$($p.File): OLD TAG NOT FOUND - skipped" -ForegroundColor Red
    }
}
