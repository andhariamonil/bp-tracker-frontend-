import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePDF(personName, records) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── Header ──────────────────────────────────────────
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Blood Pressure Report', 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const cap = name => name.charAt(0).toUpperCase() + name.slice(1);
  doc.text(`Patient: ${personName.split(' ').map(cap).join(' ')}`, 14, 22);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    })}`,
    196, 22, { align: 'right' }
  );

  // ── Table ─────────────────────────────────────────────
  const tableRows = records.map(r => [
    r.record_date
      ? new Date(r.record_date + 'T00:00:00').toLocaleDateString('en-IN',
          { day: '2-digit', month: 'short', year: 'numeric' })
      : '—',
    r.record_time?.slice(0, 5) || '—',
    Number(r.avg_upper).toFixed(1),
    Number(r.avg_lower).toFixed(1),
    Number(r.avg_pulse).toFixed(1),
    bpCategoryLabel(Number(r.avg_upper), Number(r.avg_lower)),
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['Date', 'Time', 'Avg Systolic', 'Avg Diastolic', 'Avg Pulse', 'Classification']],
    body: tableRows,
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: 30 },
    alternateRowStyles: { fillColor: [240, 247, 255] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 18 },
      2: { cellWidth: 28, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 23, halign: 'center' },
      5: { cellWidth: 40, halign: 'center' },
    },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 5) {
        const val = data.cell.text[0];
        if (val === 'Normal')             data.cell.styles.textColor = [22, 163, 74];
        else if (val === 'Elevated')      data.cell.styles.textColor = [202, 138, 4];
        else if (val.includes('Stage'))   data.cell.styles.textColor = [234, 88, 12];
        else if (val === 'Crisis')        data.cell.styles.textColor = [220, 38, 38];
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} — BP Tracker`, 105, 290, { align: 'center' });
  }

  doc.save(`BP_Report_${personName.replace(/\s+/g, '_')}.pdf`);
}

function bpCategoryLabel(upper, lower) {
  if (upper < 120 && lower < 80)       return 'Normal';
  if (upper < 130 && lower < 80)       return 'Elevated';
  if (upper < 140 || lower < 90)       return 'High Stage 1';
  if (upper >= 180 || lower >= 120)    return 'Crisis';
  return 'High Stage 2';
}