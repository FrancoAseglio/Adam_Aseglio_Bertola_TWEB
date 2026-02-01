package com.example.springboot_pgsql.Person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;

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

    @Operation(summary = "Get all people", description = "Retrieve a paginated list of all people (voice actors, staff).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of people returned successfully")
    })
    @GetMapping
    public Page<Person> getAllPeople(
            @Parameter(description = "Page number", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "20") @RequestParam(defaultValue = "20") int size) {
        return personService.getAllPeople(PageRequest.of(page, size));
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

    @Operation(summary = "Search people by name", description = "Search for people (voice actors, staff) by name.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of people matching the name")
    })
    @GetMapping("/search")
    public List<Person> searchByName(
            @Parameter(description = "Person name to search for", example = "Kana Hanazawa") @RequestParam String name) {
        return personService.searchByName(name);
    }
}
