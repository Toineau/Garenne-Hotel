// --- Menu déroulant ---
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
menuBtn.onclick = () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

// --- Données ---
const rooms = [
  {id:181,name:'Chambre 181 (Staff)',price:0,free:false},
  {id:182,name:'Chambre 182',price:80,free:true},
  {id:183,name:'Chambre 183',price:120,free:true},
  {id:184,name:'Chambre 184',price:70,free:true}
];
const reviewsBase = [
  {name:'Alice',rating:3,text:'Le personnel est souvent absent mais l'hôtel reste excellent. '},
  {name:'Marc',rating:4,text:'Très bon rapport qualité-prix !'},
  {name:'Sophie',rating:5,text:'La salle de jeux est super !'},
  {name:'Jean',rating:5,text:'Petit déjeuner excellent.'},
  {name:'Claire',rating:4,text:'Endroit calme et propre.'},
  {name:'David',rating:5,text:'Accueil chaleureux'},
  {name:'Sofia',rating:2,text:'Un hôtel classique mais pas de petit déjeuner malheureusement'},
  {name:'Jean Bave',rating:1,text:'On s est mal occupé de moi je me suis échapper. Jean Bave l escargot du Marais'},
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
function bookRoom(id){
  const room=rooms.find(r=>r.id===id);
  const guest=prompt('Votre nom ?');
  if(!guest) return;
  const date=prompt('Date ? (AAAA-MM-JJ)');
  bookings.push({type:'chambre',guest,room:room.name,date});
  room.free=false;
  localStorage.setItem('bookings',JSON.stringify(bookings));
  renderRooms();
  alert('Réservation enregistrée localement.');
}
document.getElementById('booking-form').onsubmit=e=>{
  e.preventDefault();
  const type=document.getElementById('type').value;
  const name=document.getElementById('name').value;
  const date=document.getElementById('date').value;
  const duration=document.getElementById('duration').value;
  bookings.push({type,guest:name,date,duration});
  localStorage.setItem('bookings',JSON.stringify(bookings));
  alert('Réservation ajoutée !');
  e.target.reset();
};
document.getElementById('show-bookings').onclick=()=>{
  if(!bookings.length)return alert('Aucune réservation');
  alert(bookings.map(b=>`${b.guest} → ${b.type} le ${b.date}`).join('\\n'));
};
document.getElementById('clear-bookings').onclick=()=>{
  if(confirm('Effacer toutes les réservations ?')){
    bookings=[];localStorage.setItem('bookings','[]');
    rooms.forEach(r=>{if(r.id!==181)r.free=true});
    renderRooms();
  }
};

// --- Avis ---
const reviewDiv=document.getElementById('reviews');
function renderReviews(){
  reviewDiv.innerHTML='';
  reviews.slice().reverse().forEach(r=>{
    const d=document.createElement('div');
    d.className='room';
    d.innerHTML=`<b>${r.name}</b> — ${'★'.repeat(r.rating)}<br>${r.text}`;
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

