package com.example.springboot_pgsql.Character;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;

/**
 * REST Controller for Character endpoints.
 * Base URL: /api/characters
 * Provides operations for retrieving and searching anime characters.
 */
@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "http://localhost:3001")
@Tag(name = "Character", description = "Operations related to anime characters")
public class CharacterController {

    private final CharacterService characterService;

    @Autowired
    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @Operation(summary = "Search characters by name, role, or favorites", description = "Search for characters by name, role, or minimum favorites. If no parameters are provided, returns all characters.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of characters matching the criteria")
    })
    @GetMapping("/search")
    public List<Character> searchByName(
            @Parameter(description = "Character name to search for", example = "Naruto Uzumaki") @RequestParam(required = false) String name,
            @Parameter(description = "Role of the character", example = "Main") @RequestParam(required = false) String role,
            @Parameter(description = "Minimum number of favorites", example = "1000") @RequestParam(required = false) Integer minFavorites) {
        // ...existing code...
        if (role != null || minFavorites != null) {
            return characterService.searchWithFilters(name, role, minFavorites);
        }
        if (name != null && !name.isEmpty()) {
            return characterService.searchByName(name);
        }
        return characterService.searchWithFilters(null, null, null);
    }

    @Operation(summary = "Get all characters", description = "Retrieve a paginated list of all characters.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of characters returned successfully")
    })
    @GetMapping
    public Page<Character> getAllCharacters(
            @Parameter(description = "Page number", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "20") @RequestParam(defaultValue = "20") int size) {
        return characterService.getAllCharacters(PageRequest.of(page, size));
    }

    @Operation(summary = "Get character by ID", description = "Retrieve a specific character by their ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Character found and returned"),
        @ApiResponse(responseCode = "404", description = "Character not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Character> getCharacterById(
            @Parameter(description = "Character ID", example = "1") @PathVariable Integer id) {
        return characterService.getCharacterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @Operation(summary = "Add a new character", description = "Add a new character to the database.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Character created successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<?> addCharacter(@RequestBody java.util.Map<String, String> characterData) {
        // ...existing code...
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


    @Operation(summary = "Remove a character", description = "Remove a character from the database by ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Character removed successfully"),
        @ApiResponse(responseCode = "404", description = "Character not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeCharacter(
            @Parameter(description = "Character ID", example = "1") @PathVariable Integer id) {
        // ...existing code...
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