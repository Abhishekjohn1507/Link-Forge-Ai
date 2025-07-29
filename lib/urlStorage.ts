import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

interface UrlMapping {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  userId?: string;
  alias?: string;
  clicks: number;
  lastClicked?: string;
}

interface UrlMappingData {
  originalUrl: string;
  createdAt: string;
  userId?: string;
  alias?: string;
  clicks: number;
  lastClicked?: string;
}

const STORAGE_FILE = path.join(process.cwd(), 'urls.json');

class UrlStorage {
  private urlMap = new Map<string, UrlMappingData>();
  private initialized = false;

  private async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
        const mappings: UrlMapping[] = JSON.parse(data);
        
        mappings.forEach(mapping => {
          this.urlMap.set(mapping.shortCode, {
            originalUrl: mapping.originalUrl,
            createdAt: mapping.createdAt,
            userId: mapping.userId,
            alias: mapping.alias,
            clicks: mapping.clicks || 0,
            lastClicked: mapping.lastClicked
          });
        });
      }
    } catch (error) {
      console.error('Error loading URL mappings:', error);
    }
    
    this.initialized = true;
  }

  private async saveToFile(): Promise<void> {
    try {
      const mappings: UrlMapping[] = Array.from(this.urlMap.entries()).map(([shortCode, mapping]) => ({
        shortCode,
        originalUrl: mapping.originalUrl,
        createdAt: mapping.createdAt,
        userId: mapping.userId,
        alias: mapping.alias,
        clicks: mapping.clicks,
        lastClicked: mapping.lastClicked
      }));
      
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(mappings, null, 2));
    } catch (error) {
      console.error('Error saving URL mappings:', error);
    }
  }

  async createShortUrl(originalUrl: string, userId?: string, alias?: string): Promise<string> {
    await this.initialize();
    
    let shortCode = nanoid(8);
    
    // If alias is provided, use it as shortCode
    if (alias) {
      if (await this.urlExists(alias)) {
        throw new Error('Alias already exists');
      }
      shortCode = alias;
    } else {
      // Generate unique shortCode
      while (await this.urlExists(shortCode)) {
        shortCode = nanoid(8);
      }
    }
    
    this.urlMap.set(shortCode, {
      originalUrl,
      createdAt: new Date().toISOString(),
      userId,
      alias,
      clicks: 0
    });
    
    await this.saveToFile();
    return shortCode;
  }

  async createBulkShortUrls(urls: string[], userId?: string): Promise<Array<{ originalUrl: string; shortCode: string; shortUrl: string }>> {
    await this.initialize();
    
    const results = [];
    
    for (const url of urls) {
      try {
        const shortCode = await this.createShortUrl(url, userId);
        results.push({
          originalUrl: url,
          shortCode,
          shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${shortCode}`
        });
      } catch (error) {
        console.error(`Failed to shorten URL: ${url}`, error);
      }
    }
    
    return results;
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    await this.initialize();
    const mapping = this.urlMap.get(shortCode);
    return mapping ? mapping.originalUrl : null;
  }

  async getUrlMapping(shortCode: string): Promise<UrlMappingData | null> {
    await this.initialize();
    return this.urlMap.get(shortCode) || null;
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await this.initialize();
    const mapping = this.urlMap.get(shortCode);
    if (mapping) {
      mapping.clicks += 1;
      mapping.lastClicked = new Date().toISOString();
      this.urlMap.set(shortCode, mapping);
      await this.saveToFile();
    }
  }

  async getUserUrls(userId: string): Promise<Array<{ shortCode: string; originalUrl: string; alias?: string; clicks: number; createdAt: string; lastClicked?: string }>> {
    await this.initialize();
    
    const userUrls = [];
    for (const [shortCode, mapping] of this.urlMap.entries()) {
      if (mapping.userId === userId) {
        userUrls.push({
          shortCode,
          originalUrl: mapping.originalUrl,
          alias: mapping.alias,
          clicks: mapping.clicks,
          createdAt: mapping.createdAt,
          lastClicked: mapping.lastClicked
        });
      }
    }
    
    return userUrls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateUrlAlias(shortCode: string, newAlias: string, userId: string): Promise<boolean> {
    await this.initialize();
    
    const mapping = this.urlMap.get(shortCode);
    if (!mapping || mapping.userId !== userId) {
      return false;
    }

    // Check if new alias already exists
    if (await this.urlExists(newAlias)) {
      return false;
    }

    // Create new mapping with new alias
    this.urlMap.set(newAlias, {
      ...mapping,
      alias: newAlias
    });

    // Remove old mapping
    this.urlMap.delete(shortCode);
    
    await this.saveToFile();
    return true;
  }

  async deleteUrl(shortCode: string, userId: string): Promise<boolean> {
    await this.initialize();
    
    const mapping = this.urlMap.get(shortCode);
    if (!mapping || mapping.userId !== userId) {
      return false;
    }

    this.urlMap.delete(shortCode);
    await this.saveToFile();
    return true;
  }

  async urlExists(shortCode: string): Promise<boolean> {
    await this.initialize();
    return this.urlMap.has(shortCode);
  }

  async getUrlStats(shortCode: string, userId: string): Promise<{ clicks: number; lastClicked?: string } | null> {
    await this.initialize();
    
    const mapping = this.urlMap.get(shortCode);
    if (!mapping || mapping.userId !== userId) {
      return null;
    }

    return {
      clicks: mapping.clicks,
      lastClicked: mapping.lastClicked
    };
  }
}

// Export a singleton instance
export const urlStorage = new UrlStorage();