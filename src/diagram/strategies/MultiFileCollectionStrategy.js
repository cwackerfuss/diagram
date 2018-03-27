import shortid from 'shortid';
import moment from 'moment';

export default class MultiFileCollectionStrategy {
  constructor({ type, driver }) {
    this.type = type
    this.storage = driver;
  }

  async _getManifest() {
    try {
      const result = await this.storage.getItem(this.type);
      return result || [];
    } catch (e) {
      console.error(e);
    }
  }

  async getItem(id) {
    try {
      const item = await this.storage.getItem(this._getItemPath(id));
      return item;
    } catch (e) {
      console.error(e);
    }
  }

  _getItemPath(id) {
    return `${this.type}/${id}`;
  }

  async _getItemsFromIds(ids = []) {
    if (ids.length > 0) {
      try {
        return await Promise.all(ids.map(this.getItem.bind(this)));
      } catch (e) {
        console.error(e);
        return e;
      }
    }
    return [];
  }

  async getItems() {
    try {
      const manifest = await this._getManifest();
      const items = await this._getItemsFromIds(manifest);
      return items;
    } catch (e) {
      console.error(e);
    }
  }

  async _addItemToManifest(id) {
    try {
      const manifest = await this._getManifest();
      const update = [...manifest, id];
      const newManifest = await this.storage.setItem(this.type, update);
      return update;
    } catch (e) {
      console.error(e);
    }
  }

  async _resetManifest() {
    try {
      const newManifest = await this.storage.setItem(this.type, []);
      return newManifest;
    } catch (e) {
      console.error(e);
    }
  }

  async _removeItemFromManifest(id) {
    try {
      const manifest = await this._getManifest();
      const update = manifest.filter((key) => key !== id);
      const newManifest = await this.storage.setItem(this.type, update);
      return update;
    } catch (e) {
      console.error(e);
    }
  }

  async createItem(payload) {
    let id = '';
    if (payload.id) {
      id = payload.id;
    } else {
      id = shortid.generate();
    }
    const newItem = {
      ...payload,
      id,
      updated: moment().format('X'),
      created: moment().format('X'),
    };

    try {
      await this._addItemToManifest(id);
      await this.storage.setItem(this._getItemPath(id), newItem);
      return newItem;
    } catch (e) {
      return console.error(e);
    }
  }

  async updateItem(item) {
    item = { ...item, updated: moment().format('X') };
    try {
      const savedItem = await this.storage.setItem(
        this._getItemPath(item.id),
        item,
      );
      return item;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteItem(id) {
    try {
      const updatedManifest = await this._removeItemFromManifest(id);
      const deletedItem = await this.storage.removeItem(this._getItemPath(id));
      return deletedItem;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
