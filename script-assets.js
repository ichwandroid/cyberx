document.addEventListener('DOMContentLoaded', () => {
    // Ganti dengan Web App URL dari Google Apps Script Anda
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXXHrwoAgyuxRI9sUUWJSuJJfxboew71b8uK8CTAm6q7R-zXJD8jzUGJd9HgD3Kzri/exec'; 

    const uploadForm = document.getElementById('uploadForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loadingIcon = document.getElementById('loadingIcon');
    const resultContainer = document.getElementById('resultContainer');
    const resultLink = document.getElementById('resultLink');

    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fileName = document.getElementById('fileName').value;
        const fileInput = document.getElementById('file');
        const file = fileInput.files[0];

        if (!fileName || !file) {
            alert('Nama file dan file harus diisi!');
            return;
        }

        // Tampilkan animasi loading
        submitBtn.disabled = true;
        btnText.textContent = 'Mengupload...';
        loadingIcon.classList.remove('hidden');

        const formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('originalFileName', file.name);
        formData.append('file', file);
        formData.append('mimeType', file.type);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // URL untuk halaman player
                const playerUrl = `${window.location.origin}/player.html?id=${data.fileId}`;
                
                resultLink.href = playerUrl;
                resultLink.textContent = playerUrl;

                // Generate QR Code
                document.getElementById('qrcode').innerHTML = ""; // Kosongkan QR Code lama
                new QRCode(document.getElementById("qrcode"), {
                    text: playerUrl,
                    width: 200,
                    height: 200,
                });

                // Animasi dengan GSAP
                gsap.fromTo(resultContainer, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.5, display: 'block' }
                );
                
                // Reset form
                uploadForm.reset();

            } else {
                alert(`Gagal upload: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengupload file.');
        })
        .finally(() => {
            // Sembunyikan animasi loading
            submitBtn.disabled = false;
            btnText.textContent = 'Upload Sekarang';
            loadingIcon.classList.add('hidden');
        });
    });
});
