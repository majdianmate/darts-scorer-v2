import { db } from "#/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { User } from "../types/user-types";
import MiniSearch from 'minisearch';

export async function searchUsersService(searchTerm: string): Promise<User[]> {
    if (!searchTerm || searchTerm.length < 3) return [];

    // 1. Lekérjük az összes felhasználót a Firestore-ból
    // Tipp: Ezt érdemes lehet cache-elni egy változóba, hogy ne fusson le minden leütésnél!
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const allUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as User[];

    // 2. Beállítjuk a MiniSearch-et
    const miniSearch = new MiniSearch({
        fields: ['name', 'username', 'email'], // ezekben a mezőkben fog keresni
        storeFields: ['name', 'username', 'email', 'image'], // ezeket adja vissza a találatnál
        searchOptions: {
            prefix: true, // engedélyezi a szó eleji egyezést (kri -> kristof)
            fuzzy: 0.2    // engedélyezi az apró elütéseket (pl. kristóf -> kristof)
        }
    });

    // 3. Betöltjük az adatokat
    miniSearch.addAll(allUsers);

    // 4. Keresés
    const results = miniSearch.search(searchTerm);
    console.log('results', results);

    // 5. Visszaalakítjuk a formátumot a te User típusodra
    return results.map(result => ({
        id: result.id,
        name: result.name,
        displayName: result.displayName,
        username: result.username,
        email: result.email,
        image: result.image,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    } as User));
}