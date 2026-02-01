package com.example.springboot_pgsql.Person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * REST Controller for Person endpoints.
 * Base URL: /api/people
 * Provides operations for retrieving and searching people (voice actors, staff).
 */
@RestController
@RequestMapping("/api/people")
@CrossOrigin(origins = "http://localhost:3001")
@Tag(name = "Person", description = "Operations related to people (voice actors, staff)")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @Operation(summary = "Get person by ID", description = "Retrieve a specific person by their ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Person found and returned"),
        @ApiResponse(responseCode = "404", description = "Person not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(
            @Parameter(description = "Person ID", example = "1") @PathVariable Integer id) {
        return personService.getPersonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
