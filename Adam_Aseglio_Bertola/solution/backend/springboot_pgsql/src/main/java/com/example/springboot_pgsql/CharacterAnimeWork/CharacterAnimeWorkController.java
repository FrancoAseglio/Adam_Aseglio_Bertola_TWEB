package com.example.springboot_pgsql.CharacterAnimeWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for CharacterAnimeWork endpoints.
 * Base URL: /api/character-anime
 * Provides operations for retrieving character-anime relationships.
 */
@RestController
@RequestMapping("/api/character-anime")
@CrossOrigin(origins = "http://localhost:3001")
public class CharacterAnimeWorkController {

    private final CharacterAnimeWorkService characterAnimeWorkService;

    @Autowired
    public CharacterAnimeWorkController(CharacterAnimeWorkService characterAnimeWorkService) {
        this.characterAnimeWorkService = characterAnimeWorkService;
    }

    @GetMapping("/anime/{animeId}")
    public List<CharacterAnimeWork> getCharactersByAnime(@PathVariable Integer animeId) {
        return characterAnimeWorkService.getCharactersByAnime(animeId);
    }

    @GetMapping("/character/{characterId}")
    public List<CharacterAnimeWork> getAnimeByCharacter(@PathVariable Integer characterId) {
        return characterAnimeWorkService.getAnimeByCharacter(characterId);
    }
}