package com.example.springboot_pgsql.Anime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Anime endpoints.
 * Base URL: /api/anime
 * Provides operations for retrieving, searching, and filtering anime by various criteria.
 */
@RestController
@RequestMapping("/api/anime")
@CrossOrigin(origins = "http://localhost:3001")
public class AnimeController {

    private final AnimeService animeService;

    @Autowired
    public AnimeController(AnimeService animeService) {
        this.animeService = animeService;
    }


    @GetMapping
    public List<Anime> getAllAnime(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return animeService.getAllAnime(page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Anime> getAnimeById(@PathVariable Integer id) {
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

    @GetMapping("/search")
    public List<Anime> searchByTitle(@RequestParam String title) {
        return animeService.searchByTitle(title);
    }

    @GetMapping("/genre/{genre}")
    public List<Anime> getByGenre(@PathVariable String genre) {
        return animeService.getByGenre(genre);
    }

    @GetMapping("/type/{type}")
    public List<Anime> getByType(@PathVariable String type) {
        return animeService.getByType(type);
    }

    @GetMapping("/top")
    public List<Anime> getTopAnime(@RequestParam(defaultValue = "20") int limit) {
        return animeService.getTopAnime(limit);
    }

    @GetMapping("/count")
    public long getAnimeCount() {
        return animeService.count();
    }

}