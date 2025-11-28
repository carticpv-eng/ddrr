import { NewsItem, Debate, Conversion, OrganizationInfo, Appointment, Donation, Speaker, DonationCampaign } from './types';

export const SPEAKERS: Speaker[] = [
    {
        id: 'diane',
        name: 'Oustaz Diane',
        role: 'Le Savant du Comparatisme',
        bio: 'Figure emblématique de la DDR, Oustaz Diane est reconnu pour sa maîtrise exceptionnelle des textes bibliques et coraniques. Sa pédagogie et sa rigueur scientifique ont guidé des milliers de personnes vers la vérité.',
        imageUrl: 'https://images.unsplash.com/photo-1547496502-ffa22b335e6f?q=80&w=800&auto=format&fit=crop', // Fallback, le code priorise l'image locale si présente
        socials: {
            facebook: 'https://www.facebook.com/Oustazdianeoff',
            youtube: 'https://www.youtube.com/@ddrlavraiechaine',
            tiktok: 'https://www.tiktok.com/@ddrofficielle'
        }
    },
    {
        id: 'aka',
        name: 'Ismaël Aka',
        role: 'Le Stratège du Débat',
        bio: 'Redoutable débatteur, Ismaël Aka se distingue par son éloquence et sa capacité à déconstruire les arguments complexes avec simplicité. Il est un pilier de la Dawa de rue en Côte d\'Ivoire.',
        imageUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop', // Fallback
        socials: {
            facebook: 'https://www.facebook.com/ismaelAKAofficiel',
            youtube: 'https://www.youtube.com/@ddrlavraiechaine',
            tiktok: 'https://www.tiktok.com/@ddrofficielle'
        }
    }
];

// Données de la campagne pour l'École
export const SCHOOL_CAMPAIGN: DonationCampaign = {
    id: 'ecole-science-foi',
    title: 'Grande Mosquée & École "Science & Foi"',
    description: "La DDR lance la construction d'un complexe éducatif islamique de référence à Abidjan. Cette école formera la future élite musulmane ivoirienne, alliant excellence académique et valeurs morales.",
    targetAmount: 50000000, // 50 Millions FCFA
    currentAmount: 12450000,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop',
    trustIndicators: [
        { icon: '🧱', title: 'Matériaux & Briques', text: 'Achat de ciment, fer et briques pour les fondations.' },
        { icon: '👷', title: 'Main d\'œuvre', text: 'Paiement des maçons et ouvriers sur le chantier.' },
        { icon: '📚', title: 'Futur des Enfants', text: 'Investissement pour la Oumma de demain.' }
    ]
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Oustaz Diane : Grande tournée à l\'intérieur',
    content: 'Le maître du comparatisme, Oustaz Diane, entame une série de conférences historiques. Suivez son périple sur la page officielle.',
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop',
    category: 'Event',
    createdAt: '2023-11-25',
    author: 'Admin DDR',
    tags: ['Oustaz Diane', 'Conférence']
  },
  {
    id: '2',
    title: 'Ismaël Aka face aux contradictions',
    content: 'Retour sur le dernier débat percutant d\'Ismaël Aka qui a rassemblé des milliers de personnes à Yopougon. Une démonstration de logique implacable.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    category: 'News',
    createdAt: '2023-11-20',
    author: 'DDR Media',
    tags: ['Ismaël Aka', 'Débat']
  },
  {
    id: '3',
    title: 'La DDR lance sa chaîne TikTok officielle',
    content: 'Retrouvez les meilleurs moments (Reels/Shorts) des débats de nos maîtres sur notre nouvelle chaîne TikTok @ddrofficielle.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    category: 'Announcement',
    createdAt: '2023-12-01',
    author: 'Communication',
    tags: ['Réseaux Sociaux', 'Vidéo']
  },
  {
    id: '4',
    title: 'Formation des jeunes avec Oustaz Diane',
    content: 'Une session privée où Oustaz Diane transmet son savoir aux futurs cadres de la DDR. "La relève est assurée".',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop',
    category: 'News',
    createdAt: '2023-11-15',
    author: 'Formation',
    tags: ['Jeunesse', 'Transmission']
  }
];

