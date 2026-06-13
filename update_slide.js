const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /<h3 class="ps-step-heading" id="psStepHeading">\s*Engineering\s*<\/h3>\s*<p class="ps-desc" id="psDesc">\s*Our engineers turn concepts into working prototypes — selecting components, running tests, and validating performance before a single unit goes into production\.\s*<\/p>/;

const htmlNew = `<h3 class="ps-step-heading" id="psStepHeading">R&D</h3>
    <p class="ps-desc" id="psDesc">From research labs to the factory floor — our R&D teams conceptualize, prototype, and validate every device. Engineers select components, run rigorous tests, and ensure clinical performance before a single unit enters production.</p>`;

if (regex.test(content)) {
    content = content.replace(regex, htmlNew);
    console.log('Replaced HTML block!');
    fs.writeFileSync('index.html', content);
} else {
    console.log('Failed to find HTML regex');
}
