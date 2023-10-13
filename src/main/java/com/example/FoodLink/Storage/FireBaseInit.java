package com.example.FoodLink.Storage;`

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions
import org.springframework.stereotype.Component

import javax.annotation.PostConstruct
import java.io.FileInputStream;

@Component
class FirebaseDBInit {

    @PostConstruct
    public void initialize() {
        try {
            FileInputStream serviceAccount =
                    new FileInputStream("./src/main/resources/serviceaccount.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://trip-buddy-b3dad-default-rtdb.firebaseio.com/")
                    .build();

            FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
