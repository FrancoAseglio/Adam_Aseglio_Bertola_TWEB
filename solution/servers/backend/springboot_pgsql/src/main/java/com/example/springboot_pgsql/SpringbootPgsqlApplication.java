package com.example.springboot_pgsql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Springboot Anime API Server",
        description = "API documentation for the Spring Boot Anime server."
    ),
    servers = {
        @Server(
            url = "http://localhost:8080",
            description = "Springboot Anime API Server"
        )
    }
)
public class SpringbootPgsqlApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootPgsqlApplication.class, args);
    }

}
