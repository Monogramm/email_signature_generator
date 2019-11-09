package com.monogramm.training.email.signature.generator.web.rest;

import com.monogramm.training.email.signature.generator.domain.EmailSignature;
import com.monogramm.training.email.signature.generator.domain.User;
import com.monogramm.training.email.signature.generator.repository.EmailSignatureRepository;
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
 * REST controller for managing {@link com.monogramm.training.email.signature.generator.domain.EmailSignature}.
 */
@RestController
@RequestMapping("/api")
public class EmailSignatureResource {

    private final Logger log = LoggerFactory.getLogger(EmailSignatureResource.class);

    private static final String ENTITY_NAME = "emailSignature";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmailSignatureRepository emailSignatureRepository;
    private final UserRepository userRepository;

    public EmailSignatureResource(EmailSignatureRepository emailSignatureRepository, UserRepository userRepository) {
        this.emailSignatureRepository = emailSignatureRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /email-signatures} : Create a new emailSignature.
     *
     * @param emailSignature the emailSignature to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emailSignature, or with status {@code 400 (Bad Request)} if the emailSignature has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/email-signatures")
    public ResponseEntity<EmailSignature> createEmailSignature(@Valid @RequestBody EmailSignature emailSignature) throws URISyntaxException {
        setCurrentUserFor(emailSignature);
        log.debug("REST request to save EmailSignature : {}", emailSignature);
        if (emailSignature.getId() != null) {
            throw new BadRequestAlertException("A new emailSignature cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmailSignature result = emailSignatureRepository.save(emailSignature);
        return ResponseEntity.created(new URI("/api/email-signatures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /email-signatures} : get all the emailSignatures.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emailSignatures in body.
     */
    @GetMapping("/email-signatures")
    public List<EmailSignature> getAllEmailSignatures() {
        log.debug("REST request to get all EmailSignatures");
        return emailSignatureRepository.findAll();
    }

    /**
     * {@code GET  /email-signatures/:id} : get the "id" emailSignature.
     *
     * @param id the id of the emailSignature to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emailSignature, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/email-signatures/{id}")
    public ResponseEntity<EmailSignature> getEmailSignature(@PathVariable Long id) {
        log.debug("REST request to get EmailSignature : {}", id);
        Optional<EmailSignature> emailSignature = emailSignatureRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emailSignature);
    }

    /**
     * {@code DELETE  /email-signatures/:id} : delete the "id" emailSignature.
     *
     * @param id the id of the emailSignature to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/email-signatures/{id}")
    public ResponseEntity<Void> deleteEmailSignature(@PathVariable Long id) {
        log.debug("REST request to delete EmailSignature : {}", id);
        emailSignatureRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    private void permitActionOn(EmailSignature emailSignature) {
        currentUser()
            .filter(current -> current.equals(emailSignature.getUser()))
            .orElseThrow(SecurityException::new);
    }

    private void setCurrentUserFor(EmailSignature emailSignature) {
        currentUser()
            .ifPresent(emailSignature::setUser);
    }

    private Optional<User> currentUser() {
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin);
    }
}
