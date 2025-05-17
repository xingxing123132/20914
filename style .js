  document.getElementById('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('compoundName').value.trim();
    const smilesText = document.getElementById('smilesText');
    const canvas = document.getElementById('structureCanvas');
    const resultCard = document.getElementById('resultCard');
    const drawer = new SmilesDrawer.Drawer({ width: 300, height: 300 });

    smilesText.textContent = "SMILES 구조 검색 중...";
    resultCard.style.display = "block";

    try {
      const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/IsomericSMILES/JSON`);
      const data = await res.json();
      const smiles = data.PropertyTable.Properties[0].IsomericSMILES;

      smilesText.textContent = `SMILES: ${smiles}`;

      SmilesDrawer.parse(smiles, (tree) => {
        drawer.draw(tree, canvas, 'light', false);
      }, (err) => {
        smilesText.textContent = '구조 파싱 오류: ' + err;
      });

    } catch (error) {
      smilesText.textContent = 'SMILES 구조를 찾을 수 없습니다.';
      console.error(error);
    }
  });
