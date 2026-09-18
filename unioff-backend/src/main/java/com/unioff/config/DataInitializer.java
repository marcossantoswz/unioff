package com.unioff.config;

import com.unioff.entity.Cupom;
import com.unioff.entity.Estudante;
import com.unioff.entity.StatusCupom;
import com.unioff.repository.CupomRepository;
import com.unioff.repository.EstudanteRepository;
import java.time.LocalDateTime;
import java.util.List;


import com.unioff.entity.Beneficio;
import com.unioff.repository.BeneficioRepository;
import com.unioff.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;


import com.unioff.entity.Empresa;
import com.unioff.entity.TipoUsuario;
import com.unioff.entity.Usuario;
import com.unioff.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BeneficioRepository beneficioRepository;

    @Autowired
    private EstudanteRepository estudanteRepository;

    @Autowired
    private CupomRepository cupomRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Create an Empresa user if it doesn't exist
        if (usuarioRepository.findByEmail("empresa@teste.com").isEmpty()) {
            Usuario usuario = new Usuario();
            usuario.setNome("João da Silva");
            usuario.setEmail("empresa@teste.com");
            // Encrypt the password so Spring Security can authenticate
            usuario.setSenhaHash(passwordEncoder.encode("senha123"));
            usuario.setTipoUsuario(TipoUsuario.EMPRESA);
            usuario.setAtivo(true);
            usuarioRepository.save(usuario);

            Empresa empresa = new Empresa();
            empresa.setUsuario(usuario);
            empresa.setNomeFantasia("Pizzaria Universitária");
            empresa.setDescricao("A melhor pizza para estudantes.");
            empresa.setCidade("Campinas");
            empresa.setBairro("Centro");
            empresa.setLogradouro("Rua das Universidades");
            empresa.setNumero("100");
            empresa.setTelephoneWhatsapp("5519999999999");
            empresa.setSite("https://www.pizzaria.com");
            empresaRepository.save(empresa);

            Beneficio beneficio = new Beneficio();
            beneficio.setEmpresa(empresa);
            beneficio.setTitulo("20% de desconto em pizzas");
            beneficio.setDescricao("Valido para consumo no local.");
            beneficio.setDataInicio(java.time.LocalDate.now());
            beneficio.setDataFim(java.time.LocalDate.now().plusMonths(3));
            beneficio.setQuantidadeResgates(25);
            beneficio.setQuantidadeMaxResgastes(100);
            beneficio.setAtivo(true);
            
            beneficioRepository.save(beneficio);
            
            System.out.println("Dados fictícios de empresa criados com sucesso: empresa@teste.com / senha123");
        }

        // Create an Estudante user if it doesn't exist
        if (usuarioRepository.findByEmail("estudante@teste.com").isEmpty()) {
            Usuario usuarioEstudante = new Usuario();
            usuarioEstudante.setNome("Marcos Aurelio Santos");
            usuarioEstudante.setEmail("estudante@teste.com");
            usuarioEstudante.setSenhaHash(passwordEncoder.encode("senha123"));
            usuarioEstudante.setTipoUsuario(TipoUsuario.ESTUDANTE);
            usuarioEstudante.setAtivo(true);
            usuarioRepository.save(usuarioEstudante);

            Estudante estudante = new Estudante();
            estudante.setUsuario(usuarioEstudante);
            estudante.setInstituicao("Unicamp");
            estudante.setCurso("Engenharia da Computação");
            estudante.setMatricula("123456");
            estudanteRepository.save(estudante);
            
            // Add a test coupon (Resgate) for the first benefit found
            List<Beneficio> beneficios = beneficioRepository.findAll();
            if (!beneficios.isEmpty()) {
                Beneficio b = beneficios.get(0);
                Cupom cupom = new Cupom();
                cupom.setCodigo("UNI-A8KX91");
                cupom.setStatus(StatusCupom.USADO);
                cupom.setDataGeracao(LocalDateTime.now().minusDays(2));
                cupom.setDataUso(LocalDateTime.now().minusDays(1));
                cupom.setEstudante(estudante);
                cupom.setBeneficio(b);
                cupomRepository.save(cupom);
                
                b.setQuantidadeResgates(b.getQuantidadeResgates() + 1);
                beneficioRepository.save(b);
            }

            System.out.println("Dados fictícios de estudante criados com sucesso: estudante@teste.com / senha123");
        }
        
    }
}
