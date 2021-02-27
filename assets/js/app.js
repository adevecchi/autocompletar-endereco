const App = (function () {

  let api;

  const cep = document.querySelector('#cep');

  const onlyIntegerHandler = function (evt) {
    if (evt.keyCode < 48 || evt.keyCode > 57)
        evt.preventDefault();
  };

  const autocompleteHandler = function (evt) {
    if (evt.keyCode === 13) {
      if (this.value.length !== 9)
        return;

      document.querySelector('.loader').classList.add('active');

      api.get(this.value)
            .then( (response) => { fillAddress(response.data); } )
            .catch( (err) => { fillAddressFail() } );
    }
  };

  const maskCepHandler = function (evt) {
    const cleaned = this.value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,5})?(\d{1,3})?$/);

    for (let i = 1; i <= 2; i++) {
      if (!match[i]) {
        match[i] = ''
      }
    }

    if (match[1] && cleaned.length >= 5) {
      this.value = `${match[1]}-${match[2]}`;
    }
  };

  const fillAddress = data => {
    document.querySelector('.loader').classList.remove('active');
    document.querySelector('#endereco').value = data.logradouro;
    document.querySelector('#bairro').value = data.bairro;
    document.querySelector('#complemento').value = !!data.complemento ? data.complemento : '';
    document.querySelector('#cidade').value = data.cidade;
    document.querySelector('#uf').value = data.estado;
    M.updateTextFields();
  };

  const fillAddressFail = () => {
    document.querySelector('.loader').classList.remove('active');
    M.toast({
      html: `Endereço não encontrado para o CEP "${cep.value}"`,
      classes: 'red lighten-1'
    });
  };

  const init = () => {
    api = axios.create({
      baseURL: 'https://api.postmon.com.br/v1/cep/'
    });

    cep.addEventListener('keypress', onlyIntegerHandler, false);
    cep.addEventListener('keypress', maskCepHandler, false);
    cep.addEventListener('keypress', autocompleteHandler, false);
  };

  return {
    init: init
  }

})();