package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


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

    @PostMapping
    public PersonVoiceWork createVoiceWork(@RequestBody PersonVoiceWork voiceWork) {
        return personVoiceWorkService.save(voiceWork);
    }
}
