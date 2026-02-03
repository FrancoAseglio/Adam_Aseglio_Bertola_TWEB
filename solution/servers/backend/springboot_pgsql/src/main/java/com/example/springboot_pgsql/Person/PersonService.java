package com.example.springboot_pgsql.Person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

/**
 * Service layer for Person business logic.
 * Handles data operations and business rules for people (voice actors, staff).
 */
@Service
public class PersonService {
    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Optional<Person> getPersonById(Integer id) {
        return personRepository.findById(id);
    }

}
