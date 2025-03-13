import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

const generarQRComoImagen = async () => {
  const qrDiv = document.createElement('div');
  qrDiv.style.position = 'absolute';
  qrDiv.style.left = '-9999px'; // Mover el div fuera de la pantalla
  document.body.appendChild(qrDiv);

  // Renderizar el código QR en el div
  ReactDOM.render(<QRCode value="https://tu-aplicacion.com" size={128} />, qrDiv);

  // Convertir el div a imagen usando html2canvas
  const canvas = await html2canvas(qrDiv);
  document.body.removeChild(qrDiv); // Limpiar el div

  return canvas.toDataURL('image/png'); // Devolver la imagen en base64
};