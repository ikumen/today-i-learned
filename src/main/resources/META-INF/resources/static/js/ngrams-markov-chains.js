async function generate(resp) {
  return fetch('/api/markov', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(resp)
  }).then(res => {
    return res.json();
  }).catch(err => {
    console.error(err);
  })
}


ready(() => {
  const corpusEl = el('corpus'),
        tokenizerEl = el('tokenizer'),
        ngramSizeEl = el('ngramSize'),
        textLenEl = el('textLen');

  const resultsEl = el('results');

  const setResults = ({text}) => {
    resultsEl.innerHtml(text);
  }

  el('generate-text-btn')
    .addListener('click', async (e)=>{
      const corpus = (corpusEl.get().value || '').trim();
      const ngramSize = parseInt(ngramSizeEl.get().value, 10);
      const textLen = parseInt(textLenEl.get().value, 10);
      const tokenizerType = tokenizerEl.get().value;
      if (corpus === '' || isNaN(ngramSize) || isNaN(textLen)) {
        alert('Corpus, ngramSize and textLen are required!');
      }      
      
      generate({corpus, ngramSize, textLen, tokenizerType})
        .then(setResults);
    });
});