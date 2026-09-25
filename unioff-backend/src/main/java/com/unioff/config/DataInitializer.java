package com.unioff.config;

import com.unioff.entity.*;
import com.unioff.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EmpresaRepository empresaRepository;
    @Autowired private EstudanteRepository estudanteRepository;
    @Autowired private BeneficioRepository beneficioRepository;
    @Autowired private CupomRepository cupomRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        
        // Mantém a criação da empresa original (caso ainda não exista)
        if (usuarioRepository.findByEmail("empresa@teste.com").isEmpty()) {
            Empresa e1 = criarEmpresa("João da Silva", "empresa@teste.com", "Pizzaria Universitária", "A melhor pizza para estudantes.", "Campinas", "11.111.111/0001-11");
            criarBeneficio(e1, "20% de desconto em pizzas", "Valido para consumo no local.", 100);
            System.out.println("Empresa principal criada: empresa@teste.com / senha123");
        }

        // Mantém o estudante original
        if (usuarioRepository.findByEmail("estudante@teste.com").isEmpty()) {
            Usuario uEstudante = new Usuario();
            uEstudante.setNome("Marcos Aurelio Santos");
            uEstudante.setEmail("estudante@teste.com");
            uEstudante.setSenhaHash(passwordEncoder.encode("senha123"));
            uEstudante.setTipoUsuario(TipoUsuario.ESTUDANTE);
            uEstudante.setAtivo(true);
            usuarioRepository.save(uEstudante);

            Estudante estudante = new Estudante();
            estudante.setUsuario(uEstudante);
            estudante.setInstituicao("Unicamp");
            estudante.setCurso("Engenharia da Computação");
            estudante.setMatricula("123456");
            estudanteRepository.save(estudante);

            // Adiciona um cupom de teste se houver beneficios
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
            System.out.println("Estudante principal criado: estudante@teste.com / senha123");
        }

        // Criando bastante dados fictícios se eles ainda não existirem no BD
        if (usuarioRepository.findByEmail("tech@teste.com").isEmpty()) {
            System.out.println("Gerando volume de dados fictícios para popular o feed...");

            Empresa e2 = criarEmpresa("Tech Store Brasil", "tech@teste.com", "TechStore Eletrônicos", "Laptops, acessórios e muito mais para seus estudos.", "São Paulo", "22.222.222/0001-22");
            criarBeneficio(e2, "10% OFF em Laptops", "Desconto exclusivo para estudantes universitários na compra de notebooks.", 20);
            criarBeneficio(e2, "Frete Grátis Sudeste", "Frete grátis em compras acima de R$ 150.", 200);

            Empresa e3 = criarEmpresa("CinePop SA", "cinema@teste.com", "CinePop Cinemas", "A melhor rede de cinemas do país.", "Campinas", "33.333.333/0001-33");
            criarBeneficio(e3, "Meia-Entrada + Pipoca", "Apresente carteirinha, pague meia e ganhe upgrade na pipoca.", 500);
            criarBeneficio(e3, "Sessão Dupla - 50% OFF", "Assista a dois filmes no mesmo dia com desconto.", 100);

            Empresa e4 = criarEmpresa("GymMax Participações", "gym@teste.com", "GymMax Academia", "Malhe perto do campus com as melhores máquinas.", "Belo Horizonte", "44.444.444/0001-44");
            criarBeneficio(e4, "Mensalidade Estudante R$ 59,90", "Apresente o cupom na recepção e garanta o preço especial.", 100);
            criarBeneficio(e4, "Taxa de Matrícula ZERO", "Não pague taxa de adesão ao se matricular com plano semestral.", 150);

            Empresa e5 = criarEmpresa("Livraria Jovem", "livros@teste.com", "Leitura e Saber", "Livros universitários, técnicos e obras de ficção.", "Curitiba", "55.555.555/0001-55");
            criarBeneficio(e5, "15% OFF Livros Técnicos", "Válido para toda a seção de computação, engenharia e medicina.", 300);
            criarBeneficio(e5, "Brinde: Caderno Exclusivo", "Nas compras acima de R$ 100 em papelaria, leve um brinde.", 50);

            Empresa e6 = criarEmpresa("Buser Viagens LTDA", "buser@teste.com", "Buser Viagens", "Viaje mais pagando menos para sua cidade natal.", "Rio de Janeiro", "66.666.666/0001-66");
            criarBeneficio(e6, "R$ 30 OFF na primeira viagem", "Cupom de R$ 30 de desconto no primeiro trajeto pelo app.", 1000);

            Empresa e7 = criarEmpresa("Urban Style Modas", "roupas@teste.com", "UrbanStyle", "Moda jovem, descolada e confortável para o dia a dia.", "São Paulo", "77.777.777/0001-77");
            criarBeneficio(e7, "Compre 2 Leve 3 (Camisetas)", "Na compra de 2 camisetas da nova coleção, a terceira é grátis.", 80);

            Empresa e8 = criarEmpresa("Code Academy", "cursos@teste.com", "Alura Courses", "Plataforma líder em cursos de tecnologia e programação.", "Online", "88.888.888/0001-88");
            criarBeneficio(e8, "Mês Grátis - Plano PRO", "Estude de graça no primeiro mês com este cupom especial.", 500);

            Empresa e9 = criarEmpresa("Burger & Cia", "burger@teste.com", "Burger King Off", "A fome bateu pós-aula? Temos a solução.", "São Paulo", "99.999.999/0001-99");
            criarBeneficio(e9, "Compre 1 Leve 2 (Whopper)", "Mostre o cupom, compre um combo e ganhe outro lanche.", 300);

            System.out.println("Múltiplos dados fictícios (empresas e benefícios) adicionados com sucesso!");
        }
    }

    private Empresa criarEmpresa(String nome, String email, String fantasia, String desc, String cidade, String cnpj) {
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setSenhaHash(passwordEncoder.encode("senha123"));
        u.setTipoUsuario(TipoUsuario.EMPRESA);
        u.setAtivo(true);
        usuarioRepository.save(u);

        Empresa e = new Empresa();
        e.setUsuario(u);
        e.setNomeFantasia(fantasia);
        e.setCnpj(cnpj);
        e.setDescricao(desc);
        e.setCidade(cidade);
        e.setBairro("Centro");
        e.setLogradouro("Avenida Principal");
        e.setNumero("1000");
        e.setTelephoneWhatsapp("5511999999999");
        e.setSite("https://www." + fantasia.toLowerCase().replace(" ", "").replace("&", "") + ".com.br");
        return empresaRepository.save(e);
    }

    private Beneficio criarBeneficio(Empresa e, String titulo, String desc, int maxResgates) {
        Beneficio b = new Beneficio();
        b.setEmpresa(e);
        b.setTitulo(titulo);
        b.setDescricao(desc);
        b.setDataInicio(LocalDate.now().minusDays(5));
        b.setDataFim(LocalDate.now().plusMonths(3));
        b.setQuantidadeResgates(0);
        b.setQuantidadeMaxResgastes(maxResgates);
        b.setAtivo(true);
        return beneficioRepository.save(b);
    }
}
