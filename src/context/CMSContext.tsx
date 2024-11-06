import React, { createContext, useContext, useState } from 'react';
import { cmsService, Page, Banner, FAQ } from '../services/cmsService';

interface CMSContextType {
  pages: Page[];
  banners: Banner[];
  faqs: FAQ[];
  loadPages: () => Promise<void>;
  loadBanners: (activeOnly?: boolean) => Promise<void>;
  loadFAQs: (category?: string) => Promise<void>;
  createPage: (data: Omit<Page, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePage: (id: string, data: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  createBanner: (data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBanner: (id: string, data: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  createFAQ: (data: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFAQ: (id: string, data: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);

  const loadPages = async () => {
    const data = await cmsService.getPages();
    setPages(data);
  };

  const loadBanners = async (activeOnly = false) => {
    const data = await cmsService.getBanners(activeOnly);
    setBanners(data);
  };

  const loadFAQs = async (category?: string) => {
    const data = await cmsService.getFAQs(category);
    setFAQs(data);
  };

  const createPage = async (data: Omit<Page, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    await cmsService.createPage(data);
    await loadPages();
  };

  const updatePage = async (id: string, data: Partial<Page>) => {
    await cmsService.updatePage(id, data);
    await loadPages();
  };

  const deletePage = async (id: string) => {
    await cmsService.deletePage(id);
    await loadPages();
  };

  const createBanner = async (data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    await cmsService.createBanner(data);
    await loadBanners();
  };

  const updateBanner = async (id: string, data: Partial<Banner>) => {
    await cmsService.updateBanner(id, data);
    await loadBanners();
  };

  const deleteBanner = async (id: string) => {
    await cmsService.deleteBanner(id);
    await loadBanners();
  };

  const createFAQ = async (data: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>) => {
    await cmsService.createFAQ(data);
    await loadFAQs();
  };

  const updateFAQ = async (id: string, data: Partial<FAQ>) => {
    await cmsService.updateFAQ(id, data);
    await loadFAQs();
  };

  const deleteFAQ = async (id: string) => {
    await cmsService.deleteFAQ(id);
    await loadFAQs();
  };

  return (
    <CMSContext.Provider value={{
      pages,
      banners,
      faqs,
      loadPages,
      loadBanners,
      loadFAQs,
      createPage,
      updatePage,
      deletePage,
      createBanner,
      updateBanner,
      deleteBanner,
      createFAQ,
      updateFAQ,
      deleteFAQ
    }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}