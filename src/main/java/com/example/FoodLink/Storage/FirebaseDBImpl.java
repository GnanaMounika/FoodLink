package com.example.FoodLink.Storage;

import com.google.api.core.ApiFuture
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.QueryDocumentSnapshot
import com.google.cloud.firestore.QuerySnapshot
import com.google.cloud.firestore.WriteResult
import com.google.firebase.cloud.FirestoreClient

import java.util.List;
import java.util.Map;

@Singleton
class FirebaseDBImpl {

    public void addToDB(String key, Map document, String collection) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(collection).document(key).set(document);
        System.out.println("Update time : " + collectionsApiFuture.get().getUpdateTime());
    }

    public List getDocumentsFromDB(String key = null, String collection) {
        List documents = []
        Firestore dbFirestore = FirestoreClient.getFirestore();
        if (key){
            DocumentReference docRef = dbFirestore.collection(collection).document(key);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                documents.add(document.getData())
            }
        } else {
            ApiFuture<QuerySnapshot> future = dbFirestore.collection(collection).get();
            List<QueryDocumentSnapshot> docs = future.get().getDocuments();
            for (QueryDocumentSnapshot document : docs) {
                documents.add(document.getData());
            }
        }
        return documents;
    }
}
