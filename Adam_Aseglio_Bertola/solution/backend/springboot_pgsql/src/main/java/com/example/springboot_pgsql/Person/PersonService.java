package com.example.springboot_pgsql.Person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
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

    public Page<Person> getAllPeople(Pageable pageable) {
        return personRepository.findAll(pageable);
    }

    public Optional<Person> getPersonById(Integer id) {
        return personRepository.findById(id);
    }

    public List<Person> searchByName(String name) {
        return personRepository.findByGivenNameContainingIgnoreCaseOrFamilyNameContainingIgnoreCase(name, name);
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
