// --- Menu déroulant ---
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
menuBtn.onclick = () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

// --- Données ---
const rooms = [
  {id:181,name:'Chambre 181 (Staff)',price:0,free:false},
  {id:182,name:'Chambre 182',price:100,free:true},
  {id:183,name:'Chambre 183 (avec balcon)',price:120,free:true},
  {id:184,name:'Chambre 184 (avec balcon)',price:150,free:true}
];
const reviewsBase = [
  {name:'Alice',rating:3,text:'Le personnel est souvent absent mais l hôtel reste excellent. '},
  {name:'Marc',rating:4,text:'Très bon rapport qualité-prix !'},
  {name:'Sophie',rating:5,text:'La salle de jeux est super !'},
  {name:'Jean',rating:5,text:'Petit déjeuner excellent.'},
  {name:'Claire',rating:4,text:'Endroit calme et propre.'},
  {name:'David',rating:5,text:'Accueil chaleureux'},
  {name:'Jean Bave',rating:1,text:'On s est mal occupé de moi. Je me suis échappé. Jean Bave l escargot du Marais'},
];

// --- LocalStorage ---
let reviews = JSON.parse(localStorage.getItem('reviews')) || reviewsBase;
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// --- Chambres ---
const roomsDiv = document.getElementById('rooms');
function renderRooms() {
  roomsDiv.innerHTML = '';
  rooms.forEach(r=>{
    const div=document.createElement('div');
    div.className='room';
    div.innerHTML=`<b>${r.name}</b><br>Prix: ${r.price?r.price+'€':'--'}<br>
      <button ${r.free?'':'disabled'} onclick="bookRoom(${r.id})">${r.free?'Réserver':'Occupée'}</button>`;
    roomsDiv.appendChild(div);
  });
}
renderRooms();

// --- Réservations ---
function bookRoom(id) {
  const room = rooms.find(r => r.id === id);

  // Création d'un mini pop-up HTML
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Réserver ${room.name}</h3>
      <label>Votre nom :</label>
      <input id="popup-name" type="text" required>
      <label>Date de début :</label>
      <input id="popup-date" type="date" required>
      <label>Durée (en jours) :</label>
      <input id="popup-duration" type="number" min="1" required>
      <label>Numéro de téléphone (optionnel) :</label>
      <input id="popup-phone" type="tel" placeholder="ex : 06 12 34 56 78">
      <button id="popup-ok">Valider</button>
      <button id="popup-cancel">Annuler</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('popup-ok').onclick = () => {
    const name = document.getElementById('popup-name').value.trim();
    const date = document.getElementById('popup-date').value;
    const duration = document.getElementById('popup-duration').value;
    const phone = document.getElementById('popup-phone').value.trim();

    if (!name || !date || !duration) {
      alert('Merci de remplir au moins le nom, la date et la durée.');
      return;
    }

    const booking = {
      guest: name,
      room: room.name,
      roomId: room.id, // numéro automatique
      date,
      duration,
      phone: phone || 'Non renseigné'
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    room.free = false;
    renderRooms();
    popup.remove();

    alert(`Réservation enregistrée :
- ${room.name}
- Du ${date} pour ${duration} jour(s)
- Au nom de ${name}
- Téléphone : ${phone || 'Non renseigné'}`);
  };

  document.getElementById('popup-cancel').onclick = () => popup.remove();
}
document.getElementById('booking-form').onsubmit = e => {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const name = document.getElementById('name').value.trim();
  const date = document.getElementById('date').value;
  const duration = document.getElementById('duration').value;

  if (!name || !date || !duration) {
    alert("Merci de remplir tous les champs obligatoires.");
    return;
  }

  // Charger les réservations existantes
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  // Créer la nouvelle réservation
  const newBooking = {
    type,        // type de jeu choisi
    guest: name,
    date,
    duration
  };

  // Ajouter et sauvegarder
  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  alert(`🎱 Réservation ajoutée :
- Jeu : ${type}
- Nom : ${name}
- Date : ${date}
- Durée : ${duration}`);

  e.target.reset();
};

function renderBookings() {
  const container = document.getElementById('bookings-list');
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  container.innerHTML = '';

  if (!bookings.length) {
    container.innerHTML = '<p>Aucune réservation enregistrée.</p>';
    return;
  }

  bookings.forEach((b, i) => {
    const div = document.createElement('div');
    div.className = 'room';
    if (b.roomId) {
      // Chambre
      div.innerHTML = `
        <b>🏨 ${b.room} (n°${b.roomId})</b><br>
        👤 ${b.guest}<br>
        📅 ${b.date}<br>
        ⏱️ ${b.duration} jour(s)<br>
        📞 ${b.phone || 'Non renseigné'}<br>
        <button onclick="deleteBooking(${i})">🗑️ Supprimer</button>
      `;
    } else {
      // Jeu
      div.innerHTML = `
        <b>🎱 ${b.type}</b><br>
        👤 ${b.guest}<br>
        📅 ${b.date}<br>
        ⏱️ ${b.duration}<br>
        <button onclick="deleteBooking(${i})">🗑️ Supprimer</button>
      `;
    }
    container.appendChild(div);
  });
}

// Bouton “Voir réservations”
document.getElementById('show-bookings').onclick = renderBookings;

// Supprimer UNE réservation
function deleteBooking(index) {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  if (!bookings[index]) return;

  if (confirm(`Supprimer la réservation de ${bookings[index].guest} ?`)) {
    bookings.splice(index, 1);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    renderBookings(); // rafraîchir l’affichage
  }
}

// Bouton “Effacer tout” (facultatif)
document.getElementById('clear-bookings').onclick = () => {
  if (confirm('Effacer toutes les réservations ?')) {
    localStorage.removeItem('bookings');
    renderBookings();
  }
};

// --- Avis ---
const reviewDiv=document.getElementById('reviews');
function renderReviews(){
  reviewDiv.innerHTML='';
  reviews.slice().reverse().forEach(r=>{
    const d=document.createElement('div');
    d.className='room';
    d.innerHTML=`<b>${r.name}</b> — ${'★'.repeat(Number(r.rating))}<br>${r.text}`;
    reviewDiv.appendChild(d);
  });
}
renderReviews();
document.getElementById('review-form').onsubmit=e=>{
  e.preventDefault();
  const n=document.getElementById('review-name').value;
  const r=document.getElementById('review-rating').value;
  const t=document.getElementById('review-text').value;
  reviews.push({name:n,rating:r,text:t});
  localStorage.setItem('reviews',JSON.stringify(reviews));
  renderReviews();
  e.target.reset();
};

