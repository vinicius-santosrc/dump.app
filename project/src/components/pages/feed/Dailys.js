import { auth } from "../../../lib/firebase";

export default function Dailys() {

    async function uploadImage() {
        let API_KEY = 'a380ecf1a50f69ce07a22073b8069007'
        const file = document.querySelector(".input-file-daily").value;
        file = ''

        if (file) {
            const formData = new FormData();
            formData.append('image', auth.currentUser.photoURL);
            formData.append('expiration', '1D');

            try {
                const response = await fetch('https://api.imgbb.com/1/upload?key=' + API_KEY, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
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
        <>
            <section className="dailys-dump">
                <h1>Dailys</h1>
                <div className="dailys-dump-flexbox-show">
                    <div className="daily-main-account">
                        <img src='https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                        <h1>Enviar daily</h1>
                    </div>
                    <div className="daily-another-accounts">
                        <img src='https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg' />
                        <h1>Nome</h1>
                    </div>
                </div>
            </section>
            
        </>
    )
}