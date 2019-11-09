package com.monogramm.training.email.signature.generator.web.rest;

import com.monogramm.training.email.signature.generator.EmailSignatureGeneratorApp;
import com.monogramm.training.email.signature.generator.domain.PersonalInfo;
import com.monogramm.training.email.signature.generator.repository.PersonalInfoRepository;
import com.monogramm.training.email.signature.generator.repository.UserRepository;
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
 * Integration tests for the {@link PersonalInfoResource} REST controller.
 */
@SpringBootTest(classes = EmailSignatureGeneratorApp.class)
public class PersonalInfoResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_JOB_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_JOB_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_MOBILE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_MOBILE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_WEBSITE = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    @Autowired
    private PersonalInfoRepository personalInfoRepository;

    @Autowired
    private UserRepository userRepository;

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

    private MockMvc restPersonalInfoMockMvc;

    private PersonalInfo personalInfo;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PersonalInfoResource personalInfoResource = new PersonalInfoResource(personalInfoRepository, userRepository);
        this.restPersonalInfoMockMvc = MockMvcBuilders.standaloneSetup(personalInfoResource)
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
    public static PersonalInfo createEntity(EntityManager em) {
        PersonalInfo personalInfo = new PersonalInfo()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .jobTitle(DEFAULT_JOB_TITLE)
            .service(DEFAULT_SERVICE)
            .companyName(DEFAULT_COMPANY_NAME)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .mobileNumber(DEFAULT_MOBILE_NUMBER)
            .website(DEFAULT_WEBSITE)
            .emailAddress(DEFAULT_EMAIL_ADDRESS)
            .address(DEFAULT_ADDRESS);
        return personalInfo;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonalInfo createUpdatedEntity(EntityManager em) {
        PersonalInfo personalInfo = new PersonalInfo()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .jobTitle(UPDATED_JOB_TITLE)
            .service(UPDATED_SERVICE)
            .companyName(UPDATED_COMPANY_NAME)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .mobileNumber(UPDATED_MOBILE_NUMBER)
            .website(UPDATED_WEBSITE)
            .emailAddress(UPDATED_EMAIL_ADDRESS)
            .address(UPDATED_ADDRESS);
        return personalInfo;
    }

    @BeforeEach
    public void initTest() {
        personalInfo = createEntity(em);
    }

    @Test
    @Transactional
    public void createPersonalInfo() throws Exception {
        int databaseSizeBeforeCreate = personalInfoRepository.findAll().size();

        // Create the PersonalInfo
        restPersonalInfoMockMvc.perform(post("/api/personal-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(personalInfo)))
            .andExpect(status().isCreated());

        // Validate the PersonalInfo in the database
        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeCreate + 1);
        PersonalInfo testPersonalInfo = personalInfoList.get(personalInfoList.size() - 1);
        assertThat(testPersonalInfo.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPersonalInfo.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPersonalInfo.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testPersonalInfo.getService()).isEqualTo(DEFAULT_SERVICE);
        assertThat(testPersonalInfo.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testPersonalInfo.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testPersonalInfo.getMobileNumber()).isEqualTo(DEFAULT_MOBILE_NUMBER);
        assertThat(testPersonalInfo.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
        assertThat(testPersonalInfo.getEmailAddress()).isEqualTo(DEFAULT_EMAIL_ADDRESS);
        assertThat(testPersonalInfo.getAddress()).isEqualTo(DEFAULT_ADDRESS);
    }

    @Test
    @Transactional
    public void createPersonalInfoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = personalInfoRepository.findAll().size();

        // Create the PersonalInfo with an existing ID
        personalInfo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPersonalInfoMockMvc.perform(post("/api/personal-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(personalInfo)))
            .andExpect(status().isBadRequest());

        // Validate the PersonalInfo in the database
        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = personalInfoRepository.findAll().size();
        // set the field null
        personalInfo.setFirstName(null);

        // Create the PersonalInfo, which fails.

        restPersonalInfoMockMvc.perform(post("/api/personal-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(personalInfo)))
            .andExpect(status().isBadRequest());

        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = personalInfoRepository.findAll().size();
        // set the field null
        personalInfo.setLastName(null);

        // Create the PersonalInfo, which fails.

        restPersonalInfoMockMvc.perform(post("/api/personal-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(personalInfo)))
            .andExpect(status().isBadRequest());

        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEmailAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = personalInfoRepository.findAll().size();
        // set the field null
        personalInfo.setEmailAddress(null);

        // Create the PersonalInfo, which fails.

        restPersonalInfoMockMvc.perform(post("/api/personal-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(personalInfo)))
            .andExpect(status().isBadRequest());

        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPersonalInfos() throws Exception {
        // Initialize the database
        personalInfoRepository.saveAndFlush(personalInfo);

        // Get all the personalInfoList
        restPersonalInfoMockMvc.perform(get("/api/personal-infos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(personalInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].jobTitle").value(hasItem(DEFAULT_JOB_TITLE)))
            .andExpect(jsonPath("$.[*].service").value(hasItem(DEFAULT_SERVICE)))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].mobileNumber").value(hasItem(DEFAULT_MOBILE_NUMBER)))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)))
            .andExpect(jsonPath("$.[*].emailAddress").value(hasItem(DEFAULT_EMAIL_ADDRESS)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)));
    }

    @Test
    @Transactional
    public void getPersonalInfo() throws Exception {
        // Initialize the database
        personalInfoRepository.saveAndFlush(personalInfo);

        // Get the personalInfo
        restPersonalInfoMockMvc.perform(get("/api/personal-infos/{id}", personalInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(personalInfo.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.jobTitle").value(DEFAULT_JOB_TITLE))
            .andExpect(jsonPath("$.service").value(DEFAULT_SERVICE))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.mobileNumber").value(DEFAULT_MOBILE_NUMBER))
            .andExpect(jsonPath("$.website").value(DEFAULT_WEBSITE))
            .andExpect(jsonPath("$.emailAddress").value(DEFAULT_EMAIL_ADDRESS))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS));
    }

    @Test
    @Transactional
    public void getNonExistingPersonalInfo() throws Exception {
        // Get the personalInfo
        restPersonalInfoMockMvc.perform(get("/api/personal-infos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePersonalInfo() throws Exception {
        // Initialize the database
        personalInfoRepository.saveAndFlush(personalInfo);

        int databaseSizeBeforeUpdate = personalInfoRepository.findAll().size();

        // Update the personalInfo
        PersonalInfo updatedPersonalInfo = personalInfoRepository.findById(personalInfo.getId()).get();
        // Disconnect from session so that the updates on updatedPersonalInfo are not directly saved in db
        em.detach(updatedPersonalInfo);
        updatedPersonalInfo
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .jobTitle(UPDATED_JOB_TITLE)
            .service(UPDATED_SERVICE)
            .companyName(UPDATED_COMPANY_NAME)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .mobileNumber(UPDATED_MOBILE_NUMBER)
            .website(UPDATED_WEBSITE)
            .emailAddress(UPDATED_EMAIL_ADDRESS)
            .address(UPDATED_ADDRESS);

        restPersonalInfoMockMvc.perform(put("/api/personal-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPersonalInfo)))
            .andExpect(status().isOk());

        // Validate the PersonalInfo in the database
        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeUpdate);
        PersonalInfo testPersonalInfo = personalInfoList.get(personalInfoList.size() - 1);
        assertThat(testPersonalInfo.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPersonalInfo.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPersonalInfo.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testPersonalInfo.getService()).isEqualTo(UPDATED_SERVICE);
        assertThat(testPersonalInfo.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testPersonalInfo.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testPersonalInfo.getMobileNumber()).isEqualTo(UPDATED_MOBILE_NUMBER);
        assertThat(testPersonalInfo.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testPersonalInfo.getEmailAddress()).isEqualTo(UPDATED_EMAIL_ADDRESS);
        assertThat(testPersonalInfo.getAddress()).isEqualTo(UPDATED_ADDRESS);
    }

    @Test
    @Transactional
    public void updateNonExistingPersonalInfo() throws Exception {
        int databaseSizeBeforeUpdate = personalInfoRepository.findAll().size();

        // Create the PersonalInfo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonalInfoMockMvc.perform(put("/api/personal-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(personalInfo)))
            .andExpect(status().isBadRequest());

        // Validate the PersonalInfo in the database
        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePersonalInfo() throws Exception {
        // Initialize the database
        personalInfoRepository.saveAndFlush(personalInfo);

        int databaseSizeBeforeDelete = personalInfoRepository.findAll().size();

        // Delete the personalInfo
        restPersonalInfoMockMvc.perform(delete("/api/personal-infos/{id}", personalInfo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PersonalInfo> personalInfoList = personalInfoRepository.findAll();
        assertThat(personalInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PersonalInfo.class);
        PersonalInfo personalInfo1 = new PersonalInfo();
        personalInfo1.setId(1L);
        PersonalInfo personalInfo2 = new PersonalInfo();
        personalInfo2.setId(personalInfo1.getId());
        assertThat(personalInfo1).isEqualTo(personalInfo2);
        personalInfo2.setId(2L);
        assertThat(personalInfo1).isNotEqualTo(personalInfo2);
        personalInfo1.setId(null);
        assertThat(personalInfo1).isNotEqualTo(personalInfo2);
    }
}
