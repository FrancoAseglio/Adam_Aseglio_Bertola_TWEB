package com.example.springboot_pgsql.PersonVoiceWork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public PersonVoiceWork save(PersonVoiceWork work) {
        return repository.save(work);
    }

    public void saveAll(List<PersonVoiceWork> workList) {
        repository.saveAll(workList);
    }
}
