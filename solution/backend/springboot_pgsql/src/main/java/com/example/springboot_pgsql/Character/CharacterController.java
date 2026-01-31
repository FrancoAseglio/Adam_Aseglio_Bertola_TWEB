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
@RequestMapping("/api/characters")
@CrossOrigin(origins = "http://localhost:3001")
public class CharacterController {

    private final CharacterService characterService;

    @Autowired
    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping("/search")
    public List<Character> searchByName(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer minFavorites) {
        
        // If any filter is provided, use the advanced search
        if (role != null || minFavorites != null) {
            return characterService.searchWithFilters(name, role, minFavorites);
        }
        
        // Otherwise use simple name search
        if (name != null && !name.isEmpty()) {
            return characterService.searchByName(name);
        }
        
        // Return empty list if no parameters
        return java.util.Collections.emptyList();
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
    
 
    @PostMapping
    public ResponseEntity<?> addCharacter(@RequestBody java.util.Map<String, String> characterData) {
        try {
            String name = characterData.get("name");
            String image = characterData.get("image");
            String about = characterData.get("about");
            
            Character character = characterService.addCharacter(name, image, about);
            return ResponseEntity.status(HttpStatus.CREATED).body(character);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                .body(java.util.Map.of("error", e.getReason()));
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("error", "An error occurred while adding the character: " + e.getMessage()));
        }
    }
    
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeCharacter(@PathVariable Integer id) {
        try {
            characterService.removeCharacter(id);
            return ResponseEntity.ok(java.util.Map.of("message", "Character removed successfully"));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                .body(java.util.Map.of("error", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("error", "An error occurred while removing the character"));
        }
    }
}