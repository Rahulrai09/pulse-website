$ErrorActionPreference = "Stop"

function Strip-Html {
    param([string]$text)
    return [regex]::Replace($text, '<[^>]+>', '')
}

function Apply-Replacement {
    param(
        [string]$old,
        [string]$new,
        [int]$expectedCount,
        [string]$label
    )
    $actualCount = ([regex]::Matches($script:content, [regex]::Escape($old))).Count
    if ($actualCount -ne $expectedCount) {
        Write-Host ("  ABORT [{0}]: expected {1}, found {2}. File NOT written." -f $label, $expectedCount, $actualCount) -ForegroundColor Red
        $script:fileFailed = $true
        return
    }
    $script:content = $script:content.Replace($old, $new)
    Write-Host ("  OK [{0}]: replaced {1} occurrence(s)." -f $label, $actualCount) -ForegroundColor Green
}

# These 3 files already carry a Product + BreadcrumbList schema from earlier work.
# This script only adds: the FAQ accordion CSS, a standalone FAQPage schema
# (inserted after their existing schema, right before </head>), and the
# visible FAQ accordion section. It does NOT touch their existing schema.

$cssRules = @'

  /* FAQ ACCORDION */
  .faq-accordion { display: flex; flex-direction: column; }
  .faq-item { border-bottom: 1px solid #e5e7eb; }
  .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: none; border: none; padding: 22px 0; font-size: 17px; font-weight: 700; color: #0a1e40; text-align: left; cursor: pointer; font-family: inherit; }
  .faq-icon { flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 400; color: #1B2F6E; transition: transform 0.25s ease; }
  .faq-item.open .faq-icon { transform: rotate(45deg); }
  .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
  .faq-item.open .faq-a { max-height: 300px; padding-bottom: 22px; }
  .faq-a p { color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0; }
'@

$faqPageOnlyTemplate = @'
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "__Q1__",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "__A1__"
        }
      },
      {
        "@type": "Question",
        "name": "__Q2__",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "__A2__"
        }
      },
      {
        "@type": "Question",
        "name": "__Q3__",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "__A3__"
        }
      },
      {
        "@type": "Question",
        "name": "__Q4__",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "__A4__"
        }
      },
      {
        "@type": "Question",
        "name": "__Q5__",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "__A5__"
        }
      }
    ]
  }
  </script>
'@

$faqTemplate = @'
  <section style="padding:48px 0; background:#fff;">
    <div style="max-width:800px; margin:0 auto; padding:0 24px;">
      <p style="color:#E87722; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">GOT QUESTIONS?</p>
      <h2 style="font-size:1.5rem; font-weight:800; color:#0f1f4b; margin-bottom:16px;">Frequently Asked Questions</h2>
      <div class="faq-accordion">
        <div class="faq-item">
          <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
            __Q1__
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-a"><p>__A1__</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
            __Q2__
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-a"><p>__A2__</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
            __Q3__
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-a"><p>__A3__</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
            __Q4__
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-a"><p>__A4__</p></div>
        </div>
        <div class="faq-item">
          <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
            __Q5__
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-a"><p>__A5__</p></div>
        </div>
      </div>
    </div>
  </section>
'@

$whatsappDownload = 'Message us on WhatsApp at <a href="https://wa.me/919071101108" target="_blank" rel="noopener noreferrer" style="color:#1B2F6E; font-weight:700; text-decoration:underline;">+91 90711 01108</a>, or download the brochure on this page for full specifications.'
$whatsappRequest  = 'Message us on WhatsApp at <a href="https://wa.me/919071101108" target="_blank" rel="noopener noreferrer" style="color:#1B2F6E; font-weight:700; text-decoration:underline;">+91 90711 01108</a>, or use the Request Brochure button on this page.'
$clinicHospital   = 'Yes. This is used in both small clinics and large multi-department hospitals across India.'

$products = @(
  @{ File="icu-bed-5func-electric-deluxe.html"; Q=@(
      "What is this ICU bed used for?","It is a five function electric ICU bed for ICU and critical care rooms, built on a CRCA pipe frame with ABS moulded head and foot panels.",
      "What size is the bed?","Overall size is 220 x 100 x 60-80 cm, with ABS side safety railing and electric actuator positioning for all five functions.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this bed?",$whatsappDownload
  ) },
  @{ File="modular-ot.html"; Q=@(
      "What does a modular OT include?","A complete operation theatre build, including a laminar flow ceiling, wall and ceiling panel systems, hermetic doors, pass boxes, scrub sinks, and surgeon control panels.",
      "Does it meet HVAC requirements?","Yes, the construction is designed for full HVAC compliance to maintain the air pressure and filtration an OT needs.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?","Yes. We build modular OTs for single theatre clinics as well as multi theatre hospital complexes.",
      "How do I get a quote for a modular OT project?",$whatsappRequest
  ) },
  @{ File="ot-light-four-reflector.html"; Q=@(
      "What is this light used for?","Shadow free illumination over the operating table during surgery.",
      "What configurations are available?","Single and double dome configurations, delivering up to 160,000 lux of light intensity.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this OT light?",$whatsappRequest
  ) }
)

foreach ($p in $products) {
    Write-Host ""
    Write-Host ("=== {0} ===" -f $p.File) -ForegroundColor Magenta
    $path = ".\$($p.File)"
    if (-not (Test-Path $path)) {
        Write-Host ("  ABORT: file not found: {0}" -f $path) -ForegroundColor Red
        continue
    }
    $script:content = [IO.File]::ReadAllText($path)
    $script:fileFailed = $false

    # 1) FAQ accordion CSS before </style>
    $newCss = $cssRules + "`r`n" + '</style>'
    Apply-Replacement -old '</style>' -new $newCss -expectedCount 1 -label "CSS"

    # 2) FAQPage-only schema, inserted right after the existing schema, before </head>
    $faqPageBlock = $faqPageOnlyTemplate
    for ($i = 0; $i -lt 5; $i++) {
        $faqPageBlock = $faqPageBlock.Replace("__Q$($i+1)__", (Strip-Html $p.Q[$i*2]))
        $faqPageBlock = $faqPageBlock.Replace("__A$($i+1)__", (Strip-Html $p.Q[$i*2+1]))
    }
    $oldHead = '</script></head>'
    $newHead = '</script>' + "`r`n" + $faqPageBlock + '</head>'
    Apply-Replacement -old $oldHead -new $newHead -expectedCount 1 -label "FAQPage schema"

    # 3) FAQ accordion section before the global footer
    $faqBlock = $faqTemplate
    for ($i = 0; $i -lt 5; $i++) {
        $faqBlock = $faqBlock.Replace("__Q$($i+1)__", $p.Q[$i*2])
        $faqBlock = $faqBlock.Replace("__A$($i+1)__", $p.Q[$i*2+1])
    }
    $oldFooter = '  <div id="global-footer"></div>'
    $newFooter = $faqBlock + "`r`n" + $oldFooter
    Apply-Replacement -old $oldFooter -new $newFooter -expectedCount 1 -label "FAQ section"

    if (-not $script:fileFailed) {
        [IO.File]::WriteAllText($path, $script:content, (New-Object System.Text.UTF8Encoding $false))
        Write-Host ("  DONE: {0} updated." -f $p.File) -ForegroundColor Cyan
    } else {
        Write-Host ("  SKIPPED: {0} NOT written due to abort above." -f $p.File) -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Fix-up pass complete." -ForegroundColor Cyan
