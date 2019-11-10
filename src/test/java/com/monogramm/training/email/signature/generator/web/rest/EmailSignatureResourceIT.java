package com.monogramm.training.email.signature.generator.web.rest;

import com.monogramm.training.email.signature.generator.EmailSignatureGeneratorApp;
import com.monogramm.training.email.signature.generator.domain.EmailSignature;
import com.monogramm.training.email.signature.generator.repository.EmailSignatureRepository;
import com.monogramm.training.email.signature.generator.repository.UserRepository;
import com.monogramm.training.email.signature.generator.service.EmailTemplateService;
import com.monogramm.training.email.signature.generator.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.monogramm.training.email.signature.generator.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link EmailSignatureResource} REST controller.
 */
@SpringBootTest(classes = EmailSignatureGeneratorApp.class)
public class EmailSignatureResourceIT {

    private static final String DEFAULT_TEMPLATE = "AAAAAAAAAA";
    private static final String UPDATED_TEMPLATE = "BBBBBBBBBB";

    @Autowired
    private EmailSignatureRepository emailSignatureRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restEmailSignatureMockMvc;

    private EmailSignature emailSignature;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EmailSignatureResource emailSignatureResource = new EmailSignatureResource(emailSignatureRepository, userRepository, emailTemplateService);
        this.restEmailSignatureMockMvc = MockMvcBuilders.standaloneSetup(emailSignatureResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmailSignature createEntity(EntityManager em) {
        EmailSignature emailSignature = new EmailSignature()
            .template(DEFAULT_TEMPLATE);
        return emailSignature;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmailSignature createUpdatedEntity(EntityManager em) {
        EmailSignature emailSignature = new EmailSignature()
            .template(UPDATED_TEMPLATE);
        return emailSignature;
    }

    @BeforeEach
    public void initTest() {
        emailSignature = createEntity(em);
    }

    @Test
    @Transactional
    public void createEmailSignature() throws Exception {
        int databaseSizeBeforeCreate = emailSignatureRepository.findAll().size();

        // Create the EmailSignature
        restEmailSignatureMockMvc.perform(post("/api/email-signatures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(emailSignature)))
            .andExpect(status().isCreated());

        // Validate the EmailSignature in the database
        List<EmailSignature> emailSignatureList = emailSignatureRepository.findAll();
        assertThat(emailSignatureList).hasSize(databaseSizeBeforeCreate + 1);
        EmailSignature testEmailSignature = emailSignatureList.get(emailSignatureList.size() - 1);
        assertThat(testEmailSignature.getTemplate()).isEqualTo(DEFAULT_TEMPLATE);
    }

    @Test
    @Transactional
    public void createEmailSignatureWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = emailSignatureRepository.findAll().size();

        // Create the EmailSignature with an existing ID
        emailSignature.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmailSignatureMockMvc.perform(post("/api/email-signatures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(emailSignature)))
            .andExpect(status().isBadRequest());

        // Validate the EmailSignature in the database
        List<EmailSignature> emailSignatureList = emailSignatureRepository.findAll();
        assertThat(emailSignatureList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllEmailSignatures() throws Exception {
        // Initialize the database
        emailSignatureRepository.saveAndFlush(emailSignature);

        // Get all the emailSignatureList
        restEmailSignatureMockMvc.perform(get("/api/email-signatures?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emailSignature.getId().intValue())))
            .andExpect(jsonPath("$.[*].template").value(hasItem(DEFAULT_TEMPLATE.toString())));
    }

    @Test
    @Transactional
    public void getEmailSignature() throws Exception {
        // Initialize the database
        emailSignatureRepository.saveAndFlush(emailSignature);

        // Get the emailSignature
        restEmailSignatureMockMvc.perform(get("/api/email-signatures/{id}", emailSignature.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(emailSignature.getId().intValue()))
            .andExpect(jsonPath("$.template").value(DEFAULT_TEMPLATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEmailSignature() throws Exception {
        // Get the emailSignature
        restEmailSignatureMockMvc.perform(get("/api/email-signatures/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEmailSignature() throws Exception {
        // Initialize the database
        emailSignatureRepository.saveAndFlush(emailSignature);

        int databaseSizeBeforeUpdate = emailSignatureRepository.findAll().size();

        // Update the emailSignature
        EmailSignature updatedEmailSignature = emailSignatureRepository.findById(emailSignature.getId()).get();
        // Disconnect from session so that the updates on updatedEmailSignature are not directly saved in db
        em.detach(updatedEmailSignature);
        updatedEmailSignature
            .template(UPDATED_TEMPLATE);

        restEmailSignatureMockMvc.perform(put("/api/email-signatures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEmailSignature)))
            .andExpect(status().isOk());

        // Validate the EmailSignature in the database
        List<EmailSignature> emailSignatureList = emailSignatureRepository.findAll();
        assertThat(emailSignatureList).hasSize(databaseSizeBeforeUpdate);
        EmailSignature testEmailSignature = emailSignatureList.get(emailSignatureList.size() - 1);
        assertThat(testEmailSignature.getTemplate()).isEqualTo(UPDATED_TEMPLATE);
    }

    @Test
    @Transactional
    public void updateNonExistingEmailSignature() throws Exception {
        int databaseSizeBeforeUpdate = emailSignatureRepository.findAll().size();

        // Create the EmailSignature

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmailSignatureMockMvc.perform(put("/api/email-signatures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(emailSignature)))
            .andExpect(status().isBadRequest());

        // Validate the EmailSignature in the database
        List<EmailSignature> emailSignatureList = emailSignatureRepository.findAll();
        assertThat(emailSignatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEmailSignature() throws Exception {
        // Initialize the database
        emailSignatureRepository.saveAndFlush(emailSignature);

        int databaseSizeBeforeDelete = emailSignatureRepository.findAll().size();

        // Delete the emailSignature
        restEmailSignatureMockMvc.perform(delete("/api/email-signatures/{id}", emailSignature.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmailSignature> emailSignatureList = emailSignatureRepository.findAll();
        assertThat(emailSignatureList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmailSignature.class);
        EmailSignature emailSignature1 = new EmailSignature();
        emailSignature1.setId(1L);
        EmailSignature emailSignature2 = new EmailSignature();
        emailSignature2.setId(emailSignature1.getId());
        assertThat(emailSignature1).isEqualTo(emailSignature2);
        emailSignature2.setId(2L);
        assertThat(emailSignature1).isNotEqualTo(emailSignature2);
        emailSignature1.setId(null);
        assertThat(emailSignature1).isNotEqualTo(emailSignature2);
    }
}
