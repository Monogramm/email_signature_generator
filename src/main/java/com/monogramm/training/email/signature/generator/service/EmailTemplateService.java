package com.monogramm.training.email.signature.generator.service;

import com.monogramm.training.email.signature.generator.domain.EmailSignature;
import com.monogramm.training.email.signature.generator.domain.PersonalInfo;
import com.monogramm.training.email.signature.generator.repository.EmailSignatureRepository;
import com.monogramm.training.email.signature.generator.repository.PersonalInfoRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class EmailTemplateService {
    private final EmailSignatureRepository emailSignatureRepository;
    private final PersonalInfoRepository personalInfoRepository;

    public EmailTemplateService(EmailSignatureRepository emailSignatureRepository,
                                PersonalInfoRepository personalInfoRepository) {
        this.emailSignatureRepository = emailSignatureRepository;
        this.personalInfoRepository = personalInfoRepository;
    }

    public Function<PersonalInfo, String> template(Long id) {
        String template = emailSignatureRepository.findById(id)
            .map(EmailSignature::getTemplate).orElseThrow(EntityNotFoundException::new);
        return personalInfo -> processTemplateWith(template, personalInfo);
    }

    public PersonalInfo personalInfoById(Long id) {
        return personalInfoRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    private String processTemplateWith(String template, PersonalInfo personalInfo) {
        Map<String, String> data = toMap(personalInfo);
        String processed = template;
        for (Map.Entry<String, String> pair : data.entrySet()) {
            String replacement = pair.getValue() == null ? "" : pair.getValue();
            processed = processed.replaceAll("%%" + pair.getKey() + "%%", replacement);
        }
        return processed;
    }

    private Map<String, String> toMap(PersonalInfo personalInfo) {
        HashMap<String, String> map = new HashMap<>();
        map.put("FIRST_NAME", personalInfo.getFirstName());
        map.put("LAST_NAME", personalInfo.getLastName());
        map.put("EMAIL_ADDRESS", personalInfo.getEmailAddress());
        map.put("JOB_TITLE", personalInfo.getJobTitle());
        map.put("COMPANY_NAME", personalInfo.getCompanyName());
        map.put("PHONE_NUMBER", personalInfo.getPhoneNumber());
        map.put("MOBILE_NUMBER", personalInfo.getMobileNumber());
        map.put("ADDRESS", personalInfo.getAddress());
        map.put("SERVICE", personalInfo.getService());
        map.put("WEBSITE", personalInfo.getWebsite());
        return map;
    }
}
