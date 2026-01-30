package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

/**
 * Service layer for PersonVoiceWork business logic.
 * Handles data operations for voice acting assignments.
 */
@Service
public class PersonVoiceWorkService {
    private final PersonVoiceWorkRepository repository;

    @Autowired
    public PersonVoiceWorkService(PersonVoiceWorkRepository repository) {
        this.repository = repository;
    }

    public List<PersonVoiceWork> findAll() {
        return repository.findAll();
    }

    public List<Map<String, Object>> getTop20PeopleByAnime(Integer animeId) {
        List<Object[]> results = repository.findTop20PeopleByAnime(animeId);
        return results.stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("personMalId", row[0]);
                map.put("role", row[1]);
                map.put("animeMalId", row[2]);
                map.put("characterMalId", row[3]);
                map.put("language", row[4]);
                return map;
            })
            .collect(Collectors.toList());
    }

    public PersonVoiceWork save(PersonVoiceWork work) {
        return repository.save(work);
    }

    public void saveAll(List<PersonVoiceWork> workList) {
        repository.saveAll(workList);
    }
}