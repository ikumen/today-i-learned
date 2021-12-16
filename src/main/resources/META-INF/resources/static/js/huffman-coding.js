
async function encode(s) {
  return fetch('/api/huffman', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: s
  }).then(res => {
    return res.json();
  }).catch(err => {
    console.error(err);
  })
}


ready(() => {
  const textEl = el('data');
  const encodingEl = el('encoding');
  const encodingTableEl = el('encoding-table');
  const statsEl = el('stats');

  const setResults = (source, encoded, codes) => {
    encodingEl.innerHtml(`<div>Encoding:</div><div style="overflow-y:auto;white-space:nowrap;">${encoded || ''}</div>`);
    encodingTableEl.innerHtml(`<p><div>Code Table:</div><div style="overflow-y:auto;white-space:nowrap;">${codes || ''}</div></p>`);
    if (!encoded) {
      statsEl.innerHtml(`Source chars: <br/>Source bits: <br/>Encoded:`)
    } else {
      statsEl.innerHtml(`Source chars: ${source.length}<br/>Source bits: ${source.length * 8} (assuming 8 bits per char)<br/>Encoded bits: ${encoded.length} (not including code table)`)
    }
  }

  setResults();

  el('clear-btn')
    .addListener('click', async (e)=>{
      textEl.get().value = '';
      setResults();
    });

  el('encode-btn')
    .addListener('click', async (e)=>{
      const source = (textEl.get().value || '').trim();
      if (source === '') {
        alert('Nothing to encode!');
        return;
      }
      encode(source).then(res => {
        const encoded = res['value'];
        const codes = JSON.stringify(res['encodingTable']);
        setResults(source, encoded, codes);
      })
    });
});

