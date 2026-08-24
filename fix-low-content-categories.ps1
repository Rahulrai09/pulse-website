# fix-low-content-categories.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# Inserts a category intro section (h2 + 3 paragraphs) before <div id="global-footer"></div>
# on all 7 category pages to resolve the "Low Content Pages" issue.

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
$anchor = '<div id="global-footer"></div>'

function Build-Section($h2, $p1, $p2, $p3) {
    return @"
    <!-- CATEGORY INTRO CONTENT -->
    <section style="max-width:1400px;margin:0 auto;padding:0 4% 64px;">
      <div style="max-width:820px;">
        <h2 style="font-size:28px;font-weight:800;color:#0a1e40;margin-bottom:16px;letter-spacing:-0.01em;">$h2</h2>
        <p style="font-size:16px;line-height:1.75;color:#1f2937;margin-bottom:16px;">$p1</p>
        <p style="font-size:16px;line-height:1.75;color:#1f2937;margin-bottom:16px;">$p2</p>
        <p style="font-size:16px;line-height:1.75;color:#1f2937;">$p3</p>
      </div>
    </section>

    $anchor
"@
}

$pages = @{}

$pages["critical-care.html"] = Build-Section `
  "Critical Care Equipment Manufacturing in India" `
  "Pulse manufactures a full range of critical care equipment for Indian hospitals, ICUs, and emergency departments — including ICU ventilators, patient monitors, infusion and syringe pumps, anaesthesia workstations, and ECG machines. Every device is designed and built in-house at our AMTZ, Visakhapatnam facility, then certified against ISO 13485, CE, and CDSCO standards before it reaches a hospital floor." `
  'Hospitals sourcing critical care equipment face a common challenge: breakdown response time. Pulse addresses this directly with a <a href="service-support.html" style="color:#E63946;text-decoration:none;font-weight:600;">72-hour on-ground service guarantee</a> across India, backed by a single point of accountability — no third-party distributors, no fragmented spare-parts chains.' `
  'Whether you''re equipping a new ICU wing, replacing ageing ventilators, or standardizing patient monitors across multiple facilities, Pulse''s critical care range is built to scale from a single-unit order to a full department rollout. Explore the filters above to compare equipment by application and certification, or learn more about <a href="why-pulse.html" style="color:#E63946;text-decoration:none;font-weight:600;">what sets Pulse apart</a> as a direct manufacturer.'

$pages["cardiac-care.html"] = Build-Section `
  "Cardiac Care Equipment Manufacturing in India" `
  "Pulse manufactures interventional cardiology consumables for Indian cath labs and cardiac centres — including drug-eluting stents, PTCA balloons, guidewires, diagnostic catheters, introducer sheaths, and manifold kits. Our 65+ product cardiac care range is engineered and certified to ISO 13485 standards, supporting the precision and consistency interventional cardiologists require during time-critical procedures." `
  'High-volume cath labs need a supplier who understands procedural urgency — stockouts or delayed replacements can directly affect patient scheduling. Pulse''s pan-India <a href="service-support.html" style="color:#E63946;text-decoration:none;font-weight:600;">service coverage</a> and single-manufacturer supply chain remove the reseller layer that often slows restocking for consumables like stents and guidewires.' `
  'Whether you''re setting up a new cath lab or standardizing consumables across a hospital network, Pulse''s cardiac care range supports both individual procedures and full-department procurement. Browse the filters above to compare products by application and certification, or read more about <a href="why-pulse.html" style="color:#E63946;text-decoration:none;font-weight:600;">Pulse''s direct-manufacturer model</a>.'

$pages["aesthetics.html"] = Build-Section `
  "Aesthetics Equipment Manufacturing in India" `
  "Pulse designs and manufactures non-surgical aesthetic devices for dermatology clinics, wellness centres, and hospital aesthetics departments — including laser systems, RF platforms, cryolipolysis units, HIFU machines, and skin analysis systems. Our 45+ product aesthetics range is built and certified to ISO 13485 standards." `
  'Aesthetics equipment often runs daily, multiple times a day, making uptime and consumables availability critical to clinic revenue. Pulse''s pan-India <a href="service-support.html" style="color:#E63946;text-decoration:none;font-weight:600;">service network</a> is built around this reality, avoiding the wait times of a single centralized service desk.' `
  'Whether you''re outfitting a new aesthetics clinic or replacing an ageing laser platform, Pulse''s range covers skin rejuvenation, body contouring, hair removal, and diagnostic devices under one accountable manufacturer. Use the filters above to compare devices by type and certification, or explore <a href="why-pulse.html" style="color:#E63946;text-decoration:none;font-weight:600;">why clinics choose Pulse</a> over multi-brand distributors.'

