import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase-admin.init';

@Injectable()
export class UsersService {
  constructor(private firebase: FirebaseService) {}

  async updateFreePeriod() {
    console.log('Updating free periods for validated accounts...');

    const usersRef = this.firebase.firestore.collection('users');
    const snapshot = await usersRef.where('validatedAccount', '==', true).get();

    if (snapshot.empty) return;

    const batch = this.firebase.firestore.batch();

    snapshot.docs.forEach((doc) => {
      type UserDoc = { freePeriod?: number; validatedAccount?: boolean };
      const data = doc.data() as UserDoc;
      const freePeriod =
        typeof data.freePeriod === 'number' ? data.freePeriod : 0;
      const newFreePeriod = freePeriod + 1;

      if (newFreePeriod >= 15) {
        batch.update(doc.ref, {
          freePeriod: newFreePeriod,
          validatedAccount: false,
        });
      } else {
        batch.update(doc.ref, {
          freePeriod: newFreePeriod,
        });
      }
    });

    await batch.commit();
  }
}
