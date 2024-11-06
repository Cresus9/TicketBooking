import { mockEventService } from './mockData';
import { Event } from './mockData';

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    try {
      return await mockEventService.getAll();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Event | undefined> => {
    try {
      return await mockEventService.getById(id);
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    try {
      return await mockEventService.getFeaturedEvents();
    } catch (error) {
      console.error('Error fetching featured events:', error);
      throw error;
    }
  },

  create: async (event: Omit<Event, 'id'>): Promise<Event> => {
    try {
      return await mockEventService.create(event);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    try {
      return await mockEventService.update(id, event);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await mockEventService.delete(id);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};