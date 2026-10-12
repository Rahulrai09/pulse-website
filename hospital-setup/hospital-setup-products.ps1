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

# ---------------------------------------------------------------------------
# FAQ accordion CSS (2-space indent, matches existing product-page style)
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# Schema template (Product + BreadcrumbList + FAQPage) -- tokens filled per product
# ---------------------------------------------------------------------------
$schemaTemplate = @'
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "__NAME__",
    "description": "__DESC__",
    "image": "__IMG__",
    "brand": {
      "@type": "Brand",
      "name": "Pulse Medical"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Pulse Medical",
      "url": "https://www.pulseio.in"
    },
    "category": "Hospital Setup",
    "url": "https://www.pulseio.in__SLUG__",
    "offers": {
      "@type": "Offer",
      "url": "https://www.pulseio.in__SLUG__",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Pulse Medical"
      }
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.pulseio.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Hospital Setup",
        "item": "https://www.pulseio.in/hospital-setup.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "__NAME__",
        "item": "https://www.pulseio.in__SLUG__"
      }
    ]
  }
  </script>
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

# ---------------------------------------------------------------------------
# FAQ accordion section (single column, matches product-page width)
# ---------------------------------------------------------------------------
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
  @{ File="icu-bed-5func-electric-premium.html"; Slug="/hospital-setup/icu-bed-5func-electric-premium/"; Name="Pulse ICU Bed - Five Functional Electric (Premium)"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_07%20PM.webp"; Desc="Motorised five-function premium hospital ICU bed with ABS head and foot boards, 4-section ABS railings with degree indicator, and a CPR system."; Q=@(
      "What is the Pulse ICU Bed Five Functional Electric Premium used for?","It is a motorised ICU bed for critical care wards, with five functions such as back rest, knee rest, height, and Trendelenburg tilt, operated by remote or control panel.",
      "Does it have a CPR function?","Yes. It has a one touch CPR system that flattens the bed instantly for emergency resuscitation, along with 4 section ABS railings that show a degree indicator.",
      "Is it certified?","Yes, it is ISO 13485, CE, and CDSCO certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this bed?",$whatsappDownload
  ) },
  @{ File="icu-bed-5func-electric-deluxe.html"; Slug="/hospital-setup/icu-bed-5func-electric-deluxe/"; Name="Pulse ICU Bed - Five Functional Electric (Deluxe)"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_09%20PM.webp"; Desc="Five-function electric ICU bed with CRCA pipe frame, ABS moulded head and foot panels, and electric actuator positioning."; Q=@(
      "What is this ICU bed used for?","It is a five function electric ICU bed for ICU and critical care rooms, built on a CRCA pipe frame with ABS moulded head and foot panels.",
      "What size is the bed?","Overall size is 220 x 100 x 60-80 cm, with ABS side safety railing and electric actuator positioning for all five functions.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this bed?",$whatsappDownload
  ) },
  @{ File="icu-bed-5func-manual-deluxe.html"; Slug="/hospital-setup/icu-bed-5func-manual-deluxe/"; Name="Pulse ICU Bed - Five Functional Manual (Deluxe)"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_14%20PM.webp"; Desc="Five-function manual ICU bed with crank mechanism, CRCA pipe frame, and ABS safety side railing."; Q=@(
      "What is this bed used for?","A five function manual ICU bed for wards where a crank operated bed is preferred over an electric one, built on a CRCA pipe frame.",
      "How are the functions adjusted?","By a crank mechanism rather than a motor, with ABS safety side railing and one stainless steel IV rod included.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this bed?",$whatsappDownload
  ) },
  @{ File="icu-bed-3func-electric.html"; Slug="/hospital-setup/icu-bed-3func-electric/"; Name="Pulse ICU Bed - Three Functional Electric"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_19%20PM.webp"; Desc="Three-function electric ICU bed with ABS moulded panels, ABS side railing, and electric actuator."; Q=@(
      "What is this bed used for?","A three function electric ICU bed for general ward and step down care, with back rest, knee rest, and height adjustment.",
      "What railing and wheels does it have?","ABS moulded panels, ABS side railing, and 5 inch special casters with brakes for safe movement.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this bed?",$whatsappDownload
  ) },
  @{ File="fowler-bed-electric.html"; Slug="/hospital-setup/fowler-bed-electric/"; Name="Pulse Fowler Bed Electric"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_24%20PM.webp"; Desc="Electrically operated Fowler bed with motor and remote back rest and knee rest control."; Q=@(
      "What is a Fowler bed used for?","It raises the head and knee sections so a patient can sit up comfortably in bed, commonly used in general wards and recovery rooms.",
      "How is it operated?","Electrically, using a motor with remote control for back rest and knee rest, plus aluminium collapsible side safety railing and 4 inch casters.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this bed?",$whatsappDownload
  ) },
  @{ File="semi-fowler-electric.html"; Slug="/hospital-setup/semi-fowler-electric/"; Name="Pulse Semi Fowler Bed Electric"; Img="https://www.pulseio.in/image/Hospital%20Furniture/Lite%20Fowler%20MS%20Bed.webp"; Desc="Semi Fowler electric bed with motor and remote back rest operation, and ABS moulded head and foot panels."; Q=@(
      "What is this bed used for?","A Semi Fowler electric bed for general wards, giving electric back rest adjustment with a simpler function set than a full Fowler bed.",
      "What size is it?","Overall size 220 x 100 x 60-80 cm, with motor and remote operation and ABS moulded head and foot panels.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this bed?",$whatsappDownload
  ) },
  @{ File="ot-table-electric-manual-deluxe.html"; Slug="/hospital-setup/ot-table-electric-manual-deluxe/"; Name="Pulse OT Table - Electric and Manual Top Slide (Deluxe)"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_28%20PM.webp"; Desc="Five-sectional stainless steel radio translucent top OT table with remote control, electric actuator, and a top slide with six functions."; Q=@(
      "What is this OT table used for?","A deluxe operation theatre table for general surgery, with a stainless steel radio translucent top for X-ray and C-arm use during the procedure.",
      "How many functions does it have?","Six functions including a top slide and a chair position for seating operations, operated by remote control with an electric actuator.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this table?",$whatsappDownload
  ) },
  @{ File="ot-table-carm-hydraulic.html"; Slug="/hospital-setup/ot-table-carm-hydraulic/"; Name="Pulse OT Table - C-Arm Hydraulic"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_31%20PM.webp"; Desc="C-arm compatible OT table with hydraulic and mechanical operation and an inbuilt kidney bridge."; Q=@(
      "What is this table used for?","A C-arm compatible OT table for procedures that need intraoperative imaging, such as orthopaedic and trauma surgery.",
      "How is it adjusted?","By a hydraulic and mechanical system, with interchangeable leg and head sections and an inbuilt kidney bridge for lateral positioning.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this table?",$whatsappDownload
  ) },
  @{ File="ot-table-general-hydraulic.html"; Slug="/hospital-setup/ot-table-general-hydraulic/"; Name="Pulse OT Table - General Hydraulic"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_29%20PM.webp"; Desc="Five-sectional stainless steel OT table with heavy-duty hydraulic pump and a durable floor locking system."; Q=@(
      "What is this table used for?","A general purpose OT table for standard surgical procedures across departments.",
      "How many sections does it have?","Five sections, adjusted by a heavy duty hydraulic pump, with a floor locking system and a top positioned off centre for C-arm image intensifier access.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this table?",$whatsappDownload
  ) },
  @{ File="delivery-table-electric-manual.html"; Slug="/hospital-setup/delivery-table-electric-manual/"; Name="Pulse Delivery Table - Electric and Manual"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_38%20PM.webp"; Desc="Obstetric and gynaecological delivery table with electric actuator height and back-section adjustment."; Q=@(
      "What is this table used for?","An obstetric and gynaecological delivery table for labour rooms, used for childbirth and related procedures.",
      "How is it adjusted?","Height and back section are adjusted by an electric actuator, with a three section MS pipe top, cushion mattress, and a telescopic IV rod.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this table?",$whatsappDownload
  ) },
  @{ File="delivery-table-hydraulic.html"; Slug="/hospital-setup/delivery-table-hydraulic/"; Name="Pulse Delivery Table - Hydraulic Deluxe"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_34%20PM.webp"; Desc="Three-sectional stainless steel top delivery table with pneumatic pump Trendelenburg and a U-cut middle section."; Q=@(
      "What is this table used for?","A deluxe delivery table for labour and delivery rooms, with a stainless steel top across three sections.",
      "How is it adjusted?","A pneumatic hydraulic pump gives Trendelenburg tilt, with a U cut middle section for leg slide during delivery and stainless steel hand grips.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this table?",$whatsappDownload
  ) },
  @{ File="stretcher-trolley-ms-ss.html"; Slug="/hospital-setup/stretcher-trolley-ms-ss/"; Name="Pulse Stretcher Trolley MS and SS"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_09_46%20PM.webp"; Desc="Standard mild steel and stainless steel stretcher trolley for patient transport across hospital departments."; Q=@(
      "What is this trolley used for?","It moves patients between departments such as the ward, OT, and radiology, available in mild steel and stainless steel builds.",
      "What is the difference between the MS and SS versions?","The MS version is the standard, more economical build, while the SS version uses stainless steel for easier cleaning and a longer service life.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this trolley?",$whatsappDownload
  ) },
  @{ File="emergency-trolley-hydraulic.html"; Slug="/hospital-setup/emergency-trolley-hydraulic/"; Name="Pulse Emergency Patient Trolley (Hydraulic)"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_10_13%20PM.webp"; Desc="Hydraulic emergency patient trolley designed for rapid patient transport in emergency and trauma settings."; Q=@(
      "What is this trolley used for?","Rapid patient transport in emergency rooms and trauma settings, where speed and manoeuvrability matter most.",
      "How is the height adjusted?","By a hydraulic mechanism, allowing quick height changes while moving a patient between beds, stretchers, or imaging tables.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this trolley?",$whatsappDownload
  ) },
  @{ File="wheelchair.html"; Slug="/hospital-setup/wheelchair/"; Name="Pulse Wheelchair (Indian and Imported)"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_10_16%20PM.webp"; Desc="Wheelchairs available in Indian and imported variants for patient mobility across hospital environments."; Q=@(
      "What is this wheelchair used for?","Everyday patient mobility within the hospital, from the ward to outpatient departments and discharge.",
      "What variants are available?","Both Indian made and imported variants, so you can choose based on budget and the finish you need.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this wheelchair?",$whatsappDownload
  ) },
  @{ File="ss-instrument-trolleys.html"; Slug="/hospital-setup/ss-instrument-trolleys/"; Name="Pulse SS Instrument Trolleys"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_10_25%20PM.webp"; Desc="Stainless steel instrument trolleys in multiple configurations, with customization available."; Q=@(
      "What is this trolley used for?","Holding and moving surgical instruments and supplies within the OT and other procedure areas.",
      "What configurations are available?","All stainless steel, three shelf, and box type versions in MS and SS, sized D457 x W609 x H762 mm, with customization available on request.",
      "Is it certified?","Yes, it is ISO 13485 certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this trolley?",$whatsappDownload
  ) },
  @{ File="crash-cart.html"; Slug="/hospital-setup/crash-cart/"; Name="Pulse Crash Cart with Drawers"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_10_22%20PM.webp"; Desc="Emergency crash cart available with ABS drawers and SS drawers for storing resuscitation medications and equipment."; Q=@(
      "What is a crash cart used for?","Storing resuscitation medicines and emergency equipment at the point of care, for fast access during a cardiac arrest or other emergency.",
      "What drawer options are available?","ABS drawers and stainless steel drawers, so you can choose the finish that matches your ward and emergency protocols.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this crash cart?",$whatsappDownload
  ) },
  @{ File="autoclaves-sterilizers.html"; Slug="/hospital-setup/autoclaves-sterilizers/"; Name="Pulse Autoclaves and Sterilizers"; Img="https://www.pulseio.in/image/pulse-logo.png"; Desc="Complete range of autoclaves in SS and aluminium, portable, vertical, and horizontal configurations, from 12 to 180 litres."; Q=@(
      "What are these autoclaves used for?","Sterilizing surgical instruments and other reusable medical equipment using steam under pressure.",
      "What capacities are available?","From 12 litres to 180 litres, in portable, vertical, and horizontal configurations, with both non-electric and electrical variants.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for an autoclave?",$whatsappDownload
  ) },
  @{ File="baby-warmer.html"; Slug="/hospital-setup/baby-warmer/"; Name="Pulse Baby Warmer Range"; Img="https://www.pulseio.in/image/Hospital%20Furniture/ChatGPT%20Image%20May%2028%2C%202026%2C%2004_10_39%20PM.webp"; Desc="Infant radiant warmers from Regular to Premium N-400 series with air and skin servo control."; Q=@(
      "What is a baby warmer used for?","Keeping a newborn warm in the NICU or nursery right after birth, using a radiant heat source above the baby.",
      "What control features does it have?","Air and skin servo control, a dual digital display, a self test system, and an LED phototherapy option on higher models, across the Regular to Premium N-400 series.",
      "Is it certified?","Yes, it is ISO 13485, CE, and CDSCO certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for a baby warmer?",$whatsappDownload
  ) },
  @{ File="medical-gas-pipeline.html"; Slug="/hospital-setup/medical-gas-pipeline/"; Name="Pulse Medical Gas Pipeline System"; Img="https://www.pulseio.in/image/pulse-logo.png"; Desc="Complete medical gas pipeline solutions including manifold systems, bed head panels, power columns, pendants, and vacuum regulators."; Q=@(
      "What does this system cover?","A complete medical gas pipeline setup, including manifold systems, bed head panels, power columns, pendants, and vacuum regulators.",
      "What bed head panel options are there?","The Lumipan, Silk-H, and Critrunk ranges, so you can match the panel style to your ward design.",
      "Is it certified?","Yes, it is ISO 13485, CE, and CDSCO certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get a quote for a gas pipeline project?",$whatsappDownload
  ) },
  @{ File="modular-ot.html"; Slug="/hospital-setup/modular-ot/"; Name="Pulse Modular Operation Theatre"; Img="https://www.pulseio.in/image/pulse-logo.png"; Desc="ISO-certified modular OT construction with laminar ceiling, wall and ceiling systems, hermetic doors, and full HVAC compliance."; Q=@(
      "What does a modular OT include?","A complete operation theatre build, including a laminar flow ceiling, wall and ceiling panel systems, hermetic doors, pass boxes, scrub sinks, and surgeon control panels.",
      "Does it meet HVAC requirements?","Yes, the construction is designed for full HVAC compliance to maintain the air pressure and filtration an OT needs.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?","Yes. We build modular OTs for single theatre clinics as well as multi theatre hospital complexes.",
      "How do I get a quote for a modular OT project?",$whatsappRequest
  ) },
  @{ File="ot-light-four-reflector.html"; Slug="/hospital-setup/ot-light-four-reflector/"; Name="Pulse OT Light - Four Reflector"; Img="https://www.pulseio.in/image/pulse-logo.png"; Desc="Four Reflector OT Light delivering powerful, shadow-free illumination, available in single and double dome configurations."; Q=@(
      "What is this light used for?","Shadow free illumination over the operating table during surgery.",
      "What configurations are available?","Single and double dome configurations, delivering up to 160,000 lux of light intensity.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this OT light?",$whatsappRequest
  ) },
  @{ File="ot-light-globus-dome.html"; Slug="/hospital-setup/ot-light-globus-dome/"; Name="Pulse OT Light - Premium Globus Dome"; Img="https://www.pulseio.in/image/pulse-logo.png"; Desc="Premium Globus Dome OT Light offering exceptional light depth and uniformity with a built-in backup module."; Q=@(
      "What is this light used for?","High depth, uniform illumination for longer and more complex surgical procedures.",
      "What happens if the main light fails?","A built-in backup module keeps the light running, and it delivers up to 180,000 lux.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this OT light?",$whatsappRequest
  ) },
  @{ File="ot-examination-light.html"; Slug="/hospital-setup/ot-examination-light/"; Name="Pulse OT Examination Light"; Img="https://www.pulseio.in/image/pulse-logo.png"; Desc="Examination light for minor procedure areas and outpatient settings, delivering bright, focused, shadow-free illumination."; Q=@(
      "What is this light used for?","Examination rooms, minor procedure areas, and outpatient departments, where a focused, shadow free light is needed.",
      "How is it mounted?","Mobile or wall mount options, with a stepless dimmer and up to 50,000 lux output.",
      "Is it certified?","Yes, it is ISO 13485 and CE certified.",
      "Is this suitable for small clinics and large hospitals?",$clinicHospital,
      "How do I get pricing for this light?",$whatsappRequest
  ) },
  @{ File="ot-light-premium-camera.html"; Slug="/hospital-setup/ot-light-premium-camera/"; Name="Pulse OT Light - Premium with Camera HD"; Img="https://www.pulseio.in/image/pulse-logo.png"; Desc="Premium OT light with integrated HD camera, 12 to 30 cm focusing range, and optional battery backup."; Q=@(
      "What is this light used for?","Surgical illumination with an integrated HD camera, so the procedure can be recorded or streamed for teaching and documentation.",
      "What focusing range does it have?","A 12 to 30 cm focusing range with an adjustable light diameter of 50 mm, and an optional battery backup.",
      "Is it certified?","It is manufactured to the same ISO 13485 quality standard as the rest of the Pulse hospital setup range.",
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

    # 2) Product + Breadcrumb + FAQPage schema after </style>, before </head>
    $schemaBlock = $schemaTemplate
    $schemaBlock = $schemaBlock.Replace('__NAME__', $p.Name)
    $schemaBlock = $schemaBlock.Replace('__DESC__', $p.Desc)
    $schemaBlock = $schemaBlock.Replace('__IMG__', $p.Img)
    $schemaBlock = $schemaBlock.Replace('__SLUG__', $p.Slug)
    for ($i = 0; $i -lt 5; $i++) {
        $schemaBlock = $schemaBlock.Replace("__Q$($i+1)__", (Strip-Html $p.Q[$i*2]))
        $schemaBlock = $schemaBlock.Replace("__A$($i+1)__", (Strip-Html $p.Q[$i*2+1]))
    }
    $oldHead = '</style>' + "`r`n" + '</head>'
    $newHead = '</style>' + "`r`n" + $schemaBlock + '</head>'
    Apply-Replacement -old $oldHead -new $newHead -expectedCount 1 -label "Schema"

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
Write-Host "All products processed." -ForegroundColor Cyan
