export default function Dailys() {
    
    async function uploadImage() {
        let API_KEY = 'a380ecf1a50f69ce07a22073b8069007'
        const file = fileInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('expiration', expiration);

            try {
                const response = await fetch('https://api.imgbb.com/1/upload?key=' + API_KEY, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    imagePreview.innerHTML = `<img src="${result.data.url}" alt="Imagem enviada" />`;
                    alert('Imagem enviada com sucesso!');
                } else {
                    alert('Erro ao enviar imagem.');
                }
            } catch (error) {
                console.error('Erro ao enviar imagem:', error);
            }
        } else {
            alert('Selecione uma imagem antes de enviar.');
        }
    }

    return (
        ''
    )
}