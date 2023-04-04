import { Injectable } from '@nestjs/common';
import 'firebase/auth';
import fireauth from 'src/utils/authentication';
import firestore from 'src/utils/firebase';

@Injectable()
export class AuthService {

  constructor() {}

  async signUpWithEmailAndPassword(email: string, password: string) {
    try {
      const result = await fireauth.createUserWithEmailAndPassword(email, password);
      await firestore.collection('users').doc(result.user.uid).set({
        'email' : email
      })
      return result.user.uid;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const result = await fireauth.signInWithEmailAndPassword(email, password);
      console.log("-> " , result);
      
      return result.user.uid;
    } catch (error) { 
      console.log("login invalid");
      return "Invalid"
      throw new Error(error.message);
    }
  }

  async signOut() {
    try {
      await fireauth.signOut();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async resetPassword(email: string) {
    try {
      await fireauth.sendPasswordResetEmail(email);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserToken(uid:string) {
    let token:string;
    await firestore.collection('users').doc(uid).get()
    .then(doc => {
      if(doc.data().hasOwnProperty('token')) {
        token = doc.data().token;
      } else {
        token = 'Invalid';
      }
    })
    return token;
  }

  async setUserToken(userToken:any) {
    await firestore.collection('users').doc(userToken.uid).update({
      "token" : userToken.token
    })
    return "Finish set user token";
  }
}
