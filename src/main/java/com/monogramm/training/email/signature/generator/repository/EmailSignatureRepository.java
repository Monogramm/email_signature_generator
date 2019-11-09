package com.monogramm.training.email.signature.generator.repository;
import com.monogramm.training.email.signature.generator.domain.EmailSignature;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the EmailSignature entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmailSignatureRepository extends JpaRepository<EmailSignature, Long> {

    @Query("select emailSignature from EmailSignature emailSignature where emailSignature.user.login = ?#{principal.username}")
    List<EmailSignature> findByUserIsCurrentUser();

}
