import api from './api';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  description?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

class CMSService {
  // Pages
  async getPages(): Promise<Page[]> {
    const response = await api.get('/cms/pages');
    return response.data;
  }

  async getPageBySlug(slug: string): Promise<Page> {
    const response = await api.get(`/cms/pages/${slug}`);
    return response.data;
  }

  async createPage(data: Omit<Page, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    const response = await api.post('/cms/pages', data);
    return response.data;
  }

  async updatePage(id: string, data: Partial<Page>): Promise<Page> {
    const response = await api.put(`/cms/pages/${id}`, data);
    return response.data;
  }

  async deletePage(id: string): Promise<void> {
    await api.delete(`/cms/pages/${id}`);
  }

  // Banners
  async getBanners(activeOnly = false): Promise<Banner[]> {
    const response = await api.get('/cms/banners', {
      params: { active: activeOnly }
    });
    return response.data;
  }

  async createBanner(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> {
    const response = await api.post('/cms/banners', data);
    return response.data;
  }

  async updateBanner(id: string, data: Partial<Banner>): Promise<Banner> {
    const response = await api.put(`/cms/banners/${id}`, data);
    return response.data;
  }

  async deleteBanner(id: string): Promise<void> {
    await api.delete(`/cms/banners/${id}`);
  }

  // FAQs
  async getFAQs(category?: string): Promise<FAQ[]> {
    const response = await api.get('/cms/faqs', {
      params: { category }
    });
    return response.data;
  }

  async createFAQ(data: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): Promise<FAQ> {
    const response = await api.post('/cms/faqs', data);
    return response.data;
  }

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<FAQ> {
    const response = await api.put(`/cms/faqs/${id}`, data);
    return response.data;
  }

  async deleteFAQ(id: string): Promise<void> {
    await api.delete(`/cms/faqs/${id}`);
  }
}

export const cmsService = new CMSService();