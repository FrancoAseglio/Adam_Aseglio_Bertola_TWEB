package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for PersonVoiceWork endpoints.
 * Base URL: /api/person-voice-work
 * Provides operations for retrieving voice acting assignments.
 */
@RestController
@RequestMapping("/api/person-voice-work")
@CrossOrigin(origins = "http://localhost:3001")
@Tag(name = "PersonVoiceWork", description = "Operations related to voice acting assignments")
public class PersonVoiceWorkController {

    private final PersonVoiceWorkService personVoiceWorkService;

    @Autowired
    public PersonVoiceWorkController(PersonVoiceWorkService personVoiceWorkService) {
        this.personVoiceWorkService = personVoiceWorkService;
    }

    @Operation(summary = "Get top 20 people by anime ID", description = "Retrieve the top 20 people (voice actors) for a given anime ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of top 20 people for the anime returned successfully")
    })
    @GetMapping("/anime/{animeId}/top")
    public List<Map<String, Object>> getTop20PeopleByAnime(
            @Parameter(description = "Anime ID", example = "1") @PathVariable Integer animeId) {
        return personVoiceWorkService.getTop20PeopleByAnime(animeId);
    }
}
