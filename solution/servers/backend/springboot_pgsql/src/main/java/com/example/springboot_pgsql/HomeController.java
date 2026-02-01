package com.example.springboot_pgsql;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Spring Boot Backend</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #333; }
                    p { color: #666; }
                    a { color: #007bff; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>🍃 Spring Boot PostgreSQL Backend</h1>
                <p>This is the project's Spring Boot backend server. You aren't supposed to be here.</p>
                <p><a href="http://localhost:3000">→ Go to Frontend (localhost:3000)</a></p>
            </body>
            </html>
            """;
    }
}
