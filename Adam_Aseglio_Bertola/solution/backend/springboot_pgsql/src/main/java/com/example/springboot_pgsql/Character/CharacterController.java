package com.example.springboot_pgsql.Character;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST Controller for Character endpoints.
 * Base URL: /api/characters
 * Provides operations for retrieving and searching anime characters.
 */
@RestController
public class CharacterController {

    private final CharacterService characterService;

    @Autowired
    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping("/search")
    public List<Character> searchByName(@RequestParam String name) {
        return characterService.searchByName(name);
    }

    @GetMapping
    public Page<Character> getAllCharacters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return characterService.getAllCharacters(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Character> getCharacterById(@PathVariable Integer id) {
        return characterService.getCharacterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
