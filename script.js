// === Toggle Navigasi Mobile ===
document.getElementById('menuToggle').addEventListener('click', function () {
  document.getElementById('navLinks').classList.toggle('show');
});

// === Toggle Dark Mode ===
const themeSwitch = document.getElementById('themeSwitch');
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
});

// === Generate QR Code (Teks / URL) ===
function generateQRCode() {
  const text = document.getElementById('text').value;
  const colorDark = document.getElementById('colorDark').value;
  const colorLight = document.getElementById('colorLight').value;
  const size = parseInt(document.getElementById('sizeSelect').value);
  const format = document.getElementById('formatSelect').value;
  const logoInput = document.getElementById('logoInput');
  const qrcodeContainer = document.getElementById('qrcode');
  qrcodeContainer.innerHTML = '';
  document.getElementById('downloadBtn').style.display = 'none';

  if (!text) return alert('Masukkan teks atau tautan terlebih dahulu.');

  const canvas = document.createElement('canvas');
  QRCode.toCanvas(canvas, text, {
    width: size,
    color: {
      dark: colorDark,
      light: colorLight
    }
  }, function (error) {
    if (error) {
      console.error(error);
      return;
    }

    if (logoInput.files && logoInput.files[0]) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const logoSize = size * 0.2;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;
        ctx.drawImage(img, x, y, logoSize, logoSize);
        qrcodeContainer.appendChild(canvas);
        document.getElementById('downloadBtn').style.display = 'inline-block';
      };
      img.src = URL.createObjectURL(logoInput.files[0]);
    } else {
      qrcodeContainer.appendChild(canvas);
      document.getElementById('downloadBtn').style.display = 'inline-block';
    }
  });
}

// === Download QR Code (Teks atau vCard) ===
function downloadQRCode() {
  const canvas = document.querySelector('#qrcode canvas') || document.querySelector('#vcardQrcode canvas');
  if (!canvas) return alert('QR Code belum dibuat.');
  const link = document.createElement('a');
  link.href = canvas.toDataURL();
  const now = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
  link.download = 'qr-code-' + now + '.png';
  link.click();
}

// === Generate QR Code vCard ===
function generateVCardQRCode() {
  const name = document.getElementById('vName').value;
  const phone = document.getElementById('vPhone').value;
  const email = document.getElementById('vEmail').value;
  const title = document.getElementById('vTitle').value;
  const org = document.getElementById('vOrg').value;
  const address = document.getElementById('vAddress').value;
  const website = document.getElementById('vWebsite').value;
  const container = document.getElementById('vcardQrcode');
  container.innerHTML = '';
  document.getElementById('downloadVCardBtn').style.display = 'none';

  if (!name || !phone || !email) {
    return alert('Isi minimal Nama, Nomor dan Email.');
  }

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${name}`,
    `FN:${name}`,
    `ORG:${org}`,
    `TITLE:${title}`,
    `TEL:${phone}`,
    `EMAIL:${email}`,
    `URL:${website}`,
    `ADR:;;${address}`,
    'END:VCARD'
  ].join('\n');

  const canvas = document.createElement('canvas');
  QRCode.toCanvas(canvas, vcard, {
    width: 256,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  }, function (error) {
    if (error) {
      console.error(error);
      return;
    }
    container.appendChild(canvas);
    document.getElementById('downloadVCardBtn').style.display = 'inline-block';
  });
}
