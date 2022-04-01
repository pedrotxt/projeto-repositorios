import React, {useState, useEffect} from "react";

import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from "./styles"

import api from "../../services/api";

import { FaArrowLeft } from 'react-icons/fa';

// decodeURIComponent(match.params.repositorio)
export default function Repositorio({match}){

    // passando um objeto e não um array, pois é apenas um repositorio
    const [repositorio, setRepositorio] = useState({});

    // como tem mais de uma issues passo um array
    const [issues, setIssues] = useState([]);

    const [loading, setLoading] = useState(true);

    // armazenar as paginas em que eu estou
    const [page, setPage] = useState(1);

    // Mudar o state
    // 1 Forma de fazer:
    //const [filters, setFilters] = useState('all');

    // 2 Forma de fazer:
    // Criando um array e manipular de uma forma inteligente para criar algo mais eficiente que a 1 forma
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false}
    ]);

    const [filterIndex, setFilterIndex] = useState(0);

    // useEffect para buscar todas as informações quando acessarmos a página do repositorio
    useEffect(()=> {
        
        async function load(){
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            //const reponse = await api.get(`/repos/${nomeRepo}`)
            //const issues = await api.get(`/repos/${nomeRepo}/issues`)

            // um array de Promise - ele vai executar as duas ao mesmo tempo e vai devolver dentro de um array
            // 1 posição do array[repositorioData] vai receber o resultado da primeira Promise, 2 posição o resultado da segunda Promise
            const [repositorioData, issuesData] = await Promise.all([
                // indo na requisição do repositorio, buscando as informações desse repositorio unico e também buscando todas informações das issues desse repositorio
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params:{
                        // ele procura pelo objeto em filters que esteja active e coloca o que está dentro da state desse objeto
                        state: filters.find(f => f.active).state,
                        // vai vir 5 issues por pagina
                        per_page: 5
                    }
                })
            ]);

           setRepositorio(repositorioData.data);
           setIssues(issuesData.data);

           setLoading(false);
        }

        load();

    }, [filters, match.params.repositorio]);

    // fazendo uma requisição de renderização da lista de issues de acordo com a page atual
    useEffect(()=> {
        
        async function loadIssue(){
            // pegando o repositorio
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            // fazendo requisição
            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                // passando os parametros para o axios
                params:{
                    state: filters[filterIndex].state,
                    page: page,
                    per_page: 5
                }
            });

            // atualizando minhas issues com as novas de outra page
            setIssues(response.data); 
        }

        loadIssue();


        // quando nossa page sofrer alteração o useEffect vai ser executado
    }, [filterIndex, filters, match.params.repositorio, page]);

    function handlePage(action){
        // Quando clicar no botão ele vai chamar essa função, e dentro dela vai atualizar o state: se o que a action recebeu 'back' então ele pega a pagina atual e volta uma(-1), se for false, ele vai subir a pagina atual(+1)
        setPage(action === 'back' ? page - 1 : page + 1)
    }
     
    // Mudar o state
    // 1 Forma de fazer:
    //
    // function handleState(action){
    //     if(action === 'all') {
    //         setFilters('all')
    //     }
    //     if(action === 'open'){
    //         setFilters('open')
    //     }
    //     if(action === 'closed'){
    //         setFilters('closed')
    //     }
    // }
    
    // Mudar o state
    // 2 Forma de fazer:
    
    function handleFilter(index){
        // atualizando o filterIndex com o valor de index do button que foi clicado
        setFilterIndex(index);
    }
    
    if(loading){
        return (
          <Loading>
            <h1>Carregando...</h1>
          </Loading>
        )
      }

    return(
        <Container>

            <BackButton to='/'>
                <FaArrowLeft color='#000' size={35} />
            </BackButton>

            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />

                <h1>{repositorio.name}</h1>

                <p>{repositorio.description}</p>
            </Owner>

            {/* mandando para FilterList uma prop active com a posição do array */}
            <FilterList active={filterIndex}>
                {filters.map( (filter, index) => (

                    // 1 item de um map precisa de uma key
                    // onClick passando qual posição que ta do objeto
                    <button type="button" key={filter.label} onClick={()=> handleFilter(index)}>
                        {filter.label}
                    </button>

                ))}

                {/* 
                Mudar o state
                1 Forma de fazer:
                <button type="button" onClick={ ()=> handleState('all') }>All</button>
                <button type="button" onClick={ ()=> handleState('open') }>Open</button>
                <button type="button" onClick={ ()=> handleState('closed') }>Closed</button> 
                */}
            </FilterList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>

                        <img src={ issue.user.avatar_url } alt={issue.user.login} />

                        <div>

                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>
                                        {label.name}
                                    </span>
                                ))}
                            </strong>

                            <p>{issue.user.login}</p>
                            
                        </div>
                        
                    </li>
                ))}
            </IssuesList>

            <PageActions>
                <button type="button" 
                onClick={ ()=> handlePage('back')}
                // passando para props disabled: quando pagina for menor que dois desativa esse botão de voltar
                disabled={page < 2}
                >Voltar</button>

                <button type="button" onClick={ ()=> handlePage('next')}>Proxima</button>
            </PageActions>

        </Container>
    )
}