package com.example.springboot_pgsql.CharacterAnimeWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;

/**
 * REST Controller for CharacterAnimeWork endpoints.
 * Base URL: /api/character-anime
 * Provides operations for retrieving character-anime relationships.
 */
@RestController
@RequestMapping("/api/character-anime")
@CrossOrigin(origins = "http://localhost:3001")
@Tag(name = "CharacterAnimeWork", description = "Operations related to character-anime relationships")
public class CharacterAnimeWorkController {

    private final CharacterAnimeWorkService characterAnimeWorkService;

    @Autowired
    public CharacterAnimeWorkController(CharacterAnimeWorkService characterAnimeWorkService) {
        this.characterAnimeWorkService = characterAnimeWorkService;
    }

    @Operation(summary = "Get characters by anime ID", description = "Retrieve all characters for a given anime ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of characters for the anime returned successfully")
    })
    @GetMapping("/anime/{animeId}")
    public List<CharacterAnimeWork> getCharactersByAnime(
            @Parameter(description = "Anime ID", example = "1") @PathVariable Integer animeId) {
        return characterAnimeWorkService.getCharactersByAnime(animeId);
    }

    @Operation(summary = "Get top 20 characters by anime ID", description = "Retrieve the top 20 characters for a given anime ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of top 20 characters for the anime returned successfully")
    })
    @GetMapping("/anime/{animeId}/top")
    public List<CharacterAnimeWork> getTop20CharactersByAnime(
            @Parameter(description = "Anime ID", example = "1") @PathVariable Integer animeId) {
        return characterAnimeWorkService.getTop20CharactersByAnime(animeId);
    }

    @Operation(summary = "Get anime by character ID", description = "Retrieve all anime for a given character ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of anime for the character returned successfully")
    })
    @GetMapping("/character/{characterId}")
    public List<CharacterAnimeWork> getAnimeByCharacter(
            @Parameter(description = "Character ID", example = "1") @PathVariable Integer characterId) {
        return characterAnimeWorkService.getAnimeByCharacter(characterId);
    }
}