export const MOCK_DEBATES: Debate[] = [
  {
    id: '1',
    title: 'Jésus (Issa) : Prophète ou Dieu ?',
    description: 'Le débat légendaire d\'Oustaz Diane qui clarifie la position de l\'Islam avec des preuves bibliques irréfutables.',
    videoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ', 
    date: '2023-11-05',
    speaker: 'Oustaz Diane',
    location: 'Abidjan, Place DDR'
  },
  {
    id: '2',
    title: 'La vérité sur le Péché Originel',
    description: 'Ismaël Aka décortique le concept du péché originel face à des contradicteurs. Un chef-d\'œuvre de rhétorique.',
    videoUrl: 'https://www.youtube.com/embed/F1B9Fk_SgI0', 
    date: '2023-10-15',
    speaker: 'Ismaël Aka',
    location: 'Yopougon'
  },
  {
    id: '3',
    title: 'Bible & Coran : Laquelle est la parole de Dieu ?',
    description: 'Une analyse comparative textuelle menée par Oustaz Diane devant une foule attentive.',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', 
    date: '2023-09-20',
    speaker: 'Oustaz Diane',
    location: 'Abobo'
  },
  {
    id: '4',
    title: 'Qui est le Paraclet ?',
    description: 'Ismaël Aka démontre avec brio que le Paraclet annoncé par Jésus correspond au Prophète Muhammad (PSL).',
    videoUrl: 'https://www.youtube.com/embed/tMKXbLBgkEc', 
    date: '2023-08-12',
    speaker: 'Ismaël Aka',
    location: 'Adjamé'
  }
];

export const MOCK_CONVERSIONS: Conversion[] = [
  {
    id: '1',
    name: 'Aïcha K.',
    story: "C'est en regardant une vidéo d'Oustaz Diane sur Facebook que tout a basculé. Il expliquait un verset avec une telle clarté que mes doutes se sont dissipés. J'ai pris contact via la page officielle.",
    date: '2023-08-20',
    mediaUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=800&auto=format&fit=crop' // Femme Africaine Voilée
  },
  {
    id: '2',
    name: 'Moussa (Ex-Marc)',
    story: "Je suivais Ismaël Aka sur YouTube pour me moquer au début. Mais sa patience et ses arguments logiques m'ont désarmé. Aujourd'hui, je suis fier d'être musulman grâce à la DDR.",
    date: '2023-09-15',
    mediaUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=800&auto=format&fit=crop' // Homme Africain
  },
  {
    id: '3',
    name: 'Maman Berthe',
    story: "À 60 ans, j'ai embrassé l'Islam. Mes enfants étaient choqués au début, mais en voyant que je suis devenue plus douce et patiente, ils ont accepté mon choix. La DDR m'a offert mes premiers livres.",
    date: '2023-10-02',
    mediaUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=800&auto=format&fit=crop' // Homme Africain âgé (Simulé Maman Berthe, image placeholder pour diversité)
  }
];

export const MOCK_INFO: OrganizationInfo[] = [
  { id: '1', title: 'Mission', description: 'Promouvoir le dialogue interreligieux.', icon: 'handshake', order: 1 },
  { id: '2', title: 'Vision', description: 'Une société apaisée et instruite.', icon: 'visibility', order: 2 },
  { id: '3', title: 'Valeurs', description: 'Respect, Vérité, Fraternité.', icon: 'favorite', order: 3 },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: '1', type: 'contact', name: 'Kouamé Jean', phone: '0707070707', subject: 'Question théologique', requestedDate: '2023-11-20', message: 'Je veux comprendre...', status: 'pending', createdAt: '2023-11-15'},
    { id: '2', type: 'contact', name: 'Awa Koné', phone: '0505050505', subject: 'Don matériel', requestedDate: '2023-11-22', message: 'Je veux donner des chaises', status: 'confirmed', createdAt: '2023-11-16'}
];

export const MOCK_DONATIONS: Donation[] = [
    { id: '1', amount: 5000, donorName: 'Anonyme', isAnonymous: true, donorPhone: '0101010101', method: 'Wave', status: 'success', createdAt: '2023-11-01' },
    { id: '2', amount: 150000, donorName: 'Traoré Moussa', isAnonymous: false, donorPhone: '0708091011', method: 'OrangeMoney', status: 'success', createdAt: '2023-11-05' },
    { id: '3', amount: 25000, donorName: 'Anonyme', isAnonymous: true, donorPhone: '0505050505', method: 'MTN', status: 'success', createdAt: '2023-11-06' },
    { id: '4', amount: 10000, donorName: 'Kader', isAnonymous: false, donorPhone: '0102030405', method: 'Wave', status: 'success', createdAt: '2023-11-07' },
    { id: '5', amount: 500000, donorName: 'El Hadj Bakary', isAnonymous: false, donorPhone: '0707070707', method: 'Carte', status: 'success', createdAt: '2023-11-08' }
];

export const BACKEND_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == "admin";
    }

    match /news/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /debates/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /conversions/{document=**} { allow read: if true; allow write: if isAdmin(); }
    
    // Donations: Public create (init), Admin read/write
    match /donations/{donationId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }

    match /appointments/{aptId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
`;

export const BACKEND_FUNCTIONS = `
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onDonationSuccess = functions.firestore
  .document("donations/{donationId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    if (newData.status === "success") {
       console.log("Paiement reçu :", newData.amount);
       // Envoyer SMS de remerciement via Twilio
    }
  });
`;