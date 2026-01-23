package com.example.springboot_pgsql.Person;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Person data access.
 * Provides database operations for person entities.
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Integer> {
    List<Person> findByGivenNameContainingIgnoreCaseOrFamilyNameContainingIgnoreCase(String givenName, String familyName);
}
