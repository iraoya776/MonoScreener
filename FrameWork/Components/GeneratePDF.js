import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import {Alert} from 'react-native';

const generateEditablePDF = async content => {
  try {
    // 1. Convert content to HTML with editable fields
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; }
            img { max-width: 100%; height: auto; }
            .editable { border: 1px solid #ccc; padding: 5px; min-height: 20px; }
          </style>
        </head>
        <body>
    `;

    content.forEach(item => {
      if (item.type === 'text') {
        htmlContent += `<div class="editable" contenteditable="true">${item.value}</div>`;
      } else if (item.type === 'image') {
        htmlContent += `<img src="${item.uri}" />`;
      }
    });

    htmlContent += '</body></html>';

    // 2. Generate PDF from HTML
    const options = {
      html: htmlContent,
      fileName: 'editable_document',
      directory: 'Documents',
      width: 612, // Standard US Letter width in points
      height: 792, // Standard US Letter height in points
      padding: 20,
      backgroundColor: 'white',
      author: 'Your App',
      subject: 'Editable Document',
      keywords: 'editable, pdf, document',
      pdfOptions: {
        formsEnabled: true,
        preserveFormFields: true,
      },
    };

    const file = await RNHTMLtoPDF.convert(options);

    // 3. Save PDF to device
    const filePath = file.filePath;
    const newFilePath = `${
      RNFetchBlob.fs.dirs.DownloadDir
    }/editable_document_${Date.now()}.pdf`;

    await RNFetchBlob.fs.cp(filePath, newFilePath);

    Alert.alert('Success', `Editable PDF saved to ${newFilePath}`);
  } catch (error) {
    console.error('Error generating editable PDF:', error);
    Alert.alert('Error', 'Failed to generate editable PDF. Please try again.');
  }
};

export default generateEditablePDF;
