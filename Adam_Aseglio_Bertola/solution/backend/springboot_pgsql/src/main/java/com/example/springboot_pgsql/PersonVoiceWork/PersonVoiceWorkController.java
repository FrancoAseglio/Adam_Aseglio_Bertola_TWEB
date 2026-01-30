package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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
public class PersonVoiceWorkController {

    private final PersonVoiceWorkService personVoiceWorkService;

    @Autowired
    public PersonVoiceWorkController(PersonVoiceWorkService personVoiceWorkService) {
        this.personVoiceWorkService = personVoiceWorkService;
    }

    @GetMapping
    public List<PersonVoiceWork> getAllVoiceWorks() {
        return personVoiceWorkService.findAll();
    }

    @GetMapping("/anime/{animeId}/top")
    public List<Map<String, Object>> getTop20PeopleByAnime(@PathVariable Integer animeId) {
        return personVoiceWorkService.getTop20PeopleByAnime(animeId);
    }

    @PostMapping
    public PersonVoiceWork createVoiceWork(@RequestBody PersonVoiceWork voiceWork) {
        return personVoiceWorkService.save(voiceWork);
    }
}
