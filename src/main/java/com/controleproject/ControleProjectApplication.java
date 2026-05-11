package com.controleproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.controleproject")
@EnableJpaRepositories(basePackages = "com.controleproject.repository")
@EntityScan(basePackages = "com.controleproject.entity")
public class ControleProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ControleProjectApplication.class, args);
    }

}