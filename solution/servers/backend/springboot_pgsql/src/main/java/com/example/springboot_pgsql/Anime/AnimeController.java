package com.example.springboot_pgsql.Anime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;

/**
 * REST Controller for Anime endpoints.
 * Base URL: /api/anime
 * Provides operations for retrieving, searching, and filtering anime by various criteria.
 */
@RestController
@RequestMapping("/api/anime")
@CrossOrigin(origins = "http://localhost:3001")
@Tag(name = "Anime", description = "Operations related to anime series and movies")
public class AnimeController {

    private final AnimeService animeService;

    @Autowired
    public AnimeController(AnimeService animeService) {
        this.animeService = animeService;
    }

    @Operation(summary = "Get anime by ID", description = "Retrieve a specific anime by its ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Anime found and returned"),
        @ApiResponse(responseCode = "404", description = "Anime not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Anime> getAnimeById(
            @Parameter(description = "Anime ID", example = "1") @PathVariable Integer id) {
        try {
            Anime anime = animeService.getAnimeById(id);
            if (anime != null) {
                return ResponseEntity.ok(anime);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Search anime by title", description = "Search for anime by their title.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of anime matching the title")
    })
    @GetMapping("/search")
    public List<Anime> searchByTitle(
            @Parameter(description = "Anime title to search for", example = "Naruto") @RequestParam String title) {
        return animeService.searchByTitle(title);
    }

    @Operation(summary = "Get all genres", description = "Retrieve a list of all available anime genres.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of genres returned successfully")
    })
    @GetMapping("/genres")
    public List<String> getAllGenres() {
        return animeService.getAllGenres();
    }

    @Operation(summary = "Get anime by genre", description = "Retrieve a list of anime by genre.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of anime for the specified genre")
    })
    @GetMapping("/genre/{genre}")
    public List<Anime> getByGenre(
            @Parameter(description = "Genre name", example = "Action") @PathVariable String genre) {
        return animeService.getByGenre(genre);
    }

    @Operation(summary = "Get anime count", description = "Retrieve the total number of anime in the database.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Anime count returned successfully")
    })
    @GetMapping("/count")
    public long getAnimeCount() {
        return animeService.count();
    }

}