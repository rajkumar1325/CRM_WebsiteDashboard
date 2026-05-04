package in.SpringBootProject.crm.CuriemCRM.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.AuthUser;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {

	Optional<AuthUser> findByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCase(String email);
}