$pages["rehabilitation.html"] = Build-Section `
  "Rehabilitation Equipment Manufacturing in India" `
  "Pulse manufactures physiotherapy and rehabilitation equipment for Indian hospitals and clinics — including CPM machines, electrotherapy units, traction systems, ultrasound therapy devices, TENS/EMS units, and mobility aids such as wheelchairs. Our 50+ product rehabilitation range is certified to ISO 13485 standards." `
  'Physiotherapy departments run tight daily schedules across many patients, making reliability and fast turnaround on repairs essential — a single broken traction unit can disrupt a full day''s scheduling. Pulse''s pan-India <a href="service-support.html" style="color:#E63946;text-decoration:none;font-weight:600;">service coverage</a> keeps departments from waiting on a distant service desk.' `
  'Whether you''re setting up a new physiotherapy department or expanding mobility-aid inventory, Pulse''s rehabilitation range scales from individual devices to full department fit-outs. Browse the filters above to compare equipment by product type and certification, or learn more about <a href="why-pulse.html" style="color:#E63946;text-decoration:none;font-weight:600;">Pulse''s service model</a>.'

$pages["hospital-setup.html"] = Build-Section `
  "Hospital Setup Solutions Manufacturing in India" `
  "Pulse manufactures hospital infrastructure and setup equipment for new and expanding healthcare facilities — including modular operation theatres, medical gas pipeline systems, premium ICU beds, OT lights, and essential medical furniture. Our 60+ product hospital setup range is certified to ISO 13485 standards." `
  "Setting up or expanding a hospital wing typically means coordinating dozens of separate purchases across multiple vendors, each with its own delivery timeline and service contract. Pulse consolidates this into a single accountable partner, reducing the vendor-coordination overhead that often delays hospital fit-out projects." `
  'Whether you''re building a new facility or upgrading ageing infrastructure, Pulse''s hospital setup range scales from a single department to a full-hospital rollout, backed by pan-India <a href="service-support.html" style="color:#E63946;text-decoration:none;font-weight:600;">installation and service support</a>. Browse the filters above to compare products, or explore <a href="why-pulse.html" style="color:#E63946;text-decoration:none;font-weight:600;">Pulse''s single-manufacturer model</a>.'

$pages["renal-care.html"] = Build-Section `
  "Renal Care Equipment Manufacturing in India" `
  "Pulse manufactures dialysis and renal care equipment for Indian nephrology departments and dialysis centres — including haemodialysis machines, CRRT systems, dialysis concentrates, blood tubing sets, fistula needles, and AV grafts. Our 55+ product renal care range is certified to ISO 13485 standards." `
  'Dialysis centres run on tight scheduling, often treating multiple patients per machine per day, tying consumables availability directly to patient throughput. Pulse''s pan-India <a href="service-support.html" style="color:#E63946;text-decoration:none;font-weight:600;">service coverage</a> and direct-manufacturer supply reduce the restocking delays common with multi-tier distributor networks.' `
  'Whether you''re setting up a new dialysis unit or standardizing consumables across a nephrology network, Pulse''s renal care range supports both single-machine purchases and full-centre procurement. Browse the filters above to compare products, or learn more about <a href="why-pulse.html" style="color:#E63946;text-decoration:none;font-weight:600;">Pulse''s approach</a> to consistent equipment supply.'

$pages["surgical.html"] = Build-Section `
  "Surgical Equipment Manufacturing in India" `
  "Pulse's surgical range is anchored by CircumEase, a single-use disposable circumcision stapler engineered for safety, hygiene, and consistent clinical outcomes in high-volume surgical settings. Like every Pulse product, CircumEase is manufactured and certified to ISO 13485 standards, reflecting the same quality framework applied across our critical care, cardiac care, and renal care ranges." `
  "A stapler-based approach reduces procedure time and variability compared to conventional suture techniques, while eliminating the sterilization overhead of reusable instruments — a consideration surgical departments and urology clinics weigh alongside upfront cost." `
  'Pulse''s surgical category is actively expanding as part of our broader push toward integrated hospital equipment manufacturing. Hospitals interested in CircumEase, or in discussing upcoming additions to this category, can reach our team through the quote request form on this page, or explore <a href="why-pulse.html" style="color:#E63946;text-decoration:none;font-weight:600;">Pulse''s full equipment range</a>.'

foreach ($page in $pages.Keys) {
    $path = Join-Path $repoRoot $page
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        if ($content.Contains($anchor)) {
            $content = $content.Replace($anchor, $pages[$page])
            [System.IO.File]::WriteAllText($path, $content)
            Write-Host "$page : intro section inserted"
        } else {
            Write-Host "$page : ANCHOR NOT FOUND, skipped" -ForegroundColor Yellow
        }
    } else {
        Write-Host "$page : FILE NOT FOUND" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done. Review with:"
Write-Host "  git diff critical-care.html cardiac-care.html aesthetics.html rehabilitation.html hospital-setup.html renal-care.html surgical.html"
