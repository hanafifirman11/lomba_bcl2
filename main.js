async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function populateTable(data, tableId) {
  const tbody = document.getElementById(tableId);
  tbody.innerHTML = '';
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4 py-2">${index + 1}</td>
      <td class="px-4 py-2">${item.Nama}</td>
      <td class="px-4 py-2">${item.Alamat}</td>
      <td class="px-4 py-2">${item.RT}</td>
      <td class="px-4 py-2">${item.JenisLomba}</td>
    `;
    tbody.appendChild(row);
  });
}

function filterTable(data, value) {
  return data.filter(item => !value || item.JenisLomba === value);
}

function exportCSV(tableId) {
  const table = document.getElementById(tableId);
  const rows = Array.from(table.querySelectorAll('tr')).map(row =>
    Array.from(row.querySelectorAll('th, td')).map(cell => cell.innerText).join(',')
  ).join('\n');
  const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'report.csv';
  link.click();
}

function exportExcel(tableId) {
  const table = document.getElementById(tableId);
  const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
  XLSX.writeFile(wb, 'report.xlsx');
}

document.addEventListener('DOMContentLoaded', async () => {
  const tabs = document.querySelectorAll('#tabs button');
  const sections = document.querySelectorAll('.tab-content');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      sections.forEach(sec => sec.classList.add('hidden'));
      document.getElementById(btn.dataset.target).classList.remove('hidden');
      tabs.forEach(b => b.classList.remove('border-blue-500', 'text-blue-600'));
      tabs.forEach(b => b.classList.add('border-transparent'));
      btn.classList.remove('border-transparent');
      btn.classList.add('border-blue-500', 'text-blue-600');
    });
  });

  try {
    const dataAnak5 = await fetchData('./dataAnak5_1.json');
    populateTable(dataAnak5, 'tableAnak5');
    document.getElementById('filterLomba').addEventListener('change', e => {
      populateTable(filterTable(dataAnak5, e.target.value), 'tableAnak5');
    });

    const dataAnak6_10 = await fetchData('./dataAnak10.json');
    populateTable(dataAnak6_10, 'tableAnak6-10');
    document.getElementById('filterLomba10').addEventListener('change', e => {
      populateTable(filterTable(dataAnak6_10, e.target.value), 'tableAnak6-10');
    });

    const dataDewasa = await fetchData('./dataDewasa.json');
    populateTable(dataDewasa, 'tableDewasa');
    document.getElementById('filterLombaDewasa').addEventListener('change', e => {
      populateTable(filterTable(dataDewasa, e.target.value), 'tableDewasa');
    });
  } catch (err) {
    console.error('Error fetching data:', err);
  }

  document.getElementById('printPDF').addEventListener('click', () => window.print());
  document.getElementById('exportCSV').addEventListener('click', () => exportCSV('tableAnak5'));
  document.getElementById('exportExcel').addEventListener('click', () => exportExcel('tableAnak5'));

  document.getElementById('printPDF10').addEventListener('click', () => window.print());
  document.getElementById('exportCSV10').addEventListener('click', () => exportCSV('tableAnak6-10'));
  document.getElementById('exportExcel10').addEventListener('click', () => exportExcel('tableAnak6-10'));

  document.getElementById('printPDFDewasa').addEventListener('click', () => window.print());
  document.getElementById('exportCSVDewasa').addEventListener('click', () => exportCSV('tableDewasa'));
  document.getElementById('exportExcelDewasa').addEventListener('click', () => exportExcel('tableDewasa'));

  document.getElementById('printPDFJadwal').addEventListener('click', () => window.print());
});
