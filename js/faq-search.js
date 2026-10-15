/* Pulse FAQ search — lightweight, dependency-free lexical search over
   window.PULSE_FAQ_DATA (generated from every FAQPage schema block on
   the site). No external API, no network calls beyond loading this
   file and faq-data.js once. */
(function () {
  var STOPWORDS = {
    'a':1,'an':1,'the':1,'is':1,'are':1,'was':1,'were':1,'do':1,'does':1,'did':1,'what':1,'how':1,'where':1,
    'when':1,'why':1,'which':1,'who':1,'whom':1,'can':1,'could':1,'should':1,'would':1,'i':1,'you':1,'your':1,
    'my':1,'me':1,'we':1,'our':1,'for':1,'of':1,'in':1,'on':1,'to':1,'and':1,'or':1,'with':1,'this':1,'that':1,
    'it':1,'its':1,'be':1,'been':1,'has':1,'have':1,'had':1,'will':1,'shall':1,'if':1,'not':1,'no':1,'yes':1,
    'about':1,'at':1,'by':1,'from':1,'as':1,'so':1,'than':1,'then':1,'there':1,'their':1,'please':1,'tell':1,
    'give':1,'want':1,'need':1,'looking':1,'like':1
  };

  var SYNONYMS = {
    'found':'start','establish':'start','begin':'start','launch':'start','start':'start',
    'fund':'fund','invest':'fund','backer':'fund','back':'fund','investor':'fund',
    'price':'cost','pricing':'cost','rate':'cost','cost':'cost',
    'manufactur':'make','produc':'make','build':'make','make':'make',
    'ship':'deliver','dispatch':'deliver','deliver':'deliver',
    'warranty':'warranty','guarantee':'warranty'
  };

  function stem(w) {
    if (w.length > 6 && w.slice(-8) === 'ications') return w.slice(0, -8) + 'y';
    if (w.length > 6 && w.slice(-3) === 'ing') return w.slice(0, -3);
    if (w.length > 5 && w.slice(-3) === 'ied') return w.slice(0, -3) + 'y';
    if (w.length > 5 && w.slice(-2) === 'ed') return w.slice(0, -2);
    if (w.length > 5 && w.slice(-3) === 'ies') return w.slice(0, -3) + 'y';
    if (w.length > 5 && w.slice(-2) === 'es') return w.slice(0, -2);
    if (w.length > 4 && w.slice(-1) === 's' && w.slice(-2) !== 'ss') return w.slice(0, -1);
    return w;
  }

  function normalize(w) {
    var s = stem(w);
    return SYNONYMS[s] || s;
  }

  function tokenize(text) {
    var raw = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var t = raw[i];
      if (t && !STOPWORDS[t]) out.push(normalize(t));
    }
    return out;
  }

  function prefixMatch(a, b, minLen) {
    minLen = minLen || 6;
    if (a === b) return true;
    var len = Math.min(a.length, b.length);
    if (len < minLen) return false;
    var p = Math.min(minLen, len);
    return a.slice(0, p) === b.slice(0, p);
  }

  var data = window.PULSE_FAQ_DATA || [];
  var docs = [];
  var df = {};
  for (var i = 0; i < data.length; i++) {
    var qTokens = tokenize(data[i].q);
    var aTokens = tokenize(data[i].a).slice(0, 40);
    var qSet = {};
    var seen = {};
    for (var j = 0; j < qTokens.length; j++) {
      qSet[qTokens[j]] = true;
      if (!seen[qTokens[j]]) { df[qTokens[j]] = (df[qTokens[j]] || 0) + 1; seen[qTokens[j]] = true; }
    }
    docs.push({ idx: i, qTokens: qTokens, aTokens: aTokens, qSet: qSet });
  }
  var N = docs.length;
  function idf(t) { return Math.log((N + 1) / ((df[t] || 0) + 1)) + 1; }

  function search(query, topK) {
    topK = topK || 1;
    var qTokens = tokenize(query);
    if (qTokens.length === 0) return [];
    var results = [];
    for (var d = 0; d < docs.length; d++) {
      var doc = docs[d];
      var score = 0;
      var matchedCount = 0;
      for (var qi = 0; qi < qTokens.length; qi++) {
        var t = qTokens[qi];
        if (doc.qSet[t]) {
          score += idf(t) * 2.0;
          matchedCount++;
        } else {
          var matched = false;
          for (var k2 = 0; k2 < doc.qTokens.length; k2++) {
            if (prefixMatch(t, doc.qTokens[k2])) { score += idf(doc.qTokens[k2]) * 1.3; matched = true; break; }
          }
          if (matched) {
            matchedCount++;
          } else if (doc.aTokens.indexOf(t) !== -1) {
            score += idf(t) * 0.5;
            matchedCount++;
          }
        }
      }
      var qLower = query.toLowerCase();
      var faqQLower = data[doc.idx].q.toLowerCase();
      if (faqQLower.indexOf(qLower) !== -1 || qLower.indexOf(faqQLower) !== -1) score += 3;
      var coverage = matchedCount / qTokens.length;
      results.push({ score: score, coverage: coverage, entry: data[doc.idx] });
    }
    // Coverage gate: for multi-word queries, require over half the meaningful
    // words to have matched something, so one coincidental rare-word hit
    // (e.g. "sell" matching an unrelated FAQ) can't win on its own.
    var filtered = [];
    for (var f = 0; f < results.length; f++) {
      if (qTokens.length <= 1 || results[f].coverage > 0.5) filtered.push(results[f]);
    }
    filtered.sort(function (a, b) { return b.score - a.score; });
    return filtered.slice(0, topK);
  }

  window.PulseFAQSearch = {
    search: search,
    THRESHOLD: 9
  };
})();
