package com.monogramm.training.email.signature.generator.repository;
import com.monogramm.training.email.signature.generator.domain.PersonalInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the PersonalInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {

    @Query("select personalInfo from PersonalInfo personalInfo where personalInfo.user.login = ?#{principal.username}")
    List<PersonalInfo> findByUserIsCurrentUser();

}
