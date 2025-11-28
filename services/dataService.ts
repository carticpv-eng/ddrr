
import { SCHOOL_CAMPAIGN, MOCK_NEWS, MOCK_DEBATES, MOCK_CONVERSIONS, MOCK_APPOINTMENTS, MOCK_DONATIONS } from '../constants';
import { NewsItem, Debate, Conversion, Appointment, Donation, DonationCampaign } from '../types';

const KEYS = {
    CAMPAIGN: 'ddr_db_campaign',
    NEWS: 'ddr_db_news',
    DEBATES: 'ddr_db_debates',
    CONVERSIONS: 'ddr_db_conversions',
    APPOINTMENTS: 'ddr_db_appointments',
    DONATIONS: 'ddr_db_donations',
    SETTINGS: 'ddr_db_settings' // Nouvelle clé pour maintenance & flash info
};

interface AppSettings {
    maintenanceMode: boolean;
    flashMessage: string;
    flashActive: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    maintenanceMode: false,
    flashMessage: "Bienvenue sur le site officiel de la DDR.",
    flashActive: false
};

// Charge les données ou initialise avec les Mocks si vide
const load = <T>(key: string, seed: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) {
        localStorage.setItem(key, JSON.stringify(seed));
        return seed;
    }
    return JSON.parse(stored);
};

const save = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const dataService = {
    // --- GESTION PARAMÈTRES GLOBAUX ---
    getSettings: (): AppSettings => load(KEYS.SETTINGS, DEFAULT_SETTINGS),
    updateSettings: (newSettings: Partial<AppSettings>) => {
        const current = load(KEYS.SETTINGS, DEFAULT_SETTINGS);
        const updated = { ...current, ...newSettings };
        save(KEYS.SETTINGS, updated);
        return updated;
    },

    // --- GESTION CAMPAGNE ÉCOLE ---
    getCampaign: (): DonationCampaign => load(KEYS.CAMPAIGN, SCHOOL_CAMPAIGN),
    updateCampaignAmount: (amount: number) => {
        const c = load<DonationCampaign>(KEYS.CAMPAIGN, SCHOOL_CAMPAIGN);
        c.currentAmount += amount;
        save(KEYS.CAMPAIGN, c);
        return c;
    },
    updateCampaign: (campaign: DonationCampaign) => {
        save(KEYS.CAMPAIGN, campaign);
        return campaign;
    },

    // --- GESTION DONS & TRANSACTIONS ---
    getDonations: (): Donation[] => load(KEYS.DONATIONS, MOCK_DONATIONS),
    addDonation: (donation: Donation) => {
        const list = load<Donation[]>(KEYS.DONATIONS, MOCK_DONATIONS);
        // Ajouter au début de la liste
        const newList = [donation, ...list];
        save(KEYS.DONATIONS, newList);
        
        // Mettre à jour la campagne automatiquement
        dataService.updateCampaignAmount(donation.amount);
        return newList;
    },

    // --- GESTION RENDEZ-VOUS & DÉFIS ---
    getAppointments: (): Appointment[] => load(KEYS.APPOINTMENTS, MOCK_APPOINTMENTS),
    addAppointment: (apt: Appointment) => {
        const list = load<Appointment[]>(KEYS.APPOINTMENTS, MOCK_APPOINTMENTS);
        const newList = [apt, ...list];
        save(KEYS.APPOINTMENTS, newList);
        return newList;
    },
    updateAppointmentStatus: (id: string, status: 'confirmed' | 'rejected' | 'pending') => {
        const list = load<Appointment[]>(KEYS.APPOINTMENTS, MOCK_APPOINTMENTS);
        const updatedList = list.map(a => a.id === id ? { ...a, status } : a);
        save(KEYS.APPOINTMENTS, updatedList);
        return updatedList;
    },
    deleteAppointment: (id: string) => {
        const list = load<Appointment[]>(KEYS.APPOINTMENTS, MOCK_APPOINTMENTS);
        const newList = list.filter(a => a.id !== id);
        save(KEYS.APPOINTMENTS, newList);
        return newList;
    },

    // --- GESTION CONTENU (CMS) ---
    getNews: (): NewsItem[] => load(KEYS.NEWS, MOCK_NEWS),
    addNews: (item: NewsItem) => {
        const list = load<NewsItem[]>(KEYS.NEWS, MOCK_NEWS);
        save(KEYS.NEWS, [item, ...list]);
    },
    updateNews: (item: NewsItem) => {
        const list = load<NewsItem[]>(KEYS.NEWS, MOCK_NEWS);
        const updated = list.map(i => i.id === item.id ? item : i);
        save(KEYS.NEWS, updated);
    },
    deleteNews: (id: string) => {
        const list = load<NewsItem[]>(KEYS.NEWS, MOCK_NEWS);
        save(KEYS.NEWS, list.filter(i => i.id !== id));
        return list.filter(i => i.id !== id);
    },

    getDebates: (): Debate[] => load(KEYS.DEBATES, MOCK_DEBATES),
    addDebate: (item: Debate) => {
        const list = load<Debate[]>(KEYS.DEBATES, MOCK_DEBATES);
        save(KEYS.DEBATES, [item, ...list]);
    },
    updateDebate: (item: Debate) => {
        const list = load<Debate[]>(KEYS.DEBATES, MOCK_DEBATES);
        const updated = list.map(i => i.id === item.id ? item : i);
        save(KEYS.DEBATES, updated);
    },
    deleteDebate: (id: string) => {
        const list = load<Debate[]>(KEYS.DEBATES, MOCK_DEBATES);
        save(KEYS.DEBATES, list.filter(i => i.id !== id));
        return list.filter(i => i.id !== id);
    },
    
    getConversions: (): Conversion[] => load(KEYS.CONVERSIONS, MOCK_CONVERSIONS),
    addConversion: (item: Conversion) => {
        const list = load<Conversion[]>(KEYS.CONVERSIONS, MOCK_CONVERSIONS);
        save(KEYS.CONVERSIONS, [item, ...list]);
    },
    deleteConversion: (id: string) => {
        const list = load<Conversion[]>(KEYS.CONVERSIONS, MOCK_CONVERSIONS);
        save(KEYS.CONVERSIONS, list.filter(i => i.id !== id));
        return list.filter(i => i.id !== id);
    },

    // Reset pour démo
    resetAll: () => {
        localStorage.clear();
        window.location.reload();
    }
};
