import { openDB } from "idb";

const DB_NAME = "CentroR_I";
const DB_VERSION = 1;
const STORE_PRODUCTS = "productos";
const STORE_SERVICES = "servicios";

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
        db.createObjectStore(STORE_PRODUCTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_SERVICES)) {
        db.createObjectStore(STORE_SERVICES, { keyPath: "id" });
      }
    },
  });
};

// Guardar lista de productos/servicios
export const saveItems = async (storeName, items) => {
  const db = await initDB();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  items.forEach((item) => store.put(item));
  await tx.done;
};

// Leer lista de productos/servicios
export const getItems = async (storeName) => {
  const db = await initDB();
  return db.getAll(storeName);
};
