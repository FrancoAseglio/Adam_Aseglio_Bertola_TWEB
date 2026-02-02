package com.example.springboot_pgsql.Person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

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

    public Person savePerson(Person person) {
        return personRepository.save(person);
    }

    public void saveAll(List<Person> people) {
        personRepository.saveAll(people);
    }

    public void deletePerson(Integer id) {
        personRepository.deleteById(id);
    }
}
