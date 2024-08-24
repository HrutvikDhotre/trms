import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateGroupListPDF = (groupData) => {
  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Initialize startY
  let startY = 10;

  // Define table columns without 'Sr.No'
  const columns = ['Group Number', 'Roll Number', 'Name', 'Marks'];

  // Iterate over groupData
  groupData.forEach((group, groupIndex) => {
    // Initialize rows array for the current group
    const rows = [];

    // Iterate over roll numbers and names in the group
    group.rollNumbers.forEach((rollNumber, rollIndex) => {
      // Add a new row for each roll number and corresponding name
      rows.push([group.groupName, rollNumber, group.names[rollIndex], '']);
    });

    // Add autoTable plugin to generate table for the current group
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: startY, // Start table at startY
      theme: 'grid', // Set theme to 'grid' for black and white theme
      columnStyles: {
        0: { cellWidth: 35 }, // Set width for Group Name column
        1: { cellWidth: 25 }, // Set width for Roll Number column
        2: { cellWidth: 70 }, // Set width for Name column
        3: { cellWidth: 25 }, // Set width for Marks column
      },
      headStyles: {
        fontStyle: 'bold', // Bold font
        halign: 'center' // Center align headings
      }
    });

    // Update startY for the next table
    startY = doc.autoTable.previous.finalY + 10;
  });

  // Save the PDF
  doc.save('group_list.pdf');
};

export default generateGroupListPDF;
