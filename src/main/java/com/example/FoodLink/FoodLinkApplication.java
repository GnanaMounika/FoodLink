package com.example.FoodLink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class FoodLinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodLinkApplication.class, args);
	}

@GetMapping("/")
	public String sayHello(){
		return "Hellow World";
}
}
