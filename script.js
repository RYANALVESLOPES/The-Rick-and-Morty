let currentPageUrl = 'https://rickandmortyapi.com/api/character';

window.onload = async () => {
  const nextButton = document.getElementById('next-button');
  const backButton = document.getElementById('back-button');

  nextButton.addEventListener('click', loadNextPage);
  backButton.addEventListener('click', loadPreviousPage);

  try {
    await loadCharacters(currentPageUrl);
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar personagens.');
  }
};

async function loadCharacters(url) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha na requisição');
    const data = await response.json();

    data.results.forEach(character => {
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

    // Controle dos botões
    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');
    nextButton.disabled = !data.info.next;
    backButton.disabled = !data.info.prev;
    backButton.style.visibility = data.info.prev ? 'visible' : 'hidden';

    currentPageUrl = url;

  } catch (error) {
    console.error(error);
    alert('Erro ao carregar personagens');
  }
}

function showModal(character) {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '';
  modal.style.visibility = 'visible';

  const img = document.createElement('div');
  img.className = 'character-image';
  img.style.backgroundImage = `url('${character.image}')`;

  const details = [
    `Nome: ${character.name}`,
    `Status: ${character.status}`,
    `Especie: ${character.species}`,
    `Genero: ${character.gender}`,
    `Nacimento: ${character.origin.name}`,
  ];

  modalContent.appendChild(img);
  details.forEach(text => {
    const span = document.createElement('span');
    span.className = 'character-details';
    span.innerText = text;
    modalContent.appendChild(span);
  });
}

function hideModal() {
  document.getElementById('modal').style.visibility = 'hidden';
}

async function loadNextPage() {
  if (!currentPageUrl) return;
  const response = await fetch(currentPageUrl);
  const data = await response.json();
  if (data.info.next) loadCharacters(data.info.next);
}

async function loadPreviousPage() {
  if (!currentPageUrl) return;
  const response = await fetch(currentPageUrl);
  const data = await response.json();
  if (data.info.prev) loadCharacters(data.info.prev);
}
