import { Customer, Region, VisitStatus } from '../types';

// Initial Seed Data based on user prompt
const INITIAL_REGIONS: Region[] = [
  { id: 1, name: "دهوك", subregions: ["ملا عيدان", "مالطا", "نوهدرا سنتر", "السياحية", "حي العسكري"] },
  { id: 2, name: "دوميز", subregions: ["مجمع دوميز 1", "مجمع دوميز 2", "الحي الصناعي"] },
  { id: 3, name: "سيميل", subregions: ["سيميل سنتر", "كيستي", "شاريا"] },
  { id: 4, name: "شيلادزي", subregions: ["سنتر", "افرخى", "بازيفى"] }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "1",
    shopName: "صيدلية الورد",
    managerName: "أحمد علي",
    phone: "9647700123456",
    mainRegion: "دهوك",
    subRegion: "حي العسكري",
    whatsappLink: "https://wa.me/9647700123456",
    mapLink: "http://maps.google.com/?q=36.8,42.9",
    visitStatus: VisitStatus.DONE
  },
  {
    id: "2",
    shopName: "صيدلية النور",
    managerName: "سارة محمود",
    phone: "9647700654321",
    mainRegion: "دهوك",
    subRegion: "مالطا",
    whatsappLink: "https://wa.me/9647700654321",
    mapLink: "http://maps.google.com/?q=36.8,42.9",
    visitStatus: VisitStatus.NOT_DONE
  },
  {
    id: "3",
    shopName: "مكتبة العلم",
    managerName: "خالد حسن",
    phone: "9647700987654",
    mainRegion: "سيميل",
    subRegion: "شاريا",
    whatsappLink: "https://wa.me/9647700987654",
    mapLink: "http://maps.google.com/?q=36.8,42.9",
    visitStatus: VisitStatus.POSTPONED
  }
];

const STORAGE_KEYS = {
  CUSTOMERS: 'crm_customers',
  REGIONS: 'crm_regions'
};

// Simulation of Async Firestore calls
export const dataService = {
  getCustomers: async (): Promise<Customer[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(data);
  },

  saveCustomer: async (customer: Customer): Promise<void> => {
    const customers = await dataService.getCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  deleteCustomer: async (id: string): Promise<void> => {
    const customers = await dataService.getCustomers();
    const newCustomers = customers.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(newCustomers));
  },

  getRegions: async (): Promise<Region[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.REGIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(INITIAL_REGIONS));
      return INITIAL_REGIONS;
    }
    return JSON.parse(data);
  },

  saveRegion: async (region: Region): Promise<void> => {
    const regions = await dataService.getRegions();
    const existingIndex = regions.findIndex(r => r.id === region.id);
    
    if (existingIndex >= 0) {
      regions[existingIndex] = region;
    } else {
      regions.push(region);
    }
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
  },

  deleteRegion: async (id: string | number): Promise<void> => {
    const regions = await dataService.getRegions();
    const newRegions = regions.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(newRegions));
  },
  
  bulkImportCustomers: async (newCustomers: Customer[]): Promise<void> => {
    const current = await dataService.getCustomers();
    const updated = [...current, ...newCustomers];
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
  },

  /**
   * Resets the weekly visits for all customers.
   * Simulates Firestore WriteBatch functionality.
   */
  resetWeeklyVisits: async (): Promise<void> => {
    try {
      // 1. Get raw data first to ensure we have the latest state
      let customers: Customer[] = [];
      const rawData = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      
      if (!rawData) {
        customers = INITIAL_CUSTOMERS;
      } else {
        customers = JSON.parse(rawData);
      }
      
      // 2. Update status to 'لم تتم' for every customer
      const updatedCustomers = customers.map(customer => ({
        ...customer,
        visitStatus: VisitStatus.NOT_DONE
      }));

      // 3. Save back to local storage
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updatedCustomers));
      
      console.log('Weekly visits reset successfully. Count:', updatedCustomers.length);
    } catch (error) {
      console.error('Error resetting weekly visits:', error);
      throw error;
    }
  }
};