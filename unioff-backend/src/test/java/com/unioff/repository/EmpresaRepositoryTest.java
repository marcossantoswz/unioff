package com.unioff.repository;

import com.unioff.entity.Empresa;
import com.unioff.entity.TipoUsuario;
import com.unioff.entity.Usuario;
import com.unioff.repository.EmpresaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class EmpresaRepositoryTest {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private TestEntityManager entityManager;

    @BeforeEach
    void setUp() {
        salvarEmpresa("cafe@teste.com", "Cafe Campus", "11111111000101", "Belo Horizonte", "Centro");
        salvarEmpresa("livro@teste.com", "Livraria Uni", "22222222000102", "Sao Paulo", "Pinheiros");
        entityManager.flush();
        entityManager.clear();
    }

    private void salvarEmpresa(String email, String fantasia, String cnpj, String cidade, String bairro) {
        Usuario usuario = new Usuario();
        usuario.setNome(fantasia);
        usuario.setEmail(email);
        usuario.setSenhaHash("hash");
        usuario.setTipoUsuario(TipoUsuario.EMPRESA);
        entityManager.persist(usuario);

        Empresa empresa = new Empresa();
        empresa.setUsuario(usuario);
        empresa.setNomeFantasia(fantasia);
        empresa.setCnpj(cnpj);
        empresa.setCidade(cidade);
        empresa.setBairro(bairro);
        empresa.setLogradouro("Rua Teste");
        empresa.setNumero("100");
        entityManager.persist(empresa);
    }

    @Test
    void findByUsuarioEmailRetornaEmpresaOuVazio() {
        Optional<Empresa> encontrada = empresaRepository.findByUsuarioEmail("cafe@teste.com");
        assertTrue(encontrada.isPresent());
        assertEquals("Cafe Campus", encontrada.get().getNomeFantasia());

        assertTrue(empresaRepository.findByUsuarioEmail("inexistente@teste.com").isEmpty());
    }

    @Test
    void findByFiltrosFiltraPorNomeCidadeBairroESemFiltros() {
        PageRequest pageable = PageRequest.of(0, 10);

        Page<Empresa> todas = empresaRepository.findByFiltros(null, null, null, pageable);
        assertEquals(2, todas.getTotalElements());

        Page<Empresa> porNome = empresaRepository.findByFiltros("cafe", null, null, pageable);
        assertEquals(1, porNome.getTotalElements());
        assertEquals("Cafe Campus", porNome.getContent().get(0).getNomeFantasia());

        Page<Empresa> porCidade = empresaRepository.findByFiltros(null, "sao paulo", null, pageable);
        assertEquals(1, porCidade.getTotalElements());
        assertEquals("Livraria Uni", porCidade.getContent().get(0).getNomeFantasia());

        Page<Empresa> porBairro = empresaRepository.findByFiltros(null, null, "centro", pageable);
        assertEquals(1, porBairro.getTotalElements());

        Page<Empresa> semResultado = empresaRepository.findByFiltros("cafe", "sao paulo", null, pageable);
        assertEquals(0, semResultado.getTotalElements());
    }
}
