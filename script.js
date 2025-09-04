document.addEventListener('DOMContentLoaded', () => {

  const mainContent = document.getElementById('main-content');
  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');
  const nextButton = document.getElementById('next-button');
  const backButton = document.getElementById('back-button');
  const loader = document.getElementById('loader');

 
  const state = {
    nextPageUrl: '',
    prevPageUrl: '',
    initialUrl: 'https://rickandmortyapi.com/api/character',
  };

  
  function toggleLoader(isLoading) {
    if (isLoading) {
      mainContent.innerHTML = '';
      loader.classList.add('active');
    } else {
      loader.classList.remove('active');
    }
  }

  
  function displayError(message) {
    mainContent.innerHTML = `<p class="error-message">${message}</p>`;
  }

  
  async function loadCharacters(url) {
    toggleLoader(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      const data = await response.json();
      
      toggleLoader(false);
      renderCharacters(data.results);
      updatePagination(data.info);

    } catch (error) {
      console.error('Falha ao carregar personagens:', error);
      toggleLoader(false);
      displayError('Não foi possível carregar os personagens. Tente novamente mais tarde.');
    }
  }

  
  function renderCharacters(characters) {
    mainContent.innerHTML = '';
    characters.forEach(character => {
      const card = document.createElement('div');
      card.className = 'cards';
      card.style.backgroundImage = `url('${character.image}')`;

      const nameBg = document.createElement('div');
      nameBg.className = 'character-name-bg';

      const name = document.createElement('span');
      name.className = 'character-name';
      name.innerText = character.name;

      nameBg.appendChild(name);
      card.appendChild(nameBg);
      card.addEventListener('click', () => showModal(character));
      mainContent.appendChild(card);
    });
  }
  
  
  function updatePagination(info) {
    state.nextPageUrl = info.next;
    state.prevPageUrl = info.prev;

    nextButton.disabled = !state.nextPageUrl;
    backButton.disabled = !state.prevPageUrl;
    backButton.style.visibility = state.prevPageUrl ? 'visible' : 'hidden';
  }

  
   
    
   
  function showModal(character) {
    modalContent.innerHTML = '';

    const img = document.createElement('div');
    img.className = 'character-image';
    img.style.backgroundImage = `url('${character.image}')`;
    
    modalContent.appendChild(img);

    const detailsList = [
      `Nome: ${character.name}`,
      `Status: ${character.status}`,
      `Especie: ${character.species}`,
      `Genero: ${character.gender}`,
      `Casa: ${character.origin.name}`,
    ];

    detailsList.forEach(detailText => {
      const detailElement = document.createElement('span');
      detailElement.className = 'character-details';
      detailElement.innerText = detailText;
      modalContent.appendChild(detailElement);
    });

    modal.classList.add('active');
  }

  
  function hideModal() {
    modal.classList.remove('active');
  }

  

  nextButton.addEventListener('click', () => {
    if (state.nextPageUrl) loadCharacters(state.nextPageUrl);
  });

  backButton.addEventListener('click', () => {
    if (state.prevPageUrl) loadCharacters(state.prevPageUrl);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });

  
  loadCharacters(state.initialUrl);
});