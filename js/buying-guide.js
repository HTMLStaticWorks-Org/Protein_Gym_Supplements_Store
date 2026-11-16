/**
 * IRONVAULT Buying Guide - Interactive Education Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initLabelInspector();
});

// Interactive Supplement Label Inspector
const LABEL_DATA = {
  'serving-size': {
    title: '1. SERVING SIZE & SCOOP WEIGHT',
    highlight: 'Always weigh in grams, not just visual scoops.',
    content: 'The serving size dictates all nutritional data on the panel. For example, a "30g serving" delivering 24g protein represents 80% protein purity. Be wary of brands that inflate serving sizes to 45g with cheap maltodextrin or creamers.'
  },
  'protein-content': {
    title: '2. PROTEIN PER SERVING & AMINO SPIKING',
    highlight: 'Look for full transparency amino acid profiles.',
    content: 'Check that nitrogen-spiking compounds like added cheap glycine or taurine are not counting towards the total protein value. Genuine premium whey concentrate or isolate lists complete dairy fractions as the primary ingredient.'
  },
  'calories-carbs': {
    title: '3. CALORIES & ADDED SUGAR',
    highlight: 'Differentiate isolates (<1g sugar) from mass gainers.',
    content: 'Pure protein isolates should contain 100-120 kcal with 0-2g carbohydrates. Mass gainers intentionally scale up to 1,000+ kcal with complex carbs for aggressive bulking.'
  },
  'ingredients': {
    title: '4. INGREDIENT ORDER OF PRECEDENCE',
    highlight: 'Ingredients are legally listed by predominant weight.',
    content: 'If "Whey Protein Isolate" is listed first, it represents the primary ingredient by weight. If maltodextrin, artificial thickeners, or proprietary blends are first, the formula is diluted.'
  },
  'allergens': {
    title: '5. ALLERGENS & DIGESTIVE ENZYMES',
    highlight: 'Look for lactase or DigeZyme® if lactose-sensitive.',
    content: 'Common allergens include Milk (Dairy), Soy (lecithin for mixability), and Tree Nuts (in protein bars). Premium formulations add digestive enzyme complexes (Protease, Lactase) to eliminate post-shake bloating.'
  },
  'batch-auth': {
    title: '6. BATCH CODE & AUTHENTICITY QR',
    highlight: 'Never consume a tub with a broken induction seal.',
    content: 'Authentic supplements feature a machine-printed batch number, manufacturing date, and expiry timestamp on the base or neck. Scratch-and-verify QR codes connect directly to manufacturer verification databases.'
  }
};

function initLabelInspector() {
  const specimenRows = document.querySelectorAll('.specimen-row');
  const explainerBox = document.getElementById('labelExplainerBox');
  if (!explainerBox || specimenRows.length === 0) return;

  specimenRows.forEach(row => {
    row.addEventListener('click', () => {
      specimenRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const key = row.getAttribute('data-part');
      const data = LABEL_DATA[key];
      if (!data) return;

      explainerBox.innerHTML = `
        <div class="p-4 bg-card-custom rounded border" style="border-color: var(--color-electric) !important; animation: fadeIn 0.3s ease;">
          <span class="badge-custom badge-bestseller mb-2">${data.title}</span>
          <h4 class="display-font text-electric mb-2">${data.highlight}</h4>
          <p class="text-muted-custom mb-0">${data.content}</p>
        </div>
      `;
    });
  });
}

