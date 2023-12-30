import React, { useEffect, useState } from "react";
import UserGet from "../lib/user";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const date = new Date();
  const year = date.getFullYear();

  useEffect(() => {
    // Simula um carregamento assíncrono (pode ser substituído pela lógica real de verificação do usuário)
    const fakeAsyncCheck = async () => {
      try {
        // Faça a verificação do usuário (substitua isso pela lógica real)
        const user = UserGet();

        // Define o usuário atual com base na verificação
        setCurrentUser(user);
      } catch (error) {
        console.error("Erro ao verificar o usuário:", error);
      } finally {
        // Define o estado de carregamento como falso após a verificação do usuário
        setLoading(false);
      }
    };

    fakeAsyncCheck(); // Chama a função simulada de verificação do usuário
  }, []); // O segundo parâmetro vazio garante que o useEffect seja executado apenas uma vez (equivalente a componentDidMount)

  if (loading) {
    // Se ainda estiver carregando, exiba a tela de loading
    return (
      <section className='loading-page load loading'>
        <img src={window.location.origin + '/static/media/dumplogo.f3r818ht813gh78t13t.svg'} />
        <div className="bottom-loading">
          <p>Todos direitos reservados ©{year}</p>
        </div>
      </section>
    )
  }

  if (currentUser) {
    // Se houver um usuário, exiba o conteúdo para usuário logado

  } else {
    // Se não houver usuário, exiba o conteúdo para usuário não logado

  }
}