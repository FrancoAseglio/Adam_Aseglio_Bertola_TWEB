package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
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


}
