package com.monogramm.training.email.signature.generator.web.rest;

import com.monogramm.training.email.signature.generator.domain.PersonalInfo;
import com.monogramm.training.email.signature.generator.domain.User;
import com.monogramm.training.email.signature.generator.repository.PersonalInfoRepository;
import com.monogramm.training.email.signature.generator.repository.UserRepository;
import com.monogramm.training.email.signature.generator.security.SecurityUtils;
import com.monogramm.training.email.signature.generator.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.monogramm.training.email.signature.generator.domain.PersonalInfo}.
 */
@RestController
@RequestMapping("/api")
public class PersonalInfoResource {

    private final Logger log = LoggerFactory.getLogger(PersonalInfoResource.class);

    private static final String ENTITY_NAME = "personalInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonalInfoRepository personalInfoRepository;
    private final UserRepository userRepository;

    public PersonalInfoResource(PersonalInfoRepository personalInfoRepository, UserRepository userRepository) {
        this.personalInfoRepository = personalInfoRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /personal-infos} : Create a new personalInfo.
     *
     * @param personalInfo the personalInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new personalInfo, or with status {@code 400 (Bad Request)} if the personalInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/personal-infos")
    public ResponseEntity<PersonalInfo> createPersonalInfo(@Valid @RequestBody PersonalInfo personalInfo) throws URISyntaxException {
        setCurrentUserFor(personalInfo);
        log.debug("REST request to save PersonalInfo : {}", personalInfo);
        if (personalInfo.getId() != null) {
            throw new BadRequestAlertException("A new personalInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PersonalInfo result = personalInfoRepository.save(personalInfo);
        return ResponseEntity.created(new URI("/api/personal-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /personal-infos} : Updates an existing personalInfo.
     *
     * @param personalInfo the personalInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personalInfo,
     * or with status {@code 400 (Bad Request)} if the personalInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the personalInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/personal-infos")
    public ResponseEntity<PersonalInfo> updatePersonalInfo(@Valid @RequestBody PersonalInfo personalInfo) throws URISyntaxException {
        permitActionOn(personalInfo);
        log.debug("REST request to update PersonalInfo : {}", personalInfo);
        if (personalInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PersonalInfo result = personalInfoRepository.save(personalInfo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personalInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /personal-infos} : get all the personalInfos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of personalInfos in body.
     */
    @GetMapping("/personal-infos")
    public List<PersonalInfo> getAllPersonalInfos() {
        log.debug("REST request to get all PersonalInfos");
        return personalInfoRepository.findByUserIsCurrentUser();
    }

    /**
     * {@code GET  /personal-infos/:id} : get the "id" personalInfo.
     *
     * @param id the id of the personalInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the personalInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/personal-infos/{id}")
    public ResponseEntity<PersonalInfo> getPersonalInfo(@PathVariable Long id) {
        log.debug("REST request to get PersonalInfo : {}", id);
        Optional<PersonalInfo> personalInfo = personalInfoRepository.findById(id);
        personalInfo.ifPresent(this::permitActionOn);
        return ResponseUtil.wrapOrNotFound(personalInfo);
    }

    /**
     * {@code DELETE  /personal-infos/:id} : delete the "id" personalInfo.
     *
     * @param id the id of the personalInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/personal-infos/{id}")
    public ResponseEntity<Void> deletePersonalInfo(@PathVariable Long id) {
        permitActionOn(personalInfoRepository.getOne(id));
        log.debug("REST request to delete PersonalInfo : {}", id);
        personalInfoRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    private void permitActionOn(PersonalInfo personalInfo) {
        currentUser()
            .filter(u -> u.equals(personalInfo.getUser()))
            .orElseThrow(SecurityException::new);
    }

    private void setCurrentUserFor(PersonalInfo personalInfo) {
        currentUser()
            .ifPresent(personalInfo::setUser);
    }

    private Optional<User> currentUser() {
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin);
    }
}
