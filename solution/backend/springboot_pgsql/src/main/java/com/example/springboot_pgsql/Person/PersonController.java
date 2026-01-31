package com.example.springboot_pgsql.Person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Person endpoints.
 * Base URL: /api/people
 * Provides operations for retrieving and searching people (voice actors, staff).
 */
@RestController
@RequestMapping("/api/people")
@CrossOrigin(origins = "http://localhost:3001")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public Page<Person> getAllPeople(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return personService.getAllPeople(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable Integer id) {
        return personService.getPersonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Person> searchByName(@RequestParam String name) {
        return personService.searchByName(name);
    }
}
