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


    @Operation(summary = "Get all anime", description = "Retrieve a paginated list of all anime.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of anime returned successfully")
    })
    @GetMapping
    public List<Anime> getAllAnime(
            @Parameter(description = "Page number", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "20") @RequestParam(defaultValue = "20") int size) {
        return animeService.getAllAnime(page, size);
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

    @Operation(summary = "Get anime by type", description = "Retrieve a list of anime by type (e.g., TV, Movie, OVA).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of anime for the specified type")
    })
    @GetMapping("/type/{type}")
    public List<Anime> getByType(
            @Parameter(description = "Anime type", example = "TV") @PathVariable String type) {
        return animeService.getByType(type);
    }

    @Operation(summary = "Get top anime", description = "Retrieve a list of top anime, limited by the specified number.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of top anime returned successfully")
    })
    @GetMapping("/top")
    public List<Anime> getTopAnime(
            @Parameter(description = "Maximum number of top anime to return", example = "20") @RequestParam(defaultValue = "20") int limit) {
        return animeService.getTopAnime(limit);
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