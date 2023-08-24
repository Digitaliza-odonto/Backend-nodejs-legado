const getApiUrl = () => {
    const storedApiUrl = localStorage.getItem('api');
    return storedApiUrl ? storedApiUrl : 'https://prontuario-ufpel-backend.onrender.com';
  };
  
  const sendRequest = async (url, method, data) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  
    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
  
      if (!response.ok) {
        throw responseData;
      }
  
      return responseData;
    } catch (error) {
      throw error;
    }
  };
  
  const pacientes = {
    criar: async (data) => {
      const url = `${getApiUrl()}/pacientes/criar`;
      return sendRequest(url, 'POST', data);
    },
    consultar: async (data) => {
      const url = `${getApiUrl()}/pacientes/consultar`;
      return sendRequest(url, 'POST', data);
    },
    atualizar: async (data) => {
      const url = `${getApiUrl()}/pacientes/atualizar`;
      return sendRequest(url, 'POST', data);
    },
    doAluno: async (data) => {
      const url = `${getApiUrl()}/pacientes/consultar/aluno`;
      return sendRequest(url, 'POST', data);
    }
  };
  
  const encaminhamentos = {
    criar: async (data) => {
      const url = `${getApiUrl()}/encaminhamentos/criar`;
      return sendRequest(url, 'POST', data);
    },
    consultar: async (data) => {
      const url = `${getApiUrl()}/encaminhamentos/consultar`;
      return sendRequest(url, 'POST', data);
    },
    atualizar: async (data) => {
      const url = `${getApiUrl()}/encaminhamentos/atualizar`;
      return sendRequest(url, 'POST', data);
    },
  };

const usuarios = {
  login: async (data) => {
    const url = `${getApiUrl()}/usuarios/login`;
    return sendRequest(url, 'POST', data);
  },
  criar: async (data) => {
    const url = `${getApiUrl()}/usuarios/criar`;
    return sendRequest(url, 'POST', data);
  }
}
  
window.api = {
    pacientes,
    encaminhamentos,
    usuarios
  };
  