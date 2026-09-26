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

        // Generate 50 additional companies and benefits for testing
        if (empresaRepository.count() < 500) {
            System.out.println("Gerando 50 empresas e benefícios fictícios (realistas)...");
            
            String[] nomesLojas = {
                "Burger King", "McDonald's", "Subway", "Domino's Pizza", "Starbucks", "Outback Steakhouse", "KFC", "Pizza Hut", "Spoleto", "Coco Bambu",
                "Bob's", "Habib's", "Madero", "Oxxo", "Cacau Show", "Kopenhagen", "Bacio di Latte", "Jeronimo", "Paris 6", "Pobre Juan",
                "Renner", "C&A", "Zara", "Riachuelo", "Centauro", "Nike", "Adidas", "Puma", "Vans", "O Boticário",
                "Natura", "Sephora", "Fast Shop", "KaBuM!", "Pichau", "Terabyte", "Samsung", "Apple", "Saraiva", "Livraria Cultura",
                "Amazon", "Kalunga", "Smart Fit", "Bluefit", "Cinemark", "Cinépolis", "Buser", "ClickBus", "Cobasi", "Petz"
            };

            String[] descricoesLojas = {
                "A rede de fast food famosa por seus hambúrgueres grelhados no fogo.",
                "O fast food mais famoso do mundo, com lanches rápidos e saborosos.",
                "Sanduíches e saladas saudáveis montados na hora.",
                "Pizzas deliciosas e entregues rapidamente.",
                "Cafés especiais, chás e acompanhamentos deliciosos.",
                "O melhor da culinária australiana em um ambiente descontraído.",
                "O frango frito mais famoso do mundo, com receita secreta.",
                "Pizzas incríveis com massa pan inconfundível.",
                "Culinária italiana rápida e customizada ao seu gosto.",
                "Especialista em frutos do mar e pratos para compartilhar.",
                "Clássico fast food brasileiro com os melhores milk-shakes.",
                "Comida árabe rápida e com ótimo custo-benefício.",
                "Hambúrgueres artesanais de alta qualidade e ambiente rústico.",
                "Mercado de conveniência com tudo que você precisa.",
                "A maior rede de chocolates finos do mundo.",
                "Chocolates sofisticados e clássicos inesquecíveis.",
                "Gelatos artesanais feitos com ingredientes de primeira.",
                "Smash burgers rápidos e muito saborosos.",
                "Culinária francesa e bistrô 24 horas famoso pelas sobremesas.",
                "Carnes nobres com qualidade premium e ambiente elegante.",
                "A maior rede de lojas de departamento de moda.",
                "Moda jovem, acessórios e as últimas tendências.",
                "Fast fashion internacional com design inovador.",
                "Roupas para toda a família e preços acessíveis.",
                "Maior rede multicanal de artigos esportivos da América Latina.",
                "A marca líder mundial em inovação de calçados esportivos e vestuário.",
                "Estilo e performance em roupas e tênis esportivos.",
                "Equipamentos e lifestyle esportivo com atitude.",
                "Tênis e roupas para a cultura skate e streetwear.",
                "Cosméticos e perfumes que celebram a beleza.",
                "Produtos de beleza com foco em sustentabilidade e ingredientes naturais.",
                "A maior variedade de produtos de beleza e marcas importadas.",
                "Eletrônicos e eletrodomésticos de alta tecnologia.",
                "O maior e-commerce de tecnologia e games da América Latina.",
                "Tudo em informática para gamers e entusiastas.",
                "Hardware e PCs gamers montados.",
                "Tecnologia de ponta em smartphones e eletrônicos.",
                "Inovação em design e tecnologia com iPhones e Macs.",
                "Livros, cultura e entretenimento.",
                "Um espaço inspirador com um vasto acervo de livros e cultura.",
                "A maior loja online do mundo, de A a Z.",
                "Tudo o que você precisa em papelaria e materiais de escritório.",
                "A academia inteligente com excelente custo-benefício.",
                "Estrutura moderna e completa para seus treinos.",
                "A maior rede de cinemas, com as melhores salas e tecnologia.",
                "Salas VIP e Macro XE para uma experiência de cinema incrível.",
                "Viagens de ônibus com conforto e preços imperdíveis.",
                "Passagens de ônibus de forma fácil e barata.",
                "O shopping do seu animal de estimação.",
                "Tudo para o seu pet com atendimento especializado."
            };

            String[] titulosBeneficios = {
                "Whopper em Dobro", "McOferta com 20% OFF", "Compre 1 Leve 2", "Pizza Média por R$ 39", "Café Grátis na compra de 1 Salgado",
                "Bloomin' Onion com 50% OFF", "Balde de Frango com 15% OFF", "Borda Recheada Grátis", "Massa em Dobro", "Sobremesa Grátis",
                "Milk-shake de 300ml Grátis", "10 Esfihas por R$ 19,90", "Batata Frita Grátis", "Café com 50% OFF", "Trufa Grátis",
                "Nhá Benta com 20% OFF", "Upgrade de Tamanho Grátis", "Combo Burger + Fritas 15% OFF", "Grand Gateau com 20% OFF", "Drink Grátis",
                "R$ 50 OFF nas compras acima de R$ 200", "Peças em Liquidação com +10% OFF", "15% de Desconto na Nova Coleção", "Frete Grátis + 10% OFF", "Tênis com 20% de Desconto",
                "15% OFF em Vestuário Esportivo", "Meias Grátis na compra de Tênis", "Camisetas com 25% OFF", "Skate shoes com 15% OFF", "Brinde nas compras acima de R$ 150",
                "20% OFF em Perfumaria", "Amostras Grátis e 10% OFF", "Fones de Ouvido com 20% OFF", "10% OFF em Periféricos Gamer", "Cadeira Gamer R$ 100 OFF",
                "Teclado Mecânico 15% OFF", "Smartphones com 5% de Desconto", "Acessórios Originais 10% OFF", "Livros Universitários com 30% OFF", "Qualquer livro com 20% OFF",
                "Frete Prime Grátis + Brinde", "Cadernos com 40% OFF", "Mensalidade com 20% de Desconto", "Taxa de Adesão Zero", "Meia-Entrada Todos os Dias",
                "Pipoca e Refri com 30% OFF", "Primeira Viagem com 50% OFF", "Cupom de R$ 30 para Viagens", "Rações com 15% de Desconto", "Banho e Tosa com 20% OFF"
            };

            String[] descricoesBeneficios = {
                "Apresente sua carteirinha de estudante e leve dois Whoppers pelo preço de um.",
                "Desconto especial de 20% em qualquer McOferta Média ou Grande.",
                "Na compra de um sanduíche de 15cm, ganhe outro do mesmo valor ou menor.",
                "Mostre este cupom e peça qualquer pizza média tradicional por apenas R$ 39.",
                "Compre qualquer salgado na vitrine e ganhe um café espresso ou coado pequeno.",
                "Meio preço na nossa tradicional cebola gigante ao pedir um prato principal.",
                "Aproveite 15% de desconto no balde de frango com 12 ou 16 pedaços.",
                "Ganhe borda recheada grátis ao pedir qualquer pizza grande.",
                "Compre um prato de massa tradicional e o segundo sai de graça.",
                "Ao consumir um prato principal, a sobremesa (pudim ou cocada) é por nossa conta.",
                "Na compra de qualquer trio, ganhe um milk-shake de 300ml.",
                "Leve 10 esfihas de carne ou queijo por um preço fixo especial para universitários.",
                "Ganhe uma batata frita pequena na compra de qualquer hambúrguer.",
                "Desconto de 50% em qualquer café da máquina a qualquer hora do dia.",
                "Nas compras acima de R$ 30, ganhe uma trufa tradicional de presente.",
                "Desconto especial de 20% nas clássicas Nhá Bentas, aproveite!",
                "Pague o copo pequeno e leve o copo médio de gelato artesanal.",
                "Compre um combo e garanta 15% de desconto no valor total.",
                "A sobremesa mais famosa de Paris 6 com 20% de desconto para universitários.",
                "Apresente a carteirinha e ganhe o primeiro drink ou bebida não alcoólica.",
                "Desconto automático de R$ 50 para compras de roupas acima de R$ 200.",
                "Aproveite a remarcação e ganhe mais 10% de desconto no caixa.",
                "Seja o primeiro a usar as tendências com desconto na nova coleção.",
                "Compre online e ganhe frete grátis além de 10% no valor do carrinho.",
                "Qualquer tênis da seção de esportes com 20% de desconto.",
                "Renove seu guarda-roupa esportivo com desconto especial.",
                "Na compra de um tênis para corrida, leve um par de meias de alta performance.",
                "Camisetas esportivas com desconto progressivo, garanta a sua.",
                "Tênis da linha clássica com abatimento para estudantes.",
                "Nas compras de perfumaria acima de R$ 150, escolha um brinde especial.",
                "Toda a linha de perfumaria nacional com desconto incrível.",
                "Amostras sortidas de marcas famosas e desconto no total da compra.",
                "Desconto aplicável em fones bluetooth selecionados.",
                "Periféricos como mouses e teclados com desconto para gamers e estudantes.",
                "R$ 100 de desconto direto na compra de qualquer cadeira gamer.",
                "Teclados mecânicos das melhores marcas com 15% de desconto.",
                "Aparelhos da linha Galaxy com desconto para estudantes parceiros.",
                "Cabos e carregadores originais com redução no valor.",
                "Livros técnicos e universitários com o maior desconto do mercado.",
                "Leitura acessível: qualquer obra literária com redução de preço.",
                "Seja Prime e ganhe brindes exclusivos na primeira compra.",
                "Volta às aulas com material escolar mais barato.",
                "Mostre que você é estudante e garanta desconto na mensalidade recorrente.",
                "Matricule-se agora e não pague a taxa de adesão.",
                "Apresente o cupom e garanta o benefício da meia-entrada de forma garantida.",
                "Combo especial de pipoca grande e refrigerante com desconto generoso.",
                "Sua primeira viagem de ônibus custa metade do preço no aplicativo.",
                "Resgate este código e aplique no app para R$ 30 de desconto imediato.",
                "Desconto na compra de rações premium para cães e gatos.",
                "Agende serviços de estética pet e pague menos."
            };

            for (int i = 0; i < 50; i++) {
                String email = "loja" + (i + 1) + "@teste.com";
                if (usuarioRepository.findByEmail(email).isEmpty()) {
                    Usuario u = new Usuario();
                    u.setNome("Gerência " + nomesLojas[i]);
                    u.setEmail(email);
                    u.setSenhaHash(passwordEncoder.encode("senha123"));
                    u.setTipoUsuario(TipoUsuario.EMPRESA);
                    u.setAtivo(true);
                    usuarioRepository.save(u);

                    Empresa e = new Empresa();
                    e.setUsuario(u);
                    e.setNomeFantasia(nomesLojas[i]);
                    e.setDescricao(descricoesLojas[i]);
                    e.setCidade((i % 2 == 0) ? "Campinas" : "São Paulo");
                    e.setBairro((i % 3 == 0) ? "Centro" : ((i % 2 == 0) ? "Barão Geraldo" : "Pinheiros"));
                    e.setLogradouro("Avenida Principal");
                    e.setNumero(String.valueOf((i + 1) * 15));
                    e.setTelephoneWhatsapp("551199999" + String.format("%04d", (i + 1)));
                    empresaRepository.save(e);

                    Beneficio b = new Beneficio();
                    b.setEmpresa(e);
                    b.setTitulo(titulosBeneficios[i]);
                    b.setDescricao(descricoesBeneficios[i]);
                    b.setDataInicio(java.time.LocalDate.now().minusDays(i % 10));
                    b.setDataFim(java.time.LocalDate.now().plusMonths((i % 6) + 1));
                    b.setQuantidadeResgates(i % 5);
                    b.setQuantidadeMaxResgastes(100 + (i * 10));
                    b.setAtivo(true);
                    beneficioRepository.save(b);
                }
            }
            System.out.println("50 lojas reais e benefícios criados com sucesso!");
        }
    }
}
